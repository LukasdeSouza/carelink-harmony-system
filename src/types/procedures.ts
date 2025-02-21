
import { InventoryItem } from "./inventory";

export interface ProcedureItem {
  inventoryItem: InventoryItem;
  quantity: number;
  cost: number;
}

export interface Procedure {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  description: string;
  items: ProcedureItem[];
  totalCost: number;
  price: number;
  profit: number;
}
