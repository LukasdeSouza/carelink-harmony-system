
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/types/staff";
import { useState } from "react";

interface PatientFormProps {
  onSubmit: (data: Omit<Patient, "id">) => void;
  initialData?: Patient;
  onCancel: () => void;
}

export function PatientForm({ onSubmit, initialData, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    responsibleName: initialData?.responsibleName || "",
    responsibleCPF: initialData?.responsibleCPF || "",
    address: initialData?.address || "",
    email: initialData?.email || "",
    phone1: initialData?.phone1 || "",
    phone2: initialData?.phone2 || "",
    patientName: initialData?.patientName || "",
    gender: initialData?.gender || "other",
    patientCPF: initialData?.patientCPF || "",
    birthDate: initialData?.birthDate || "",
    observations: initialData?.observations || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome completo do responsável"
        value={formData.responsibleName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, responsibleName: e.target.value }))
        }
      />
      <Input
        placeholder="CPF do responsável"
        value={formData.responsibleCPF}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, responsibleCPF: e.target.value }))
        }
      />
      <Input
        placeholder="Endereço"
        value={formData.address}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, address: e.target.value }))
        }
      />
      <Input
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Telefone 1"
          value={formData.phone1}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone1: e.target.value }))
          }
        />
        <Input
          placeholder="Telefone 2"
          value={formData.phone2}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone2: e.target.value }))
          }
        />
      </div>
      <Input
        placeholder="Nome do paciente"
        value={formData.patientName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, patientName: e.target.value }))
        }
      />
      <Select
        value={formData.gender}
        onValueChange={(value: 'male' | 'female' | 'other') =>
          setFormData((prev) => ({ ...prev, gender: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Sexo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Masculino</SelectItem>
          <SelectItem value="female">Feminino</SelectItem>
          <SelectItem value="other">Outro</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="CPF do paciente"
        value={formData.patientCPF}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, patientCPF: e.target.value }))
        }
      />
      <Input
        type="date"
        value={formData.birthDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
        }
      />
      <Textarea
        placeholder="Observações"
        value={formData.observations}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, observations: e.target.value }))
        }
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
