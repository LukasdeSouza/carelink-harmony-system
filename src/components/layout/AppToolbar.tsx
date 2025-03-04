
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useFlow } from "@/contexts/FlowContext";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { getInitials } from "@/utils/string-utils";

export function AppToolbar() {
  const navigate = useNavigate();
  const { currentUser, setSelectedFlow } = useFlow();
  const [notifications] = useState(3); // For demonstration, we'll show 3 notifications

  const handleLogout = () => {
    setSelectedFlow(null);
    localStorage.removeItem("drfacil.auth.token");
    localStorage.removeItem("drfacil.flow");
    localStorage.removeItem("drfacil.user.role");
    navigate("/login");
  };

  const getAvatarImage = () => {
    if (currentUser?.profilePicture) {
      return currentUser.profilePicture;
    }
    return null;
  };

  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-10">
      <div className="flex items-center justify-end h-16 px-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors mr-2">
          <Bell size={20} />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        {/* User Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={getAvatarImage()} alt={currentUser?.name || "User"} />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {currentUser?.name ? getInitials(currentUser.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                {currentUser?.name || "Usuário"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings/profile")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
