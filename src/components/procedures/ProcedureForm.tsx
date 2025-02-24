
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Procedure } from "@/types/procedures";
import { useState } from "react";
import { Staff } from "@/types/staff";
import { Patient } from "@/types/staff";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcedureFormProps {
  onSubmit: (data: Omit<Procedure, "id">) => void;
  initialData?: Procedure;
  onCancel: () => void;
  doctors: Staff[];
  patients: Patient[];
}

export function ProcedureForm({ onSubmit, initialData, onCancel, doctors, patients }: ProcedureFormProps) {
  const [formData, setFormData] = useState({
    descricao: initialData?.descricao || "",
    data_hora: initialData?.data_hora ? new Date(initialData.data_hora).toISOString().slice(0, 16) : "",
    valor: initialData?.valor || 0,
    plano_saude: initialData?.plano_saude || false,
    paciente_id: initialData?.paciente_id || "",
    medico_id: initialData?.medico_id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição do Procedimento</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, descricao: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_hora">Data e Hora</Label>
        <Input
          id="data_hora"
          type="datetime-local"
          value={formData.data_hora}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, data_hora: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor (R$)</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          min="0"
          value={formData.valor}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, valor: Number(e.target.value) }))
          }
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="plano_saude"
          checked={formData.plano_saude}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, plano_saude: checked }))
          }
        />
        <Label htmlFor="plano_saude">Plano de Saúde</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paciente">Paciente</Label>
        <Select
          value={formData.paciente_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, paciente_id: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o paciente" />
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
        <Label htmlFor="medico">Médico</Label>
        <Select
          value={formData.medico_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, medico_id: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o médico" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
