// "use client";


// import {
//   Clock,
//   FileText,
//   Home,
//   Plus,
//   Users,
//   Building2,
//   Mail,
//   Search,
//   TrendingUp,
//   Files,
//   type LucideIcon,
// } from "lucide-react";
// import * as React from "react";
// import { usePathname } from "next/navigation";


// import { NavMain } from "@/components/nav-main";
// import { NavUser } from "@/components/nav-user";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarRail,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { api } from "@/trpc/react";


// type MenuItem = {
//   title: string;
//   url: string;
//   icon: LucideIcon;
//   isActive?: boolean;
//   items?: Array<{
//     title: string;
//     url: string;
//     isActive?: boolean;
//   }>;
// };


// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { data: user } = api.me.get.useQuery();
//   const pathname = usePathname();
//   const { state } = useSidebar();
//   const { data: recentSubjects } = api.subject.list.useQuery({ limit: 5 });


//   const isAdminRoute = pathname?.startsWith("/app/admin");


//   const userData = {
//     name: user?.name ?? "Loading...",
//     email: user?.email ?? "Loading...",
//     isAdmin: user?.isAdmin ?? false,
//   };


//   const navMain = React.useMemo((): MenuItem[] => {
//     const items: MenuItem[] = [
//       { title: "All", url: "/app/subject/list", icon: FileText, isActive: pathname === "/app/subject/list" },
//       { title: "New", url: "/app/subject", icon: Plus, isActive: pathname === "/app/subject" },
//     ];


//     if (recentSubjects?.length) {
//       items.push({
//         title: "Recent",
//         url: "#",
//         icon: Clock,
//         items: recentSubjects.map((subject) => ({
//           title: subject.title || `Analysis ${subject.id.slice(0, 8)}`,
//           url: `/app/subject/${subject.id}`,
//           isActive: pathname === `/app/subject/${subject.id}`,
//         })),
//       });
//     }


//     return items;
//   }, [recentSubjects, pathname]);


//   const organizationNavItems = React.useMemo((): MenuItem[] => {
//     const items: MenuItem[] = [
//       {
//         title: "Find Organizations",
//         url: "/app/organizations/search",
//         icon: Search,
//         isActive: pathname === "/app/organizations/search",
//       },
//     ];


//     return items;
//   }, [pathname, user]);


//   const organizationAdminNavItems = React.useMemo((): MenuItem[] => {
//     const role = user?.activeOrganizationMember?.role;
//     if (role !== "ADMIN") return [];


//     return [
//       {
//         title: "Dashboard",
//         url: "/app/organization-admin/dashboard",
//         icon: TrendingUp,
//         isActive: pathname === "/app/organization-admin/dashboard",
//       },
//       {
//         title: "Members",
//         url: "/app/organization-admin/members",
//         icon: Users,
//         isActive: pathname === "/app/organization-admin/members",
//       },
//       {
//         title: "Invitations",
//         url: "/app/organization-admin/invitations",
//         icon: Mail,
//         isActive: pathname === "/app/organization-admin/invitations",
//       },
//       {
//         title: "Requests",
//         url: "/app/organization-admin/requests",
//         icon: Building2,
//         isActive: pathname === "/app/organization-admin/requests",
//       },
//     ];
//   }, [pathname, user]);


//   const adminNavItems = React.useMemo((): MenuItem[] => {
//     if (!user?.isAdmin) return [];


//     return [
//       {
//         title: "Dashboard",
//         url: "/app/admin",
//         icon: TrendingUp,
//         isActive: pathname === "/app/admin",
//       },
//       {
//         title: "Users",
//         url: "/app/admin/users",
//         icon: Users,
//         isActive: pathname === "/app/admin/users",
//       },
//       {
//         title: "Organizations",
//         url: "/app/admin/organizations",
//         icon: Building2,
//         isActive: pathname === "/app/admin/organizations",
//       },
//       {
//         title: "Documents",
//         url: "/app/admin/documents",
//         icon: Files,
//         isActive: pathname === "/app/admin/documents",
//       },
//     ];
//   }, [pathname, user]);


//   const getOrganizationDisplayName = () => {
//     const orgName = user?.activeOrganization?.name || "Complēre";
//     return state === "collapsed" ? orgName.charAt(0).toUpperCase() : orgName;
//   };


//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <div className="px-2 py-6">
//           <h2 className="text-lg font-semibold tracking-tight">
//             {getOrganizationDisplayName()}
//           </h2>
//         </div>
//       </SidebarHeader>


//       <SidebarContent>
//         <NavMain
//           title="Complēre"
//           items={[
//             { icon: Home, title: "Home", url: "/app", isActive: pathname === "/app" },
//           ]}
//         />


//         <NavMain title="Analyses" items={navMain} />


//         <NavMain title="Organization" items={organizationNavItems} />


//         {organizationAdminNavItems.length > 0 && (
//           <NavMain title="Organization Admin " items={organizationAdminNavItems} />
//         )}


//         {isAdminRoute && adminNavItems.length > 0 && (
//           <NavMain title="Admin" items={adminNavItems} />
//         )}
//       </SidebarContent>


//       <SidebarFooter>
//         <SidebarTrigger />
//         <NavUser user={userData} />
//       </SidebarFooter>


//       <SidebarRail />
//     </Sidebar>
//   );
// }




"use client";


import {
 Clock,
 FileText,
 Home,
 Plus,
 Users,
 Building2,
 Mail,
 Search,
 TrendingUp,
 Files,
 type LucideIcon,
 ClipboardList,
} from "lucide-react";
import * as React from "react";
import { usePathname } from "next/navigation";


import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
 Sidebar,
 SidebarContent,
 SidebarFooter,
 SidebarHeader,
 SidebarRail,
 SidebarTrigger,
 useSidebar,
} from "@/components/ui/sidebar";
import { api } from "@/trpc/react";


type MenuItem = {
 title: string;
 url: string;
 icon: LucideIcon;
 isActive?: boolean;
 items?: Array<{
   title: string;
   url: string;
   isActive?: boolean;
 }>;
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 const { data: user } = api.me.get.useQuery();
 const pathname = usePathname();
 const { state } = useSidebar();
 const { data: recentSubjects } = api.subject.list.useQuery({ limit: 5 });


 const isAdminRoute = pathname?.startsWith("/app/admin");
 const isPersonalWorkspace = user?.activeOrganization?.id === null;


 const userData = {
   name: user?.name ?? "Loading...",
   email: user?.email ?? "Loading...",
   isAdmin: user?.isAdmin ?? false,
 };


 const navMain = React.useMemo((): MenuItem[] => {
   const items: MenuItem[] = [
     { title: "All", url: "/app/subject/list", icon: FileText, isActive: pathname === "/app/subject/list" },
     { title: "New", url: "/app/subject", icon: Plus, isActive: pathname === "/app/subject" },
   ];


   if (recentSubjects?.length) {
     items.push({
       title: "Recent",
       url: "#",
       icon: Clock,
       items: recentSubjects.map((subject: any) => ({
         title: subject.title || `Analysis ${subject.id.slice(0, 8)}`,
         url: `/app/subject/${subject.id}`,
         isActive: pathname === `/app/subject/${subject.id}`,
       })),
     });
   }


   return items;
 }, [recentSubjects, pathname]);


 const organizationNavItems = React.useMemo((): MenuItem[] => {
   const items: MenuItem[] = [
     {
       title: "Find Organizations",
       url: "/app/organizations/search",
       icon: Search,
       isActive: pathname === "/app/organizations/search",
     },
   ];


   if (isPersonalWorkspace) {
     items.push({
       title: "Requests",
       url: "/app/organization-admin/personal-requests",
       icon: ClipboardList,
       isActive: pathname === "/app/organization-admin/personal-requests",
     });
   }


   return items;
 }, [pathname, isPersonalWorkspace]);


 const organizationAdminNavItems = React.useMemo((): MenuItem[] => {
   const role = user?.activeOrganizationMember?.role;
   if (role !== "ADMIN") return [];


   return [
     {
       title: "Dashboard",
       url: "/app/organization-admin/dashboard",
       icon: TrendingUp,
       isActive: pathname === "/app/organization-admin/dashboard",
     },
     {
       title: "Members",
       url: "/app/organization-admin/members",
       icon: Users,
       isActive: pathname === "/app/organization-admin/members",
     },
     {
       title: "Invitations",
       url: "/app/organization-admin/invitations",
       icon: Mail,
       isActive: pathname === "/app/organization-admin/invitations",
     },
     {
       title: "Requests",
       url: "/app/organization-admin/requests",
       icon: Building2,
       isActive: pathname === "/app/organization-admin/requests",
     },
   ];
 }, [pathname, user]);


 const adminNavItems = React.useMemo((): MenuItem[] => {
   if (!user?.isAdmin) return [];


   return [
     {
       title: "Dashboard",
       url: "/app/admin",
       icon: TrendingUp,
       isActive: pathname === "/app/admin",
     },
     {
       title: "Users",
       url: "/app/admin/users",
       icon: Users,
       isActive: pathname === "/app/admin/users",
     },
     {
       title: "Organizations",
       url: "/app/admin/organizations",
       icon: Building2,
       isActive: pathname === "/app/admin/organizations",
     },
     {
       title: "Documents",
       url: "/app/admin/documents",
       icon: Files,
       isActive: pathname === "/app/admin/documents",
     },
   ];
 }, [pathname, user]);


 const getOrganizationDisplayName = () => {
   const orgName = user?.activeOrganization?.name || "Complēre";
   return state === "collapsed" ? orgName.charAt(0).toUpperCase() : orgName;
 };


 return (
   <Sidebar collapsible="icon" {...props}>
     <SidebarHeader>
       <div className="px-2 py-6">
         <h2 className="text-lg font-semibold tracking-tight">
           {getOrganizationDisplayName()}
         </h2>
       </div>
     </SidebarHeader>


     <SidebarContent>
       <NavMain
         title="Complēre"
         items={[
           { icon: Home, title: "Home", url: "/app", isActive: pathname === "/app" },
         ]}
       />


       <NavMain title="Analyses" items={navMain} />


       <NavMain title="Organization" items={organizationNavItems} />


       {organizationAdminNavItems.length > 0 && (
         <NavMain title="Organization Admin" items={organizationAdminNavItems} />
       )}


       {isAdminRoute && adminNavItems.length > 0 && (
         <NavMain title="Admin" items={adminNavItems} />
       )}
     </SidebarContent>


     <SidebarFooter>
       <SidebarTrigger />
       <NavUser user={userData} />
     </SidebarFooter>


     <SidebarRail />
   </Sidebar>
 );
}



