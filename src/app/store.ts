import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../redux/api/baseApi";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}
const initialState: AuthState = {
  token: (typeof window !== "undefined" && localStorage.getItem("jwt")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (s, a: PayloadAction<string | null>) => {
      s.token = a.payload ?? null;
      if (typeof window !== "undefined") {
        if (a.payload) localStorage.setItem("jwt", a.payload);
        else localStorage.removeItem("jwt");
      }
    },
    logout: (s) => {
      s.token = null;
      if (typeof window !== "undefined") localStorage.removeItem("jwt");
    },
  },
});

export const { setToken, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (gDM) => gDM().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
