// store.ts

import { create } from 'zustand'
import { createUserSlice, UserSlice } from './slices/createUserSlice'
import { createSignUpSlice, SignUpSlice } from './slices/createSignupSlice'
import { persist } from 'zustand/middleware'

type StoreState = UserSlice & SignUpSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createSignUpSlice(...a),
    }),
    { name: 'bound-store' }
  )
)