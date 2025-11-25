"use client";

import { api } from "@/trpc/react";
import { Plus, GitCompare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecentEvaluations } from "./recent-evaluations";

export function HeroEval() {
  const { data: subjects } = api.subject.list.useQuery({
    limit: 3,
  });
  return (
    <div className="bg-gray-50/30 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-8 rounded-2xl bg-gray-100 p-12">
          {/* Left side content */}
          <div className="flex w-1/3 flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Create Analysis</h1>
              <div className="mt-4 text-sm leading-relaxed text-gray-800">
                <ul className="list-disc space-y-1 pl-5">
                  <li>Review proposals</li>
                  <li>Analyze organizations</li>
                  <li>Test concepts</li>
                  <li>Shape strategic discussions</li>
                  <li>Design programs</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              {subjects?.length === 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs font-medium text-blue-600">
                        !
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">
                        You haven't created any analyses yet
                      </div>
                      <Link
                        href="/app/subject"
                        className="mt-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Create your first analysis →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-2/3">
            <div className="space-y-6">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {/* Single Analysis Button */}
                  <Link
                    href="/app/subject"
                    className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-8 py-8 text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:shadow-lg"
                  >
                    <div className="flex flex-1 flex-col justify-center text-center">
                      <div className="mb-3 flex items-center justify-center gap-3">
                        <Plus className="h-6 w-6" />
                        <span className="text-lg font-medium">
                          Single Analysis
                        </span>
                      </div>
                      <p className="mb-6 max-w-sm text-sm text-gray-600">
                        Analyze a proposal, organization, strategic plan, etc.
                      </p>
                      <div className="flex justify-center">
                        <Button size="lg" className="w-fit">
                          Create
                        </Button>
                      </div>
                    </div>
                  </Link>

                  {/* Comparative Analysis - Coming Soon */}
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-8 py-8">
                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                      <div className="mb-6 flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                          <GitCompare className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          Comparative Analysis
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                          Compare multiple proposals, organizations, strategic plans, etc.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2">
                          <span className="text-sm font-medium text-blue-700">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-xs">
                          We're working on bringing you powerful comparison features
                        </p>
                      </div>
                    </div>
                  </div>

                  {/*
                  <div
                    // href="/app/comparison/create"
                    className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-8 py-8 text-gray-900 transition-all duration-200 pointer-events-none opacity-50"
                  >
                    <div className="flex flex-1 flex-col justify-center text-center">
                      <div className="mb-3 flex items-center justify-center gap-3">
                        <GitCompare className="h-6 w-6" />
                        <span className="text-lg font-medium">
                          Comparative Analysis
                        </span>
                      </div>
                      <p className="mb-6 max-w-sm text-sm text-gray-600">
                        Compare multiple proposals, organizations, strategic plans, etc.
                      </p>
                      <div className="flex justify-center">Coming Soon</div>
                    </div>
                  </div>
                  */}
                </div>

                {/* <div className="absolute right-4 top-4 flex gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                    AI-Powered
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <span className="h-1 w-1 rounded-full bg-green-500"></span>
                    Quick Setup
                  </div>
                </div> */}
              </div>

              <RecentEvaluations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}