import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store';
import { ISpecification } from '@/components/adminpanel/shop/typescope';
import { Category } from '@/components/adminpanel/shop/classification/categories/typescope';
// in this slice i put global states that dont have any specific functionality just a few boolean states.

interface IStates {
    product: any,
    updateProduct: any,
    selectedCategory: Category | undefined,
    presistSpecification:any,
}


const initialState = {
    product: null,
    updateProduct: null,
    selectedCategory: undefined,
    presistSpecification:[],
} as IStates

const productSlice = createSlice({
    name: 'productSlice',
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.product = action.payload
        },
        setUpdateProduct: (state, action) => {
            state.updateProduct = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },
        // when u dispatch your specification array with bellow method inside updateProduct component u are storing 
        // the initial fetched specifications here to handle better ux when user wants to go on previus category id
        setSpecificationPersistence: (state, action) => {
            state.presistSpecification = action.payload
        }

       
    }
})

export const {
    setProduct,
    setUpdateProduct,
    setSelectedCategory,
    setSpecificationPersistence,
} = productSlice.actions

export const selectedProduct = ( state: RootState ) => state.productManager.product;
export const selectedUpdateProduct = ( state: RootState ) => state.productManager.updateProduct;
export const selectedCategory = ( state: RootState ) => state.productManager.selectedCategory;
export const selectedPersistedSpecification = ( state: RootState ) => state.productManager.presistSpecification;


export default productSlice.reducer