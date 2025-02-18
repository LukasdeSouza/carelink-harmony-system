
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NurseForm } from "@/components/staff/NurseForm";
import { PatientForm } from "@/components/staff/PatientForm";
import { Nurse, Patient } from "@/types/staff";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";

const Staff = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleAddNurse = (data: Omit<Nurse, "id">) => {
    const newNurse = { ...data, id: Date.now().toString() };
    setNurses([...nurses, newNurse]);
    toast.success("Enfermeiro(a) cadastrado(a) com sucesso!");
  };

  const handleAddPatient = (data: Omit<Patient, "id">) => {
    const newPatient = { ...data, id: Date.now().toString() };
    setPatients([...patients, newPatient]);
    toast.success("Paciente cadastrado com sucesso!");
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

  const handleEditPatient = (data: Omit<Patient, "id">) => {
    if (!editingPatient) return;
    const updatedPatients = patients.map((patient) =>
      patient.id === editingPatient.id ? { ...data, id: patient.id } : patient
    );
    setPatients(updatedPatients);
    setEditingPatient(null);
    toast.success("Paciente atualizado com sucesso!");
  };

  const handleDeleteNurse = (id: string) => {
    setNurses(nurses.filter((nurse) => nurse.id !== id));
    toast.success("Enfermeiro(a) removido(a) com sucesso!");
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((patient) => patient.id !== id));
    toast.success("Paciente removido com sucesso!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Pessoal</h1>

        <Tabs defaultValue="nurses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="nurses">Enfermeiros</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
          </TabsList>

          <TabsContent value="nurses" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lista de Pacientes</h2>
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Telefones</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.patientName}</TableCell>
                    <TableCell>{patient.responsibleName}</TableCell>
                    <TableCell>
                      {patient.phone1}
                      <br />
                      {patient.phone2}
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
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
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Staff;
