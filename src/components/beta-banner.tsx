"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UpcomingWorkshops } from "@/features/brand/upcoming-workshops";

export function BetaBanner() {
  return (
    <div className="fixed z-50 w-full border-b border-border bg-muted">
      <div className="py-2">
        <div className="-ml-40 text-center text-sm text-muted-foreground">
          Welcome to Complēre{" "}
          <span className="font-medium text-foreground">Beta</span>
          <span className="mx-2">-</span>
          Join us for an{" "}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="underline transition-colors hover:text-foreground">
                onboarding session
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh] overflow-auto">
              <DrawerHeader>
                <DrawerTitle>Upcoming Onboarding Sessions</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <UpcomingWorkshops />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
