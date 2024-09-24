import { combineReducers } from "@reduxjs/toolkit";
import { notesApi } from "./api";
import { authSlice } from "./slices";

const { reducer: auth } = authSlice;
const { reducer: notes, reducerPath: notesPath } = notesApi;

export const rootReducer = combineReducers({
  auth,
  [notesPath]: notes
});

export type RootState = ReturnType<typeof rootReducer>;