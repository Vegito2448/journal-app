import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService, UserLogin, UserRegister } from "./authService";

const handleAsyncError = (error: unknown, rejectWithValue: (value: unknown) => void) => {
  const err = error as Error;
  return rejectWithValue(err?.message || err);
};

export const userLogin = createAsyncThunk(
  'auth/login',
  async (props: UserLogin, { rejectWithValue }) => {
    try {
      const user = await authService.login(props);
      localStorage.setItem('userToken', user.token);
      return user;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const userRegister = createAsyncThunk(
  'auth/register',
  async (props: UserRegister, { rejectWithValue }) => {
    try {
      const user = await authService.register(props);
      localStorage.setItem('userToken', user.token);
      return user;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const userLogout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('userToken');
      return null;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);