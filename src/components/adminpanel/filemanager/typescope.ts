import { ReactNode } from "react";

export interface IFilePagination {
     
        current_page: number;
        per_page: number;
        total: number;
      
}
export interface IDirectoryResponse {
    files:FileManagerType[],
    pagination?:IFilePagination;
}

export interface FileManagerType {
    id: number;
    path: string;
    name: string;
    isFolder: boolean;
    downloadLink: string;
    children?:ReactNode,
}

export type ComponentRecognizer = 'textEditor' | 'mainAttach' | 'uploader'
 