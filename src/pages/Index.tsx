
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Activity, 
  Users, 
  CalendarClock, 
  Clock, 
  UserPlus, 
  ClipboardList,
  Stethoscope,
  FileText,
  BarChart2,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const navigate = useNavigate();

  // Dados fictícios para o dashboard
  const quickStats = [
    { 
      title: "Atendimentos hoje", 
      value: "8", 
      icon: <Stethoscope className="w-6 h-6 text-emerald-500" />,
      change: "+2 em relação a ontem",
      path: "/schedule"
    },
    { 
      title: "Pacientes na espera", 
      value: "3", 
      icon: <Clock className="w-6 h-6 text-amber-500" />,
      change: "Tempo médio: 12min",
      path: "/schedule"
    },
    { 
      title: "Exames pendentes", 
      value: "5", 
      icon: <FileText className="w-6 h-6 text-sky-500" />,
      change: "2 urgentes",
      path: "/medical-exams"
    },
    { 
      title: "Faturamento do dia", 
      value: "R$ 2.350", 
      icon: <BarChart2 className="w-6 h-6 text-violet-500" />,
      change: "+15% em relação à média",
      path: "/financial"
    }
  ];

  const nextAppointments = [
    { time: "10:30", patient: "Maria Silva", type: "Consulta", room: "104" },
    { time: "11:15", patient: "João Ferreira", type: "Retorno", room: "101" },
    { time: "13:45", patient: "Ana Oliveira", type: "Exame", room: "203" }
  ];

  const quickActions = [
    { name: "Novo paciente", icon: UserPlus, path: "/patients", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { name: "Novo atendimento", icon: ClipboardList, path: "/records", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    { name: "Registrar ponto", icon: Clock, path: "/time-clock", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
    { name: "Calendário", icon: Calendar, path: "/schedule", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <Badge className="w-fit pop-in mb-2" variant="secondary">Bem-vindo</Badge>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 pop-in" style={{ animationDelay: "0.1s" }}>
              Care Management System
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl pop-in" style={{ animationDelay: "0.2s" }}>
              Dashboard da clínica - Visão rápida das atividades e informações importantes
            </p>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pop-in" style={{ animationDelay: "0.3s" }}>
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary" onClick={() => navigate(stat.path)}>
              <CardContent className="p-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{stat.value}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                </div>
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ações Rápidas */}
          <Card className="pop-in lg:col-span-1" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2 text-xs font-medium border hover:border-primary dark:hover:border-primary"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    {action.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximos Atendimentos */}
          <Card className="pop-in lg:col-span-2" style={{ animationDelay: "0.5s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Próximos Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nextAppointments.map((appt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold rounded-md p-2 text-sm w-16 text-center">
                        {appt.time}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{appt.patient}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{appt.type} • Sala {appt.room}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => navigate("/schedule")}>Ver</Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/schedule")}
                >
                  Ver agenda completa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clinical" className="pop-in" style={{ animationDelay: "0.6s" }}>
          <TabsList className="w-full md:w-auto mb-4">
            <TabsTrigger value="clinical" className="flex-1 md:flex-auto">Sistema Clínico</TabsTrigger>
            <TabsTrigger value="administrative" className="flex-1 md:flex-auto">Sistema Administrativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clinical">
            <div className="medical-grid">
              <Card className="vital-sign-card hover-shadow">
                <div className="flex mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-400">Prontuários</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Acesse e gerencie registros médicos e histórico de pacientes
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/records")}
                >
                  <span>Acessar Prontuários</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>

              <Card className="vital-sign-card hover-shadow">
                <div className="flex mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-400">Pacientes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Gerenciamento de cadastros, histórico e agendamentos
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/patients")}
                >
                  <span>Gerenciar Pacientes</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>

              <Card className="vital-sign-card hover-shadow">
                <div className="flex mb-4">
                  <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <CalendarClock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-400">Agenda</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Consulte a agenda do dia, marque e gerencie consultas
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/schedule")}
                >
                  <span>Abrir Agenda</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="administrative">
            <div className="medical-grid">
              <Card className="vital-sign-card hover-shadow">
                <div className="flex mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-400">Financeiro</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Monitore faturamento, despesas e relatórios gerenciais
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/financial")}
                >
                  <span>Dados Financeiros</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>

              <Card className="vital-sign-card hover-shadow">
                <div className="flex mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-400">Equipe</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Gerencie funcionários, escalas e ponto eletrônico
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/staff")}
                >
                  <span>Gerenciar Equipe</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>

              <Card className="vital-sign-card hover-shadow">
                <div className="flex mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-700 dark:text-primary-400">Ponto Eletrônico</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Registre e acompanhe o ponto dos funcionários
                </p>
                <Button 
                  variant="outline" 
                  className="w-full group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => navigate("/time-clock")}
                >
                  <span>Registrar Ponto</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card className="p-6 border border-sky-100 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-white dark:from-gray-800 dark:to-gray-900 pop-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configurar Dr. Fácil</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configure seu perfil e preferências para otimizar seu fluxo de trabalho.</p>
              </div>
              <Button className="shrink-0" onClick={() => navigate("/settings/profile")}>Configurar Perfil</Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
