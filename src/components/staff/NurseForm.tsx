
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Nurse } from "@/types/staff";
import { useState } from "react";

interface NurseFormProps {
  onSubmit: (data: Omit<Nurse, "id">) => void;
  initialData?: Nurse;
  onCancel: () => void;
}

export function NurseForm({ onSubmit, initialData, onCancel }: NurseFormProps) {
  const [formData, setFormData] = useState<Omit<Nurse, "id">>({
    fullName: initialData?.fullName || "",
    document: initialData?.document || "",
    gender: initialData?.gender || "other",
    address: initialData?.address || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    cboCode: initialData?.cboCode || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome completo ou razão social"
        value={formData.fullName}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, fullName: e.target.value }))
        }
      />
      <Input
        placeholder="CPF ou CNPJ"
        value={formData.document}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, document: e.target.value }))
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
      <Input
        placeholder="Telefone"
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, phone: e.target.value }))
        }
      />
      <Input
        placeholder="Código CBO (para técnico de enfermagem)"
        value={formData.cboCode}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, cboCode: e.target.value }))
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
