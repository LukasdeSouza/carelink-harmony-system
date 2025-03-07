
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./MainSidebar";
import { AppToolbar } from "./AppToolbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-sky-50 dark:bg-gray-900 transition-colors duration-300">
      <MainSidebar />
      <main className="flex-1 overflow-auto transition-all duration-300">
        <AppToolbar />
        <div className="container px-6 py-8 max-w-7xl mx-auto">
          <SidebarTrigger className="lg:hidden mb-4" />
          <div className="fade-in-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
