
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/chart";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define types for our financial data
type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "expense" | "income";
};

// Mock data
const mockTransactions: Transaction[] = [
  { id: "1", description: "Consulta Particular", amount: 250, date: "2023-07-01", category: "Consultas", type: "income" },
  { id: "2", description: "Consulta Convênio", amount: 150, date: "2023-07-02", category: "Consultas", type: "income" },
  { id: "3", description: "Exame Laboratorial", amount: 300, date: "2023-07-03", category: "Exames", type: "income" },
  { id: "4", description: "Procedimento Cirúrgico", amount: 800, date: "2023-07-05", category: "Procedimentos", type: "income" },
  { id: "5", description: "Pagamento Aluguel", amount: 2500, date: "2023-07-10", category: "Instalações", type: "expense" },
  { id: "6", description: "Compra de Medicamentos", amount: 1200, date: "2023-07-12", category: "Estoque", type: "expense" },
  { id: "7", description: "Serviço de Limpeza", amount: 600, date: "2023-07-15", category: "Serviços", type: "expense" },
  { id: "8", description: "Manutenção de Equipamentos", amount: 350, date: "2023-07-17", category: "Manutenção", type: "expense" },
  { id: "9", description: "Pagamento Internet", amount: 200, date: "2023-07-20", category: "Serviços", type: "expense" },
  { id: "10", description: "Pagamento Energia", amount: 450, date: "2023-07-20", category: "Serviços", type: "expense" },
  { id: "11", description: "Pacote de Consultas", amount: 1200, date: "2023-07-22", category: "Consultas", type: "income" },
  { id: "12", description: "Salários", amount: 8000, date: "2023-07-30", category: "Pessoal", type: "expense" },
];

const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const Financial = () => {
  const [view, setView] = useState<"expense" | "income" | "all">("all");

  // Filter transactions based on the selected view
  const filteredTransactions = mockTransactions.filter(
    t => view === "all" ? true : t.type === view
  );

  // Calculate totals
  const totalIncome = mockTransactions
    .filter(t => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpense = mockTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const netProfit = totalIncome - totalExpense;

  // Generate chart data by month
  const monthlyChartData = months.map((month, index) => {
    const monthIncome = mockTransactions
      .filter(t => {
        const txMonth = new Date(t.date).getMonth();
        return txMonth === index && t.type === "income";
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const monthExpense = mockTransactions
      .filter(t => {
        const txMonth = new Date(t.date).getMonth();
        return txMonth === index && t.type === "expense";
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return {
      name: month,
      income: monthIncome,
      expense: monthExpense,
      profit: monthIncome - monthExpense
    };
  });

  // Create chart data for bar chart
  const barChartData = {
    data: monthlyChartData,
    categories: ["income", "expense"],
    colors: ["#4ade80", "#f87171"],
    valueFormatter: (value: number) => 
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value),
  };

  // Create chart data for line chart
  const lineChartData = {
    data: monthlyChartData,
    index: "name",
    categories: ["profit"],
    colors: ["#60a5fa"],
    valueFormatter: (value: number) => 
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value),
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600 mt-1">Visualize e gerencie as finanças da clínica</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <DollarSign className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-sky-50 border-sky-100">
            <CardHeader className="pb-2">
              <CardDescription>Receitas Totais</CardDescription>
              <CardTitle className="text-2xl text-sky-700 flex items-center">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalIncome)}
                <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-sky-50 border-sky-100">
            <CardHeader className="pb-2">
              <CardDescription>Despesas Totais</CardDescription>
              <CardTitle className="text-2xl text-sky-700 flex items-center">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalExpense)}
                <TrendingDown className="ml-2 h-5 w-5 text-red-500" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className={`${netProfit >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
            <CardHeader className="pb-2">
              <CardDescription>Lucro Líquido</CardDescription>
              <CardTitle className={`text-2xl flex items-center ${netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(netProfit)}
                {netProfit >= 0 ? 
                  <ArrowUpRight className="ml-2 h-5 w-5 text-green-500" /> : 
                  <ArrowDownRight className="ml-2 h-5 w-5 text-red-500" />
                }
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro Mensal</CardTitle>
                <CardDescription>Receitas e despesas por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart {...barChartData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lucro Líquido Mensal</CardTitle>
                <CardDescription>Lucro ou prejuízo por mês</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart {...lineChartData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Receitas</CardTitle>
                <CardDescription>Detalhes de todas as entradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.filter(t => t.type === "income").map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Despesas</CardTitle>
                <CardDescription>Detalhes de todas as saídas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.filter(t => t.type === "expense").map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Financial;
