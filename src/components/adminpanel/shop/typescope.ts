

export interface ContentCategory {
    id:number;
    title: string;
    children: ContentCategory[]
}

export interface IBrand {
    id: number;
    title: string;
}

export interface ISpecification {
    id: number;
    title:string;
    specification_id?: number | undefined;
    value: string;
}

export interface ICategorySpecification {
    id?: any;
    specification_id?: any;
    title:string;
    value?:string | undefined;
}


export enum ProductStatus {
    DRAFT = 0,
    PUBLISHED = 1,
  }

  export enum SpecialStatus {
    DEFAULT = 0,
    SPECIAL = 1,
  }

// bellow enums are for shop configs
