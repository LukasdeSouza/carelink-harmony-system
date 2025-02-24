
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Patient } from "@/types/staff";
import { useState } from "react";

interface PatientFormProps {
  onSubmit: (data: Omit<Patient, "id" | "anamnese_id" | "atestado_id">) => void;
  initialData?: Patient;
  onCancel: () => void;
}

export function PatientForm({ onSubmit, initialData, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<Omit<Patient, "id" | "anamnese_id" | "atestado_id">>({
    nome: initialData?.nome || "",
    email: initialData?.email || "",
    documento: initialData?.documento || "",
    cidade_natal: initialData?.cidade_natal || "",
    estado_natal: initialData?.estado_natal || "",
    telefone_familia: initialData?.telefone_familia || "",
    idade: initialData?.idade || 0,
    peso: initialData?.peso || 0,
    altura: initialData?.altura || 0,
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
        <Label htmlFor="documento">CPF</Label>
        <Input
          id="documento"
          value={formData.documento}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, documento: e.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cidade_natal">Cidade Natal</Label>
          <Input
            id="cidade_natal"
            value={formData.cidade_natal}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, cidade_natal: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado_natal">Estado Natal</Label>
          <Input
            id="estado_natal"
            value={formData.estado_natal}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, estado_natal: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone_familia">Telefone Família</Label>
        <Input
          id="telefone_familia"
          value={formData.telefone_familia}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, telefone_familia: e.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="idade">Idade</Label>
          <Input
            id="idade"
            type="number"
            value={formData.idade}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, idade: Number(e.target.value) }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            step="0.01"
            value={formData.peso}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, peso: Number(e.target.value) }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="altura">Altura (m)</Label>
          <Input
            id="altura"
            type="number"
            step="0.01"
            value={formData.altura}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, altura: Number(e.target.value) }))
            }
            required
          />
        </div>
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
