import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: JSON.parse(localStorage.getItem('user') || '{}').username || "",
  email: JSON.parse(localStorage.getItem('user') || '{}').email || "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.username = null;
      state.email = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;     