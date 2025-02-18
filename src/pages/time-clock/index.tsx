
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockInButton } from "@/components/time-clock/ClockInButton";
import { TimeClockCalendar } from "@/components/time-clock/TimeClockCalendar";
import { TimeClockList } from "@/components/time-clock/TimeClockList";
import { TimeClockEntry, TimeClockEntryType, WorkDay } from "@/types/time-clock";
import { useState } from "react";
import { toast } from "sonner";

const TimeClock = () => {
  // Temporary mock data - replace with actual data from backend
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const isAdmin = true; // Replace with actual admin check

  const handleClockIn = (type: TimeClockEntryType, coords: GeolocationCoordinates) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const newEntry: TimeClockEntry = {
      id: Date.now().toString(),
      userId: "user-1", // Replace with actual user ID
      userName: "John Doe", // Replace with actual user name
      type,
      timestamp: now.toISOString(),
      location: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    };

    const existingDayIndex = workDays.findIndex((day) => day.date === today);

    if (existingDayIndex >= 0) {
      const updatedWorkDays = [...workDays];
      updatedWorkDays[existingDayIndex].entries.push(newEntry);
      setWorkDays(updatedWorkDays);
    } else {
      const newWorkDay: WorkDay = {
        id: Date.now().toString(),
        userId: "user-1", // Replace with actual user ID
        userName: "John Doe", // Replace with actual user name
        date: today,
        entries: [newEntry],
      };
      setWorkDays([...workDays, newWorkDay]);
    }

    toast.success("Ponto registrado com sucesso!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Ponto Eletrônico</h1>

        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ClockInButton
              type="in"
              label="Registrar Entrada"
              onClockIn={handleClockIn}
            />
            <ClockInButton
              type="lunch-start"
              label="Início do Almoço"
              onClockIn={handleClockIn}
            />
            <ClockInButton
              type="lunch-end"
              label="Fim do Almoço"
              onClockIn={handleClockIn}
            />
            <ClockInButton
              type="out"
              label="Registrar Saída"
              onClockIn={handleClockIn}
            />
          </div>
        )}

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card className="p-4">
              <TimeClockList workDays={workDays} showUserName={isAdmin} />
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <TimeClockCalendar workDays={workDays} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TimeClock;
