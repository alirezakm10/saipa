import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useLocalStorage } from "@/hooks/useLocalStorage";


interface SettingsState {
    showSetting: boolean;
    allNotifications:boolean;
    challengesFeedback:boolean;
    newGames:boolean;
    changePosition:boolean;
    endOfSubscription:boolean;
}

const initialState = {
    showSetting:false,
    allNotifications:false,
    challengesFeedback:false,
    newGames:false,
    changePosition:false,
    endOfSubscription:false,
} as SettingsState

export const settings = createSlice({
    name:'settings',//name used for select initial states inside this file
    initialState,
    reducers: {
        setShowSetting: (state) => {
            state.showSetting = !state.showSetting;
        },
        setAllNotifications: (state) => {
            state.allNotifications = !state.allNotifications
        },
        setchallengesFeedback : (state) => {
            state.challengesFeedback = !state.challengesFeedback
        },
        setNewGames : (state) => {
            state.newGames = !state.newGames
        },
        setChangePosition: (state) => {
            state.changePosition = !state.changePosition
        },
        setEndOfSubscription: (state) => {
            state.endOfSubscription = !state.endOfSubscription
        },
        

    }
})

export const {
    setShowSetting,
    setAllNotifications,
    setchallengesFeedback,
    setNewGames,
    setChangePosition,
    setEndOfSubscription,
} = settings.actions


export const SelectShowSetting = (state: RootState ) => state.settings.showSetting
export const SelectAllNotifications = (state: RootState ) => state.settings.allNotifications
export const SelectChallengesFeedback = (state: RootState ) => state.settings.challengesFeedback
export const SelectNewGames = (state: RootState ) => state.settings.newGames
export const SelectChangePosition = (state: RootState ) => state.settings.changePosition
export const SelectEndOfSubscription = (state: RootState ) => state.settings.endOfSubscription

export default settings.reducer 