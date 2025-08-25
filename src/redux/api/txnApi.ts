import { baseApi } from "./baseApi";

export type TxType = "send" | "withdraw" | "deposit";
export type TxStatus = "completed" | "failed";

export interface Transaction {
  _id: string;
  sender?: any;
  receiver?: any;
  amount: number;
  type: TxType;
  status: TxStatus;
  createdAt?: string;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const txnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTransactions: builder.query<
      Paginated<Transaction>,
      { page?: number; limit?: number; type?: TxType; dateFrom?: string; dateTo?: string }
    >({
      query: (params) => ({ url: "/transactions/me", params }),
      providesTags: ["Txns"],
    }),
    sendMoney: builder.mutation<{ message: string }, { recipient: string; amount: number }>(
      {
        query: (body) => ({ url: "/transactions/send", method: "POST", body }),
        invalidatesTags: ["Wallet", "Txns", "Stats"],
      }
    ),
    cashIn: builder.mutation<{ message: string }, { username: string; amount: number }>(
      {
        query: (body) => ({ url: "/transactions/cash-in", method: "POST", body }),
        invalidatesTags: ["Txns", "Stats"],
      }
    ),
    cashOut: builder.mutation<{ message: string }, { username: string; amount: number }>(
      {
        query: (body) => ({ url: "/transactions/cash-out", method: "POST", body }),
        invalidatesTags: ["Txns", "Stats"],
      }
    ),
  }),
});

export const {
  useGetMyTransactionsQuery,
  useSendMoneyMutation,
  useCashInMutation,
  useCashOutMutation,
} = txnApi;
