"use client";

import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { SubjectWithChat } from "../types";

export function HeaderDetails({ evaluation }: { evaluation: SubjectWithChat }) {
  const { data } = api.subject.createTitle.useQuery(evaluation?.id || "", {
    enabled: !!evaluation?.id,
  });

  const title = useMemo(() => {
    if (data) return data;
    if (evaluation?.title) return evaluation.title;
    const dateString = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `Analysis ${dateString}`;
  }, [data, evaluation?.title]);

  // Handle null evaluation
  if (!evaluation) {
    return null;
  }

  return (
    <div className="space-y-6  rounded-2xl bg-slate-900 p-8 text-white">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="space-y-0">
        <div className="text-lg font-medium text-white">Files:</div>

        <div className="ml-2 space-y-0 divide-y divide-gray-700">
          {evaluation.documents.length === 0 ? (
            <div className="flex items-start gap-3 py-3">
              <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-600"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  No files attached
                </div>
              </div>
            </div>
          ) : (
            evaluation.documents.map((file) => (
              <div key={file.id} className="flex items-start gap-3 py-3">
                <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-600"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {file.name}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {evaluation.context && (
        <div>
          <div className="text-lg font-medium text-white">
            Additional Context:
          </div>
          <p className="ml-2 mt-2 text-sm leading-relaxed text-slate-100">
            {evaluation.context}
          </p>
        </div>
      )}

      <Link
        href="/app/subject"
        className="flex items-center gap-2 text-sm text-white"
      >
        <Plus className="h-3 w-3" />
        Create New Evaluation
      </Link>
    </div>
  );
}
