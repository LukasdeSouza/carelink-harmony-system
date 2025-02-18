
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  Users,
  Settings,
  UserCircle,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
  },
  {
    title: "Patients",
    icon: UserCircle,
    url: "/patients",
  },
  {
    title: "Staff",
    icon: Users,
    url: "/staff",
  },
  {
    title: "Schedule",
    icon: Calendar,
    url: "/schedule",
  },
  {
    title: "Time Clock",
    icon: Clock,
    url: "/time-clock",
  },
  {
    title: "Records",
    icon: ClipboardList,
    url: "/records",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
];

export function MainSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-primary-700">Care Management</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-primary-600" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
