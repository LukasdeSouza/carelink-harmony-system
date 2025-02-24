export interface Procedure {
  id: string;
  descricao: string;
  data_hora: string;
  valor: number;
  plano_saude: boolean;
  paciente_id: string;
  medico_id: string;
}

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
