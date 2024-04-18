// this component stores selected keywords from keywords module then we can attacj the stored value from keywords catcher selector and put them into api body
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store';


type IKeywords = {
    keywords: string[]
}

const initialState = {
    keywords:[]
} as IKeywords




const keywordsCatcherSlice = createSlice({
    name: 'keywordsCatcherSlice',
    initialState,
    reducers: {
        setKeywords: (state, action) => {
            state.keywords = action.payload
        },    
    }
})

export const {
    setKeywords,
} = keywordsCatcherSlice.actions

export const selectedKeywords = ( state: RootState ) => state.keywordsManager.keywords;



export default keywordsCatcherSlice.reducer