
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Inventory() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/inventory/medicines")}>
            <CardHeader>
              <CardTitle>Medicamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerenciar estoque de medicamentos
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/inventory/products")}>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerenciar estoque de produtos gerais
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/inventory/equipment")}>
            <CardHeader>
              <CardTitle>Materiais e EPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerenciar estoque de materiais e equipamentos de proteção
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
