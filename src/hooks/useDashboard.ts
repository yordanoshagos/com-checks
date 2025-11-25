import { api } from "@/trpc/react";

export function useDashboardStats() {
  const { data: members } = api.organization.listMembers.useQuery({ organizationId: undefined });
  const { data: chats } = api.chat.getHistory.useQuery({ type: "recent", limit: 1 });
  const { data: requests } = api.organization.getJoinRequests.useQuery({ status: "PENDING" });

  return {
    memberCount: members?.length ?? 0,
    chatCount: chats?.length ?? 0,
    requestCount: requests?.length ?? 0,
  };
}