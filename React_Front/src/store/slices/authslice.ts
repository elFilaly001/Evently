import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  id: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

// Get user data from localStorage
const storedUser = JSON.parse(localStorage.getItem('user')||'{}');
const storedToken = localStorage.getItem('ticket');

const initialState: AuthState = {
  id: storedUser.id || null,
  username: storedUser.username || null,
  email: storedUser.email || null,
  isAuthenticated: !!storedToken, // Set based on token existence
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.id = null;
      state.username = null;
      state.email = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('ticket');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;     