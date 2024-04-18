export interface ICollectedImages {
    id:number;
    alt:string | null;
    is_default: boolean;
}



type IPreviewType = 'images' | 'documents' | 'videos' | 'other'

export interface IDropZone {
  dropzoneTitle: string;
  directory: string;
  showMetaEditor?: boolean;
  counter?: boolean;
  setAsDefault?: boolean;
  preview?: boolean;
  showAcceptedFiles?: boolean;
  showRejectedFiles?: boolean;
  galleryMode?:boolean;
  showSliderEditor?:boolean;
  previewType?: IPreviewType[];
}