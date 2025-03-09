
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { WorkDay, TimeClockEntryType } from "@/types/time-clock";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TimeClockCalendarProps {
  workDays: WorkDay[];
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

export function TimeClockCalendar({ workDays }: TimeClockCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

  // Create an array of dates that have work entries
  const workDates = workDays.map(day => new Date(day.date));

  // Find the selected day's entries
  const selectedDayEntries = workDays
    .find(day => day.date === format(date, "yyyy-MM-dd"))
    ?.entries.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  return (
    <Card className="p-4 grid md:grid-cols-2 gap-4">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate || new Date())}
          locale={ptBR}
          modifiers={{
            worked: workDates,
          }}
          modifiersStyles={{
            worked: { backgroundColor: "#E3F2FD", color: "#1976D2" },
          }}
          className="border rounded-md p-3"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Registros do dia {format(date, "dd 'de' MMMM", { locale: ptBR })}
        </h3>
        
        {!selectedDayEntries || selectedDayEntries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nenhum registro de ponto neste dia.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedDayEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2 border rounded-md dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Badge className={`font-normal ${getEntryBadgeColor(entry.type)}`}>
                    {getEntryTypeLabel(entry.type)}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(entry.timestamp), "HH:mm")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
