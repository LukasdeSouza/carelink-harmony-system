
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
import { PatientForm } from "@/components/staff/PatientForm";
import { Patient } from "@/types/staff";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
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

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("nome");

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar pacientes: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleAddPatient = async (data: Omit<Patient, "id" | "anamnese_id" | "atestado_id">) => {
    try {
      const { data: newPatient, error } = await supabase
        .from("pacientes")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      setPatients((prev) => [...prev, newPatient]);
      toast.success("Paciente cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar paciente: " + error.message);
    }
  };

  const handleEditPatient = async (data: Omit<Patient, "id" | "anamnese_id" | "atestado_id">) => {
    if (!editingPatient) return;

    try {
      const { error } = await supabase
        .from("pacientes")
        .update(data)
        .eq("id", editingPatient.id);

      if (error) throw error;

      setPatients((prev) =>
        prev.map((item) =>
          item.id === editingPatient.id
            ? { ...editingPatient, ...data }
            : item
        )
      );
      setEditingPatient(null);
      toast.success("Paciente atualizado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao atualizar paciente: " + error.message);
    }
  };

  const handleDeletePatient = async (patient: Patient) => {
    try {
      const { error } = await supabase
        .from("pacientes")
        .delete()
        .eq("id", patient.id);

      if (error) throw error;

      setPatients((prev) => prev.filter((item) => item.id !== patient.id));
      toast.success("Paciente removido com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao remover paciente: " + error.message);
    } finally {
      setPatientToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Pacientes</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo Paciente</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
              </DialogHeader>
              <PatientForm
                onSubmit={handleAddPatient}
                onCancel={() => setEditingPatient(null)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Telefone Família</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.nome}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.documento}</TableCell>
                  <TableCell>{patient.idade}</TableCell>
                  <TableCell>{patient.telefone_familia}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingPatient(patient)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Editar Paciente</DialogTitle>
                        </DialogHeader>
                        <PatientForm
                          initialData={patient}
                          onSubmit={handleEditPatient}
                          onCancel={() => setEditingPatient(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setPatientToDelete(patient);
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
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPatientToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => patientToDelete && handleDeletePatient(patientToDelete)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
