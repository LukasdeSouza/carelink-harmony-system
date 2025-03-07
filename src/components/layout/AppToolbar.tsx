
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AppToolbar() {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
