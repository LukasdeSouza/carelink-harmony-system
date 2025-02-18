
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MedicalRecord } from "@/types/medical-record";
import { useState } from "react";
import { toast } from "sonner";
import { Search, PlusCircle, FileEdit } from "lucide-react";

const Records = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const handleCreateRecord = (data: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">) => {
    const newRecord: MedicalRecord = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecords([...records, newRecord]);
    toast.success("Registro médico criado com sucesso!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Prontuários</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Novo Registro Médico</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar Paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">João Silva</SelectItem>
                      <SelectItem value="2">Maria Santos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="datetime-local" />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Sinais Vitais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Pressão Arterial</Label>
                      <Input placeholder="120/80" />
                    </div>
                    <div>
                      <Label>SpO2 (%)</Label>
                      <Input type="number" />
                    </div>
                    <div>
                      <Label>Temperatura (°C)</Label>
                      <Input type="number" step="0.1" />
                    </div>
                    <div>
                      <Label>Freq. Respiratória</Label>
                      <Input type="number" />
                    </div>
                    <div>
                      <Label>Freq. Cardíaca</Label>
                      <Input type="number" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Orientação</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oriented">Orientado</SelectItem>
                        <SelectItem value="disoriented">Desorientado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Consciência</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conscious">Consciente</SelectItem>
                        <SelectItem value="drowsy">Sonolento</SelectItem>
                        <SelectItem value="alert">Alerta</SelectItem>
                        <SelectItem value="lethargic">Letárgico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Estado Emocional</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calm">Calmo</SelectItem>
                        <SelectItem value="agitated">Agitado</SelectItem>
                        <SelectItem value="goodMood">Bom humor</SelectItem>
                        <SelectItem value="badMood">Mau humor</SelectItem>
                        <SelectItem value="depressed">Depressivo</SelectItem>
                        <SelectItem value="cheerful">Alegre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Nutrição/Dieta</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="oral" />
                        <label htmlFor="oral">Via Oral</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tube" />
                        <label htmlFor="tube">Sonda</label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="accepted" />
                        <label htmlFor="accepted">Aceita</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="rejected" />
                        <label htmlFor="rejected">Rejeita</label>
                      </div>
                    </div>
                  </div>
                  <Textarea placeholder="Observações sobre nutrição" />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Eliminações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Urinária</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="urinary-present" />
                          <label htmlFor="urinary-present">Presente</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="urinary-absent" />
                          <label htmlFor="urinary-absent">Ausente</label>
                        </div>
                      </div>
                      <Textarea placeholder="Observações" className="mt-2" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Intestinal</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="intestinal-present" />
                          <label htmlFor="intestinal-present">Presente</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="intestinal-absent" />
                          <label htmlFor="intestinal-absent">Ausente</label>
                        </div>
                      </div>
                      <Textarea placeholder="Observações" className="mt-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Hidratação</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Quantidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-250">0 a 250ml</SelectItem>
                      <SelectItem value="250-500">250 a 500ml</SelectItem>
                      <SelectItem value="500-1000">500 a 1000ml</SelectItem>
                      <SelectItem value="2000+">Até 2 litros</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Observações sobre hidratação" />
                </div>

                <div>
                  <Label>Observações Gerais</Label>
                  <Textarea className="min-h-[100px]" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar prontuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {records.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Nenhum registro médico encontrado.
                    </p>
                  ) : (
                    records
                      .filter((record) =>
                        record.patientName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold">{record.patientName}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(record.dateTime).toLocaleDateString()}{" "}
                              {new Date(record.dateTime).toLocaleTimeString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedRecord(record)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Métricas e Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500">
                  Dashboard em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Records;
