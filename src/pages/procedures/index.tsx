
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { Procedure } from "@/types/procedures";
import { Eye } from "lucide-react";

export default function Procedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Procedimentos</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo Procedimento</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Procedimento</DialogTitle>
              </DialogHeader>
              {/* TODO: Adicionar formulário de procedimento */}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Custo Total</TableHead>
                <TableHead>Valor Cobrado</TableHead>
                <TableHead>Lucro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procedures.map((procedure) => (
                <TableRow key={procedure.id}>
                  <TableCell>
                    {format(new Date(procedure.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{procedure.patientName}</TableCell>
                  <TableCell>{procedure.doctorName}</TableCell>
                  <TableCell>R$ {procedure.totalCost.toFixed(2)}</TableCell>
                  <TableCell>R$ {procedure.price.toFixed(2)}</TableCell>
                  <TableCell>R$ {procedure.profit.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
