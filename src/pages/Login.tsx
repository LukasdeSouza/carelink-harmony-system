
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope } from "lucide-react";
import { useFlow } from "@/contexts/FlowContext"; // Updated import path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserRole } = useFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (email && password) {
        let result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) {
          toast.error(result.error.message);
        } else {
          setUserRole('admin');
          localStorage.setItem("drfacil.auth.token", result.data?.session.access_token);
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
        let result = await supabase.auth.signUp({ email, password });
        if(result.data.user?.aud === 'authenticated') {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center gap-2 text-primary-700 justify-center">
            <Stethoscope className="w-6 h-6" />
            <CardTitle className="text-2xl font-bold">Dr. Fácil</CardTitle>
          </div>
          <p className="text-gray-500">Entre com suas credenciais para acessar o sistema</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <Button
                  variant="link"
                  className="px-0 font-normal"
                  type="button"
                  onClick={() => navigate("/reset-password")}
                >
                  Esqueceu a senha?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Carregando..." : "Entrar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
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
