import { baseApi } from "./baseApi";

export interface UserSafe {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  role: "user" | "agent" | "admin";
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface UpdateProfileReq {
  username?: string;
  email?: string;
  phone?: string;
}
export interface UpdatePasswordReq {
  oldPassword: string;
  newPassword: string;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateMyProfile: builder.mutation<{ message: string; user: UserSafe }, UpdateProfileReq>({
      query: (body) => ({ url: "/users/me", method: "PATCH", body }),
      invalidatesTags: ["Me"],
    }),
    updateMyPassword: builder.mutation<{ message: string }, UpdatePasswordReq>({
      query: (body) => ({ url: "/users/me/password", method: "PATCH", body }),
    }),
    lookupUser: builder.query<UserSafe, { username?: string; email?: string; phone?: string; q?: string }>(
      {
        query: (params) => ({ url: "/users/lookup", params }),
      }
    ),
  }),
});

export const {
  useUpdateMyProfileMutation,
  useUpdateMyPasswordMutation,
  useLazyLookupUserQuery,
} = profileApi;
