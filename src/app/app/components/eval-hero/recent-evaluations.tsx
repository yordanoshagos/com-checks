"use client";

import { api } from "@/trpc/react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export function RecentEvaluations() {
  const { data } = api.subject.list.useQuery({
    limit: 3,
  });

  return (
    <div className="p-4">
      <h2 className="mb-3 text-lg font-medium">Your Recent Analyses</h2>
      <div className="grid grid-cols-4 gap-3">
        {/* Existing analyses */}
        {data?.map((analysis) => (
          <Link key={analysis.id} href={`/app/subject/${analysis.id}`}>
            <div className="h-24 cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300">
              <div className="mb-2 truncate text-sm font-medium">
                {analysis.title}
              </div>
              <div className="space-y-0.5 text-xs text-gray-600">
                {analysis.documents.slice(0, 2).map((doc, index) => (
                  <div key={index} className="truncate">
                    {doc.name}
                  </div>
                ))}
                {analysis.documents.length > 2 && (
                  <div className="text-gray-400">
                    +{analysis.documents.length - 2} more
                  </div>
                )}
                {analysis.documents.length === 0 && (
                  <div className="text-gray-400">No documents</div>
                )}
              </div>
            </div>
          </Link>
        ))}

        {/* Fill remaining slots with empty cards if less than 3 analyses */}
        {data && data.length < 3 && (
          <>
            {Array.from({ length: 3 - data.length }, (_, index) => (
              <div key={`empty-${index}`} className="h-24"></div>
            ))}
          </>
        )}

        {/* Create new analysis card */}
        <Link href="/app/subject">
          <div className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 transition-colors hover:border-gray-400">
            <Plus className="mb-1 h-4 w-4 text-gray-400" />
            <div className="text-xs font-medium text-gray-500">Create</div>
          </div>
        </Link>
      </div>

      {/* See all link */}
      {data && data.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Link
            href="/app/subject/list"
            className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            See all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
