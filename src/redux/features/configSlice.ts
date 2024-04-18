import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '@/redux/store';

type HeaderStates = {
    language : string;
    direction: 'rtl' | 'ltr';
    sidebarWallpaper: string;
  }
  
const initialState = {
    language: 'fa',
    direction:'ltr',
    sidebarWallpaper:'',
} as HeaderStates

const configSlice = createSlice({
    name:'configSlice',
    initialState,
    reducers: {
        setLanguageHeader: ( state, action ) => {
            state.language = action.payload
        },
        setThemeDirection: ( state, action ) => {
            state.direction = action.payload === 'rtl' ? 'ltr' : 'rtl'
        },
        setSidebarWallpaper: (state ,action) => {
            state.sidebarWallpaper = action.payload
        }
    }
})

export const {
    setLanguageHeader,
    setThemeDirection,
    setSidebarWallpaper,
} = configSlice.actions

export const selectThemeDirection = (state: RootState) => state.configs.direction;
export const selectedSidebarWallpaper = ( state: RootState ) => state.configs.sidebarWallpaper;



export default configSlice.reducer