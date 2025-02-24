export type InventoryItemType = "medicine" | "product" | "equipment";

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valor_unidade: number;
  valor_total: number;
  data_cadastro?: string;
}

export interface InventoryItem {
  id: string;
  type: InventoryItemType;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  expirationDate?: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface InventoryLog {
  id: string;
  itemId: string;
  type: "add" | "remove";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  modifiedBy: string;
  modifiedAt: string;
}
