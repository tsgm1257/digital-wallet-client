import { baseApi } from "./baseApi";

export interface LoginReq { username: string; password: string; }
export interface LoginRes { message: string; token: string; }
export interface RegisterReq {
  username: string;
  password: string;
  role?: "user" | "agent" | "admin";
  email?: string;
  phone?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginRes, LoginReq>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<{ message: string }, RegisterReq>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
