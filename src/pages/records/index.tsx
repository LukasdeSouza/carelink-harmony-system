
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MedicalRecord } from "@/types/medical-record";
import { Patient } from "@/types/staff";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, PlusCircle, FileEdit, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Records = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
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

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const { data, error } = await supabase
          .from("pacientes")
          .select("*")
          .order("nome");

        if (error) throw error;
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
      try {
        // First, fetch all prontuarios
        const { data: recordsData, error: recordsError } = await supabase
          .from("prontuarios")
          .select("*")
          .order("dateTime", { ascending: false });

        if (recordsError) throw recordsError;

        if (!recordsData || recordsData.length === 0) {
          setRecords([]);
          return;
        }

        // Create a map of patient IDs
        const patientIds = [...new Set(recordsData.map(record => record.patientId))];
        
        // Then fetch all related patients
        const { data: patientsData, error: patientsError } = await supabase
          .from("pacientes")
          .select("id, nome")
          .in("id", patientIds);

        if (patientsError) throw patientsError;

        // Create a map for quick patient lookups
        const patientMap = (patientsData || []).reduce((map, patient) => {
          map[patient.id] = patient.nome;
          return map;
        }, {});

        // Combine the data
        const formattedRecords = recordsData.map(record => ({
          ...record,
          patientName: patientMap[record.patientId] || "Paciente não encontrado"
        }));

        setRecords(formattedRecords);
      } catch (error: any) {
        console.error("Error fetching records:", error);
        toast.error("Erro ao carregar prontuários: " + error.message);
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
  };

  const handleCreateRecord = async () => {
    if (!selectedPatient) {
      toast.error("Por favor, selecione um paciente");
      return;
    }

    try {
      const newRecord = {
        patientId: selectedPatient,
        dateTime: recordDate,
        vitalSigns: {
          bloodPressure,
          spO2: spO2 === "" ? null : Number(spO2),
          temperature: temperature === "" ? null : Number(temperature),
          respiratoryRate: respiratoryRate === "" ? null : Number(respiratoryRate),
          heartRate: heartRate === "" ? null : Number(heartRate)
        },
        orientation,
        consciousness,
        emotionalState,
        nutrition: {
          type: nutritionType,
          acceptance: nutritionAcceptance,
          observations: nutritionObservations
        },
        elimination: {
          urinary: {
            status: urinaryStatus,
            observations: urinaryObservations
          },
          intestinal: {
            status: intestinalStatus,
            observations: intestinalObservations
          }
        },
        hydration: {
          amount: hydrationAmount,
          observations: hydrationObservations
        },
        generalNotes
      };

      const { data, error } = await supabase
        .from("prontuarios")
        .insert([newRecord])
        .select()
        .single();

      if (error) throw error;
      
      // Add the patient name to the record for display
      const patientName = patients.find(p => p.id === selectedPatient)?.nome || "Desconhecido";
      const recordWithPatientName = {
        ...data,
        patientName
      };

      setRecords([recordWithPatientName, ...records]);
      resetForm();
      setFormOpen(false);
      toast.success("Registro médico criado com sucesso!");
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
                                    ? [...nutritionType, "oral"] 
                                    : nutritionType.filter(t => t !== "oral")
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
                                    ? [...nutritionType, "tube"] 
                                    : nutritionType.filter(t => t !== "tube")
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
                                    ? [...nutritionAcceptance, "accepted"] 
                                    : nutritionAcceptance.filter(a => a !== "accepted")
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
                                    ? [...nutritionAcceptance, "rejected"] 
                                    : nutritionAcceptance.filter(a => a !== "rejected")
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
                              checked={urinaryStatus.includes("present")}
                              onCheckedChange={(checked) => {
                                setUrinaryStatus(
                                  checked 
                                    ? [...urinaryStatus, "present"] 
                                    : urinaryStatus.filter(s => s !== "present")
                                );
                              }} 
                            />
                            <label htmlFor="urinary-present">Presente</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="urinary-absent" 
                              checked={urinaryStatus.includes("absent")}
                              onCheckedChange={(checked) => {
                                setUrinaryStatus(
                                  checked 
                                    ? [...urinaryStatus, "absent"] 
                                    : urinaryStatus.filter(s => s !== "absent")
                                );
                              }} 
                            />
                            <label htmlFor="urinary-absent">Ausente</label>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label>Observações</Label>
                          <Textarea 
                            placeholder="Observações" 
                            value={urinaryObservations}
                            onChange={(e) => setUrinaryObservations(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Intestinal</h4>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="intestinal-present" 
                              checked={intestinalStatus.includes("present")}
                              onCheckedChange={(checked) => {
                                setIntestinalStatus(
                                  checked 
                                    ? [...intestinalStatus, "present"] 
                                    : intestinalStatus.filter(s => s !== "present")
                                );
                              }} 
                            />
                            <label htmlFor="intestinal-present">Presente</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="intestinal-absent" 
                              checked={intestinalStatus.includes("absent")}
                              onCheckedChange={(checked) => {
                                setIntestinalStatus(
                                  checked 
                                    ? [...intestinalStatus, "absent"] 
                                    : intestinalStatus.filter(s => s !== "absent")
                                );
                              }} 
                            />
                            <label htmlFor="intestinal-absent">Ausente</label>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label>Observações</Label>
                          <Textarea 
                            placeholder="Observações" 
                            value={intestinalObservations}
                            onChange={(e) => setIntestinalObservations(e.target.value)}
                          />
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
                          <SelectItem value="0-250">0 a 250ml</SelectItem>
                          <SelectItem value="250-500">250 a 500ml</SelectItem>
                          <SelectItem value="500-1000">500 a 1000ml</SelectItem>
                          <SelectItem value="2000+">Até 2 litros</SelectItem>
                          <SelectItem value="absent">Ausente</SelectItem>
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
                      className={`h-2 w-2 rounded-full ${
                        formStep === step 
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
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar prontuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {records.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Nenhum registro médico encontrado.
                    </p>
                  ) : (
                    records
                      .filter((record) =>
                        record.patientName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold">{record.patientName}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(record.dateTime).toLocaleDateString()}{" "}
                              {new Date(record.dateTime).toLocaleTimeString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedRecord(record)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Métricas e Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500">
                  Dashboard em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Records;
