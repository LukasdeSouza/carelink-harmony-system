
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ExamRequest } from "@/types/medical-record";
import { Plus, X } from "lucide-react";

interface ExamRequestFormProps {
  patientId: string;
  patientName: string;
  onSubmit: (data: Omit<ExamRequest, "id">) => void;
  onCancel: () => void;
}

export function ExamRequestForm({
  patientId,
  patientName,
  onSubmit,
  onCancel,
}: ExamRequestFormProps) {
  const [formData, setFormData] = useState({
    doctor: "",
    crm: "",
    exams: [{ name: "", quantity: "", observations: "" }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const examRequest: Omit<ExamRequest, "id"> = {
      patientId,
      date: new Date().toISOString(),
      doctor: formData.doctor,
      crm: formData.crm,
      exams: formData.exams,
    };

    onSubmit(examRequest);
  };

  const addExam = () => {
    setFormData({
      ...formData,
      exams: [...formData.exams, { name: "", quantity: "", observations: "" }],
    });
  };

  const removeExam = (index: number) => {
    setFormData({
      ...formData,
      exams: formData.exams.filter((_, i) => i !== index),
    });
  };

  const updateExam = (index: number, field: keyof typeof formData.exams[0], value: string) => {
    const newExams = [...formData.exams];
    newExams[index] = { ...newExams[index], [field]: value };
    setFormData({ ...formData, exams: newExams });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Paciente</h4>
        <p className="text-sm text-muted-foreground">{patientName}</p>
      </div>

      <div className="space-y-4">
        {formData.exams.map((exam, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => removeExam(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            <div className="space-y-2">
              <Label>Tipo de Exame</Label>
              <Input
                value={exam.name}
                onChange={(e) => updateExam(index, "name", e.target.value)}
                placeholder="Ex: Raio-X, Ultrassonografia, Exame de Sangue..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Quantidade de Amostras (se aplicável)</Label>
              <Input
                value={exam.quantity}
                onChange={(e) => updateExam(index, "quantity", e.target.value)}
                placeholder="Ex: 2 amostras em jejum"
              />
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={exam.observations}
                onChange={(e) => updateExam(index, "observations", e.target.value)}
                placeholder="Instruções específicas, recomendações..."
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addExam} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Exame
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Médico</Label>
            <Input
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              placeholder="Dr. Nome Completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>CRM</Label>
            <Input
              value={formData.crm}
              onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
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
        <Button type="submit">Emitir Pedido de Exame</Button>
      </div>
    </form>
  );
}
