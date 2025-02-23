
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
        title: "Enfermeiros",
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
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-primary-700">
          <Stethoscope className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Dr. Fácil</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sky-50">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sky-100 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-primary-600" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleChangeFlow}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sky-100 transition-colors"
                >
                  <Building2 className="w-5 h-5 text-primary-600" />
                  <span>Trocar Sistema</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sky-100 transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
