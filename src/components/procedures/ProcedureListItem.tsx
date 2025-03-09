
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Procedure } from "@/types/procedures";
import { getProcedureIcon } from "@/utils/avatar-utils";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";

interface ProcedureListItemProps {
  procedure: Procedure;
  patientName: string;
  doctorName: string;
  onEdit: (procedure: Procedure) => void;
  onDelete: (procedure: Procedure) => void;
}

export function ProcedureListItem({
  procedure,
  patientName,
  doctorName,
  onEdit,
  onDelete,
}: ProcedureListItemProps) {
  const { icon: Icon, background, color } = getProcedureIcon(procedure.id);

  return (
    <TableRow>
      <TableCell>
        <Avatar className={`${background} h-9 w-9`}>
          <AvatarFallback className={`${color}`}>
            <Icon size={16} />
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        {format(new Date(procedure.data_hora), "dd/MM/yyyy HH:mm")}
      </TableCell>
      <TableCell>{patientName}</TableCell>
      <TableCell>{doctorName}</TableCell>
      <TableCell>{procedure.descricao}</TableCell>
      <TableCell>{procedure.plano_saude ? "Sim" : "Não"}</TableCell>
      <TableCell>R$ {procedure.valor.toFixed(2)}</TableCell>
      <TableCell className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(procedure)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(procedure)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
