import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecord } from "@/types/medical-record";
import { Patient } from "@/types/staff";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Search, PlusCircle, FileText, Loader2, 
  FilePlus2, User, ClipboardList, Calendar, ActivitySquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { createMedicalRecord, fetchData, supabase } from "@/integrations/supabase/client";
import { RecordFormSteps } from "@/components/records/RecordFormSteps";
import { RecordListItem } from "@/components/records/RecordListItem";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Records = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [recordDate, setRecordDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  // Form state
  const [bloodPressure, setBloodPressure] = useState("");
  const [spO2, setSpO2] = useState<number | "">("");
  const [temperature, setTemperature] = useState<number | "">("");
  const [respiratoryRate, setRespiratoryRate] = useState<number | "">("");
  const [heartRate, setHeartRate] = useState<number | "">("");
  const [orientation, setOrientation] = useState("");
  const [consciousness, setConsciousness] = useState("");
  const [emotionalState, setEmotionalState] = useState("");
  const [nutritionType, setNutritionType] = useState<string[]>([]);
  const [nutritionAcceptance, setNutritionAcceptance] = useState<string[]>([]);
  const [nutritionObservations, setNutritionObservations] = useState("");
  const [urinaryStatus, setUrinaryStatus] = useState<string[]>([]);
  const [urinaryObservations, setUrinaryObservations] = useState("");
  const [intestinalStatus, setIntestinalStatus] = useState<string[]>([]);
  const [intestinalObservations, setIntestinalObservations] = useState("");
  const [hydrationAmount, setHydrationAmount] = useState("");
  const [hydrationObservations, setHydrationObservations] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  // Multi-step form state
  const [formStep, setFormStep] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'dashboard'>('list');
  const [loading, setLoading] = useState(true);
  
  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const data = await fetchData<Patient>("pacientes");
        setPatients(data || []);
      } catch (error: any) {
        console.error("Error fetching patients:", error);
        toast.error("Erro ao carregar pacientes: " + error.message);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch records from Supabase
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        // First, fetch all prontuarios
        const recordsData = await fetchData<any>("prontuario");

        if (!recordsData || recordsData.length === 0) {
          setRecords([]);
          setLoading(false);
          return;
        }

        // Create a map of patient IDs
        const patientIds = [...new Set(recordsData.map((record: any) => record.paciente_id))];

        // Then fetch all related patients
        const patientsData = await fetchData<Patient>("pacientes");
        
        // Create a map for quick patient lookups
        const patientMap = (patientsData || []).reduce((map: any, patient: Patient) => {
          map[patient.id] = patient.nome;
          return map;
        }, {});

        // Combine the data
        const formattedRecords = recordsData.map((record: any) => ({
          ...record,
          patientName: patientMap[record.paciente_id] || "Paciente não encontrado"
        }));

        setRecords(formattedRecords);
      } catch (error: any) {
        console.error("Error fetching records:", error);
        toast.error("Erro ao carregar prontuários: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const resetForm = () => {
    setSelectedPatient("");
    setRecordDate(new Date().toISOString().slice(0, 16));
    setBloodPressure("");
    setSpO2("");
    setTemperature("");
    setRespiratoryRate("");
    setHeartRate("");
    setOrientation("");
    setConsciousness("");
    setEmotionalState("");
    setNutritionType([]);
    setNutritionAcceptance([]);
    setNutritionObservations("");
    setUrinaryStatus([]);
    setUrinaryObservations("");
    setIntestinalStatus([]);
    setIntestinalObservations("");
    setHydrationAmount("");
    setHydrationObservations("");
    setGeneralNotes("");
    setFormStep(0);
    setFormOpen(false);
  };

  const handleCreateRecord = async () => {
    if (!selectedPatient) {
      toast.error("Por favor, selecione um paciente");
      return;
    }

    try {
      const newRecord = {
        paciente_id: selectedPatient,
        data_hora: recordDate,
        pressao_arterial: bloodPressure,
        sp02: spO2 === "" ? null : Number(spO2),
        temperatura: temperature === "" ? null : Number(temperature),
        frequencia_respiratoria: respiratoryRate === "" ? null : Number(respiratoryRate),
        frequencia_cardiaca: heartRate === "" ? null : Number(heartRate),
        orientacao: orientation,
        consciencia: consciousness,
        estado_emocional: emotionalState,
        nutricao: nutritionType,
        observacoes_nutricao: nutritionObservations,
        eliminacao_urinaria: urinaryStatus,
        observacoes_eliminacao_urinaria: urinaryObservations,
        eliminacao_intestinal: intestinalStatus,
        observacoes_eliminacao_intestinal: intestinalObservations,
        quantidade_hidratacao: hydrationAmount ? parseInt(hydrationAmount) : null,
        observacoes_hidratacao: hydrationObservations,
        observacoes_gerais: generalNotes
      };

      console.log("Submitting record:", newRecord);

      const data = await createMedicalRecord(newRecord);

      // Add the patient name to the record for display
      const patientName = patients.find(p => p.id === selectedPatient)?.nome || "Desconhecido";
      if (data && data[0]) {
        const recordWithPatientName = {
          ...data[0],
          patientName
        };

        setRecords(prev => [recordWithPatientName, ...prev]);
        resetForm();
        toast.success("Registro médico criado com sucesso!");
      }
    } catch (error: any) {
      console.error("Error creating record:", error);
      toast.error("Erro ao criar prontuário: " + error.message);
    }
  };

  const nextStep = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    }
  };

  const prevStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    }
  };

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Prontuários</h1>
          <Sheet open={formOpen} onOpenChange={setFormOpen}>
            <SheetTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Registro
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Novo Registro Médico</SheetTitle>
                <SheetDescription>
                  Preencha os dados do prontuário para o paciente selecionado
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-4 py-4">
                {formStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-select">Paciente</Label>
                      <Select onValueChange={setSelectedPatient} value={selectedPatient}>
                        <SelectTrigger id="patient-select">
                          <SelectValue placeholder={loadingPatients ? "Carregando pacientes..." : "Selecionar Paciente"} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingPatients ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Carregando...</span>
                            </div>
                          ) : patients.length > 0 ? (
                            patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.nome}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-patients" disabled>
                              Nenhum paciente encontrado
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="record-date">Data e Hora</Label>
                      <Input
                        id="record-date"
                        type="datetime-local"
                        value={recordDate}
                        onChange={(e) => setRecordDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 pt-4">
                      <h3 className="font-semibold">Sinais Vitais</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Pressão Arterial</Label>
                          <Input
                            placeholder="120/80"
                            value={bloodPressure}
                            onChange={(e) => setBloodPressure(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>SpO2 (%)</Label>
                          <Input
                            type="number"
                            value={spO2}
                            onChange={(e) => setSpO2(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>Temperatura (°C)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Freq. Respiratória</Label>
                          <Input
                            type="number"
                            value={respiratoryRate}
                            onChange={(e) => setRespiratoryRate(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Freq. Cardíaca</Label>
                          <Input
                            type="number"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Orientação</Label>
                        <Select onValueChange={setOrientation} value={orientation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oriented">Orientado</SelectItem>
                            <SelectItem value="disoriented">Desorientado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Consciência</Label>
                        <Select onValueChange={setConsciousness} value={consciousness}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conscious">Consciente</SelectItem>
                            <SelectItem value="drowsy">Sonolento</SelectItem>
                            <SelectItem value="alert">Alerta</SelectItem>
                            <SelectItem value="lethargic">Letárgico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Estado Emocional</Label>
                        <Select onValueChange={setEmotionalState} value={emotionalState}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="calm">Calmo</SelectItem>
                            <SelectItem value="agitated">Agitado</SelectItem>
                            <SelectItem value="goodMood">Bom humor</SelectItem>
                            <SelectItem value="badMood">Mau humor</SelectItem>
                            <SelectItem value="depressed">Depressivo</SelectItem>
                            <SelectItem value="cheerful">Alegre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Nutrição/Dieta</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="oral"
                              checked={nutritionType.includes("oral")}
                              onCheckedChange={(checked) => {
                                setNutritionType(
                                  checked
                                    ? "oral"
                                    : "not-oral"
                                );
                              }}
                            />
                            <label htmlFor="oral">Via Oral</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="tube"
                              checked={nutritionType.includes("tube")}
                              onCheckedChange={(checked) => {
                                setNutritionType(
                                  checked
                                    ? "tube"
                                    : "not-tube"
                                );
                              }}
                            />
                            <label htmlFor="tube">Sonda</label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Aceitação</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="accepted"
                              checked={nutritionAcceptance.includes("accepted")}
                              onCheckedChange={(checked) => {
                                setNutritionAcceptance(
                                  checked
                                    ? "accepted"
                                    : "rejected"
                                );
                              }}
                            />
                            <label htmlFor="accepted">Aceita</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="rejected"
                              checked={nutritionAcceptance.includes("rejected")}
                              onCheckedChange={(checked) => {
                                setNutritionAcceptance(
                                  checked
                                    ? "rejected"
                                    : "not-rejected"
                                );
                              }}
                            />
                            <label htmlFor="rejected">Rejeita</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        placeholder="Observações sobre nutrição"
                        value={nutritionObservations}
                        onChange={(e) => setNutritionObservations(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Eliminações</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Urinária</h4>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="urinary-present"
                              checked={urinaryStatus === "present"}
                              onCheckedChange={(checked) => {
                                setUrinaryStatus(checked ? "present" : null);
                              }}
                            />
                            <label htmlFor="urinary-present">Presente</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="urinary-absent"
                              checked={urinaryStatus === "absent"}
                              onCheckedChange={(checked) => {
                                setUrinaryStatus(checked ? "absent" : null);
                              }}
                            />
                            <label htmlFor="urinary-absent">Ausente</label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Intestinal</h4>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="intestinal-present"
                              checked={intestinalStatus === "present"}
                              onCheckedChange={(checked) => {
                                setIntestinalStatus(checked ? "present" : "");
                              }}
                            />
                            <label htmlFor="intestinal-present">Presente</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="intestinal-absent"
                              checked={intestinalStatus === "absent"}
                              onCheckedChange={(checked) => {
                                setIntestinalStatus(checked ? "absent" : "");
                              }}
                            />
                            <label htmlFor="intestinal-absent">Ausente</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Hidratação</h3>
                      <Select onValueChange={setHydrationAmount} value={hydrationAmount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Quantidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"250"}>0 a 250ml</SelectItem>
                          <SelectItem value={"500"}>250 a 500ml</SelectItem>
                          <SelectItem value={"1000"}>500 a 1000ml</SelectItem>
                          <SelectItem value={"2000"}>Até 2 litros</SelectItem>
                          <SelectItem value={"0"}>Ausente</SelectItem>
                        </SelectContent>
                      </Select>
                      <div>
                        <Label>Observações</Label>
                        <Textarea
                          placeholder="Observações sobre hidratação"
                          value={hydrationObservations}
                          onChange={(e) => setHydrationObservations(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Label>Observações Gerais</Label>
                      <Textarea
                        className="min-h-[100px]"
                        value={generalNotes}
                        onChange={(e) => setGeneralNotes(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {formStep > 0 ? (
                    <Button variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Anterior
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => {
                      resetForm();
                      setFormOpen(false);
                    }}>
                      Cancelar
                    </Button>
                  )}

                  {formStep < 3 ? (
                    <Button onClick={nextStep}>
                      Próximo
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleCreateRecord}>
                      Salvar Registro
                    </Button>
                  )}
                </div>

                <div className="flex justify-center items-center space-x-2 mt-4">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-2 w-2 rounded-full ${formStep === step
                        ? "bg-primary"
                        : formStep > step
                          ? "bg-gray-400"
                          : "bg-gray-200"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-900">Prontuários</h1>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <User size={14} />
              Pacientes: {patients.length}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <ClipboardList size={14} />
              Registros: {records.length}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:inline-flex">
            <TabsTrigger value="list" onClick={() => setCurrentView('list')}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="dashboard" onClick={() => setCurrentView('dashboard')}>
              <ActivitySquare className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(j => (
                          <div key={j} className="h-10 bg-gray-100 rounded"></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <ClipboardList size={48} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum prontuário encontrado</h3>
                <p className="text-sm text-gray-500">
                  {searchTerm ? "Tente ajustar sua busca ou " : ""}
                  crie um novo registro de prontuário.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFormOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Registro
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredRecords.map((record) => (
                  <RecordListItem 
                    key={record.id} 
                    record={record} 
                    onView={() => setSelectedRecord(record)} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Estatísticas de registros</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-blue-500 mb-1">Últimos 7 dias</div>
                        <div className="text-2xl font-bold">
                          {records.filter(r => {
                            const date = new Date(r.dateTime);
                            const now = new Date();
                            const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                            return diff <= 7;
                          }).length}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-green-500 mb-1">Este mês</div>
                        <div className="text-2xl font-bold">
                          {records.filter(r => {
                            const date = new Date(r.dateTime);
                            const now = new Date();
                            return date.getMonth() === now.getMonth() && 
                                   date.getFullYear() === now.getFullYear();
                          }).length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium mb-1">Visualização de calendário</h3>
                      <p className="text-sm text-gray-500">
                        Visualização de calendário em desenvolvimento
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Novo Registro Médico</SheetTitle>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <RecordFormSteps
              formStep={formStep}
              selectedPatient={selectedPatient}
              recordDate={recordDate}
              bloodPressure={bloodPressure}
              spO2={spO2}
              temperature={temperature}
              respiratoryRate={respiratoryRate}
              heartRate={heartRate}
              orientation={orientation}
              consciousness={consciousness}
              emotionalState={emotionalState}
              nutritionType={nutritionType}
              nutritionAcceptance={nutritionAcceptance}
              nutritionObservations={nutritionObservations}
              urinaryStatus={urinaryStatus}
              urinaryObservations={urinaryObservations}
              intestinalStatus={intestinalStatus}
              intestinalObservations={intestinalObservations}
              hydrationAmount={hydrationAmount}
              hydrationObservations={hydrationObservations}
              generalNotes={generalNotes}
              loadingPatients={loadingPatients}
              patients={patients}
              setSelectedPatient={setSelectedPatient}
              setRecordDate={setRecordDate}
              setBloodPressure={setBloodPressure}
              setSpO2={setSpO2}
              setTemperature={setTemperature}
              setRespiratoryRate={setRespiratoryRate}
              setHeartRate={setHeartRate}
              setOrientation={setOrientation}
              setConsciousness={setConsciousness}
              setEmotionalState={setEmotionalState}
              setNutritionType={setNutritionType}
              setNutritionAcceptance={setNutritionAcceptance}
              setNutritionObservations={setNutritionObservations}
              setUrinaryStatus={setUrinaryStatus}
              setUrinaryObservations={setUrinaryObservations}
              setIntestinalStatus={setIntestinalStatus}
              setIntestinalObservations={setIntestinalObservations}
              setHydrationAmount={setHydrationAmount}
              setHydrationObservations={setHydrationObservations}
              setGeneralNotes={setGeneralNotes}
              prevStep={prevStep}
              nextStep={nextStep}
              resetForm={resetForm}
              handleCreateRecord={handleCreateRecord}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Prontuário</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Paciente</h3>
                  <p>{selectedRecord.patientName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data e Hora</h3>
                  <p>{new Date(selectedRecord.dateTime).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sinais Vitais</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Pressão</div>
                    <div>{selectedRecord.vitalSigns?.bloodPressure || "N/A"}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">SpO2</div>
                    <div>{selectedRecord.vitalSigns?.spO2 || "N/A"}%</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Temperatura</div>
                    <div>{selectedRecord.vitalSigns?.temperature || "N/A"}°C</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">FC</div>
                    <div>{selectedRecord.vitalSigns?.heartRate || "N/A"} bpm</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Estado</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {selectedRecord.orientation === "oriented" ? "Orientado" : "Desorientado"}
                  </Badge>
                  <Badge variant="outline">
                    {selectedRecord.consciousness === "conscious" ? "Consciente" : 
                     selectedRecord.consciousness === "drowsy" ? "Sonolento" :
                     selectedRecord.consciousness === "alert" ? "Alerta" : "Letárgico"}
                  </Badge>
                </div>
              </div>
              
              {selectedRecord.generalNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Observações Gerais</h3>
                  <p className="text-sm">{selectedRecord.generalNotes}</p>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedRecord(null)}
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Records;

