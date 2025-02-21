
export type InventoryItemType = "medicine" | "product" | "equipment";

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
