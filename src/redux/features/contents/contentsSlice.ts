import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store';

// in this slice i put global states that dont have any specific functionality just a few boolean states.



export enum PostStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    PUBLISHEDTIME = 2,
  }


const initialState = {
    content: null,
    updateContent: null,
    selectedCategory: null,
} as any

const contentsSlice = createSlice({
    name: 'contentsSlice',
    initialState,
    reducers: {
        setContent: (state, action) => {
            state.content = action.payload
        },
        setUpdateContent: (state, action) => {
            state.updateContent = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },

       
    }
})

export const {
    setContent,
    setUpdateContent,
    setSelectedCategory,
} = contentsSlice.actions

export const selectedContent = ( state: RootState ) => state.contentsManager.content;
export const selectedUpdateContent = ( state: RootState ) => state.contentsManager.updateContent;
export const selectedCategory = ( state: RootState ) => state.contentsManager.selectedCategory;


export default contentsSlice.reducer