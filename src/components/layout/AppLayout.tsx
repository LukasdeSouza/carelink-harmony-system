
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./MainSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <MainSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container px-4 py-6 max-w-7xl mx-auto">
            <SidebarTrigger className="lg:hidden mb-4" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
