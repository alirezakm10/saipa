import { DateObject } from "react-multi-date-picker";

export interface User {
  id: number;
  photo: {
    path: string;
  } | null;
  profile: {
    name: string;
    national_code: string;
  };
  name: string;
  email: string;
  mobile: string;
  roles: {
    name: string;
  };
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  is_admin?: any;
  f_name: string;
  family: string;
  father_name: string;
  birthdate: any;
  phone: string;
  mobile: string;
  national_code: string;
}

export interface Address {
  id: number;
  user_id: number;
  city_id: number;
  address: string;
  postal_code: string;
  is_default: 0 | 1;
}

interface Pivot {
  role_id: number;
  permission_id: number;
}

interface Permission {
  created_at: string;
  guard_name: string;
  id: number;
  module: string;
  name: string;
  pivot: Pivot;
  updated_at: string;
}

export interface Role {
  created_at: string;
  guard_name: string;
  updated_at: string;
  name: string;
  id: number;
  permissions: Permission[];
}

export interface SelectedUserFilter {
  name:string | null;
  family : string | null;
  email : string | null;
  mobile : string | null;
  is_admin : boolean | number;
}
