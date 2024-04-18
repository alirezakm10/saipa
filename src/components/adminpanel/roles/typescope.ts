export interface Role {
    name: string;
  }

  interface Pivot {
    role_id: number;
    permission_id: number;
  }
  
  export interface Permission {
    created_at: string;
    guard_name: string;
    id: number;
    module: string;
    name: string;
    pivot: Pivot;
    updated_at: string;
  }

  export interface Col  {
    title: string;
     id: number;
  }

  export interface PermissionColumn {
    rowName : string;
    cols : Col[];
  }

  export interface Param{
    row : PermissionColumn,
    field : string;
  }

  export interface ParamHeader{
    field : string;
  }