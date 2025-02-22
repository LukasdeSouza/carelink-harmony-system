
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, LineChart } from "lucide-react";

const FlowSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Sistema</h1>
          <p className="text-gray-500">Selecione o fluxo que deseja acessar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Gerenciamento Clínico</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              <p>Acesse o gerenciamento de pacientes, enfermeiros, médicos, estoque e mais</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate("/time-clock")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <LineChart className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Administrativo</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-500">
              <p>Acesse o ponto eletrônico, dashboard e outras ferramentas administrativas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlowSelection;
