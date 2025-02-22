
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InventoryItem } from '@/types/inventory';

interface InventoryItemFormProps {
  onSubmit: (data: Omit<InventoryItem, 'id' | 'totalPrice' | 'lastModifiedBy' | 'lastModifiedAt'>) => void;
  initialData?: Partial<InventoryItem>;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || 'product',
      quantity: initialData?.quantity || 0,
      unitPrice: initialData?.unitPrice || 0,
      expirationDate: initialData?.expirationDate || ''
    }
  });

  const handleFormSubmit = (data: any) => {
    const formData = {
      name: data.name,
      type: data.type as 'medicine' | 'product' | 'equipment',
      quantity: Number(data.quantity),
      unitPrice: Number(data.unitPrice),
      expirationDate: data.expirationDate || undefined
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Item</Label>
        <Input 
          id="name" 
          {...register('name', { required: true })}
          placeholder="Nome do item"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select 
          {...register('type', { required: true })}
          defaultValue="product"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medicine">Medicamento</SelectItem>
            <SelectItem value="product">Produto</SelectItem>
            <SelectItem value="equipment">Equipamento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade</Label>
        <Input 
          id="quantity" 
          type="number"
          {...register('quantity', { required: true, min: 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitPrice">Preço Unitário</Label>
        <Input 
          id="unitPrice" 
          type="number"
          step="0.01"
          {...register('unitPrice', { required: true, min: 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expirationDate">Data de Validade (opcional)</Label>
        <Input 
          id="expirationDate" 
          type="date"
          {...register('expirationDate')}
        />
      </div>

      <Button type="submit" className="w-full">
        Salvar Item
      </Button>
    </form>
  );
};

export default InventoryItemForm;
