
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkDay } from "@/types/time-clock";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeClockListProps {
  workDays: WorkDay[];
  showUserName?: boolean;
}

export function TimeClockList({ workDays, showUserName = false }: TimeClockListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          {showUserName && <TableHead>Funcionário</TableHead>}
          <TableHead>Entrada</TableHead>
          <TableHead>Almoço</TableHead>
          <TableHead>Retorno</TableHead>
          <TableHead>Saída</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workDays.map((day) => {
          const getEntryTime = (type: "in" | "lunch-start" | "lunch-end" | "out") =>
            day.entries.find((entry) => entry.type === type)?.timestamp;

          return (
            <TableRow key={day.id}>
              <TableCell>
                {format(new Date(day.date), "dd/MM/yyyy")}
              </TableCell>
              {showUserName && <TableCell>{day.userName}</TableCell>}
              <TableCell>
                {getEntryTime("in")
                  ? format(new Date(getEntryTime("in")!), "HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                {getEntryTime("lunch-start")
                  ? format(new Date(getEntryTime("lunch-start")!), "HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                {getEntryTime("lunch-end")
                  ? format(new Date(getEntryTime("lunch-end")!), "HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>
                {getEntryTime("out")
                  ? format(new Date(getEntryTime("out")!), "HH:mm")
                  : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
