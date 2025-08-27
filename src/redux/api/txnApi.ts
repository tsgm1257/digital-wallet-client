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

type GetMyTxParams = {
  page?: number;
  limit?: number;
  type?: TxType;
  dateFrom?: string;
  dateTo?: string;
};

type SendPayload =
  | { recipient: string; amount: number | string }
  | { recipientUsername: string; amount: number | string };

type CashPayload = { username: string; amount: number | string };

export const txnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTransactions: builder.query<
      Paginated<Transaction>,
      GetMyTxParams | void
    >({
      query: (params) => ({ url: "/transactions/me", params }),
      providesTags: ["Txns", "Wallet", "Stats"],
    }),

    sendMoney: builder.mutation<{ message: string }, SendPayload>({
      query: (payload) => {
        const recipient =
          (payload as any).recipient ?? (payload as any).recipientUsername;
        const amount = Number((payload as any).amount);
        return {
          url: "/transactions/send",
          method: "POST",
          body: { recipient, amount },
        };
      },
      invalidatesTags: ["Txns", "Wallet", "Stats"],
    }),

    cashIn: builder.mutation<{ message: string }, CashPayload>({
      query: (body) => ({
        url: "/transactions/cash-in",
        method: "POST",
        body: { username: body.username, amount: Number(body.amount) },
      }),
      invalidatesTags: ["Txns", "Wallet", "Stats"],
    }),

    cashOut: builder.mutation<{ message: string }, CashPayload>({
      query: (body) => ({
        url: "/transactions/cash-out",
        method: "POST",
        body: { username: body.username, amount: Number(body.amount) },
      }),
      invalidatesTags: ["Txns", "Wallet", "Stats"],
    }),
  }),
});

export const {
  useGetMyTransactionsQuery,
  useSendMoneyMutation,
  useCashInMutation,
  useCashOutMutation,
} = txnApi;
