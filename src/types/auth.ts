
import { UserRole } from "@/contexts/FlowContext";

export interface Permission {
  id: string;
  route: string;
  description: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  permission?: Permission;
}

export interface UserPermission {
  routes: string[];
}

export interface ExtendedUserRole extends UserRole {
  super_admin?: boolean;
}
