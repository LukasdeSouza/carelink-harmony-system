
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { WorkDay } from "@/types/time-clock";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface TimeClockCalendarProps {
  workDays: WorkDay[];
}

export function TimeClockCalendar({ workDays }: TimeClockCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

  // Create an array of dates that have work entries
  const workDates = workDays.map(day => new Date(day.date));

  return (
    <Card className="p-4">
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
      />
      {date && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">
            Registros do dia {format(date, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          {workDays
            .find(day => day.date === format(date, "yyyy-MM-dd"))
            ?.entries.map(entry => (
              <div key={entry.id} className="text-sm text-gray-600">
                {format(new Date(entry.timestamp), "HH:mm")} -{" "}
                {entry.type === "in"
                  ? "Entrada"
                  : entry.type === "lunch-start"
                  ? "Início do Almoço"
                  : entry.type === "lunch-end"
                  ? "Fim do Almoço"
                  : "Saída"}
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
