
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, AlertCircle } from "lucide-react";
import { useFlow } from "@/contexts/FlowContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, LineChart } from "@/components/ui/chart";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  chart?: {
    type: "bar" | "line";
    data: any[];
    title: string;
  };
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userRole } = useFlow();

  // Protects the route for administrators only
  if (!userRole?.super_admin && userRole?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const analyzeQuery = async (query: string) => {
    try {
      // For development purposes, we'll use a simple keyword matching approach
      // In production, this would be replaced with the DeepSeek API call
      
      const queryLower = query.toLowerCase();
      
      // Financial data request patterns
      if (queryLower.includes("financeiro") || 
          queryLower.includes("receita") || 
          queryLower.includes("despesa") ||
          queryLower.includes("faturamento") ||
          queryLower.includes("lucro")) {
        return await getFinancialData(query);
      }
      
      // Patient data request patterns
      else if (queryLower.includes("paciente") || 
               queryLower.includes("prontuário") ||
               queryLower.includes("consulta") ||
               queryLower.includes("atendimento")) {
        return await getPatientData(query);
      }
      
      // Procedure data request patterns
      else if (queryLower.includes("procedimento") || 
               queryLower.includes("exame") ||
               queryLower.includes("cirurgia")) {
        return await getProcedureData(query);
      }
      
      // If no specific data pattern is recognized
      return {
        text: "Não consegui identificar exatamente o que você está procurando. Você poderia fornecer mais detalhes sobre quais informações deseja consultar? Por exemplo: informações financeiras, dados de pacientes ou procedimentos específicos.",
        chart: null
      };
    } catch (error) {
      console.error("Error analyzing query:", error);
      return {
        text: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.",
        chart: null
      };
    }
  };

  const getFinancialData = async (query: string) => {
    try {
      // This is where you would query Supabase for financial data
      // For development purposes, we'll return mock data
      
      const mockData = [
        { month: "Jan", receita: 25000, despesa: 15000 },
        { month: "Fev", receita: 28000, despesa: 16000 },
        { month: "Mar", receita: 32000, despesa: 17500 },
        { month: "Abr", receita: 30000, despesa: 18000 },
        { month: "Mai", receita: 35000, despesa: 19000 },
        { month: "Jun", receita: 42000, despesa: 20000 },
      ];
      
      // Check if the query is about trends/charts or just facts
      const wantsVisualization = query.toLowerCase().includes("gráfico") || 
                                 query.toLowerCase().includes("visualizar") ||
                                 query.toLowerCase().includes("tendência");
      
      if (wantsVisualization) {
        return {
          text: "Aqui está um gráfico mostrando receitas e despesas dos últimos 6 meses:",
          chart: {
            type: "bar",
            data: mockData,
            title: "Análise Financeira - Últimos 6 Meses"
          }
        };
      } else {
        // Provide a text summary
        const totalReceita = mockData.reduce((sum, item) => sum + item.receita, 0);
        const totalDespesa = mockData.reduce((sum, item) => sum + item.despesa, 0);
        const lucro = totalReceita - totalDespesa;
        
        return {
          text: `Resumo financeiro dos últimos 6 meses:\n\nReceita total: R$ ${totalReceita.toLocaleString('pt-BR')}\nDespesa total: R$ ${totalDespesa.toLocaleString('pt-BR')}\nLucro: R$ ${lucro.toLocaleString('pt-BR')}\n\nO mês com maior receita foi Junho com R$ 42.000,00.`,
          chart: null
        };
      }
    } catch (error) {
      console.error("Error fetching financial data:", error);
      return {
        text: "Ocorreu um erro ao buscar dados financeiros. Por favor, tente novamente mais tarde.",
        chart: null
      };
    }
  };

  const getPatientData = async (query: string) => {
    try {
      // In production, this would query Supabase for actual patient data
      // For now, we'll use mock data
      
      const queryLower = query.toLowerCase();
      const wantsVisualization = queryLower.includes("gráfico") || 
                                 queryLower.includes("visualizar") ||
                                 queryLower.includes("estatística");
      
      if (wantsVisualization) {
        const patientAgeData = [
          { faixa: "0-18", quantidade: 45 },
          { faixa: "19-30", quantidade: 78 },
          { faixa: "31-45", quantidade: 125 },
          { faixa: "46-60", quantidade: 93 },
          { faixa: "61+", quantidade: 67 }
        ];
        
        return {
          text: "Aqui está um gráfico mostrando a distribuição de pacientes por faixa etária:",
          chart: {
            type: "bar",
            data: patientAgeData,
            title: "Distribuição de Pacientes por Faixa Etária"
          }
        };
      } else {
        return {
          text: "Atualmente temos 408 pacientes cadastrados no sistema. 235 são do sexo feminino e 173 do sexo masculino. A faixa etária mais comum é de 31-45 anos, representando 30% dos pacientes. Nos últimos 30 dias, foram realizados 87 atendimentos.",
          chart: null
        };
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      return {
        text: "Ocorreu um erro ao buscar dados de pacientes. Por favor, tente novamente mais tarde.",
        chart: null
      };
    }
  };

  const getProcedureData = async (query: string) => {
    try {
      // In production, this would query Supabase for procedure data
      
      const queryLower = query.toLowerCase();
      const wantsVisualization = queryLower.includes("gráfico") || 
                                 queryLower.includes("visualizar") ||
                                 queryLower.includes("tendência");
      
      if (wantsVisualization) {
        const procedureData = [
          { month: "Jan", consultas: 45, cirurgias: 12, exames: 78 },
          { month: "Fev", consultas: 52, cirurgias: 14, exames: 85 },
          { month: "Mar", consultas: 48, cirurgias: 11, exames: 92 },
          { month: "Abr", consultas: 55, cirurgias: 17, exames: 88 },
          { month: "Mai", consultas: 60, cirurgias: 15, exames: 95 },
          { month: "Jun", consultas: 58, cirurgias: 13, exames: 90 },
        ];
        
        return {
          text: "Aqui está um gráfico mostrando a evolução dos procedimentos realizados nos últimos 6 meses:",
          chart: {
            type: "line",
            data: procedureData,
            title: "Procedimentos Realizados - Últimos 6 Meses"
          }
        };
      } else {
        return {
          text: "Nos últimos 6 meses, foram realizados 318 consultas, 82 cirurgias e 528 exames. O procedimento mais comum foi o exame de sangue completo, seguido por consultas de rotina. Junho teve o maior número de consultas, com 60 atendimentos.",
          chart: null
        };
      }
    } catch (error) {
      console.error("Error fetching procedure data:", error);
      return {
        text: "Ocorreu um erro ao buscar dados de procedimentos. Por favor, tente novamente mais tarde.",
        chart: null
      };
    }
  };

  // Integration with DeepSeek API
  const callDeepSeekAPI = async (userQuery: string) => {
    try {
      // In production, this would be replaced with actual API call
      // For development, we'll simulate the API response
      
      console.log("DeepSeek API would be called with:", userQuery);
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use our query analyzer in place of DeepSeek API for now
      return await analyzeQuery(userQuery);
      
      /* 
      // This would be the actual DeepSeek API call implementation:
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for a medical clinic management system. Analyze 
                        the user's question and determine if they are asking for financial data, 
                        patient information, or procedure statistics. Extract key parameters 
                        needed to query the database.`
            },
            {
              role: 'user',
              content: userQuery
            }
          ],
        }),
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
      */
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call DeepSeek API (simulated for now)
      const result = await callDeepSeekAPI(userMessage.content);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: result.text,
        chart: result.chart
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Erro ao processar sua solicitação. Por favor, tente novamente.");
      
      const errorMessage: Message = {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render chart based on its type
  const renderChart = (chartData: Message["chart"]) => {
    if (!chartData) return null;
    
    const { type, data, title } = chartData;
    
    return (
      <div className="mt-4 mb-2">
        <h4 className="text-sm font-medium text-center mb-2">{title}</h4>
        <div className="h-64">
          {type === "bar" ? (
            <BarChart 
              data={data} 
              categories={Object.keys(data[0]).filter(key => key !== "month" && key !== "faixa")}
              valueFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
          ) : (
            <LineChart 
              data={data} 
              categories={Object.keys(data[0]).filter(key => key !== "month")}
              valueFormatter={(value) => value.toString()}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2 text-primary-600">
        <Bot className="w-8 h-8" />
        <h1 className="text-2xl font-bold">IA Dr.Fácil</h1>
      </div>
      <a href="/" className="text-blue-500 hover:text-blue-700 underline text-sm">
        {"< voltar"}
      </a>

      <div className="rounded-lg shadow-sm border-slate-800 border p-4 min-h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-primary-200" />
              <p className="font-bold">Olá! Como posso ajudar você hoje?</p>
              <p className="text-xs mt-2">
                Experimente perguntar sobre análises financeiras, estatísticas de procedimentos
                ou outras informações administrativas.
              </p>
              <div className="mt-4 p-3 bg-slate-800 rounded-md max-w-md mx-auto">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Exemplos de perguntas:</p>
                    <ul className="text-xs text-blue-600 mt-1 list-disc list-inside">
                      <li>Qual foi a receita nos últimos meses?</li>
                      <li>Mostre um gráfico com os procedimentos realizados</li>
                      <li>Quantos pacientes foram atendidos este mês?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <Card key={index} className={message.role === "assistant" ? "bg-primary-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {message.role === "assistant" ? (
                      <Bot className="w-6 h-6 text-primary-600 shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                    )}
                    <div className="w-full">
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.chart && renderChart(message.chart)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {isLoading && (
            <Card className="bg-primary-50">
              <CardContent className="p-4">
                <div className="flex gap-3 items-center">
                  <Bot className="w-6 h-6 text-primary-600" />
                  <div className="animate-pulse">Pensando...</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
