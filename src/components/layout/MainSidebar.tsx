
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFlow } from "@/contexts/FlowContext";

const menuItemsByRole = {
  admin: {
    clinical: [
      {
        title: "Painel Principal",
        icon: BarChart3,
        url: "/dashboard",
      },
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
        title: "Painel Principal",
        icon: BarChart3,
        url: "/dashboard",
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

  const menuItems = menuItemsByRole[userRole][selectedFlow];

  return (
    <Sidebar className="w-72 border-r border-sky-100">
      <SidebarHeader className="p-5 border-b border-sky-100">
        <div className="flex items-center gap-3 text-primary-700">
          <div className="bg-primary-50 p-2 rounded-full">
            <Stethoscope className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Dr. Fácil</h2>
            <p className="text-xs text-gray-500">{selectedFlow === 'clinical' ? 'Sistema Clínico' : 'Sistema Administrativo'}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-500 px-4 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="pop-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="menu-item group"
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
                  className="menu-item group"
                >
                  <Building2 className="w-5 h-5 menu-icon" />
                  <span>Trocar Sistema</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="pop-in" style={{ animationDelay: `${(menuItems.length + 1) * 0.05}s` }}>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="menu-item group text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 transition-colors duration-300 group-hover:text-red-700" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-sky-50 rounded-lg p-3 text-xs text-sky-800 border border-sky-100">
            <p className="font-medium">Dr. Fácil</p>
            <p>Sistema de Gestão para Clínicas</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
