
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
  userId?: string; // Add userId to track individual user permissions
}

export interface ExtendedUserRole {
  role: 'admin' | 'nurse' | 'receptionist';
  super_admin?: boolean;
  userId?: string; // Add userId to identify specific users
  subscription?: {
    active: boolean;
    expiresAt: string;
    plan: 'basic' | 'standard' | 'premium';
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'nurse' | 'receptionist';
  super_admin?: boolean;
  subscription?: {
    active: boolean;
    expiresAt: string;
    plan: 'basic' | 'standard' | 'premium';
  };
  createdAt: string;
  lastLogin?: string;
}
