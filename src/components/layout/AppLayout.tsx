
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./MainSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-sky-50">
        <MainSidebar />
        <main className="flex-1 overflow-auto transition-all duration-300">
          <div className="container px-6 py-8 max-w-7xl mx-auto">
            <SidebarTrigger className="lg:hidden mb-4" />
            <div className="fade-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
