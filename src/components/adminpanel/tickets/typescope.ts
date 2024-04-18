export interface OptionType {
    created_at: string;
    guard_name: string;
    updated_at: string;
    name: string;
    id: number;
  }

  export interface TicketFields {
    title: "",
    subject_id: number | null,
    role_id:  number | null,
    user_id:  number | null,
    priority:  string | null,
    content: string ,
    files: [],
  }

  export interface TicketResponse {
    content : string , 
    files : [],
  }

  export interface selectedFilterType {
    status?:string | null;
    priority? : string | null;
    role_id : OptionType | null | undefined;
  }