import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store';

// in this slice i put global states that dont have any specific functionality just a few boolean states.

interface components {
    showSearch: boolean;
    showSignout: boolean;
}

const initialState = {
    showSearch: false,
    showSignout: false,
}

const componentSlice = createSlice({
    name: 'componentSlice',
    initialState,
    reducers: {
        setShowSearch: (state, action) => {
            state.showSearch = action.payload
        },
        setShowSignout : ( state )  => {
            state.showSignout = !state.showSignout
        },
       
    }
})

export const {
    setShowSearch,
    setShowSignout,
} = componentSlice.actions

export const selectNewest = ( state: RootState ) => state.componentStates.showSearch;
export const selectShowSignout = ( state: RootState) => state.componentStates.showSignout;


export default componentSlice.reducer