"use client";

import * as React from "react";
import { Organization } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/index";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { User } from "lucide-react";

interface WorkspaceSwitcherPanelProps {
  organizations?: (Organization & { isActive?: boolean; role?: string; memberCount?: number })[] | null;
  activeOrganization?: Organization | { id: null; name: string };
  onOrganizationSwitch: (organizationId: string | null) => void;
  isLoading?: boolean;
}

function getOrganizationColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length] ?? "bg-blue-500";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function WorkspaceSwitcherPanel({
  organizations,
  activeOrganization,
  onOrganizationSwitch,
  isLoading: loadingState,
}: WorkspaceSwitcherPanelProps) {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = React.useState(false);
  const utils = api.useUtils();
  const loading = loadingState ?? (organizations === null || organizations === undefined);
  const organizationsList = organizations ?? [];

  const handleOrganizationSwitch = async (organizationId: string | null) => {
    if (organizationId === activeOrganization?.id) return;

    setIsSwitching(true);
    try {
      onOrganizationSwitch(organizationId);

      const response = await fetch("/api/auth/session", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activeOrganizationId: organizationId }),
      });

      if (!response.ok) {
        console.error("Failed to switch organization (session PATCH failed)");
        setIsSwitching(false);
        return;
      }


      await utils.invalidate();

      router.push("/app");

      window.location.href = "/app";

    } catch (error) {
      console.error("Error switching organization:", error);
      setIsSwitching(false);
    } finally {
      setTimeout(() => {
        setIsSwitching(false);
      }, 500);
    }
  };

  return (
    <div
      className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center gap-3 "
      style={{
        background:
          "linear-gradient(145deg, #f8fdff 0%, #f0f9ff 25%, #e0f2fe 50%, #e6fffa 75%, #f0fdf4 100%)",
      }}
    >
      {/* Subtle blue gradient overlay to match sidebar */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 0% 20%, rgba(70, 144, 213, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 0% 80%, rgba(110, 191, 244, 0.06) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center gap-3 py-4">
        <TooltipProvider delayDuration={0}>
          <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent px-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-1" aria-hidden>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative h-12 w-12 rounded-2xl flex-shrink-0">
                <div className="h-full w-full rounded-2xl border border-white/10 animate-pulse bg-[#A59B92] shadow-[0_2px_6px_rgba(0,0,0,0.06)]"/>
                <div className="absolute inset-2 rounded-xl bg-white/6 pointer-events-none" />
              </div>
            ))}
          </div>
          ) : (
            organizationsList.map((org) => {
              const isActive = org.id === activeOrganization?.id;
              const isPersonal = org.id === null;
              const initials = isPersonal ? "P" : getInitials(org.name);
              const color = isPersonal ? "bg-gray-700" : getOrganizationColor(org.name);

              return (
                <Tooltip key={org.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleOrganizationSwitch(org.id)}
                      disabled={isSwitching || isActive}
                      className={cn(
                        "group relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl font-semibold text-white transition-all duration-200",
                        color,
                        "hover:rounded-xl",
                        isActive && "rounded-xl outline outline-2 outline-[#A59B92]  outline-offset-2",
                        (isSwitching || isActive) && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label={`Switch to ${org.name}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && (
                        <div className="absolute -left-4 h-10 w-1 rounded-r-full bg-white shadow-lg" />
                      )}

                      <span className="relative z-10 text-sm">
                        {isSwitching && org.id === activeOrganization?.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : isPersonal ? (
                          <User className="h-5 w-5" />
                        ) : (
                          initials
                        )}
                      </span>

                      <div
                        className={cn(
                          "absolute inset-0 rounded-2xl bg-white opacity-0 transition-all duration-200 group-hover:opacity-20",
                          isActive && "rounded-xl"
                        )}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2 border-gray-700 bg-gray-800 text-white">
                    <p className="font-medium">{org.name}</p>
                    {isActive && <p className="text-sm text-gray-300">Current</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })
          )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}