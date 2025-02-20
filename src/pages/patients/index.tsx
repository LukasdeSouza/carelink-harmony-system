import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientForm } from "@/components/staff/PatientForm";
import { Patient } from "@/types/staff";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
import {
  Anamnesis,
  Evolution,
  MedicalReport,
  MedicalCertificate,
  ExamRequest,
} from "@/types/medical-record";
import { AnamnesisForm } from "@/components/patients/AnamnesisForm";

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [anamneses, setAnamneses] = useState<Anamnesis[]>([]);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleAddPatient = (data: Omit<Patient, "id">) => {
    const newPatient = { ...data, id: Date.now().toString() };
    setPatients([...patients, newPatient]);
    toast.success("Paciente cadastrado com sucesso!");
  };

  const handlePrintCertificate = (certificate: MedicalCertificate) => {
    // Implement print logic
    toast.success("Atestado enviado para impressão");
  };

  const handlePrintExamRequest = (examRequest: ExamRequest) => {
    // Implement print logic
    toast.success("Pedido de exame enviado para impressão");
  };

  const handleNewAnamnesis = (data: any) => {
    const newAnamnesis: Anamnesis = {
      id: Date.now().toString(),
      patientId: selectedPatient!.id,
      date: new Date().toISOString(),
      mainComplaint: data.hasPainOrFever === "yes" ? "Dor/Febre" : "Nenhuma queixa principal",
      currentHistory: `
        ${data.hasPainOrFever === "yes" ? `Dor/Febre há ${data.painDuration}. Localização: ${data.painLocations}` : ""}
        Problemas urinários: ${data.hasUrinaryProblems === "yes" ? "Sim" : "Não"}
        Problemas intestinais: ${data.hasIntestinalProblems === "yes" ? "Sim" : "Não"}
        Vômitos: ${data.hasVomiting === "yes" ? "Sim" : "Não"}
        Tonturas/Desmaios: ${data.hasDizzinessOrFainting === "yes" ? "Sim" : "Não"}
      `.trim(),
      medications: data.usesContinuousMedication === "yes" ? data.medicationDetails : "Não faz uso de medicação contínua",
      habits: `
        Tabagismo: ${data.smoker === "yes" ? "Sim" : "Não"}
        Álcool: ${data.alcoholUse === "yes" ? "Sim" : "Não"}
      `.trim(),
      pastHistory: data.hasSurgeries === "yes" ? data.surgeryDetails : "Sem cirurgias prévias",
      familyHistory: data.hasHereditaryDiseases === "yes" ? data.hereditaryDiseases : "Sem doenças hereditárias relatadas",
      socialHistory: "",
      allergies: "",
      observations: "",
    };

    setAnamneses([...anamneses, newAnamnesis]);
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
              <PatientForm onSubmit={handleAddPatient} onCancel={() => {}} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.patientName}</TableCell>
                      <TableCell>{patient.responsibleName}</TableCell>
                      <TableCell>{patient.phone1}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedPatient.patientName}</CardTitle>
                <CardDescription>Prontuário do Paciente</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="anamnesis" className="space-y-4">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="anamnesis">Anamnese</TabsTrigger>
                    <TabsTrigger value="evolution">Evolução</TabsTrigger>
                    <TabsTrigger value="reports">Laudos</TabsTrigger>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="anamnesis" className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Nova Anamnese</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Nova Anamnese - {selectedPatient?.patientName}</DialogTitle>
                        </DialogHeader>
                        <AnamnesisForm
                          patientId={selectedPatient?.id || ""}
                          onSubmit={(data) => {
                            handleNewAnamnesis(data);
                            const closeDialog = document.querySelector('[data-radix-focus-guard]');
                            if (closeDialog instanceof HTMLElement) {
                              closeDialog.click();
                            }
                          }}
                          onCancel={() => {
                            const closeDialog = document.querySelector('[data-radix-focus-guard]');
                            if (closeDialog instanceof HTMLElement) {
                              closeDialog.click();
                            }
                          }}
                        />
                      </DialogContent>
                    </Dialog>

                    <div className="space-y-4">
                      {anamneses
                        .filter((anamnesis) => anamnesis.patientId === selectedPatient?.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((anamnesis) => (
                          <Card key={anamnesis.id}>
                            <CardHeader>
                              <CardTitle>Anamnese - {new Date(anamnesis.date).toLocaleDateString()}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p><strong>Queixa Principal:</strong> {anamnesis.mainComplaint}</p>
                              <p><strong>História Atual:</strong> {anamnesis.currentHistory}</p>
                              <p><strong>Medicamentos:</strong> {anamnesis.medications}</p>
                              <p><strong>Hábitos:</strong> {anamnesis.habits}</p>
                              <p><strong>História Pregressa:</strong> {anamnesis.pastHistory}</p>
                              <p><strong>História Familiar:</strong> {anamnesis.familyHistory}</p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="evolution" className="space-y-4">
                    <Button className="w-full">Nova Evolução</Button>
                    {/* Evolution list */}
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-4">
                    <Button className="w-full">Novo Laudo</Button>
                    {/* Medical reports list */}
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <Button className="w-full">
                        <Printer className="w-4 h-4 mr-2" />
                        Emitir Atestado
                      </Button>
                      <Button className="w-full">
                        <Printer className="w-4 h-4 mr-2" />
                        Pedido de Exame
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Patients;
