
import { useState, useEffect } from "react";
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
import { ProcedureForm } from "@/components/procedures/ProcedureForm";
import { Procedure } from "@/types/procedures";
import { Staff } from "@/types/staff";
import { Patient } from "@/types/staff";
import { toast } from "sonner";
import { Pencil, Trash, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Procedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [doctors, setDoctors] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);

  const loadData = async () => {
    try {
      const [proceduresResponse, doctorsResponse, patientsResponse] = await Promise.all([
        supabase.from("procedimentos").select("*").order("data_hora", { ascending: false }),
        supabase.from("funcionarios").select("*").eq("funcao", "MEDICO"),
        supabase.from("pacientes").select("*")
      ]);

      if (proceduresResponse.error) throw proceduresResponse.error;
      if (doctorsResponse.error) throw doctorsResponse.error;
      if (patientsResponse.error) throw patientsResponse.error;

      setProcedures(proceduresResponse.data || []);
      setDoctors(doctorsResponse.data || []);
      setPatients(patientsResponse.data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProcedure = async (data: Omit<Procedure, "id">) => {
    try {
      const { data: newProcedure, error } = await supabase
        .from("procedimentos")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      setProcedures((prev) => [newProcedure, ...prev]);
      toast.success("Procedimento cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar procedimento: " + error.message);
    }
  };

  const handleEditProcedure = async (data: Omit<Procedure, "id">) => {
    if (!editingProcedure) return;

    try {
      const { error } = await supabase
        .from("procedimentos")
        .update(data)
        .eq("id", editingProcedure.id);

      if (error) throw error;

      setProcedures((prev) =>
        prev.map((item) =>
          item.id === editingProcedure.id
            ? { ...data, id: editingProcedure.id }
            : item
        )
      );
      setEditingProcedure(null);
      toast.success("Procedimento atualizado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao atualizar procedimento: " + error.message);
    }
  };

  const handleDeleteProcedure = async (procedure: Procedure) => {
    try {
      const { error } = await supabase
        .from("procedimentos")
        .delete()
        .eq("id", procedure.id);

      if (error) throw error;

      setProcedures((prev) => prev.filter((item) => item.id !== procedure.id));
      toast.success("Procedimento removido com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao remover procedimento: " + error.message);
    } finally {
      setProcedureToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const findPatientName = (id: string) => {
    return patients.find(patient => patient.id === id)?.nome || "Paciente não encontrado";
  };

  const findDoctorName = (id: string) => {
    return doctors.find(doctor => doctor.id === id)?.nome || "Médico não encontrado";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-900">Procedimentos</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo Procedimento</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Procedimento</DialogTitle>
              </DialogHeader>
              <ProcedureForm
                onSubmit={handleAddProcedure}
                onCancel={() => setEditingProcedure(null)}
                doctors={doctors}
                patients={patients}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-4">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {procedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell>
                      {format(new Date(procedure.data_hora), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{findPatientName(procedure.paciente_id)}</TableCell>
                    <TableCell>{findDoctorName(procedure.medico_id)}</TableCell>
                    <TableCell>{procedure.descricao}</TableCell>
                    <TableCell>{procedure.plano_saude ? "Sim" : "Não"}</TableCell>
                    <TableCell>R$ {procedure.valor.toFixed(2)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingProcedure(procedure)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Editar Procedimento</DialogTitle>
                          </DialogHeader>
                          <ProcedureForm
                            initialData={procedure}
                            onSubmit={handleEditProcedure}
                            onCancel={() => setEditingProcedure(null)}
                            doctors={doctors}
                            patients={patients}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setProcedureToDelete(procedure);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este procedimento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProcedureToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => procedureToDelete && handleDeleteProcedure(procedureToDelete)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
