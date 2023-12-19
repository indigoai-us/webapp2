import { StateCreator } from "zustand";

export interface SignUp {
  bio: string;
  company: string;
  company_name: string;
}

export interface SignUpSlice {
  signup: SignUp | null;
  updateSignUp: (signup: any) => Promise<void>;
}

export const createSignUpSlice: StateCreator<SignUpSlice> = (set) => ({
    signup: null,
    updateSignUp: async (signup: any) => {      
      set({ signup });
    }
})