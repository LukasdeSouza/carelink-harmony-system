
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getProductIcon } from "@/utils/avatar-utils";

interface InventoryListProps {
  items: InventoryItem[];
  onViewDetails: (item: InventoryItem) => void;
  onAddStock: (item: InventoryItem) => void;
  onRemoveStock: (item: InventoryItem) => void;
}

const typeLabels = {
  medicine: "Medicamento",
  product: "Produto",
  equipment: "Material/EPI",
};

export function InventoryList({
  items,
  onViewDetails,
  onAddStock,
  onRemoveStock,
}: InventoryListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Valor Unit.</TableHead>
          <TableHead>Valor Total</TableHead>
          <TableHead>Validade</TableHead>
          <TableHead>Última Alteração</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const { icon: Icon, background, color } = getProductIcon(item.id);
          
          return (
            <TableRow key={item.id}>
              <TableCell>
                <Avatar className={`${background} h-9 w-9`}>
                  <AvatarFallback className={`${color}`}>
                    <Icon size={16} />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{typeLabels[item.type]}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>R$ {item.unitPrice.toFixed(2)}</TableCell>
              <TableCell>R$ {item.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                {item.expirationDate
                  ? format(new Date(item.expirationDate), "dd/MM/yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-sm">
                <div>Por: {item.lastModifiedBy}</div>
                <div>Em: {format(new Date(item.lastModifiedAt), "dd/MM/yyyy HH:mm")}</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddStock(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveStock(item)}
                    disabled={item.quantity === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
