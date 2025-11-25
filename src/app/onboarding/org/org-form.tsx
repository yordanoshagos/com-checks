"use client";

import { HelpTextBox } from "@/components/complere/help-text-box";
import { PageContainer } from "@/components/complere/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEmailData } from "@/lib/utils/email";
import { parseOnboardingData, type OnboardingFormData } from "@/types/onboarding";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ONBOARD_KEY = "onboarding-data";
const BILL_EMAIL_KEY = "billiam-email";

export function OrgForm() {
  const router = useRouter();

  const email =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email") ||
        localStorage.getItem(BILL_EMAIL_KEY)
      : null;

  let derivedDomain: string | null = null;
  if (email) {
    try {
      const d = getEmailData(email);
      if (d?.domain) derivedDomain = d.domain;
    } catch {
      derivedDomain = null;
    }
  }

  const {
    data: existingDomainCheck,
    isLoading: isCheckingDerivedDomain,
  } = api.organization.checkDomain.useQuery(
    { domain: derivedDomain ?? "" },
    { enabled: !!derivedDomain },
  );


  const {
    data: pendingInvitations,
    isLoading: isCheckingInvitations,
  } = api.invitation.findPendingInvitations.useQuery(
    { email: email ?? "" },
    { enabled: !!email },
  );

  const [nameQuery, setNameQuery] = useState("");
  const [debouncedNameQuery, setDebouncedNameQuery] = useState("");
  const [selectedExistingOrg, setSelectedExistingOrg] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    const query = nameQuery.trim();
    if (query.length <= 2) {
      setDebouncedNameQuery("");
      return;
    }
    const timeout = setTimeout(() => setDebouncedNameQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [nameQuery]);

  const {
    data: nameSearchResults,
    isLoading: isSearchingNames,
    isError: isNameSearchError,
  } = api.organization.searchOrganizations.useQuery(
    { query: debouncedNameQuery, limit: 10 },
    { enabled: debouncedNameQuery.length > 0 },
  );

  const nameCheckForSubmit = api.organization.searchOrganizations.useQuery(
    { query: formData.name ?? "", limit: 10 },
    { enabled: false },
  );
  const domainCheckForSubmit = api.organization.checkDomain.useQuery(
    { domain: formData.url ?? "" },
    { enabled: false },
  );

  useEffect(() => {
    const saved = sessionStorage.getItem(ONBOARD_KEY);
    if (saved) {
      const parsed = parseOnboardingData(saved);
      if (parsed) {
        setFormData({
          name: parsed.organization?.name ?? "",
          url: parsed.organization?.url ?? parsed.url ?? "",
        });
      }
    }
    if (derivedDomain) {
      setFormData((p) => ({ ...p, url: derivedDomain ?? "" }));
    }
  }, [derivedDomain]);

 
  useEffect(() => {
    if (!pendingInvitations || pendingInvitations.length === 0) return;

   
    try {
      const invitation = pendingInvitations[0];
      const marker = invitation?.id ? String(invitation.id) : "has-invite";
      sessionStorage.setItem("invitation", marker);
    } catch (error) {
      console.warn("Failed to save pending invitation marker:", error);
    }

    router.push("/onboarding/interests");
  }, [pendingInvitations, router]);

  const joinOrg = selectedExistingOrg ?? existingDomainCheck?.organization ?? null;

  const showJoinForm = !!joinOrg;

  const isAutoDetectedJoin =
    !!(
      derivedDomain &&
      existingDomainCheck?.hasExistingDomain &&
      existingDomainCheck.organization &&
      !selectedExistingOrg
    );

  const nameDropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(e.target as Node)) {
        setNameQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "url") {
      setUrlError(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameQuery(value);
      setSelectedExistingOrg(null);
    } else if (name === "url") {
      setSelectedExistingOrg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const [domainRefetchResult, nameRefetchResult] = await Promise.all([
        domainCheckForSubmit.refetch(),
        nameCheckForSubmit.refetch(),
      ]);

      const domainResult = domainRefetchResult.data;
      const nameResults = nameRefetchResult.data ?? [];

      if (domainResult?.hasExistingDomain && domainResult.organization) {
        setSelectedExistingOrg(domainResult.organization);
        toast.info("We found an existing organization for that domain, request to join instead.");
        setIsSubmitting(false);
        return;
      }

      const nameLower = (formData.name ?? "").trim().toLowerCase();
      const exactNameMatch = (nameResults as any[]).find((r) => (r.name ?? "").trim().toLowerCase() === nameLower);

      if (exactNameMatch) {
        setSelectedExistingOrg(exactNameMatch);
        toast.info("An organization with this name already exists, request to join instead.");
        setIsSubmitting(false);
        return;
      }

      const savedRaw = sessionStorage.getItem(ONBOARD_KEY);
      let draft: OnboardingFormData = {};
      if (savedRaw) {
        const parsedDraft = parseOnboardingData(savedRaw);
        if (parsedDraft) draft = parsedDraft;
      }

      const newDraft = { ...draft, organization: { name: formData.name, url: formData.url } };
      sessionStorage.setItem(ONBOARD_KEY, JSON.stringify(newDraft));
      router.push("/onboarding/interests");
    } catch (err) {
      console.error("Validation check failed:", err);
      toast.error("Failed to validate organization name/domain. Try again.");
      setIsSubmitting(false);
    }
  };

  const handleRequestToJoin = (org: any) => {
    const savedRaw = sessionStorage.getItem(ONBOARD_KEY);
    let draft: OnboardingFormData = {};
    if (savedRaw) {
      const parsedDraft = parseOnboardingData(savedRaw);
      if (parsedDraft) draft = parsedDraft;
    }
    const newDraft = {
      ...draft,
      joinExistingOrganization: {
        organizationId: org.id ?? "",
        organizationName: org.name ?? "",
      },
    };
    sessionStorage.setItem(ONBOARD_KEY, JSON.stringify(newDraft));
    router.push("/onboarding/interests");
  };

  return (
    <PageContainer
      title={showJoinForm ? "Join Organization" : "Your Organization"}
      description={showJoinForm ? "Join your colleagues" : "Tell us about where you work"}
      currentStep={2}
      totalSteps={3}
    >
      <div className="flex">
        <div className="w-2/3 pr-8">
          {showJoinForm ? (
            <div className="relative h-full">
              <div className={`transition-all duration-200 ${isCheckingInvitations ? "pointer-events-none opacity-50 blur-sm" : ""}`}>
                <div className="space-y-8">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      {joinOrg?.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Your email domain ({existingDomainCheck?.domain ?? ""}) matches this organization. You can request to join or contact support if you need a new organization.
                    </p>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => handleRequestToJoin(joinOrg)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "Requesting..." : "Request to Join"}
                      </Button>
                    </div>
                  </div>

                  {!isAutoDetectedJoin && (
                    <div className="text-center">
                      <p className="mb-2 text-sm text-gray-500">
                        Want to create a new organization instead?
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedExistingOrg(null);
                          toast.info(
                            "Contact support if you need to create a separate organization with the same domain or name",
                          );
                        }}
                        disabled={isSubmitting}
                      >
                        Create New Organization
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative h-full">
              <div className={`transition-all duration-200 ${isCheckingInvitations ? "pointer-events-none opacity-50 blur-sm" : ""}`}>
                <div className="space-y-8">
                  <div className="relative">
                    <label htmlFor="name" className="mb-2 block text-base font-medium text-gray-700">
                      Organization Name
                    </label>
                    <Input
                      id="name"
                      autoFocus
                      name="name"
                      type="text"
                      placeholder="Enter your company or organization name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-14 w-full rounded-full border-gray-200 px-6 text-base shadow-none"
                    />
                    {nameQuery.trim().length > 2 && (
                      <div ref={nameDropdownRef} className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {isSearchingNames ? "Searching organizations..." : isNameSearchError ? "Failed to load suggestions" : `Suggestions for "${nameQuery}"`}
                        </div>

                        {!isSearchingNames && !isNameSearchError && (nameSearchResults ?? []).length === 0 && (
                          <div className="px-4 py-3 text-sm text-gray-500">No organizations found ? you'll create a new one.</div>
                        )}

                        {!isSearchingNames && !isNameSearchError && (nameSearchResults ?? []).length > 0 && (
                          <ul className="divide-y">
                            {nameSearchResults!.map((org: any) => (
                              <li
                                key={org.id}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedExistingOrg(org)}
                              >
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                  <div className="text-xs text-gray-500">{org.domains?.[0] ?? org.url}</div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedExistingOrg(org);
                                  }}
                                >
                                  Request to Join
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="url" className="mb-2 block text-base font-medium text-gray-700">
                      Organization Domain or URL
                    </label>
                    <Input
                      id="url"
                      name="url"
                      type="text"
                      placeholder="example.com or https://example.com"
                      value={formData.url}
                      onChange={handleChange}
                      required
                      className={`h-14 w-full rounded-full border-gray-200 px-6 text-base shadow-none ${urlError ? "border-red-500" : ""}`}
                    />
                    {urlError && <p className="mt-1 text-sm text-red-500">{urlError}</p>}
                  </div>
                </div>

                 <div className="mt-16 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    asChild
                    size="default"
                    className="border-black h-10 py-2"
                  >
                    <Link href="/onboarding">
                      Back
                    </Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    size="default"
                    className="h-10 py-2"
                  >
                    {isSubmitting ? "Saving..." : "Next"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="w-1/3">
          <HelpTextBox title={showJoinForm ? "Join Organization" : "Organization Details"}>
            {showJoinForm ? (
              <>
                <li>We found an organization that matches your domain.</li>
                <li>Request to join and your account will be associated to that organization after review.</li>
              </>
            ) : (
              <>
                <li>We use your organization information to customize your workspace and features.</li>
                <li>Domain or URL-specific templates and workflows will be suggested based on your input.</li>
              </>
            )}
          </HelpTextBox>
        </div>
      </div>
    </PageContainer>
  );
}