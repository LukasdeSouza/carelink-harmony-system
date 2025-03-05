
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Activity, Users, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <Badge className="w-fit pop-in" variant="secondary">Bem-vindo</Badge>
          <h1 className="text-4xl font-bold text-gray-900 pop-in" style={{ animationDelay: "0.1s" }}>
            Care Management System
          </h1>
          <p className="text-gray-600 max-w-2xl pop-in" style={{ animationDelay: "0.2s" }}>
            Uma solução completa para profissionais de saúde, gestão de pacientes
            e monitoramento de registros.
          </p>
        </div>

        <div className="medical-grid">
          <Card className="vital-sign-card pop-in hover-shadow" style={{ animationDelay: "0.3s" }}>
            <div className="flex mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-primary-700">Master Administrator</h3>
            <p className="text-gray-600 mb-4">
              Gerenciamento de funcionários, pacientes e configurações do sistema
            </p>
            <Button 
              variant="outline" 
              className="w-full group"
              onClick={() => navigate("/admin/permissions")}
            >
              <span>Acessar Área Admin</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Card>

          <Card className="vital-sign-card pop-in hover-shadow" style={{ animationDelay: "0.4s" }}>
            <div className="flex mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-primary-700">Equipe de Enfermagem</h3>
            <p className="text-gray-600 mb-4">
              Acesse registros de pacientes e relógio de ponto
            </p>
            <Button 
              variant="outline" 
              className="w-full group"
              onClick={() => navigate("/staff")}
            >
              <span>Portal da Equipe</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Card>

          <Card className="vital-sign-card pop-in hover-shadow" style={{ animationDelay: "0.5s" }}>
            <div className="flex mb-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-primary-700">Área do Cliente</h3>
            <p className="text-gray-600 mb-4">
              Monitore o progresso do paciente e comunique-se com os cuidadores
            </p>
            <Button 
              variant="outline" 
              className="w-full group"
              onClick={() => navigate("/patients")}
            >
              <span>Portal do Cliente</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-6 border border-sky-100 bg-gradient-to-r from-sky-50 to-white pop-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Começar a usar o Dr. Fácil</h3>
                <p className="text-gray-600 mt-1">Configure seu perfil e comece a explorar todos os recursos do sistema.</p>
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
