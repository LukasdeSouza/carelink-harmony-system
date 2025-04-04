
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock data for appointments (to be replaced with real data from backend)
  const appointments = [
    { date: new Date(2023, 6, 15), count: 3 },
    { date: new Date(2023, 6, 20), count: 5 },
    { date: new Date(2023, 6, 25), count: 2 },
    { date: new Date(), count: 4 }, // Today
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-600 mt-1">Visualize e gerencie os agendamentos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle>Calendário de Agendamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border w-full max-w-3xl mx-auto"
                    modifiers={{
                      booked: appointments.map(appointment => appointment.date),
                    }}
                    modifiersStyles={{
                      booked: { backgroundColor: "rgba(59, 130, 246, 0.1)" }
                    }}
                    components={{
                      DayContent: (props) => {
                        const appointment = appointments.find(
                          appt => 
                            appt.date.getDate() === props.date.getDate() && 
                            appt.date.getMonth() === props.date.getMonth() && 
                            appt.date.getFullYear() === props.date.getFullYear()
                        );
                        return (
                          <div className="relative h-full w-full p-2">
                            <div>{props.date.getDate()}</div>
                            {appointment && (
                              <Badge 
                                variant="secondary" 
                                className="absolute bottom-0 left-0 right-0 mx-auto w-fit text-xs"
                              >
                                {appointment.count}
                              </Badge>
                            )}
                          </div>
                        );
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-md h-full">
              <CardHeader className="pb-3">
                <CardTitle>Detalhes do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                {date ? (
                  <div className="space-y-4">
                    <p className="text-lg font-medium">{date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500">Agendamentos para esse dia:</p>
                      
                      {appointments.find(appt => 
                        appt.date.getDate() === date.getDate() && 
                        appt.date.getMonth() === date.getMonth() && 
                        appt.date.getFullYear() === date.getFullYear()
                      ) ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Consulta - Dr. Silva</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Paciente: João Costa</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Horário: 09:00</p>
                          </div>
                          
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                            <p className="font-medium text-gray-900 dark:text-gray-100">Exame - Raio X</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Paciente: Maria Oliveira</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Horário: 10:30</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Nenhum agendamento para esta data.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Selecione uma data no calendário</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Schedule;
