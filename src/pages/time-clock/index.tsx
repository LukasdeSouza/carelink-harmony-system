
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockInButton } from "@/components/time-clock/ClockInButton";
import { TimeClockCalendar } from "@/components/time-clock/TimeClockCalendar";
import { TimeClockList } from "@/components/time-clock/TimeClockList";
import { TimeClockEntry, TimeClockEntryType, WorkDay } from "@/types/time-clock";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFlow } from "@/contexts/FlowContext";
import { Clock } from "lucide-react";

const TimeClock = () => {
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntryType, setSelectedEntryType] = useState<TimeClockEntryType | null>(null);
  const { userRole } = useFlow();
  const isAdmin = userRole?.toString() === 'admin';

  // Fetch time clock entries when component mounts
  useEffect(() => {
    fetchTimeClockEntries();
  }, []);

  const fetchTimeClockEntries = async () => {
    setLoading(true);
    try {
      // Get user information (in a real app, you would get this from auth context)
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user:", userError);
        toast.error("Erro ao obter informações do usuário");
        setLoading(false);
        return;
      }

      const userId = userData.user?.id;

      // Get time clock entries - adjust column names based on your actual table structure
      const { data, error } = await supabase
        .from('ponto_eletronico')
        .select('*')
        .order('data_registro', { ascending: false });

      if (error) {
        console.error("Error fetching time clock entries:", error);
        toast.error("Erro ao carregar registros de ponto");
        setLoading(false);
        return;
      }

      // Transform data into WorkDay format - adjust property names based on your actual table structure
      const groupedByDate: Record<string, TimeClockEntry[]> = {};
      
      data?.forEach(entry => {
        // Use created_at as the timestamp
        const date = new Date(entry.data_registro).toISOString().split('T')[0];
        
        if (!groupedByDate[date]) {
          groupedByDate[date] = [];
        }
        
        groupedByDate[date].push({
          id: entry.id,
          usuario_id: entry.usuario_id || userId || "",
          type: entry.type,
          timestamp: entry.created_at,
          location: {
            latitude: entry.lat || 0,
            longitude: entry.lng || 0,
          },
        });
      });
      
      const formattedWorkDays: WorkDay[] = Object.keys(groupedByDate).map(date => ({
        id: date,
        userId: userData.user?.id || "",
        date,
        entries: groupedByDate[date],
      }));
      
      setWorkDays(formattedWorkDays);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Ocorreu um erro ao carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClockInDialog = (type: TimeClockEntryType) => {
    setSelectedEntryType(type);
    setDialogOpen(true);
  };

  const handleClockIn = async (type: TimeClockEntryType, coords: GeolocationCoordinates) => {
    try {
      const now = new Date();
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error fetching user:", userError);
        toast.error("Erro ao obter informações do usuário");
        return;
      }
      
      const userId = userData.user?.id;
      
      if (!userId) {
        toast.error("Usuário não identificado");
        return;
      }
      
      // Insert entry into Supabase - adjust property names based on your actual table structure
      const { data, error } = await supabase.from('ponto_eletronico').insert([
        {
          usuario_id: userId,
          tipo: selectedEntryType,
          data_registro: now.toISOString(),
          local_registro: `lat${coords.latitude}, long${coords.longitude})`,
        }
      ]);
      console.log(data);
      
      if (error) {
        console.error("Error registering time clock:", error);
        toast.error("Erro ao registrar ponto");
        return;
      }
      
      toast.success("Ponto registrado com sucesso!");
      
      // Refresh the data to get the server-generated ID
      fetchTimeClockEntries();
      
    } catch (err) {
      console.error("Error:", err);
      toast.error("Ocorreu um erro ao registrar o ponto");
    } finally {
      setDialogOpen(false);
    }
  };

  const getEntryTypeLabel = (type: TimeClockEntryType): string => {
    switch (type) {
      case "ENTRADA": return "Registrar Entrada";
      case "ALMOCO": return "Início do Almoço";
      case "VOLTA_ALMOCO": return "Fim do Almoço";
      case "CAFE": return "Início Café";
      case "VOLTA_CAFE": return "Volta do Café";
      case "INTERVALO": return "Intervalo 5min";
      case "JANTA": return "Início Janta";
      case "VOLTA_JANTA": return "Volta da Janta";
      case "SAIDA": return "Registrar Saída";
      default: return "";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Ponto Eletrônico</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar registro de ponto</DialogTitle>
                <DialogDescription>
                  Você está prestes a registrar: {selectedEntryType ? getEntryTypeLabel(selectedEntryType) : ""}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                {selectedEntryType && (
                  <ClockInButton
                    type={selectedEntryType}
                    label="Confirmar"
                    onClockIn={handleClockIn}
                  />
                )}
              </DialogFooter>
            </DialogContent>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => handleOpenClockInDialog("ENTRADA")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Registrar Entrada
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("ALMOCO")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Início do Almoço
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("VOLTA_ALMOCO")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Fim do Almoço
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("CAFE")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Início Café da Tarde
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("VOLTA_CAFE")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Fim Café da Tarde
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("INTERVALO")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Intervalo 5 Minutos
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("JANTA")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Início Janta
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("VOLTA_JANTA")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Volta Janta
              </Button>
              <Button 
                onClick={() => handleOpenClockInDialog("SAIDA")}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Registrar Saída
              </Button>
            </div>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card className="p-4">
              {loading ? (
                <div className="flex justify-center p-4">Carregando registros de ponto...</div>
              ) : (
                <TimeClockList workDays={workDays} showUserName={isAdmin} />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            {loading ? (
              <div className="flex justify-center p-4">Carregando calendário...</div>
            ) : (
              <TimeClockCalendar workDays={workDays} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default TimeClock;
