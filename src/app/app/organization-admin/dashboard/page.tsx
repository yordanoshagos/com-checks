"use client";

import { Users, MessageSquare, Clock } from "lucide-react";
import { DashboardCard } from "./dashboardCard";
import { useDashboardStats } from "@/hooks/useDashboard";
import { api } from "@/trpc/react";

export default function DashboardPage() {
  const { memberCount, chatCount, requestCount } = useDashboardStats();
  const { data: session } = api.me.get.useQuery();

  const role = session?.activeOrganizationMember?.role;
  const isOrgAdmin = role === "ADMIN";

  if (!isOrgAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-500">Access Denied</h2>
        <p>You must be an organization admin to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-gray-900 mb-2">
          Welcome to Complēre Beta !
        </h1>
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-600 mt-1">
          Organization workspace overview and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Total Members" 
          value={memberCount} 
          description="Total Members in the organization"
          icon={<Users className="h-6 w-8 text-gray-400" />}
        />
        <DashboardCard 
          title="Pending Requests" 
          value={requestCount} 
          description="Total pending join requests"
          icon={<Clock className="h-6 w-8 text-gray-400" />}
        />
        <DashboardCard 
          title="Total Chats" 
          value={chatCount} 
          description="Total number of chat conversations"
          icon={<MessageSquare className="h-6 w-8 text-gray-400" />}
        />
      </div>

      <div className="border-t border-gray-200 my-8"></div>

    </div>
  );
}