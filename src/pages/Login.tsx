
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope, Mail, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Login realizado com sucesso!");
          navigate("/flow-selection");
        }
      } else {
        throw new Error("Por favor, preencha todos os campos");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email && password) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Cadastro realizado com sucesso! Faça Login para acessar o sistema");
        }
      } else {
        throw new Error("Por favor, preencha todos os campos");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-primary-50 rounded-b-full opacity-50 transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-primary-50 rounded-t-full opacity-50 transform translate-y-1/2"></div>
      </div>
      
      <Card className="w-full max-w-md border border-sky-100 shadow-xl relative z-10 pop-in">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex items-center gap-2 text-primary-700 justify-center">
            <div className="bg-primary-50 p-2 rounded-full subtle-bounce">
              <Stethoscope className="w-7 h-7 text-primary-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Dr. Fácil</CardTitle>
          </div>
          <p className="text-gray-500">Entre com suas credenciais para acessar o sistema</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                <Button
                  variant="link"
                  className="px-0 font-normal text-primary-600 hover:text-primary-700"
                  type="button"
                  onClick={() => navigate("/reset-password")}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={handleSignUp}
                disabled={isLoading}
              >
                Criar conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
