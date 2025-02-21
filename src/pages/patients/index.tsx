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
import { Printer } from "lucide-react";
import {
  Anamnesis,
  MedicalReport,
  MedicalCertificate,
  ExamRequest,
} from "@/types/medical-record";
import { AnamnesisForm } from "@/components/patients/AnamnesisForm";
import { MedicalReportForm } from "@/components/patients/MedicalReportForm";
import { MedicalCertificateForm } from "@/components/patients/MedicalCertificateForm";
import { ExamRequestForm } from "@/components/patients/ExamRequestForm";

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [anamneses, setAnamneses] = useState<Anamnesis[]>([]);
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);
  const [certificates, setCertificates] = useState<MedicalCertificate[]>([]);
  const [examRequests, setExamRequests] = useState<ExamRequest[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleAddPatient = (data: Omit<Patient, "id">) => {
    const newPatient = { ...data, id: Date.now().toString() };
    setPatients([...patients, newPatient]);
    toast.success("Paciente cadastrado com sucesso!");
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

  const handleNewMedicalReport = (data: Omit<MedicalReport, "id">) => {
    const newReport: MedicalReport = {
      ...data,
      id: Date.now().toString(),
    };
    setMedicalReports([...medicalReports, newReport]);
    toast.success("Laudo médico gerado com sucesso!");
  };

  const handleNewCertificate = (data: Omit<MedicalCertificate, "id">) => {
    const newCertificate: MedicalCertificate = {
      ...data,
      id: Date.now().toString(),
    };
    setCertificates([...certificates, newCertificate]);
    toast.success("Atestado médico gerado com sucesso!");
  };

  const handleNewExamRequest = (data: Omit<ExamRequest, "id">) => {
    const newRequest: ExamRequest = {
      ...data,
      id: Date.now().toString(),
    };
    setExamRequests([...examRequests, newRequest]);
    toast.success("Pedido de exame gerado com sucesso!");
  };

  const handlePrintCertificate = (certificate: MedicalCertificate) => {
    const content = `
ATESTADO MÉDICO

Atesto para os devidos fins que o(a) paciente ${selectedPatient?.patientName} necessita de ${certificate.restDays} dia(s) de afastamento de suas atividades.

${certificate.description}

Data: ${new Date(certificate.date).toLocaleDateString()}

_______________________________
Dr(a). ${certificate.doctor}
CRM: ${certificate.crm}
    `.trim();

    const win = window.open("", "_blank");
    win?.document.write(`<pre style="font-family: 'Times New Roman', serif; font-size: 14px; white-space: pre-wrap;">${content}</pre>`);
    win?.document.close();
    win?.print();
  };

  const handlePrintExamRequest = (examRequest: ExamRequest) => {
    const content = `
PEDIDO DE EXAMES

Paciente: ${selectedPatient?.patientName}
Data: ${new Date(examRequest.date).toLocaleDateString()}

EXAMES SOLICITADOS:

${examRequest.exams.map(exam => `
- ${exam.name}
${exam.quantity ? `  Quantidade: ${exam.quantity}` : ""}
${exam.observations ? `  Observações: ${exam.observations}` : ""}
`).join("\n")}

_______________________________
Dr(a). ${examRequest.doctor}
CRM: ${examRequest.crm}
    `.trim();

    const win = window.open("", "_blank");
    win?.document.write(`<pre style="font-family: 'Times New Roman', serif; font-size: 14px; white-space: pre-wrap;">${content}</pre>`);
    win?.document.close();
    win?.print();
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
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="anamnesis">Anamnese</TabsTrigger>
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

                  <TabsContent value="reports" className="space-y-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Novo Laudo</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Novo Laudo Médico - {selectedPatient?.patientName}</DialogTitle>
                        </DialogHeader>
                        <MedicalReportForm
                          patientId={selectedPatient?.id || ""}
                          patientName={selectedPatient?.patientName || ""}
                          onSubmit={(data) => {
                            handleNewMedicalReport(data);
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
                      {medicalReports
                        .filter((report) => report.patientId === selectedPatient?.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((report) => (
                          <Card key={report.id}>
                            <CardHeader>
                              <CardTitle>{report.title}</CardTitle>
                              <CardDescription>
                                {new Date(report.date).toLocaleDateString()} - Dr(a). {report.doctor} - CRM {report.crm}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="whitespace-pre-wrap">{report.content}</div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Printer className="w-4 h-4 mr-2" />
                            Emitir Atestado
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Novo Atestado Médico - {selectedPatient?.patientName}</DialogTitle>
                          </DialogHeader>
                          <MedicalCertificateForm
                            patientId={selectedPatient?.id || ""}
                            patientName={selectedPatient?.patientName || ""}
                            onSubmit={(data) => {
                              handleNewCertificate(data);
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

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <Printer className="w-4 h-4 mr-2" />
                            Pedido de Exame
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Novo Pedido de Exame - {selectedPatient?.patientName}</DialogTitle>
                          </DialogHeader>
                          <ExamRequestForm
                            patientId={selectedPatient?.id || ""}
                            patientName={selectedPatient?.patientName || ""}
                            onSubmit={(data) => {
                              handleNewExamRequest(data);
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
                        <h3 className="font-semibold">Atestados Emitidos</h3>
                        {certificates
                          .filter((cert) => cert.patientId === selectedPatient?.id)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((certificate) => (
                            <Card key={certificate.id}>
                              <CardHeader>
                                <CardDescription>
                                  {new Date(certificate.date).toLocaleDateString()} - 
                                  Dr(a). {certificate.doctor} - CRM {certificate.crm}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-2">Dias de afastamento: {certificate.restDays}</p>
                                <Button
                                  variant="outline"
                                  onClick={() => handlePrintCertificate(certificate)}
                                >
                                  <Printer className="w-4 h-4 mr-2" />
                                  Imprimir
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Pedidos de Exame</h3>
                        {examRequests
                          .filter((req) => req.patientId === selectedPatient?.id)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((request) => (
                            <Card key={request.id}>
                              <CardHeader>
                                <CardDescription>
                                  {new Date(request.date).toLocaleDateString()} - 
                                  Dr(a). {request.doctor} - CRM {request.crm}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 mb-4">
                                  {request.exams.map((exam, index) => (
                                    <div key={index} className="text-sm">
                                      <strong>{exam.name}</strong>
                                      {exam.quantity && <p>Quantidade: {exam.quantity}</p>}
                                      {exam.observations && <p>Observações: {exam.observations}</p>}
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => handlePrintExamRequest(request)}
                                >
                                  <Printer className="w-4 h-4 mr-2" />
                                  Imprimir
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
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
