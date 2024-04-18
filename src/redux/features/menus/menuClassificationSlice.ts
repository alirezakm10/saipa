import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store';
// in this slice i put global states that dont have any specific functionality just a few boolean states.



const initialState = {
    SynchronizedMenu:{}as any,
    selectMenus:[] as any
}

const menuClassificationSlice = createSlice({
    name: 'menuClassificationSlice',
    initialState,
    reducers: {
        setSelectMenu: (state, action) => {
            state.selectMenus = action.payload
        },
        setMenuSynchronizer: (state, action) => {
            state.SynchronizedMenu = action.payload
        }
    }
})

export const {
    setSelectMenu,
    setMenuSynchronizer
} = menuClassificationSlice.actions

export const selectedMenu = ( state: RootState ) => state.menusManager.selectMenus;
export const selectSynchronizedMenu = ( state: RootState ) => state.menusManager.SynchronizedMenu;


export default menuClassificationSlice.reducer