
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, LineChart, ArrowRight, HelpCircle } from "lucide-react";
import { useFlow } from "@/contexts/FlowContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const FlowSelection = () => {
  const navigate = useNavigate();
  const { setSelectedFlow } = useFlow();
  const [loading, setLoading] = useState<string | null>(null);

  const handleFlowSelection = (flow: 'clinical' | 'administrative') => {
    setLoading(flow);
    setSelectedFlow(flow);
    
    try {
      // Simular tempo de carregamento para mostrar splash screen
      setTimeout(() => {
        navigate(flow === 'clinical' ? "/dashboard" : "/time-clock");
      }, 1500);
    } catch (error) {
      console.error("Erro ao navegar:", error);
      toast.error("Erro ao carregar fluxo. Tente novamente.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {loading ? (
        // Splash Screen
        <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-6">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                {loading === 'clinical' ? (
                  <Stethoscope className="w-12 h-12 text-primary animate-pulse" />
                ) : (
                  <LineChart className="w-12 h-12 text-primary animate-pulse" />
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-1 rounded-full shadow-md">
                <Badge variant="outline" className="font-medium text-sm border-primary text-primary">
                  {loading === 'clinical' ? 'Fluxo Clínico' : 'Fluxo Administrativo'}
                </Badge>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Carregando {loading === 'clinical' ? 'Gestão Clínica' : 'Área Administrativa'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Preparando seu ambiente de trabalho personalizado...
            </p>
            <div className="w-12 h-1.5 bg-primary/30 rounded-full mx-auto overflow-hidden mt-4">
              <div className="h-full bg-primary shimmer"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl w-full">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Bem-vindo ao Dr. Fácil
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              Selecione o modo que deseja acessar para começar a trabalhar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20 overflow-hidden relative"
              onClick={() => handleFlowSelection('clinical')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-gray-800/50 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center relative z-10">
                <div className="mx-auto bg-blue-50 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Gerenciamento Clínico
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8 relative z-10">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Acesse o gerenciamento de pacientes, prontuários médicos, exames, estoque e mais.
                </p>
                <div className="flex justify-center items-center mt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="mr-2 font-medium">Acessar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-blue-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Card>

            <Card 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20 overflow-hidden relative"
              onClick={() => handleFlowSelection('administrative')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50/30 dark:from-gray-800/50 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="text-center relative z-10">
                <div className="mx-auto bg-indigo-50 dark:bg-indigo-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <LineChart className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  Administrativo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8 relative z-10">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Acesse o ponto eletrônico, relatórios financeiros e outras ferramentas administrativas.
                </p>
                <div className="flex justify-center items-center mt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="mr-2 font-medium">Acessar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-indigo-400/40 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <button className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              <HelpCircle className="w-4 h-4 mr-2" />
              <span>Precisa de ajuda para escolher?</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowSelection;
