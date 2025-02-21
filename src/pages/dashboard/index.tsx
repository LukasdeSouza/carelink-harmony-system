
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  // Exemplo de dados - você deve substituir por dados reais do seu sistema
  const proceduresData = [
    { month: 'Jan', custos: 4000, receita: 6000, lucro: 2000 },
    { month: 'Fev', custos: 3000, receita: 5500, lucro: 2500 },
    { month: 'Mar', custos: 5000, receita: 8000, lucro: 3000 },
    { month: 'Abr', custos: 2780, receita: 4890, lucro: 2110 },
    { month: 'Mai', custos: 1890, receita: 4800, lucro: 2910 },
    { month: 'Jun', custos: 2390, receita: 5800, lucro: 3410 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Total de Procedimentos</h3>
            <p className="text-3xl font-bold text-primary-600">124</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Receita Total</h3>
            <p className="text-3xl font-bold text-green-600">R$ 45.890,00</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-2">Lucro Total</h3>
            <p className="text-3xl font-bold text-blue-600">R$ 15.970,00</p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Evolução Financeira</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={proceduresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="receita" stroke="#4CAF50" name="Receita" />
                  <Line type="monotone" dataKey="custos" stroke="#f44336" name="Custos" />
                  <Line type="monotone" dataKey="lucro" stroke="#2196F3" name="Lucro" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Análise de Custos vs Lucro</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={proceduresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="custos" fill="#f44336" name="Custos" />
                  <Bar dataKey="lucro" fill="#2196F3" name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
