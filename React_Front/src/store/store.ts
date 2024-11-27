import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authslice'
import eventReducer from './slices/eventSlice'
import inscriptionReducer from './slices/InscriptionsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    inscription: inscriptionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch