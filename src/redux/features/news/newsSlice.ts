import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store';

// in this slice i put global states that dont have any specific functionality just a few boolean states.



export enum NewsStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    PUBLISHEDTIME = 2,
  }


const initialState = {
    news: null,
    updateNews: null,
    selectedCategory: null,
} as any

const newsSlice = createSlice({
    name: 'newsSlice',
    initialState,
    reducers: {
        setNews: (state, action) => {
            state.news = action.payload
        },
        setUpdateNews: (state, action) => {
            state.updateNews = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },

        setClearNews : (state) => {
            state.news = {}
            state.updateNews = {}
            state.selectedCategory = {}
        },
       
    }
})

export const {
    setNews,
    setUpdateNews,
    setSelectedCategory,
    setClearNews,
} = newsSlice.actions

export const selectedNews = ( state: RootState ) => state.newsManager.news;
export const selectedUpdateNews = ( state: RootState ) => state.newsManager.updateNews;
export const selectedCategory = ( state: RootState ) => state.newsManager.selectedCategory;


export default newsSlice.reducer