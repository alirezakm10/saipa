import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { Category } from '@/components/adminpanel/shop/classification/categories/typescope';
// in this slice i put global states that dont have any specific functionality just a few boolean states.



const initialState = {
    selectedPostCategory: {} as Category,
}

const postsClassificationSlice = createSlice({
    name: 'postsClassificationSlice',
    initialState,
    reducers: {
        setSelectedPostCategory: (state, action) => {
            state.selectedPostCategory = action.payload
        },
   
    }
})

export const {
    setSelectedPostCategory
} = postsClassificationSlice.actions

export const selectedPostCategory = ( state: RootState ) => state.postsClassificationManager.selectedPostCategory;


export default postsClassificationSlice.reducer