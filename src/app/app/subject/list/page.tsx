"use client";

import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { LoadingCardSpinner } from "@/features/shared/loading-spinner";
import { type AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type ColumnDef } from "@tanstack/react-table";
import { type inferRouterOutputs } from "@trpc/server";
import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { columns } from "./columns";

type RouterOutput = inferRouterOutputs<AppRouter>;
type SubjectListItem = RouterOutput["subject"]["list"][number];

export default function SubjectListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: subjects, isLoading } = api.subject.list.useQuery({
    limit: 0, // 0 means no limit, get all subjects
  });

  const filteredSubjects = useMemo(() => {
    if (!subjects || !searchQuery.trim()) {
      return subjects || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return subjects.filter((subject) => {
      // Search in title
      const title = subject.title || `Analysis ${subject.id.slice(0, 8)}`;
      if (title.toLowerCase().includes(query)) return true;

      // Search in context
      if (subject.context?.toLowerCase().includes(query)) return true;

      // Search in document names
      if (
        subject.documents?.some((doc) => doc.name.toLowerCase().includes(query))
      )
        return true;

      // Search in creator name
      const creatorName =
        subject.createdBy.name || subject.createdBy.firstName || "";
      if (creatorName.toLowerCase().includes(query)) return true;

      return false;
    });
  }, [subjects, searchQuery]);

  const hasSubjects = subjects && subjects.length > 0;
  const hasFilteredResults = filteredSubjects.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">All Analyses</h1>
            <p className="text-muted-foreground">
              Manage and view all your analyses
            </p>
          </div>
          <Link href="/app/subject">
            <div className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Create Analysis
            </div>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingCardSpinner />
          </div>
        ) : hasSubjects ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {hasFilteredResults ? (
              <DataTable
                columns={
                  columns as unknown as ColumnDef<SubjectListItem, unknown>[]
                }
                data={filteredSubjects}
              />
            ) : searchQuery.trim() ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted py-20">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    No results found
                  </h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    No analyses match your search for "{searchQuery}". Try a
                    different search term.
                  </p>
                </div>
              </div>
            ) : (
              <DataTable
                columns={
                  columns as unknown as ColumnDef<SubjectListItem, unknown>[]
                }
                data={filteredSubjects}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted py-20">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No analyses yet</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven't created any analyses yet. Get started by
                creating your first analysis.
              </p>
              <Link href="/app/subject">
                <div className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create Your First Analysis
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
