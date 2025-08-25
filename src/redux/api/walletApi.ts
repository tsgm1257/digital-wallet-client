import { baseApi } from "./baseApi";

export interface Wallet {
  _id: string;
  user: string | any;
  balance: number;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWallet: builder.query<Wallet, void>({
      query: () => ({ url: "/wallet/me" }),
      providesTags: ["Wallet"],
    }),
    addMoney: builder.mutation<{ message: string }, { amount: number }>({
      query: (body) => ({ url: "/wallet/add-money", method: "POST", body }),
      invalidatesTags: ["Wallet", "Txns", "Stats"],
    }),
    withdrawMoney: builder.mutation<{ message: string }, { amount: number }>({
      query: (body) => ({ url: "/wallet/withdraw", method: "POST", body }),
      invalidatesTags: ["Wallet", "Txns", "Stats"],
    }),
  }),
});

export const {
  useGetMyWalletQuery,
  useAddMoneyMutation,
  useWithdrawMoneyMutation,
} = walletApi;
