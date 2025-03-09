
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  BarChart3,
  ClipboardList,
  Clock,
  Users,
  LogOut,
  FileText,
  UserRound,
  Stethoscope,
  PackageSearch,
  Syringe,
  Building2,
  Receipt,
  CalendarRange,
  Bot,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFlow } from "@/contexts/FlowContext";
import { UserRole } from "@/contexts/FlowContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItemsByRole: Record<UserRole, Record<'clinical' | 'administrative', {
  title: string;
  icon: React.ElementType;
  url: string;
}[]>> = {
  admin: {
    clinical: [
      {
        title: "Funcionários",
        icon: Users,
        url: "/staff",
      },
      {
        title: "Pacientes",
        icon: UserRound,
        url: "/patients",
      },
      {
        title: "Prontuários",
        icon: ClipboardList,
        url: "/records",
      },
      {
        title: "Exames Médicos",
        icon: FileText,
        url: "/medical-exams",
      },
      {
        title: "Estoque",
        icon: PackageSearch,
        url: "/inventory",
      },
      {
        title: "Procedimentos",
        icon: Syringe,
        url: "/procedures",
      },
    ],
    administrative: [
      {
        title: "Painel Administrativo",
        icon: Building2,
        url: "/dashboard",
      },
      {
        title: "IA Dr.Fácil",
        icon: Bot,
        url: "/ai-assistant",
      },
      {
        title: "Ponto Eletrônico",
        icon: Clock,
        url: "/time-clock",
      },
      {
        title: "Financeiro",
        icon: Receipt,
        url: "/financial",
      },
      {
        title: "Agenda",
        icon: CalendarRange,
        url: "/schedule",
      },
    ],
  },
  nurse: {
    clinical: [
      {
        title: "Pacientes",
        icon: UserRound,
        url: "/patients",
      },
      {
        title: "Prontuários",
        icon: ClipboardList,
        url: "/records",
      },
      {
        title: "Exames Médicos",
        icon: FileText,
        url: "/medical-exams",
      },
      {
        title: "Procedimentos",
        icon: Syringe,
        url: "/procedures",
      },
    ],
    administrative: [
      {
        title: "Ponto Eletrônico",
        icon: Clock,
        url: "/time-clock",
      },
      {
        title: "Agenda",
        icon: CalendarRange,
        url: "/schedule",
      },
    ],
  },
  receptionist: {
    clinical: [
      {
        title: "Pacientes",
        icon: UserRound,
        url: "/patients",
      },
      {
        title: "Agenda",
        icon: CalendarRange,
        url: "/schedule",
      },
    ],
    administrative: [
      {
        title: "Ponto Eletrônico",
        icon: Clock,
        url: "/time-clock",
      },
      {
        title: "Agenda",
        icon: CalendarRange,
        url: "/schedule",
      },
    ],
  },
};

export function MainSidebar() {
  const navigate = useNavigate();
  const { selectedFlow, setSelectedFlow, userRole } = useFlow();
  const { toggleSidebar, state } = useSidebar();

  const handleLogout = () => {
    setSelectedFlow(null);
    localStorage.removeItem("drfacil.auth.token");
    localStorage.removeItem("drfacil.flow");
    localStorage.removeItem("drfacil.user.role");
    navigate("/login");
  };

  const handleChangeFlow = () => {
    setSelectedFlow(null);
    navigate("/flow-selection");
  };

  if (!userRole || !selectedFlow) return null;

  const menuItems = menuItemsByRole[userRole.role][selectedFlow];

  return (
    <Sidebar className="w-72 border-r border-sky-100 dark:border-gray-700">
      <SidebarHeader className="p-5 border-b border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary-700 dark:text-primary-400">
            <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full">
              <Stethoscope className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Dr. Fácil</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedFlow === 'clinical' ? 'Sistema Clínico' : 'Sistema Administrativo'}</p>
            </div>
          </div>
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              {state === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white dark:bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-500 dark:text-gray-400 px-4 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="pop-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="menu-item group dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <item.icon className="w-5 h-5 menu-icon" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className="pop-in" style={{ animationDelay: `${menuItems.length * 0.05}s` }}>
                <SidebarMenuButton
                  onClick={handleChangeFlow}
                  className="menu-item group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Building2 className="w-5 h-5 menu-icon" />
                  <span>Trocar Sistema</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pop-in" style={{ animationDelay: `${(menuItems.length + 1) * 0.05}s` }}>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="menu-item group text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-5 h-5 transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-sky-50 dark:bg-gray-700 rounded-lg p-3 text-xs text-sky-800 dark:text-sky-100 border border-sky-100 dark:border-gray-600">
            <p className="font-medium">Dr. Fácil</p>
            <p>Sistema de Gestão para Clínicas</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
