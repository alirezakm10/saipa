import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { Category } from '@/components/adminpanel/shop/classification/categories/typescope';
// in this slice i put global states that dont have any specific functionality just a few boolean states.



const initialState = {
    selectedDocCategory: {} as Category,
}

const docClassificationSlice = createSlice({
    name: 'docClassificationSlice',
    initialState,
    reducers: {
        setSelectedDocCategory: (state, action) => {
            state.selectedDocCategory = action.payload
        },
   
    }
})

export const {
    setSelectedDocCategory
} = docClassificationSlice.actions

export const selectedDocCategory = ( state: RootState ) => state.docClassificationManager.selectedDocCategory;


export default docClassificationSlice.reducer