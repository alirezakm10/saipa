import { ReactNode } from "react"

export interface Children {
    children: ReactNode
}



export interface ITablePaginationMode {
    pageSize: number;
    page: number;
}