// this component stores selected keywords from keywords module then we can attacj the stored value from keywords catcher selector and put them into api body
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store';


type IEditorContent = {
    editorContent: string
}

const initialState = {
    editorContent:''
} as IEditorContent




const editorSlice = createSlice({
    name: 'editorSlice',
    initialState,
    reducers: {
        setEditorContent: (state, action) => {
            state.editorContent = action.payload
        },    
    }
})

export const {
    setEditorContent,
} = editorSlice.actions

export const selectedEditorContent = ( state: RootState ) => state.editorManager.editorContent;



export default editorSlice.reducer