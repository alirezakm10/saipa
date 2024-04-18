import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuTypes {
    sidebarCollapsed: boolean;
}

const initialState = {
    sidebarCollapsed: false,
} as MenuTypes

export const sidebarManager = createSlice({
    name: 'sidebarManager',
    initialState,
    reducers: {
        setSidebarCollapsed: ( state ) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSideBarOpen: (state, action) => {
            state.sidebarCollapsed = action.payload
        }
    }
})

export const {
    setSidebarCollapsed,
    setSideBarOpen,
} = sidebarManager.actions

export const selectSidebarCollapsed = ( state: { sidebarManager: MenuTypes}) => state.sidebarManager.sidebarCollapsed;

export default sidebarManager.reducer