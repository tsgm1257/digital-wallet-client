## Digital Wallet Client (Frontend)

Modern, role-based React application for a Digital Wallet System (bKash/Nagad style) built with React, TypeScript, Redux Toolkit, and RTK Query. It consumes the companion backend API to provide tailored dashboards and financial operations for Users, Agents, and Admins.

### Live

- Frontend: https://digital-wallet-client-eight.vercel.app/
- Backend API: https://digital-wallet-api-beta.vercel.app

Replace the above with your deployed URLs if they change.

### Tech Stack

- React 19, TypeScript, Vite
- React Router 7
- Redux Toolkit + RTK Query
- Tailwind CSS + DaisyUI
- Recharts (charts)
- react-hot-toast (toasts)
- @reactour/tour (guided tour)

### Features

- Public landing experience
  - Sticky navbar, responsive layout, animated hero, CTA buttons, skeleton loaders
  - Pages: Home, About, Features, FAQ, Contact (with simulated form submission)
- Authentication
  - JWT login, registration (User/Agent), logout, persisted auth in localStorage
  - Role-based redirect on login; protected routes with role enforcement
- User Dashboard
  - Wallet balance, quick actions (deposit, withdraw, send), charts
  - Transactions with pagination and filtering (type/date) + quick search
  - Profile management (update profile, change password)
- Agent Dashboard
  - Cash-in/out for users, handled transactions with filters and search
  - Agent wallet KPI + charts
- Admin Dashboard
  - KPIs, manage users (approve/suspend agents), block/unblock wallets
  - All transactions with advanced filters and pagination
  - Charts by type and status
- General UX
  - Theme toggle (light/dark), loading states, toasts, form validations
  - Guided tour (5+ steps) for each role; auto-runs once per role and can be restarted in Settings

### Project Structure

```
src/
  app/            # Redux store setup
  components/     # Shared UI (Navbar, Footer, charts, Pagination)
  hooks/          # Custom hooks (auth)
  pages/          # Route pages (Landing, Login, Dashboards, Settings, etc.)
  redux/          # RTK Query APIs (auth, profile, wallet, txn, admin)
  routes/         # Route guards (Protected)
  tour/           # Guided tour provider and helpers
  utils/          # Helpers (transaction aggregations, dates)
```

### Getting Started

1. Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A running backend API (see the server repo). Default dev URL is `http://localhost:5000`.

2. Install

```bash
npm install
```

3. Environment

Create a `.env` file (or configure in your hosting platform):

```
VITE_API_URL=http://localhost:5000
```

4. Run

```bash
npm run dev
```

Open the app at the URL printed by Vite (usually `http://localhost:5173`).

5. Build & Preview

```bash
npm run build
npm run preview
```

### Scripts

- `npm run dev` — start development server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

### Configuration Highlights

- API base URL is derived from `VITE_API_URL` and used as `${VITE_API_URL}/api`.
- Auth token is persisted in `localStorage` under the key `jwt`.
- Protected routes enforce roles via `src/routes/Protected.tsx`.
- Guided tour auto-runs once per role with `localStorage` key `dw_tour_done_<role>` and can be restarted in Settings.

### Key Routes

- Public: `/`, `/about`, `/features`, `/faq`, `/contact`, `/login`, `/register`
- User: `/dashboard/user`, `/settings`
- Agent: `/dashboard/agent`, `/settings`
- Admin: `/dashboard/admin`, `/settings`

### API Expectations (Frontend)

The frontend calls these main API groups (see `src/redux/api/*`):

- Auth: `POST /api/auth/login`, `POST /api/auth/register`
- Profile: `GET /api/users/me`, `PATCH /api/users/me`, `PATCH /api/users/me/password`, `GET /api/users/lookup`
- Wallet: `GET /api/wallet/me`, `POST /api/wallet/add-money`, `POST /api/wallet/withdraw`
- Transactions: `GET /api/transactions/me`, `POST /api/transactions/send`, `POST /api/transactions/cash-in`, `POST /api/transactions/cash-out`
- Admin: `GET /api/admin/stats`, `GET /api/admin/all`, `GET /api/admin/wallets`, `GET /api/admin/transactions`, `PATCH /api/admin/wallets/:walletId/block`, `PATCH /api/admin/agents/:userId/approve`

### Demo Credentials (example)

Provide working demo accounts for testing (update with real seeded data):

- Admin: `admin@example.com` / `Admin@123` (or username/password)
- Agent: `agent1` / `Agent@123`
- User: `user1` / `User@123`

### Accessibility & UX

- Keyboard-focusable controls and clear labels
- Color theme with contrast-aware defaults (light/dark)
- Skeleton loaders and toasts for responsive feedback

### Deployment

1. Set `VITE_API_URL` to your production API URL.
2. Build the app: `npm run build`.
3. Deploy the `dist/` folder to your hosting (Vercel/Netlify/etc.).

Example Vercel settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Env: `VITE_API_URL=https://your-api.example.com`

### Development Notes

- Charts and stats derive from the transactions endpoints. If your data set is empty, charts may render empty states.
- Client-side role enforcement complements server-side authorization but does not replace it.
- The tour will auto-start once per role; clear `localStorage` to replay it or use the Restart button in Settings.

### Troubleshooting

- 401 errors — ensure the backend is running and `VITE_API_URL` is correct, and that you are logged in.
- CORS issues — verify the backend CORS settings allow the frontend origin.
- Empty tables/charts — seed data via registration and transactions or through admin tools.

### License

This project is for educational purposes. Add your preferred license if needed.
