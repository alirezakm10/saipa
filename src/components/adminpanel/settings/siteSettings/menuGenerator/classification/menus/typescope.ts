


export type AddMenuField ={
  icon:null;
  link:string | null;
  menuId:string;
  name:string;
  subMenus:AddMenuField[];
}

export type Category = {
    id: number;
    title: string;
    children: Category[],
  }

  export interface SharedCategory {
    selectedId?: number;
    selectedCategory?: Category | undefined;
  setSelectedId?:(value: number) => void ;
  }

  export interface CheckboxMenuList  {
    id: number;
    title?: string;
    keyword?:Keyword[];
    isModified?:boolean;

  }
  
  export interface CheckboxMenuType {
    inputLabel: string;
    buttonIcon: React.ReactNode;
    allItems: CheckboxMenuList[];
    attachedItems: any;
    setter?: (values:any) => void;
    setIsModified?: (value: boolean) => void;
    buttonGuid?: string;
  }







  // these type are for categorykeyword component
export type Keyword = {
  inputValue?:any;
  id?: number;
  title?: string;
  keyword?: string;
  isModified?:boolean;
};

export type Specification = {
  id: number;
  title: string;
  isModified?: boolean; 
};

export interface AddCategories {
  title: string;
  parent_id:number;
}

export type KeywordListType = {
  keywords: Keyword[];
  specifications: Specification[];
};