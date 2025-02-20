
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface AnamnesisFormProps {
  patientId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AnamnesisForm({ patientId, onSubmit, onCancel }: AnamnesisFormProps) {
  const [formData, setFormData] = useState({
    hasPainOrFever: "",
    painDuration: "",
    painLocations: "",
    hasUrinaryProblems: "",
    hasIntestinalProblems: "",
    hasVomiting: "",
    hasDizzinessOrFainting: "",
    usesContinuousMedication: "",
    medicationDetails: "",
    smoker: "",
    alcoholUse: "",
    hasSurgeries: "",
    surgeryDetails: "",
    hasHereditaryDiseases: "",
    hereditaryDiseases: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      patientId,
      date: new Date().toISOString(),
    });
    toast.success("Anamnese registrada com sucesso!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pain or Fever */}
      <div className="space-y-2">
        <Label>Sente dor ou febre?</Label>
        <RadioGroup
          value={formData.hasPainOrFever}
          onValueChange={(value) => handleChange("hasPainOrFever", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="pain-yes" />
            <Label htmlFor="pain-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="pain-no" />
            <Label htmlFor="pain-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasPainOrFever === "yes" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="painDuration">Há quanto tempo?</Label>
            <Textarea
              id="painDuration"
              value={formData.painDuration}
              onChange={(e) => handleChange("painDuration", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="painLocations">Em quais regiões do corpo sente dores?</Label>
            <Textarea
              id="painLocations"
              value={formData.painLocations}
              onChange={(e) => handleChange("painLocations", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Urinary Problems */}
      <div className="space-y-2">
        <Label>Tem tido dificuldade ao urinar?</Label>
        <RadioGroup
          value={formData.hasUrinaryProblems}
          onValueChange={(value) => handleChange("hasUrinaryProblems", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="urinary-yes" />
            <Label htmlFor="urinary-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="urinary-no" />
            <Label htmlFor="urinary-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Intestinal Problems */}
      <div className="space-y-2">
        <Label>Tem tido dificuldade ao defecar?</Label>
        <RadioGroup
          value={formData.hasIntestinalProblems}
          onValueChange={(value) => handleChange("hasIntestinalProblems", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="intestinal-yes" />
            <Label htmlFor="intestinal-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="intestinal-no" />
            <Label htmlFor="intestinal-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Vomiting */}
      <div className="space-y-2">
        <Label>Tem apresentado vômitos?</Label>
        <RadioGroup
          value={formData.hasVomiting}
          onValueChange={(value) => handleChange("hasVomiting", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="vomiting-yes" />
            <Label htmlFor="vomiting-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="vomiting-no" />
            <Label htmlFor="vomiting-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Dizziness/Fainting */}
      <div className="space-y-2">
        <Label>Sofre de tonturas ou desmaios?</Label>
        <RadioGroup
          value={formData.hasDizzinessOrFainting}
          onValueChange={(value) => handleChange("hasDizzinessOrFainting", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="dizziness-yes" />
            <Label htmlFor="dizziness-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="dizziness-no" />
            <Label htmlFor="dizziness-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Continuous Medication */}
      <div className="space-y-2">
        <Label>Toma medicamento de uso contínuo?</Label>
        <RadioGroup
          value={formData.usesContinuousMedication}
          onValueChange={(value) => handleChange("usesContinuousMedication", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="medication-yes" />
            <Label htmlFor="medication-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="medication-no" />
            <Label htmlFor="medication-no">Não</Label>
          </div>
        </RadioGroup>
        {formData.usesContinuousMedication === "yes" && (
          <Textarea
            value={formData.medicationDetails}
            onChange={(e) => handleChange("medicationDetails", e.target.value)}
            placeholder="Quais medicamentos?"
          />
        )}
      </div>

      {/* Smoking */}
      <div className="space-y-2">
        <Label>Faz uso de cigarro (incluindo cigarro eletrônico)?</Label>
        <RadioGroup
          value={formData.smoker}
          onValueChange={(value) => handleChange("smoker", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="smoking-yes" />
            <Label htmlFor="smoking-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="smoking-no" />
            <Label htmlFor="smoking-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Alcohol Use */}
      <div className="space-y-2">
        <Label>Faz uso de bebida alcoólica com frequência?</Label>
        <RadioGroup
          value={formData.alcoholUse}
          onValueChange={(value) => handleChange("alcoholUse", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="alcohol-yes" />
            <Label htmlFor="alcohol-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="alcohol-no" />
            <Label htmlFor="alcohol-no">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Previous Surgeries */}
      <div className="space-y-2">
        <Label>Já realizou alguma cirurgia?</Label>
        <RadioGroup
          value={formData.hasSurgeries}
          onValueChange={(value) => handleChange("hasSurgeries", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="surgery-yes" />
            <Label htmlFor="surgery-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="surgery-no" />
            <Label htmlFor="surgery-no">Não</Label>
          </div>
        </RadioGroup>
        {formData.hasSurgeries === "yes" && (
          <Textarea
            value={formData.surgeryDetails}
            onChange={(e) => handleChange("surgeryDetails", e.target.value)}
            placeholder="Quais cirurgias?"
          />
        )}
      </div>

      {/* Hereditary Diseases */}
      <div className="space-y-2">
        <Label>Alguma doença hereditária na família?</Label>
        <RadioGroup
          value={formData.hasHereditaryDiseases}
          onValueChange={(value) => handleChange("hasHereditaryDiseases", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="hereditary-yes" />
            <Label htmlFor="hereditary-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="hereditary-no" />
            <Label htmlFor="hereditary-no">Não</Label>
          </div>
        </RadioGroup>
        {formData.hasHereditaryDiseases === "yes" && (
          <Textarea
            value={formData.hereditaryDiseases}
            onChange={(e) => handleChange("hereditaryDiseases", e.target.value)}
            placeholder="Quais doenças? (diabetes, pressão alta, cardíaca)"
          />
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Anamnese</Button>
      </div>
    </form>
  );
}
