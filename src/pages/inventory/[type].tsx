import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryItemForm } from "@/components/inventory/InventoryItemForm";
import { InventoryList } from "@/components/inventory/InventoryList";
import { InventoryItem, InventoryItemType, InventoryLog } from "@/types/inventory";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const typeLabels: Record<InventoryItemType, string> = {
  medicine: "Medicamentos",
  product: "Produtos",
  equipment: "Materiais e EPIs",
};

export default function InventoryType() {
  const { type = "product" } = useParams<{ type: InventoryItemType }>();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isStockSheetOpen, setIsStockSheetOpen] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockAction, setStockAction] = useState<"add" | "remove">("add");

  const handleAddItem = (data: Omit<InventoryItem, "id" | "totalPrice" | "lastModifiedBy" | "lastModifiedAt">) => {
    const newItem: InventoryItem = {
      ...data,
      id: Date.now().toString(),
      totalPrice: data.quantity * data.unitPrice,
      lastModifiedBy: "Usuário Atual", // Aqui você deve usar o usuário logado
      lastModifiedAt: new Date().toISOString(),
    };

    setItems([...items, newItem]);
    toast.success("Item cadastrado com sucesso!");
  };

  const handleStockChange = (item: InventoryItem, action: "add" | "remove") => {
    setSelectedItem(item);
    setStockAction(action);
    setStockQuantity("");
    setIsStockSheetOpen(true);
  };

  const handleStockUpdate = () => {
    if (!selectedItem || !stockQuantity) return;

    const quantity = parseInt(stockQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantidade inválida");
      return;
    }

    const previousQuantity = selectedItem.quantity;
    let newQuantity = previousQuantity;

    if (stockAction === "add") {
      newQuantity += quantity;
    } else {
      if (quantity > previousQuantity) {
        toast.error("Quantidade a remover é maior que o estoque atual");
        return;
      }
      newQuantity -= quantity;
    }

    const updatedItem: InventoryItem = {
      ...selectedItem,
      quantity: newQuantity,
      totalPrice: newQuantity * selectedItem.unitPrice,
      lastModifiedBy: "Usuário Atual", // Aqui você deve usar o usuário logado
      lastModifiedAt: new Date().toISOString(),
    };

    const newLog: InventoryLog = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      type: stockAction,
      quantity,
      previousQuantity,
      newQuantity,
      modifiedBy: "Usuário Atual", // Aqui você deve usar o usuário logado
      modifiedAt: new Date().toISOString(),
    };

    setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item));
    setLogs([...logs, newLog]);
    setIsStockSheetOpen(false);
    toast.success(`${stockAction === "add" ? "Adicionado" : "Removido"} ${quantity} ${quantity === 1 ? "item" : "itens"} do estoque`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Estoque - {typeLabels[type as InventoryItemType]}
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Item</DialogTitle>
              </DialogHeader>
              <InventoryItemForm
                onSubmit={handleAddItem}
                onCancel={() => {
                  const closeDialog = document.querySelector('[data-radix-focus-guard]');
                  if (closeDialog instanceof HTMLElement) {
                    closeDialog.click();
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <InventoryList
          items={items.filter(item => item.type === type)}
          onViewDetails={setSelectedItem}
          onAddStock={(item) => handleStockChange(item, "add")}
          onRemoveStock={(item) => handleStockChange(item, "remove")}
        />

        <Sheet open={isStockSheetOpen} onOpenChange={setIsStockSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                {stockAction === "add" ? "Adicionar ao" : "Remover do"} Estoque
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Item</Label>
                <Input value={selectedItem?.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Quantidade Atual</Label>
                <Input value={selectedItem?.quantity} disabled />
              </div>
              <div className="space-y-2">
                <Label>Quantidade a {stockAction === "add" ? "Adicionar" : "Remover"}</Label>
                <Input
                  type="number"
                  min="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleStockUpdate}>
                Confirmar
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}
