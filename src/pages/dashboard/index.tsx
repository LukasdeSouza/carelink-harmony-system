
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  BarChart
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar, Users, Receipt, TrendingUp, Banknote } from "lucide-react";

const Dashboard = () => {
  // Dados de exemplo - você deve substituir por dados reais do sistema
  const proceduresData = [
    { month: 'Jan', custos: 4000, receita: 6000, lucro: 2000 },
    { month: 'Fev', custos: 3000, receita: 5500, lucro: 2500 },
    { month: 'Mar', custos: 5000, receita: 8000, lucro: 3000 },
    { month: 'Abr', custos: 2780, receita: 4890, lucro: 2110 },
    { month: 'Mai', custos: 1890, receita: 4800, lucro: 2910 },
    { month: 'Jun', custos: 2390, receita: 5800, lucro: 3410 },
  ];

  const patientsByType = [
    { name: 'Consultas', valor: 38 },
    { name: 'Retornos', valor: 22 },
    { name: 'Exames', valor: 15 },
    { name: 'Procedimentos', valor: 8 },
  ];

  const financeByQuarter = [
    { quarter: 'Q1', receita: 18000, despesas: 12000 },
    { quarter: 'Q2', receita: 22000, despesas: 14000 },
    { quarter: 'Q3', receita: 26000, despesas: 16000 },
    { quarter: 'Q4', receita: 32000, despesas: 18000 },
  ];

  const statsCards = [
    {
      title: "Total de Pacientes",
      value: "1.248",
      change: "+12% este mês",
      icon: <Users className="h-8 w-8 text-primary-500" />
    },
    {
      title: "Consultas Realizadas",
      value: "324",
      change: "+8% este mês",
      icon: <Calendar className="h-8 w-8 text-indigo-500" />
    },
    {
      title: "Receita Total",
      value: "R$ 45.890",
      change: "+15% este mês",
      icon: <Receipt className="h-8 w-8 text-emerald-500" />
    },
    {
      title: "Ticket Médio",
      value: "R$ 168",
      change: "+5% este mês",
      icon: <Banknote className="h-8 w-8 text-amber-500" />
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{card.value}</h3>
                  </div>
                  {card.icon}
                </div>
                <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {card.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="financeiro" className="w-full">
          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="financeiro" className="flex-1 sm:flex-auto">Financeiro</TabsTrigger>
            <TabsTrigger value="atendimentos" className="flex-1 sm:flex-auto">Atendimentos</TabsTrigger>
            <TabsTrigger value="pacientes" className="flex-1 sm:flex-auto">Pacientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Financeira Mensal</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <LineChart 
                    data={proceduresData}
                    index="month"
                    categories={["receita", "custos", "lucro"]}
                    colors={["#10b981", "#f43f5e", "#3b82f6"]}
                    valueFormatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receita vs Despesas (Trimestral)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={financeByQuarter}
                    categories={["receita", "despesas"]}
                    colors={["#10b981", "#f43f5e"]}
                    valueFormatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="atendimentos" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={patientsByType}
                    categories={["valor"]}
                    colors={["#8b5cf6"]}
                    valueFormatter={(value) => `${value} pacientes`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análise de Atendimentos por Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <LineChart 
                    data={proceduresData}
                    index="month"
                    categories={["receita"]}
                    colors={["#3b82f6"]}
                    valueFormatter={(value) => `R$ ${value.toLocaleString()}`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pacientes" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Novos Pacientes vs Retornos</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <LineChart 
                    data={[
                      { month: 'Jan', novos: 35, retornos: 65 },
                      { month: 'Fev', novos: 28, retornos: 59 },
                      { month: 'Mar', novos: 42, retornos: 78 },
                      { month: 'Abr', novos: 31, retornos: 62 },
                      { month: 'Mai', novos: 39, retornos: 68 },
                      { month: 'Jun', novos: 33, retornos: 71 },
                    ]}
                    index="month"
                    categories={["novos", "retornos"]}
                    colors={["#ec4899", "#8b5cf6"]}
                    valueFormatter={(value) => `${value} pacientes`}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Faixa Etária dos Pacientes</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BarChart 
                    data={[
                      { faixa: '0-18', valor: 48 },
                      { faixa: '19-30', valor: 112 },
                      { faixa: '31-45', valor: 167 },
                      { faixa: '46-60', valor: 95 },
                      { faixa: '61+', valor: 78 },
                    ]}
                    categories={["valor"]}
                    colors={["#6366f1"]}
                    valueFormatter={(value) => `${value} pacientes`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
