
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RecordFormProps {
  formStep: number;
  selectedPatient: string;
  recordDate: string;
  bloodPressure: string;
  spO2: number | "";
  temperature: number | "";
  respiratoryRate: number | "";
  heartRate: number | "";
  orientation: string;
  consciousness: string;
  emotionalState: string;
  nutritionType: string;
  nutritionAcceptance: string;
  nutritionObservations: string;
  urinaryStatus: string;
  urinaryObservations: string;
  intestinalStatus: string;
  intestinalObservations: string;
  hydrationAmount: string;
  hydrationObservations: string;
  generalNotes: string;
  loadingPatients: boolean;
  patients: any[];
  setSelectedPatient: (value: string) => void;
  setRecordDate: (value: string) => void;
  setBloodPressure: (value: string) => void;
  setSpO2: (value: number | "") => void;
  setTemperature: (value: number | "") => void;
  setRespiratoryRate: (value: number | "") => void;
  setHeartRate: (value: number | "") => void;
  setOrientation: (value: string) => void;
  setConsciousness: (value: string) => void;
  setEmotionalState: (value: string) => void;
  setNutritionType: (value: string) => void;
  setNutritionAcceptance: (value: string) => void;
  setNutritionObservations: (value: string) => void;
  setUrinaryStatus: (value: string) => void;
  setUrinaryObservations: (value: string) => void;
  setIntestinalStatus: (value: string) => void;
  setIntestinalObservations: (value: string) => void;
  setHydrationAmount: (value: string) => void;
  setHydrationObservations: (value: string) => void;
  setGeneralNotes: (value: string) => void;
  prevStep: () => void;
  nextStep: () => void;
  resetForm: () => void;
  handleCreateRecord: () => void;
}

export function RecordFormSteps({
  formStep,
  selectedPatient,
  recordDate,
  bloodPressure,
  spO2,
  temperature,
  respiratoryRate,
  heartRate,
  orientation,
  consciousness,
  emotionalState,
  nutritionType,
  nutritionAcceptance,
  nutritionObservations,
  urinaryStatus,
  urinaryObservations,
  intestinalStatus,
  intestinalObservations,
  hydrationAmount,
  hydrationObservations,
  generalNotes,
  loadingPatients,
  patients,
  setSelectedPatient,
  setRecordDate,
  setBloodPressure,
  setSpO2,
  setTemperature,
  setRespiratoryRate,
  setHeartRate,
  setOrientation,
  setConsciousness,
  setEmotionalState,
  setNutritionType,
  setNutritionAcceptance,
  setNutritionObservations,
  setUrinaryStatus,
  setUrinaryObservations,
  setIntestinalStatus,
  setIntestinalObservations,
  setHydrationAmount,
  setHydrationObservations,
  setGeneralNotes,
  prevStep,
  nextStep,
  resetForm,
  handleCreateRecord,
}: RecordFormProps) {
  return (
    <div className="space-y-4">
      {formStep === 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-select">Paciente</Label>
            <Select onValueChange={setSelectedPatient} value={selectedPatient}>
              <SelectTrigger id="patient-select">
                <SelectValue placeholder={loadingPatients ? "Carregando pacientes..." : "Selecionar Paciente"} />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.nome}
                  </SelectItem>
                ))}
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
          <Button variant="outline" onClick={resetForm}>
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
  );
}
