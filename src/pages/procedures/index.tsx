
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
import { ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { ProcedureListItem } from "@/components/procedures/ProcedureListItem";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Procedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [doctors, setDoctors] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    const patient = patients.find(patient => patient.id === id);
    return patient ? patient.nome : "Paciente não encontrado";
  };

  const findDoctorName = (id: string) => {
    const doctor = doctors.find(doctor => doctor.id === id);
    return doctor ? doctor.nome : "Médico não encontrado";
  };

  const filteredProcedures = procedures.filter(procedure => {
    const patientName = findPatientName(procedure.paciente_id);
    const doctorName = findDoctorName(procedure.medico_id);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      patientName.toLowerCase().includes(searchLower) ||
      doctorName.toLowerCase().includes(searchLower) ||
      procedure.descricao.toLowerCase().includes(searchLower)
    );
  });

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

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por paciente, médico ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary">
              Total: {procedures.length}
            </Badge>
          </div>
        </div>

        <Card>
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
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
                {filteredProcedures.map((procedure) => (
                  <ProcedureListItem
                    key={procedure.id}
                    procedure={procedure}
                    patientName={findPatientName(procedure.paciente_id)}
                    doctorName={findDoctorName(procedure.medico_id)}
                    onEdit={() => setEditingProcedure(procedure)}
                    onDelete={() => {
                      setProcedureToDelete(procedure);
                      setDeleteDialogOpen(true);
                    }}
                  />
                ))}
                {filteredProcedures.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhum procedimento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={!!editingProcedure} onOpenChange={(open) => !open && setEditingProcedure(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Procedimento</DialogTitle>
          </DialogHeader>
          {editingProcedure && (
            <ProcedureForm
              initialData={editingProcedure}
              onSubmit={handleEditProcedure}
              onCancel={() => setEditingProcedure(null)}
              doctors={doctors}
              patients={patients}
            />
          )}
        </DialogContent>
      </Dialog>

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
