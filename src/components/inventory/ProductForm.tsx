
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/inventory";
import { useState } from "react";

interface ProductFormProps {
  onSubmit: (data: Omit<Product, "id" | "data_cadastro" | "valor_total">) => void;
  initialData?: Product;
  onCancel: () => void;
}

export function ProductForm({ onSubmit, initialData, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || "",
    descricao: initialData?.descricao || "",
    quantidade: initialData?.quantidade || 0,
    unidade: initialData?.unidade || "",
    valor_unidade: initialData?.valor_unidade || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Produto</Label>
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
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, descricao: e.target.value }))
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            min="0"
            value={formData.quantidade}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantidade: Number(e.target.value) }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade</Label>
          <Input
            id="unidade"
            value={formData.unidade}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, unidade: e.target.value }))
            }
            placeholder="ex: un, kg, ml"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_unidade">Valor Unitário (R$)</Label>
        <Input
          id="valor_unidade"
          type="number"
          step="0.01"
          min="0"
          value={formData.valor_unidade}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, valor_unidade: Number(e.target.value) }))
          }
          required
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
