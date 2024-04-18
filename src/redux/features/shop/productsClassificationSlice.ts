import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
import { Category } from '@/components/adminpanel/shop/classification/categories/typescope';
// in this slice i put global states that dont have any specific functionality just a few boolean states.



const initialState = {
    selectedProductCategory: {} as Category,
}

const productsClassification = createSlice({
    name: 'productsClassification',
    initialState,
    reducers: {
        setSelectedProductCategory: (state, action) => {
            state.selectedProductCategory = action.payload
        },
   
    }
})

export const {
    setSelectedProductCategory
} = productsClassification.actions

export const selectedProductCategory = ( state: RootState ) => state.productsClassificationManager.selectedProductCategory;


export default productsClassification.reducer