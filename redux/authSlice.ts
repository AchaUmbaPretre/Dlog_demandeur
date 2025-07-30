import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  currentUser: any | null;
}

const initialState: UserState = {
  token: null,
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: any }>) {
      state.token = action.payload.token;
      state.currentUser = action.payload.user;
      AsyncStorage.setItem('token', action.payload.token);
      AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.currentUser = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<any | null>) {
      state.currentUser = action.payload;
    }
  },
});

export const { loginSuccess, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;