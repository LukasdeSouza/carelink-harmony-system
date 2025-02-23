
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send } from "lucide-react";
import { useFlow } from "@/contexts/FlowContext";
import { Navigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userRole } = useFlow();

  // Protege a rota para apenas administradores
  if (userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Aqui você pode integrar com uma API de IA (OpenAI, etc.)
    // Por enquanto, vamos simular uma resposta
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "Esta é uma resposta simulada do assistente. Aqui você pode integrar com uma API de IA para fornecer análises reais dos dados do sistema.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2 text-primary-600">
        <Bot className="w-8 h-8" />
        <h1 className="text-2xl font-bold">IA Dr.Fácil</h1>
      </div>
      <a href="/" className="text-blue-500 hover:text-blue-700 underline text-sm">
        {"< voltar"}
      </a>

      <div className="bg-white rounded-lg shadow-sm border p-4 min-h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-primary-200" />
              <p>Olá! Como posso ajudar você hoje?</p>
              <p className="text-sm mt-2">
                Experimente perguntar sobre análises financeiras, estatísticas de procedimentos
                ou outras informações administrativas.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <Card key={index} className={message.role === "assistant" ? "bg-primary-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {message.role === "assistant" ? (
                      <Bot className="w-6 h-6 text-primary-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200" />
                    )}
                    <p>{message.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {isLoading && (
            <Card className="bg-primary-50">
              <CardContent className="p-4">
                <div className="flex gap-3 items-center">
                  <Bot className="w-6 h-6 text-primary-600" />
                  <div className="animate-pulse">Pensando...</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
