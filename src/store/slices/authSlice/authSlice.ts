import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { AuthState } from "../../../types";
import { userLogin, userLogout, userRegister } from "./actions";

export const initialAuthState: AuthState = {
  loading: false,
  error: null,
  user: null,
  token: null
};

const handlePending = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};

const handleFulfilled = (state: AuthState, action: PayloadAction<AuthState>) => {
  state.loading = false;
  state.user = action.payload?.user || null;
  state.error = action.payload?.error || null;
  state.token = action.payload?.token || null;
};

const handleRejected = (state: AuthState, action: PayloadAction<unknown, string, {
  arg: unknown;
  requestId: string;
  requestStatus: "rejected";
  aborted: boolean;
  condition: boolean;
} & ({
  rejectedWithValue: true;
} | ({
  rejectedWithValue: false;
} & {})), SerializedError>) => {
  const error = action?.payload as string;

  state.loading = false;
  state.user = null;
  state.token = null;
  state.error = error || null;
};

const handleLogout = () => initialAuthState;


const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logoutUser: handleLogout,
    login: handleFulfilled,
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, handlePending)
      .addCase(userLogin.fulfilled, handleFulfilled)
      .addCase(userLogin.rejected, handleRejected)
      .addCase(userRegister.pending, handlePending)
      .addCase(userRegister.fulfilled, (handleFulfilled))
      .addCase(userRegister.rejected, handleRejected)
      .addCase(userLogout.pending, handlePending)
      .addCase(userLogout.fulfilled, handleLogout)
      .addCase(userLogout.rejected, handleRejected);

  },
});

const { logoutUser, login } = authSlice.actions;

export {
  authSlice, login, logoutUser
};

