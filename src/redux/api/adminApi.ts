import { baseApi } from "./baseApi";
import type { Paginated } from "./txnApi";

export interface AdminStats {
  users: {
    totalUsers: number;
    totalAgents: number;
    totalAdmins: number;
    approvedAgents: number;
    pendingAgents: number;
  };
  wallets: {
    totalWallets: number;
    blockedWallets: number;
  };
  transactions: {
    total: number;
    totalVolume: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

export interface AdminUser {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  role: "user" | "agent" | "admin";
  isApproved?: boolean;
  createdAt?: string;
}

export interface AdminWallet {
  _id: string;
  user: AdminUser;
  balance: number;
  isBlocked: boolean;
  createdAt?: string;
}

export interface AdminTx {
  _id: string;
  sender?: AdminUser;
  receiver?: AdminUser;
  amount: number;
  type: "send" | "withdraw" | "deposit";
  status: "completed" | "failed";
  createdAt?: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => ({ url: "/admin/stats" }),
      providesTags: ["Stats"],
    }),
    getUsers: builder.query<
      Paginated<AdminUser>,
      { page?: number; limit?: number; role?: "user"|"agent"|"admin"; approved?: boolean; search?: string }
    >({
      query: (params) => ({
        url: "/admin/all",
        params: {
          ...params,
          approved: typeof params.approved === "boolean" ? String(params.approved) : undefined,
        },
      }),
      providesTags: ["Users"],
    }),
    getWallets: builder.query<
      Paginated<AdminWallet>,
      {
        page?: number; limit?: number; blocked?: boolean; minBalance?: number; maxBalance?: number;
        userId?: string; role?: "user"|"agent"|"admin"; approved?: boolean; search?: string
      }
    >({
      query: (params) => ({
        url: "/admin/wallets",
        params: {
          ...params,
          blocked: typeof params.blocked === "boolean" ? String(params.blocked) : undefined,
          approved: typeof params.approved === "boolean" ? String(params.approved) : undefined,
        },
      }),
      providesTags: ["Wallets"],
    }),
    getAllTransactionsAdmin: builder.query<
      Paginated<AdminTx>,
      {
        page?: number; limit?: number; type?: "send"|"withdraw"|"deposit";
        status?: "completed"|"failed"; dateFrom?: string; dateTo?: string; userId?: string;
        minAmount?: number; maxAmount?: number;
      }
    >({
      query: (params) => ({ url: "/admin/transactions", params }),
      providesTags: ["Txns"],
    }),
    setWalletBlocked: builder.mutation<{ message: string }, { walletId: string; block: boolean }>(
      {
        query: ({ walletId, block }) => ({
          url: `/admin/wallets/${walletId}/block`,
          method: "PATCH",
          body: { block },
        }),
        invalidatesTags: ["Wallets", "Stats"],
      }
    ),
    updateAgentApproval: builder.mutation<{ message: string }, { userId: string; approve: boolean }>(
      {
        query: ({ userId, approve }) => ({
          url: `/admin/agents/${userId}/approve`,
          method: "PATCH",
          body: { approve },
        }),
        invalidatesTags: ["Users", "Stats"],
      }
    ),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetWalletsQuery,
  useGetAllTransactionsAdminQuery,
  useSetWalletBlockedMutation,
  useUpdateAgentApprovalMutation,
} = adminApi;
