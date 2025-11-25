"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { BetaBanner } from "@/components/beta-banner";
import { WorkspaceSwitcherPanel } from "@/components/workspace-switcher-panel";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import { authClient } from "@/lib/auth-client";

export function V2Container({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: userLoading } = api.me.get.useQuery();
  const utils = api.useUtils();

  const handleOrganizationSwitch = async (organizationId: string | null) => {
    if (!user) return;
    
    utils.me.get.setData(undefined, (oldData) => {
      if (!oldData) return oldData;
      
      const newActiveOrg = user.organizations?.find(org => org.id === organizationId);
      
      if (!newActiveOrg) return oldData;
      
      return {
        ...oldData,
        activeOrganization: newActiveOrg,
      };
    });

    if (organizationId !== null) {
      await authClient.organization.setActive({
        organizationId,
      });
    }

    await utils.me.get.invalidate();
  };

  return (
    <>
      <WorkspaceSwitcherPanel
        organizations={user?.organizations}
        activeOrganization={user?.activeOrganization}
        onOrganizationSwitch={handleOrganizationSwitch}
        isLoading={userLoading}
      />
      
      <div className="ml-20">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <BetaBanner />
            <div className="pt-12">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}