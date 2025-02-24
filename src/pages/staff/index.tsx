
import { useEffect, useState } from "react";
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
import { StaffForm } from "@/components/staff/StaffForm";
import { Staff } from "@/types/staff";
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

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const loadStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("funcionarios")
        .select("*")
        .order("nome");

      if (error) throw error;
      setStaff(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar funcionários: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleAddStaff = async (data: Omit<Staff, "id" | "data_criacao" | "profile_id">) => {
    try {
      const { data: newStaff, error } = await supabase
        .from("funcionarios")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      setStaff((prev) => [...prev, newStaff]);
      toast.success("Funcionário cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar funcionário: " + error.message);
    }
  };

  const handleEditStaff = async (data: Omit<Staff, "id" | "data_criacao" | "profile_id">) => {
    if (!editingStaff) return;

    try {
      const { error } = await supabase
        .from("funcionarios")
        .update(data)
        .eq("id", editingStaff.id);

      if (error) throw error;

      setStaff((prev) =>
        prev.map((item) =>
          item.id === editingStaff.id
            ? { ...data, id: item.id, data_criacao: item.data_criacao, profile_id: item.profile_id }
            : item
        )
      );
      setEditingStaff(null);
      toast.success("Funcionário atualizado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao atualizar funcionário: " + error.message);
    }
  };

  const handleDeleteStaff = async (staff: Staff) => {
    try {
      const { error } = await supabase
        .from("funcionarios")
        .delete()
        .eq("id", staff.id);

      if (error) throw error;

      setStaff((prev) => prev.filter((item) => item.id !== staff.id));
      toast.success("Funcionário removido com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao remover funcionário: " + error.message);
    } finally {
      setStaffToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Funcionários</h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Funcionários</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Novo Funcionário</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
                </DialogHeader>
                <StaffForm
                  onSubmit={handleAddStaff}
                  onCancel={() => setEditingStaff(null)}
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
                  <TableHead>Função</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.nome}</TableCell>
                    <TableCell>{staffMember.funcao}</TableCell>
                    <TableCell>{staffMember.documento_pessoal}</TableCell>
                    <TableCell>{staffMember.telefone}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingStaff(staffMember)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Editar Funcionário</DialogTitle>
                          </DialogHeader>
                          <StaffForm
                            initialData={staffMember}
                            onSubmit={handleEditStaff}
                            onCancel={() => setEditingStaff(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setStaffToDelete(staffMember);
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
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStaffToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => staffToDelete && handleDeleteStaff(staffToDelete)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default StaffPage;
