
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MedicalCertificate } from "@/types/medical-record";

interface MedicalCertificateFormProps {
  patientId: string;
  patientName: string;
  onSubmit: (data: Omit<MedicalCertificate, "id">) => void;
  onCancel: () => void;
}

export function MedicalCertificateForm({
  patientId,
  patientName,
  onSubmit,
  onCancel,
}: MedicalCertificateFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    restDays: 0,
    doctor: "",
    crm: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const certificate: Omit<MedicalCertificate, "id"> = {
      patientId,
      date: new Date().toISOString(),
      description: formData.description,
      restDays: formData.restDays,
      doctor: formData.doctor,
      crm: formData.crm,
    };

    onSubmit(certificate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Paciente</h4>
        <p className="text-sm text-muted-foreground">{patientName}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Descrição do Atestado</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva o motivo do atestado e as recomendações médicas..."
            className="min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Dias de Afastamento</Label>
          <Input
            type="number"
            value={formData.restDays}
            onChange={(e) => setFormData({ ...formData, restDays: parseInt(e.target.value) })}
            min={0}
            required
          />
        </div>

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
        <Button type="submit">Emitir Atestado</Button>
      </div>
    </form>
  );
}
