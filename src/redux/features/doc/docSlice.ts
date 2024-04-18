import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store';

// in this slice i put global states that dont have any specific functionality just a few boolean states.





const initialState = {
    doc: null,
    updateDoc: null,
    selectedCategory: null,
} as any

const docSlice = createSlice({
    name: 'docSlice',
    initialState,
    reducers: {
        setDoc: (state, action) => {
            state.doc = action.payload
        },
        setUpdateDocs: (state, action) => {
            state.updateDoc = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },

       
    }
})

export const {
    setDoc,
    setUpdateDocs,
    setSelectedCategory,
} = docSlice.actions

export const selectedDoc = ( state: RootState ) => state.docManager.doc;
export const selectedUpdateDoc = ( state: RootState ) => state.docManager.updateDoc;
export const selectedCategory = ( state: RootState ) => state.docManager.selectedCategory;


export default docSlice.reducer