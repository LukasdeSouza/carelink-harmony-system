
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MedicalReport } from "@/types/medical-record";
import { toast } from "sonner";

interface MedicalReportFormProps {
  patientId: string;
  patientName: string;
  onSubmit: (data: Omit<MedicalReport, "id">) => void;
  onCancel: () => void;
}

export function MedicalReportForm({
  patientId,
  patientName,
  onSubmit,
  onCancel,
}: MedicalReportFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    doctor: "",
    crm: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report: Omit<MedicalReport, "id"> = {
      patientId,
      date: new Date().toISOString(),
      title: formData.title,
      content: formData.content,
      doctor: formData.doctor,
      crm: formData.crm,
    };

    onSubmit(report);
    toast.success("Laudo médico gerado com sucesso!");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Título do Laudo</Label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Laudo Médico para Auxílio-Doença"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Identificação do Paciente</h4>
          <p className="text-sm text-muted-foreground">{patientName}</p>
        </div>

        <div className="space-y-2">
          <Label>Histórico Clínico e Queixas Principais</Label>
          <Textarea
            placeholder="Descreva o histórico médico relevante, sintomas principais e sua evolução..."
            className="min-h-[100px]"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Exames e Diagnósticos</Label>
          <Textarea
            placeholder="Liste os exames realizados, resultados e diagnósticos..."
            className="min-h-[100px]"
            value={formData.content}
            onChange={(e) => {
              const updatedContent = formData.content + "\n\nEXAMES E DIAGNÓSTICOS:\n" + e.target.value;
              handleChange("content", updatedContent);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Avaliação da Incapacidade</Label>
          <Textarea
            placeholder="Descreva como a condição afeta as atividades do paciente..."
            className="min-h-[100px]"
            value={formData.content}
            onChange={(e) => {
              const updatedContent = formData.content + "\n\nAVALIAÇÃO DA INCAPACIDADE:\n" + e.target.value;
              handleChange("content", updatedContent);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Médico</Label>
            <Input
              value={formData.doctor}
              onChange={(e) => handleChange("doctor", e.target.value)}
              placeholder="Dr. Nome Completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>CRM</Label>
            <Input
              value={formData.crm}
              onChange={(e) => handleChange("crm", e.target.value)}
              placeholder="CRM/UF 000000"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Gerar Laudo</Button>
      </div>
    </form>
  );
}
