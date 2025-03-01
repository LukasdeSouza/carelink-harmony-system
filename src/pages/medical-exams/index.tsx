import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileUp, Loader2, Download, Eye } from "lucide-react";
import { Patient } from "@/types/staff";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  paciente_id: string;
  arquivo_nome: string;
  data_upload: string;
  paciente?: Patient;
}

const MedicalExams = () => {
  const [examFiles, setExamFiles] = useState<ExamFile[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

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

  const loadExams = async () => {
    setIsLoadingList(true);
    try {
      const { data, error } = await supabase
        .from("exames")
        .select("*")
        .order("data_upload", { ascending: false });

      if (error) throw error;

      const examsWithPatients = await Promise.all(
        (data || []).map(async (exam) => {
          const { data: patientData, error: patientError } = await supabase
            .from("pacientes")
            .select("*")
            .eq("id", exam.paciente_id)
            .single();

          if (patientError) {
            console.error("Error fetching patient:", patientError);
            return { ...exam, paciente: null };
          }

          return { ...exam, paciente: patientData };
        })
      );

      setExamFiles(examsWithPatients);
    } catch (error: any) {
      toast.error("Erro ao carregar exames: " + error.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    loadPatients();
    loadExams();
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

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user?.id,
          document: patient.documento,
          role: "patient",
        },
      ]);

      if (profileError) throw profileError;

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

      let credentials;
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("document", patient.documento)
        .single();

      if (!existingProfile) {
        credentials = await createUserAccount(patient);
      }

      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${patient.documento}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("exame-medico")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

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

      setSelectedFile(null);
      setSelectedPatient("");
      const fileInput = document.getElementById(
        "exam-file"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      loadExams();
    } catch (error: any) {
      toast.error("Erro ao enviar exame: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    setIsDownloading(fileName);
    try {
      const { data, error } = await supabase.storage
        .from("exame-medico")
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Arquivo baixado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao baixar arquivo: " + error.message);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleViewExam = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("exame-medico")
        .createSignedUrl(fileName, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast.error("Erro ao visualizar arquivo: " + error.message);
    }
  };

  const selectedPatientName = patients.find(p => p.id === selectedPatient)?.nome || "Selecione o paciente";

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
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Selecione o paciente">
                      {selectedPatientName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-white z-50 max-h-60 overflow-y-auto">
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

        <Card>
          <CardHeader>
            <CardTitle>Exames Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingList ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : examFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum exame encontrado
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Data de Upload</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examFiles.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        {exam.paciente ? exam.paciente.nome : "Paciente não encontrado"}
                      </TableCell>
                      <TableCell>{exam.arquivo_nome}</TableCell>
                      <TableCell>
                        {format(new Date(exam.data_upload), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewExam(exam.arquivo_nome)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(exam.arquivo_nome)}
                            disabled={isDownloading === exam.arquivo_nome}
                          >
                            {isDownloading === exam.arquivo_nome ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            Baixar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MedicalExams;
