
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkDay, TimeClockEntryType } from "@/types/time-clock";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface TimeClockListProps {
  workDays: WorkDay[];
  showUserName?: boolean;
}

// Função auxiliar para traduzir os tipos de registro
const getEntryTypeLabel = (type: TimeClockEntryType): string => {
  const labels: Record<TimeClockEntryType, string> = {
    "ENTRADA": "Entrada",
    "ALMOCO": "Início Almoço",
    "VOLTA_ALMOCO": "Fim Almoço",
    "CAFE": "Início Café",
    "VOLTA_CAFE": "Fim Café",
    "INTERVALO": "Intervalo",
    "JANTA": "Início Janta",
    "VOLTA_JANTA": "Fim Janta",
    "SAIDA": "Saída"
  };
  
  return labels[type] || type;
};

// Função para determinar a cor do badge com base no tipo de registro
const getEntryBadgeColor = (type: TimeClockEntryType): string => {
  const colors: Record<TimeClockEntryType, string> = {
    "ENTRADA": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    "ALMOCO": "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    "VOLTA_ALMOCO": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    "CAFE": "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    "VOLTA_CAFE": "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
    "INTERVALO": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    "JANTA": "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
    "VOLTA_JANTA": "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100",
    "SAIDA": "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
  };
  
  return colors[type] || "";
};

export function TimeClockList({ workDays, showUserName = false }: TimeClockListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            {showUserName && <TableHead>Funcionário</TableHead>}
            <TableHead>Hora</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Local</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workDays.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showUserName ? 5 : 4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                Nenhum registro de ponto encontrado
              </TableCell>
            </TableRow>
          ) : (
            workDays.flatMap(day => 
              day.entries.map(entry => (
                <TableRow key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(day.date), "dd/MM/yyyy")}
                  </TableCell>
                  {showUserName && (
                    <TableCell>{entry.userName || 'N/A'}</TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    {entry.timestamp ? format(new Date(entry.timestamp), "HH:mm") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={`font-normal ${getEntryBadgeColor(entry.type)}`}>
                      {getEntryTypeLabel(entry.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.location ? 
                      `${entry.location.latitude.toFixed(4)}, ${entry.location.longitude.toFixed(4)}` : 
                      "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
