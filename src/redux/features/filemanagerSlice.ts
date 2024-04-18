import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ComponentRecognizer, FileManagerType } from "@/components/adminpanel/filemanager/typescope";
import { RootState } from "../store";


interface FileMetadata {
    name: string;
    type: string;
    size: number;
    // Add other relevant metadata properties here
}



interface FileManagerTypes {
    openFileManagerTypes:ComponentRecognizer[],
    uploadProgress: any
    isUploading: boolean
    showFileManager: boolean;
    selectedDir: FileManagerType;
    generatedFileConfigs: ImgConfigs[];
    pickedFilesForEditor: any;
    pickedForMainAttach: any;
    pickedForCategories:any;
}

interface ImgConfigs {
    id: number;
    isDefault: boolean;
    alt: string;
}

const initialState = {
    openFileManagerTypes:[],
    uploadProgress: 0,
    isUploading: false,
    showFileManager: false,
    selectedDir: {
        id: 0,
        path: '',
        name: '',
        isFolder: true,
        downloadLink: '',
        children: undefined,
    }, // store temporary route in fileManager
    generatedFileConfigs: [], // for now is not so clear use cases of this specific state
   
    pickedFilesForEditor: [],
    pickedForMainAttach:[],
    pickedForCategories:[],
} as FileManagerTypes

export const filemanagerSlice = createSlice({
    name: 'filemanagerSlice',
    initialState,
    reducers: {
        setShowFilemanager: (state, action) => {
            state.showFileManager = !state.showFileManager;
            state.openFileManagerTypes = action.payload
        },
        setGeneratedFiles: (state, action: PayloadAction<ImgConfigs[]>) => {
            state.generatedFileConfigs = action.payload;
        },
       
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload
        },
        setIsUploading: (state, action) => {
            state.isUploading = action.payload
        },
        setClearFilesStates: (state) => {
            state.isUploading = false
            state.uploadProgress = 0
        },
        // we should call this function when each uplaod progress finished

        setSelectedDir: (state, action) => {
            state.selectedDir = action.payload
        },
        setPickedFilesForEditor: (state, action) => {
            const selectedFile = action.payload;

            // Check if the file is already in the picked files
            const isFileSelected = state.pickedFilesForEditor.some((file:any) => file.id === selectedFile.id);

            if (isFileSelected) {
                // File is already selected, unselect it
                state.pickedFilesForEditor = state.pickedFilesForEditor.filter((file:any) => file.id !== selectedFile.id);
            } else {
                // File is not selected, select it
                state.pickedFilesForEditor = [...state.pickedFilesForEditor, selectedFile];
            }
        },
        setPickedFilesForEditorEmpty : (state) => {
            state.pickedFilesForEditor = []
        },
        setPickedFilesForCategories: (state, action) => {
            const selectedFile = action.payload;

            // Check if the file is already in the picked files
            const isFileSelected = state.pickedFilesForEditor.some((file:any) => file.id === selectedFile.id);

            if (isFileSelected) {
                // File is already selected, unselect it
                state.pickedFilesForEditor = state.pickedFilesForEditor.filter((file:any) => file.id !== selectedFile.id);
            } else {
                // File is not selected, select it
                state.pickedFilesForEditor = [...state.pickedFilesForEditor, selectedFile];
            }
        },
        setPickedFilesForCategoriesEmpty : (state) => {
            state.pickedFilesForEditor = []
        },

        setPickedFilesForMainAttach: (state, action) => {
            const selectedFileForMainAttach = action.payload;

            // Check if the file is already in the picked files
            const isFileSelectedForMainAttach = state.pickedForMainAttach.some((file:any) => file.id === selectedFileForMainAttach.id);

            if (isFileSelectedForMainAttach) {
                // File is already selected, unselect it
                state.pickedForMainAttach = state.pickedForMainAttach.filter((file:any) => file.id !== selectedFileForMainAttach.id);
            } else {
                // File is not selected, select it
                state.pickedForMainAttach = [...state.pickedForMainAttach, selectedFileForMainAttach];
            }
        },
        setMetaEditorUndergone: (state, action) => {
            // {
            //     manipulationType:'slider',
            //     state:{}
            // }
            const readyObj = action.payload 
            console.log('obj ready inside filemanager slice: ', action.payload)
            state.pickedForMainAttach = action.payload
        },

        setDeleteMainAttachedFiles: (state, action) => {
            state.pickedForMainAttach = [...state.pickedForMainAttach.filter((item:any) => item.id !== action.payload)]
        },

        setPickedFilesForMainAttachEmpty : (state) => {
            state.pickedForMainAttach = []
        }

    }
})

export const {
    setShowFilemanager,
    setGeneratedFiles,
    setUploadProgress,
    setIsUploading,
    setClearFilesStates,
    setSelectedDir,
    setPickedFilesForEditor,
    setPickedFilesForEditorEmpty,
    setPickedFilesForMainAttach,
    setPickedFilesForMainAttachEmpty,
    setPickedFilesForCategories,
    setPickedFilesForCategoriesEmpty,
    setDeleteMainAttachedFiles,
    setMetaEditorUndergone,
} = filemanagerSlice.actions

// config selectors
export const selectShowFilemanager = (state: { fileManager: FileManagerTypes }) => state.fileManager.showFileManager;
export const selectedDir = (state: { fileManager: FileManagerTypes }) => state.fileManager.selectedDir;
export const selectFilesConfigs = (state: { fileManager: FileManagerTypes }) => state.fileManager.generatedFileConfigs;
export const selectUploadProgress = (state: { fileManager: FileManagerTypes }) => state.fileManager.uploadProgress;
export const selectIsUploading = (state: { fileManager: FileManagerTypes }) => state.fileManager.isUploading;
export const selectPickedFilesForEditor = (state: { fileManager: FileManagerTypes }) => state.fileManager.pickedFilesForEditor;
export const selectPickedForMainAttach = (state: { fileManager: FileManagerTypes }) => state.fileManager.pickedForMainAttach;
export const selectPickedForCategories = (state: { fileManager: FileManagerTypes }) => state.fileManager.pickedForCategories;

export const selectedOpenFileManagerTypes = (state: { fileManager: FileManagerTypes }) => state.fileManager.openFileManagerTypes;




export default filemanagerSlice.reducer