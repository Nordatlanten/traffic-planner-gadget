import {configureStore} from '@reduxjs/toolkit'
import testReducer from './features/testSlice'
import stopsReducer from './features/stopsSlice'
import journeysReducer from './features/journeysSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    testReducer,
    stopsReducer,
    journeysReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
