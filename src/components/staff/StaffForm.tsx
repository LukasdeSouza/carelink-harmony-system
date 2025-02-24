
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Staff, StaffRole } from "@/types/staff";

interface StaffFormProps {
  onSubmit: (data: Omit<Staff, "id" | "data_criacao" | "profile_id">) => void;
  initialData?: Staff;
  onCancel: () => void;
}

const roleLabels: Record<StaffRole, string> = {
  FISIOTERAPEUTA: "Fisioterapeuta",
  MEDICO: "Médico",
  ENFERMEIRO: "Enfermeiro",
  TECNICO_ENFERMAGEM: "Técnico de Enfermagem",
  INSTRUMENTISTA: "Instrumentista",
  FARMACEUTICO: "Farmacêutico",
  SECRETARIA: "Secretária(o)",
};

export function StaffForm({ onSubmit, initialData, onCancel }: StaffFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    documento_pessoal: initialData?.documento_pessoal || "",
    email: initialData?.email || "",
    telefone: initialData?.telefone || "",
    endereco: initialData?.endereco || "",
    registro_profissional: initialData?.registro_profissional || "",
    funcao: initialData?.funcao || ("" as StaffRole),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nome: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="documento_pessoal">CPF/CNPJ</Label>
        <Input
          id="documento_pessoal"
          value={formData.documento_pessoal}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, documento_pessoal: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          value={formData.telefone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, telefone: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          value={formData.endereco}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, endereco: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="funcao">Função</Label>
        <Select
          value={formData.funcao}
          onValueChange={(value: StaffRole) =>
            setFormData((prev) => ({ ...prev, funcao: value }))
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registro_profissional">Registro Profissional (opcional)</Label>
        <Input
          id="registro_profissional"
          value={formData.registro_profissional}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, registro_profissional: e.target.value }))
          }
        />
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
