import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface ExamFile {
  id: string;
  patientDocument: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  fileName: string;
  uploadDate: string;
}

const MedicalExams = () => {
  const [examFiles, setExamFiles] = useState<ExamFile[]>([]);
  const [formData, setFormData] = useState({
    patientDocument: "",
    patientName: "",
    patientPhone: "",
    patientAddress: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add file handling logic here
    toast.success("Exame enviado com sucesso!");
  };

  const handleWhatsAppClick = (phone: string) => {
    const formattedPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Exames Médicos</h1>

        <Card>
          <CardHeader>
            <CardTitle>Enviar Novo Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientDocument">Documento do Paciente</Label>
                  <Input
                    id="patientDocument"
                    value={formData.patientDocument}
                    onChange={(e) =>
                      setFormData({ ...formData, patientDocument: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName">Nome Completo do Paciente</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientPhone">Telefone do Paciente</Label>
                  <Input
                    id="patientPhone"
                    value={formData.patientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, patientPhone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientAddress">Endereço do Paciente</Label>
                  <Input
                    id="patientAddress"
                    value={formData.patientAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, patientAddress: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentName">Nome dos Pais</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email dos Pais</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, parentEmail: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Telefone dos Pais</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Arquivo do Exame</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>

              <Button type="submit" className="w-full">
                Enviar Exame
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exames Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{file.patientName}</h3>
                    <p className="text-sm text-gray-500">{file.fileName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsAppClick(file.patientPhone)}
                    >
                      WhatsApp Paciente
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleWhatsAppClick(file.parentPhone)}
                    >
                      WhatsApp Pais
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MedicalExams;
