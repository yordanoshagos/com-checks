"use client";

import { LogoSecondary } from "@/components/logo-secondary";
import { Card, CardContent } from "@/components/ui/card";
import { GitCompare, Clock } from "lucide-react";

export default function CreateComparisonPage() {
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="space-y-8">
        {/* Main Content */}
        <Card className="text-center">
          <CardContent className="pb-12 pt-12">
            <div className="space-y-6">
              {/* Icon */}
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <GitCompare className="h-16 w-16 text-muted-foreground" />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Comparison Analysis</h1>
                <h2 className="text-xl font-semibold text-primary">
                  Coming Soon
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="mx-auto max-w-md text-muted-foreground">
                  We're working on powerful comparison tools that will let you
                  analyze multiple organizations, proposals, or funding
                  opportunities side-by-side.
                </p>
                <p className="text-sm text-muted-foreground">
                  Stay tuned for updates!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="pt-8 text-center">
          <LogoSecondary />
        </div>
      </div>
    </div>
  );
}
