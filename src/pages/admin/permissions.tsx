
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFlow } from "@/contexts/FlowContext";
import { Permission, RolePermission } from "@/types/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";

// Available routes to control
const availableRoutes = [
  { route: "dashboard", description: "Dashboard" },
  { route: "patients", description: "Pacientes" },
  { route: "staff", description: "Funcionários" },
  { route: "schedule", description: "Agenda" },
  { route: "procedures", description: "Procedimentos" },
  { route: "medical-exams", description: "Exames" },
  { route: "records", description: "Prontuários" },
  { route: "inventory", description: "Estoque" },
  { route: "financial", description: "Financeiro" },
  { route: "time-clock", description: "Ponto Eletrônico" },
  { route: "settings", description: "Configurações" },
  { route: "ai-assistant", description: "Assistente IA" }
];

const PermissionsPage = () => {
  const { userRole } = useFlow();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    admin: [],
    nurse: [],
    receptionist: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect if not super admin
  if (!userRole?.super_admin) {
    return <Navigate to="/flow-selection" replace />;
  }

  // Load permissions from the database or initialize them
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from the database
        // For development, initialize with our available routes
        const initialPermissions = availableRoutes.map((route, index) => ({
          id: `perm_${index}`,
          route: route.route,
          description: route.description
        }));
        setPermissions(initialPermissions);
        
        // Initialize with some default permissions
        setRolePermissions({
          admin: initialPermissions.map(p => p.route), // Admins get all permissions by default
          nurse: ["dashboard", "patients", "schedule", "procedures", "medical-exams", "records"],
          receptionist: ["dashboard", "patients", "schedule"]
        });
        
        setIsLoading(false);
      } catch (error: any) {
        toast.error("Erro ao carregar permissões: " + error.message);
        setIsLoading(false);
      }
    };

    loadPermissions();
  }, []);

  const handlePermissionToggle = (role: string, route: string) => {
    setRolePermissions(prev => {
      const currentPerms = [...prev[role]];
      if (currentPerms.includes(route)) {
        return {
          ...prev,
          [role]: currentPerms.filter(r => r !== route)
        };
      } else {
        return {
          ...prev,
          [role]: [...currentPerms, route]
        };
      }
    });
  };

  const savePermissions = async (role: string) => {
    try {
      setSaving(true);
      
      // In a real implementation, this would save to the database
      // For now, we'll just show a success message
      
      toast.success(`Permissões para ${role} salvas com sucesso!`);
      
      // In a real implementation, you would do something like:
      /*
      // Delete existing permissions for this role
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', role);
        
      // Insert new permissions
      const permissionsToInsert = rolePermissions[role].map(route => {
        const permission = permissions.find(p => p.route === route);
        return {
          role_id: role,
          permission_id: permission?.id
        };
      });
      
      await supabase
        .from('role_permissions')
        .insert(permissionsToInsert);
      */
      
      setSaving(false);
    } catch (error: any) {
      toast.error(`Erro ao salvar permissões: ${error.message}`);
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Permissões</h1>
        
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Controle de Acesso</CardTitle>
              <CardDescription>
                Configure quais módulos cada tipo de usuário pode acessar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="admin" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="admin">Administradores</TabsTrigger>
                  <TabsTrigger value="nurse">Enfermeiros</TabsTrigger>
                  <TabsTrigger value="receptionist">Recepcionistas</TabsTrigger>
                </TabsList>
                
                {Object.keys(rolePermissions).map(role => (
                  <TabsContent key={role} value={role} className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Módulo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Acesso</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell>{permission.route}</TableCell>
                            <TableCell>{permission.description}</TableCell>
                            <TableCell>
                              <Checkbox 
                                checked={rolePermissions[role].includes(permission.route)}
                                onCheckedChange={() => handlePermissionToggle(role, permission.route)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => savePermissions(role)}
                        disabled={saving}
                      >
                        {saving ? 'Salvando...' : 'Salvar Permissões'}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default PermissionsPage;
