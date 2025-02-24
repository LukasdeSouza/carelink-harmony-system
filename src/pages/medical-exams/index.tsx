
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileUp, Loader2 } from "lucide-react";
import { Patient } from "@/types/staff";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { generateRandomPassword, generateUsername } from "@/utils/auth";

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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("nome");

      if (error) throw error;
      setPatients(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar pacientes: " + error.message);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const createUserAccount = async (patient: Patient) => {
    try {
      const email = patient.email;
      const password = generateRandomPassword();
      const username = generateUsername(patient.nome);

      // Criar usuário no auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: patient.nome,
          },
        },
      });

      if (authError) throw authError;

      // Criar perfil na tabela profiles
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user?.id,
          document: patient.documento,
          role: "patient",
        },
      ]);

      if (profileError) throw profileError;

      // Enviar credenciais por email (você precisará implementar isso)
      toast.success(
        `Credenciais criadas - Email: ${email}, Senha: ${password}. Guarde essas informações.`
      );

      return { email, password };
    } catch (error: any) {
      toast.error("Erro ao criar conta do paciente: " + error.message);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedPatient) {
      toast.error("Selecione um arquivo e um paciente");
      return;
    }

    setIsLoading(true);

    try {
      const patient = patients.find((p) => p.id === selectedPatient);
      if (!patient) throw new Error("Paciente não encontrado");

      // Criar conta de usuário se ainda não existir
      let credentials;
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("document", patient.documento)
        .single();

      if (!existingProfile) {
        credentials = await createUserAccount(patient);
      }

      // Upload do arquivo
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${patient.documento}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("exame-medico")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Registrar o exame na tabela de exames
      const { error: examError } = await supabase.from("exames").insert([
        {
          paciente_id: patient.id,
          arquivo_nome: fileName,
          data_upload: new Date().toISOString(),
        },
      ]);

      if (examError) throw examError;

      toast.success(
        "Exame enviado com sucesso! " +
          (credentials
            ? "Conta criada para o paciente."
            : "Paciente já possui conta.")
      );

      // Limpar formulário
      setSelectedFile(null);
      setSelectedPatient("");
      const fileInput = document.getElementById(
        "exam-file"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast.error("Erro ao enviar exame: " + error.message);
    } finally {
      setIsLoading(false);
    }
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
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select
                  value={selectedPatient}
                  onValueChange={setSelectedPatient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exam-file">Arquivo do Exame</Label>
                <Input
                  id="exam-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedFile || !selectedPatient}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Enviar Exame
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MedicalExams;
