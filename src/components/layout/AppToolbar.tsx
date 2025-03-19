
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Settings, LogOut, UserCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useFlow } from "@/contexts/FlowContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function AppToolbar() {
  const navigate = useNavigate();
  const { setSelectedFlow } = useFlow();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("US");
  
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        // Generate initials from email
        const initials = user.email
          .split('@')[0]
          .split('.')
          .map(part => part[0]?.toUpperCase() || '')
          .join('')
          .substring(0, 2);
        setUserInitials(initials || "US");
      }
    };
    
    getUserData();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSelectedFlow(null);
    localStorage.removeItem("drfacil.auth.token");
    localStorage.removeItem("drfacil.flow");
    localStorage.removeItem("drfacil.user.role");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between h-16 px-6 border-b bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap overflow-visible"></h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-600 cursor-pointer hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-700 transition-all duration-200">
              <AvatarImage src="" />
              <AvatarFallback className="bg-sky-100 text-sky-800 dark:bg-gray-700 dark:text-sky-300">{userInitials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Usuário</p>
                <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">{userEmail || "usuario@drfacil.com.br"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem 
              className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              onClick={() => navigate('/settings/profile')}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
