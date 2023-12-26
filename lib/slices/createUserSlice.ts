import { StateCreator } from "zustand";

export interface User {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  primaryEmailAddress: {
    emailAddress: string;
  };
  company: {
    _id: string;
    name: string;
  };
  admin: boolean;
  siteAdmin: boolean;
  layoutStyle: string;
}

export interface UserSlice {
    user: User | null;
    fetchUserFromDB: (user: any, organization: any) => Promise<void>;
    updateUser: (user: any) => Promise<void>;
    clearUser: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
    user: null,
    fetchUserFromDB: async (clerkUser: any, organization: any) => {
      const response = await fetch(`/api/users/get?sub=${clerkUser.id}`);
      const user = await response.json();
      console.log('fetchUserFromDB user: ', user);
      
      const coResponse = await fetch(`/api/companies/get?sub=${organization.id}`);
      const company = await coResponse.json();
      
      const newUser = {
        ...user.data[0],
        company: company.data[0]
      }
      console.log('fetchUserFromDB newUser: ', newUser);
      
      if(user.data[0]) {
        console.log('fetchUserFromDB user: ', user.data[0]);        
        set({ user: user.data[0] });
      } else {
        console.log('fetchUserFromDB no user found: ', user);        
      }
    },
    updateUser: async (user: any) => {
      console.log('fetchUser', user);
      
      set({ user });
    },
    clearUser: () => set({ user: null }),
})