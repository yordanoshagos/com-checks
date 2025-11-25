"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { BookOpen, Check, FileText, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubjectWithChat } from "../types";

export function EvalMenu({ evaluation }: { evaluation?: SubjectWithChat }) {
  const pathname = usePathname();

  // Helper function to check if a chat type is complete
  const isComplete = (
    chatType: "ANALYSIS" | "COUNTERPOINT" | "LANDSCAPE_ANALYSIS",
  ) => {
    return (
      evaluation?.chats?.some(
        (chat) => chat.type === chatType && chat._count.messages > 0,
      ) ?? false
    );
  };

  const menuItems = [
    {
      href: `/app/subject/${evaluation?.id}/analysis`,
      icon: Search,
      title: "Initial Analysis",
      description: "Review the primary analysis results and insights",
      isActive: pathname.includes("/analysis"),
      isComplete: isComplete("ANALYSIS"),
    },
    {
      href: `/app/subject/${evaluation?.id}/counterpoint`,
      icon: FileText,
      title: "Gather Additional Perspective",
      description: "Go further with your analysis",
      isActive: pathname.includes("/counterpoint"),
      isComplete: isComplete("COUNTERPOINT"),
    },
    {
      href: `/app/subject/${evaluation?.id}/landscape`,
      icon: FileText,
      title: "Landscape Analysis",
      description:
        "Maps ecosystem of comparable programs and organizations to identify gaps, overlaps, and positioning opportunities.",
      isActive: pathname.includes("/landscape"),
      isComplete: isComplete("LANDSCAPE_ANALYSIS"),
    },
    {
      href: `/app/subject/${evaluation?.id}/next-steps`,
      icon: BookOpen,
      title: "Next Steps",
      description: "Share, summarize, or build cross-org comparisons",
      isActive: pathname.includes("/next-steps"),
      isComplete: false, // Next steps doesn't have a chat type
    },
  ];

  return (
    <div className="ml-8 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Next Steps</h3>
        <div className="text-sm text-muted-foreground">
          Select the actions you'd like to take with this analysis.
        </div>
      </div>

      <div className="grid w-full max-w-sm grid-cols-1 gap-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <CheckboxPrimitive.Root
                checked={item.isActive}
                className="relative w-full rounded-lg px-4 py-3 text-start text-muted-foreground ring-[1px] ring-border transition-all duration-200 hover:bg-muted/50 hover:shadow-sm hover:ring-2 hover:ring-border data-[state=checked]:text-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:hover:ring-primary"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 font-medium tracking-tight">
                      {item.isComplete && (
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/50">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                      {item.title}
                    </div>
                  </div>
                  <CheckboxPrimitive.Indicator>
                    <Icon className="h-5 w-5" />
                  </CheckboxPrimitive.Indicator>
                </div>
                <div className="ml-9 mt-1 text-xs text-muted-foreground">
                  {item.description}
                </div>
              </CheckboxPrimitive.Root>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
