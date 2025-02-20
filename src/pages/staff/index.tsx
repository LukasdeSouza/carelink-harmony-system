
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
import { NurseForm } from "@/components/staff/NurseForm";
import { Nurse } from "@/types/staff";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";

const Staff = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);

  const handleAddNurse = (data: Omit<Nurse, "id">) => {
    const newNurse = { ...data, id: Date.now().toString() };
    setNurses([...nurses, newNurse]);
    toast.success("Enfermeiro(a) cadastrado(a) com sucesso!");
  };

  const handleEditNurse = (data: Omit<Nurse, "id">) => {
    if (!editingNurse) return;
    const updatedNurses = nurses.map((nurse) =>
      nurse.id === editingNurse.id ? { ...data, id: nurse.id } : nurse
    );
    setNurses(updatedNurses);
    setEditingNurse(null);
    toast.success("Enfermeiro(a) atualizado(a) com sucesso!");
  };

  const handleDeleteNurse = (id: string) => {
    setNurses(nurses.filter((nurse) => nurse.id !== id));
    toast.success("Enfermeiro(a) removido(a) com sucesso!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Enfermeiros</h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Enfermeiros</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Novo Enfermeiro</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Enfermeiro</DialogTitle>
                </DialogHeader>
                <NurseForm
                  onSubmit={handleAddNurse}
                  onCancel={() => setEditingNurse(null)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nurses.map((nurse) => (
                <TableRow key={nurse.id}>
                  <TableCell>{nurse.fullName}</TableCell>
                  <TableCell>{nurse.document}</TableCell>
                  <TableCell>{nurse.phone}</TableCell>
                  <TableCell>{nurse.email}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingNurse(nurse)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Editar Enfermeiro</DialogTitle>
                        </DialogHeader>
                        <NurseForm
                          initialData={nurse}
                          onSubmit={handleEditNurse}
                          onCancel={() => setEditingNurse(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteNurse(nurse.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Staff;
