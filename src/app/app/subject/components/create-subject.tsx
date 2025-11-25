"use client";

import { LogoSecondary } from "@/components/logo-secondary";
import { LoadingButton } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileUploadDropzone } from "./file-upload-dropzone";
import { useSubject } from "./use-subject";

export function CreateSubject() {
  const { files, context, setContext, clear } = useSubject();

  // Clear stale uploads on mount only
  useEffect(() => {
    useSubject.getState().clearStaleUploads();
  }, []);

  const { data } = api.me.get.useQuery();
  const [loading, setLoading] = useState(false);
  const mutation = api.subject.create.useMutation({
    onError: () => {
      setLoading(false);
      toast.error("Oops! Failed to create analysis. Please try again.");
    },
  });
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);

    const resp = await mutation.mutateAsync({
      context,
      files: successfulFiles.map((file) => file.id),
    });

    clear();
    router.push(`/app/subject/${resp.id}/analysis`);
  };

  // Get successfully uploaded files
  const successfulFiles = files.filter((f) => f.status === "success");
  const hasReadyFiles = successfulFiles.length > 0;

  return (
    <div className="flex flex-col space-y-8 pb-8 pt-0">
      <div className="flex flex-col justify-center gap-4">
        <LogoSecondary />
        <div className="flex flex-col">
          <div className="text-2xl font-medium text-black">
            Hi, {data?.firstName}. Let's get started.
          </div>
          <div className="text-2xl text-slate-500">
            Get started by adding files about a nonprofit, grantee, or proposal.
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-6 pr-4">
        <div className="space-y-0">
          <div className="text-lg font-medium text-black">
            Start with a file:
          </div>

          <div className="space-y-0 divide-y divide-gray-100">
            <div className="flex items-start gap-3 py-3">
              <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-200"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-black">
                  Annual Reports
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  The program analysis tool can work just fine off of an
                  annual report from a grantee organization.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-200"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-black">RFPs</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Get reseach-based feedback on RFPs. Add your own context, e.g.
                  pdf requirements, etc.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-200"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-black">Proposals</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Formal or informal proposals for funding from grantees.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="m-1 flex flex-1 flex-col justify-center">
          <FileUploadDropzone />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <Textarea
            placeholder="Any additional context?"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className=" rounded-sm border-primary/40"
          />
          <div className="flex justify-center">
            <LoadingButton
              disabled={context === "" && !hasReadyFiles}
              effect="expandIcon"
              size="lg"
              isLoading={loading}
              iconPlacement="right"
              icon={SendHorizontal}
            >
              Create
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
