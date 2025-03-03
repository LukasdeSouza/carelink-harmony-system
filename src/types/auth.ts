
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

export interface ExtendedUserRole {
  role: 'admin' | 'nurse' | 'receptionist';
  super_admin?: boolean;
}
