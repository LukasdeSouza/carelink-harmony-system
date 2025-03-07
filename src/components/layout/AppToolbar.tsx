
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AppToolbar() {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-600">
          <AvatarImage src="" />
          <AvatarFallback className="bg-sky-100 text-sky-800 dark:bg-gray-700 dark:text-sky-300">US</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
