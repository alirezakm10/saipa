'use client'
import { store } from './store'
import { Provider } from 'react-redux'
import { Children } from '@/types'


export const ReduxProvider = ({children}: {children: React.ReactNode}) => {
  return <Provider store={store} >{children}</Provider>
} 