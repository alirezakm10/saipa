import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { Category } from '@/components/adminpanel/shop/classification/categories/typescope';
// in this slice i put global states that dont have any specific functionality just a few boolean states.



const initialState = {
    selectedNewCategory: {} as Category,
}

const newsClassification = createSlice({
    name: 'newsClassification',
    initialState,
    reducers: {
        setSelectedNewCategory: (state, action) => {
            state.selectedNewCategory = action.payload
        },
   
    }
})

export const {
    setSelectedNewCategory
} = newsClassification.actions

export const selectedNewCategory = ( state: RootState ) => state.newsClassificationManager.selectedNewCategory;


export default newsClassification.reducer