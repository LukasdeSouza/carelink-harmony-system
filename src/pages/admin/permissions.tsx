
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFlow } from "@/contexts/FlowContext";
import { Permission, User } from "@/types/auth";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

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
  const [activeTab, setActiveTab] = useState<string>("roles");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    admin: [],
    nurse: [],
    receptionist: []
  });
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect if not super admin
  if (!userRole?.super_admin) {
    return <Navigate to="/flow-selection" replace />;
  }

  // Load permissions and users from the database or initialize them
  useEffect(() => {
    const loadPermissionsAndUsers = async () => {
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
        
        // Mock users for development
        const mockUsers: User[] = [
          {
            id: "usr_1",
            email: "cliente1@exemplo.com",
            name: "Cliente Exemplo 1",
            role: "admin",
            subscription: {
              active: true,
              expiresAt: "2024-12-31T23:59:59Z",
              plan: "premium"
            },
            createdAt: "2023-01-15T10:30:00Z",
            lastLogin: "2023-06-20T14:45:22Z"
          },
          {
            id: "usr_2",
            email: "cliente2@exemplo.com",
            name: "Cliente Exemplo 2",
            role: "nurse",
            subscription: {
              active: true,
              expiresAt: "2024-10-15T23:59:59Z",
              plan: "standard"
            },
            createdAt: "2023-02-22T09:15:00Z",
            lastLogin: "2023-06-19T11:32:15Z"
          },
          {
            id: "usr_3",
            email: "cliente3@exemplo.com",
            name: "Cliente Exemplo 3",
            role: "receptionist",
            subscription: {
              active: false,
              expiresAt: "2023-05-10T23:59:59Z", 
              plan: "basic"
            },
            createdAt: "2023-03-05T16:45:00Z",
            lastLogin: "2023-05-09T10:27:41Z"
          }
        ];
        
        setUsers(mockUsers);
        
        setIsLoading(false);
      } catch (error: any) {
        toast.error("Erro ao carregar permissões e usuários: " + error.message);
        setIsLoading(false);
      }
    };

    loadPermissionsAndUsers();
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

  const handleUserPermissionToggle = (route: string) => {
    if (!selectedUser) return;
    
    setUserPermissions(prev => {
      if (prev.includes(route)) {
        return prev.filter(r => r !== route);
      } else {
        return [...prev, route];
      }
    });
  };

  const saveRolePermissions = async (role: string) => {
    try {
      setSaving(true);
      
      // In a real implementation, this would save to the database
      toast.success(`Permissões para função ${role} salvas com sucesso!`);
      
      setSaving(false);
    } catch (error: any) {
      toast.error(`Erro ao salvar permissões: ${error.message}`);
      setSaving(false);
    }
  };

  const saveUserPermissions = async () => {
    if (!selectedUser) return;
    
    try {
      setSaving(true);
      
      // In a real implementation, this would save to the database
      toast.success(`Permissões para usuário ${selectedUser.name} salvas com sucesso!`);
      
      // Update the user in our local state with the new permissions
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user } // In a real app, we'd store the permissions with the user
            : user
        )
      );
      
      setSaving(false);
    } catch (error: any) {
      toast.error(`Erro ao salvar permissões do usuário: ${error.message}`);
      setSaving(false);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    
    // In a real implementation, we would fetch the user's permissions from the database
    // For now, we'll just use their role's default permissions as a starting point
    setUserPermissions(rolePermissions[user.role] || []);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Permissões</h1>
        
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="roles">Por Função</TabsTrigger>
              <TabsTrigger value="users">Por Usuário</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Permissões por Função</CardTitle>
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
                            onClick={() => saveRolePermissions(role)}
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
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User list section */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Usuários Pagantes</CardTitle>
                    <CardDescription>
                      Selecione um usuário para gerenciar permissões
                    </CardDescription>
                    <div className="mt-2">
                      <Input 
                        placeholder="Buscar usuário..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto">
                    <div className="space-y-2">
                      {filteredUsers.map(user => (
                        <div 
                          key={user.id}
                          className={`p-3 rounded-md cursor-pointer border ${selectedUser?.id === user.id ? 'bg-primary/10 border-primary' : 'border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => selectUser(user)}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${user.subscription?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.subscription?.active ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {user.subscription?.plan === 'basic' ? 'Básico' : 
                                user.subscription?.plan === 'standard' ? 'Padrão' : 'Premium'}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {filteredUsers.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          Nenhum usuário encontrado
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* User permissions section */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Permissões do Usuário</CardTitle>
                    {selectedUser ? (
                      <CardDescription>
                        Configurando permissões para {selectedUser.name}
                      </CardDescription>
                    ) : (
                      <CardDescription>
                        Selecione um usuário para gerenciar suas permissões
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedUser ? (
                      <>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Email</Label>
                            <div className="mt-1">{selectedUser.email}</div>
                          </div>
                          <div>
                            <Label>Função</Label>
                            <div className="mt-1 capitalize">{selectedUser.role}</div>
                          </div>
                          <div>
                            <Label>Data de Criação</Label>
                            <div className="mt-1">
                              {format(new Date(selectedUser.createdAt), 'dd/MM/yyyy')}
                            </div>
                          </div>
                          <div>
                            <Label>Plano</Label>
                            <div className="mt-1 capitalize">
                              {selectedUser.subscription?.plan === 'basic' ? 'Básico' : 
                                selectedUser.subscription?.plan === 'standard' ? 'Padrão' : 'Premium'}
                            </div>
                          </div>
                          <div>
                            <Label>Status da Assinatura</Label>
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs ${selectedUser.subscription?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {selectedUser.subscription?.active ? 'Ativa' : 'Inativa'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <Label>Expira em</Label>
                            <div className="mt-1">
                              {selectedUser.subscription?.expiresAt ? 
                                format(new Date(selectedUser.subscription.expiresAt), 'dd/MM/yyyy') : 
                                'N/A'}
                            </div>
                          </div>
                        </div>
                        
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
                                    checked={userPermissions.includes(permission.route)}
                                    onCheckedChange={() => handleUserPermissionToggle(permission.route)}
                                    disabled={!selectedUser.subscription?.active}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        <div className="flex justify-end mt-4">
                          <Button 
                            onClick={saveUserPermissions}
                            disabled={saving || !selectedUser.subscription?.active}
                          >
                            {saving ? 'Salvando...' : 'Salvar Permissões'}
                          </Button>
                        </div>
                        
                        {!selectedUser.subscription?.active && (
                          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                            <strong>Atenção:</strong> Este usuário possui assinatura inativa. 
                            Atualize o status da assinatura para poder modificar as permissões.
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-12 text-center text-gray-500">
                        Selecione um usuário na lista para gerenciar suas permissões
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default PermissionsPage;
