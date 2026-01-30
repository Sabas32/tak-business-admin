# Tak Business Admin - Developer Documentation

## Purpose
Tak Business Admin is a React-based admin dashboard for managing the Tak Business platform. It provides an operations console for users, businesses, subscriptions, transactions, inventory, refunds, support, and platform health. The current UI runs entirely on mock data and in-memory state. This document explains how it works today and what backend services are required to make it production-ready.

## Stack and tooling
- React 19 + Vite
- React Router 6 (client-side routing)
- Tailwind CSS 4 + custom CSS (src/index.css)
- Recharts (charts)
- jsPDF + window.print (reports/PDF export)
- lucide-react (icons)

## Local setup
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## App architecture
- Entry point: `src/main.jsx` mounts `<App />` inside `BrowserRouter`.
- Routing: `src/App.jsx` defines all routes and guards them with `RequireAuth`.
- Layout: `AppLayout` renders `Sidebar`, `Navbar`, and `Outlet`.
- Loading: `AppLayout` toggles `isLoading` for 550ms on route changes and shows `PageSkeleton`.
- State: `src/context/AppContext.jsx` provides app state (theme, user, sidebar, data lists).
- Storage:
  - `tak-admin-user` in localStorage (current admin user, password stripped)
  - `tak-admin-theme` in localStorage (light/dark)

## Auth and permissions (current behavior)
- Login uses mock admins from `TEST_ADMINS` in `src/data/mockData.js`.
- `RequireAuth` redirects to `/login` if `currentUser` is null.
- `hasPermission(permission)` checks `currentUser.permissions` ("all" grants full access).
- Sidebar filters visible items based on permissions.
- Admin Roles page is restricted to `currentUser.role === "Super Admin"`.

## Where data comes from today
- `src/data/mockData.js` supplies most domain data.
- `AppContext` holds and mutates:
  - `users`, `businesses`, `transactions`, `refundRequests`, `admins`
  - `notifications`, `sidebarOpen`, `isLoading`, `currentUser`, `isDark`
- Some pages import mock data directly instead of using context:
  - Attendants, Inventory, Sales Ops, Reports, Customers, Expenses, Notifications, System Health, etc.

## Routes and page behaviors
Route -> Component -> Key behaviors and data needs

- `/login` -> `LoginScreen`
  - Username/password login against admin list.
  - Needs: admin auth endpoint and token-based session.

- `/dashboard` -> `DashboardPage`
  - Aggregated stats: users, businesses, transactions, refund requests.
  - Charts: user growth and revenue/subscriptions.
  - Alerts + recent activity feed.

- `/users` -> `UsersPage`
  - Search, filter (status, role), pagination.
  - Create, edit, view, delete users.
  - Toggle status Active/Suspended.
  - Assign businesses; create a business inline.
  - PDF export (window.print).
  - Supports query highlight: `/users?highlight={userId}`.

- `/businesses` -> `BusinessesPage`
  - Search, filter (status, plan).
  - Create/edit business, toggle featured.
  - Cards with metrics (low stock, sync status, last sync).
  - PDF export.
  - Supports query highlight: `/businesses?highlight={businessId}`.

- `/businesses/:id` -> `BusinessDetailsPage`
  - Tabs: Overview, Sales, Stock, Attendants, Billing.
  - Overview shows VAT, currency, address, created date.
  - Sales tab shows business transactions and totals.
  - Stock tab shows low stock alerts.
  - Attendants tab lists staff.
  - Billing tab shows plan payment status and renewal dates.

- `/attendants` -> `AttendantsPage`
  - Read-only list, filter by status.
  - Activity modal.

- `/billing` -> `BillingPage`
  - Plan cards and editable pricing/features.
  - Subscription table with status filters.
  - MRR and renewal summary.
  - PDF export.

- `/transactions` -> `TransactionsPage`
  - Table of non-refunded transactions with filters.
  - Summary totals and PDF export.

- `/sales-ops` -> `SalesOpsPage`
  - Sales, returns, on-hold monitoring.
  - Filters + PDF export.

- `/inventory` -> `InventoryPage`
  - Per-business stock health summary.
  - Drill-in modal with products, alerts, movements.

- `/cashflow` -> `CashflowPage`
  - Cash in/out table with filters.
  - Recent expenses summary.

- `/expenses` -> `ExpensesPage`
  - Expense table with filters and category summaries.

- `/customers` -> `CustomersPage`
  - Customer list, status filter, credit totals.

- `/reports` -> `ReportsPage`
  - Generate or download PDF for report types.
  - Updates last-generated timestamp in UI.

- `/emails` -> `EmailsPage`
  - Compose broadcast email with audience selection.
  - Shows live preview and delivery summary.

- `/notifications` -> `NotificationsPage`
  - Manage notification rules (enable/disable).
  - Notification log with filters and channel health.

- `/analytics` -> `AnalyticsPage`
  - Retention trend, plan mix, status distribution.
  - Profit summary chart + table.

- `/refunds` -> `RefundsPage`
  - Search + filters; review modal.
  - Approve/decline updates transactions, adds notification.

- `/feature-limits` -> `FeatureLimitsPage`
  - Plan limits table and usage monitoring.

- `/support` -> `SupportPage`
  - Support queue list with filters.

- `/onboarding-auth` -> `OnboardingAuthPage`
  - Onboarding funnel and conversion rate.
  - Auth requests (resolve), account requests (resolve).
  - Mark email/phone verification on users.

- `/system-health` -> `SystemHealthPage`
  - Sync issues, integrity alerts, auth events.

- `/audit-log` -> `AuditLogPage`
  - Searchable audit log with status filter.

- `/roles` -> `RolesPage`
  - CRUD for admin accounts and permissions.
  - Permission viewer modal.

- `/settings` -> `SettingsPage`
  - App settings (company, email, currency, timezone).
  - Security toggles (2FA, session timeout, audit retention).
  - Notification toggles.

## Backend integration map (recommended endpoints)
The UI is ready to consume REST-style endpoints. Below is a suggested contract. Adjust to your backend style as needed.

### Auth and admin session
- POST `/admin/auth/login`
  - Request: `{ username, password }`
  - Response: `{ token, admin: { id, username, email, role, permissions } }`
- GET `/admin/me`
- POST `/admin/auth/logout` (optional)

### Admin roles
- GET `/admin/roles`
- POST `/admin/roles`
- PATCH `/admin/roles/{id}`
- DELETE `/admin/roles/{id}`

### Users
- GET `/admin/users?search=&status=&role=&page=&limit=`
- POST `/admin/users`
- PATCH `/admin/users/{id}`
- DELETE `/admin/users/{id}`
- PATCH `/admin/users/{id}/status` (Active/Suspended)
- PATCH `/admin/users/{id}/verify-email`
- PATCH `/admin/users/{id}/verify-phone`

### Businesses
- GET `/admin/businesses?search=&status=&plan=`
- POST `/admin/businesses`
- PATCH `/admin/businesses/{id}`
- PATCH `/admin/businesses/{id}/feature` (toggle)
- GET `/admin/businesses/{id}`
- GET `/admin/businesses/{id}/billing` (VAT, last payment, renewal, payment status)
- GET `/admin/businesses/{id}/transactions`
- GET `/admin/businesses/{id}/attendants`
- GET `/admin/businesses/{id}/stock-alerts`

### Billing and subscriptions
- GET `/admin/plans`
- PATCH `/admin/plans/{name}`
- GET `/admin/subscriptions?status=&search=`
- GET `/admin/subscriptions/metrics` (MRR, counts, renewals)

### Transactions
- GET `/admin/transactions?status=&method=&search=`

### Sales ops
- GET `/admin/sales?status=&type=&search=`

### Inventory
- GET `/admin/inventory/summary` (per business totals)
- GET `/admin/inventory/products?businessId=`
- GET `/admin/inventory/alerts?businessId=`
- GET `/admin/inventory/movements?businessId=`

### Cashflow and expenses
- GET `/admin/cashflow?type=&search=`
- GET `/admin/expenses?status=&business=&search=`
- PATCH `/admin/expenses/{id}` (approve/deny)

### Customers
- GET `/admin/customers?status=&search=`

### Reports
- GET `/admin/reports`
- POST `/admin/reports/{id}/generate`
- POST `/admin/reports/{id}/download`

### Notifications
- GET `/admin/notification-rules?status=&channel=`
- PATCH `/admin/notification-rules/{id}`
- GET `/admin/notification-logs?status=&channel=`

### Emails
- POST `/admin/emails/broadcast`
  - Request: `{ subject, preheader, message, target }`

### Onboarding and auth
- GET `/admin/onboarding/metrics`
- GET `/admin/auth-requests`
- PATCH `/admin/auth-requests/{id}` (resolve)
- GET `/admin/account-requests`
- PATCH `/admin/account-requests/{id}` (resolve)

### Refunds
- GET `/admin/refunds?status=&reason=&search=`
- PATCH `/admin/refunds/{id}` (approve/decline)
  - If approved, update related transaction to `Refunded` and notify.

### System health
- GET `/admin/system/sync-issues`
- GET `/admin/system/integrity-events`
- GET `/admin/system/auth-events?includeResolved=`

### Audit log
- GET `/admin/audit-logs?status=&search=`

### Settings
- GET `/admin/settings`
- PATCH `/admin/settings`

## Entity models as used by the UI
Use these shapes (or superset) so the UI can render without adaptation.

### Admin
```
{
  id: number,
  username: string,
  email: string,
  password?: string,
  role: string,
  permissions: string[] // includes "all" or module keys
}
```

### User
```
{
  id: number,
  name: string,
  email: string,
  phoneCountryCode: string,
  phoneNumber: string,
  phone?: string, // derived from country code + number
  role: "Business Owner" | "Admin" | "Manager",
  status: "Active" | "Suspended",
  emailVerified: boolean,
  phoneVerified: boolean,
  onboardingStage: "Registered" | "Verified" | "Setup" | "Live" | "Invited",
  businessIds: number[],
  businesses?: number, // derived count
  subscriptions: "Basic" | "Premium" | "Enterprise" | "N/A",
  joinDate: "YYYY-MM-DD",
  lastActive: "YYYY-MM-DD HH:mm",
  revenue: number
}
```

### Business
```
{
  id: number,
  name: string,
  owner: string,
  ownerId: number,
  status: "Active" | "Suspended",
  plan: "Basic" | "Premium" | "Enterprise",
  category: string,
  currency: string,
  address: string,
  details?: string,
  setupStatus: "Registered" | "Verified" | "Setup" | "Live" | "Suspended",
  revenue: number,
  employees: number,
  attendantsCount?: number,
  productsCount?: number,
  created: "YYYY-MM-DD",
  featured: boolean,
  lowStock: number,
  syncStatus: "Healthy" | "Delayed" | "Offline",
  lastSync: "YYYY-MM-DD HH:mm"
}
```

### Business billing details
```
{
  businessId: number,
  currency: string,
  vatRate: string,
  lastPayment: "YYYY-MM-DD",
  nextRenewal: "YYYY-MM-DD",
  paymentStatus: "Paid" | "Overdue"
}
```

### Transaction
```
{
  id: number,
  business: string,
  amount: number,
  date: "YYYY-MM-DD",
  status: "Completed" | "Refunded",
  type: string,
  method: "Card" | "Bank Transfer" | "Mobile Money" | string,
  fee?: number
}
```

### Refund request
```
{
  id: string,
  business: string,
  plan: "Basic" | "Premium" | "Enterprise",
  amount: number,
  status: "Pending" | "Approved" | "Declined",
  reason: string,
  transactionId: number,
  requestedBy: string,
  requestedAt: "YYYY-MM-DD HH:mm",
  resolvedAt?: "YYYY-MM-DD HH:mm",
  resolvedBy?: string,
  communication?: string
}
```

### Notification rule
```
{
  id: number,
  name: string,
  trigger: string,
  channel: string,
  status: "Active" | "Disabled"
}
```

### Notification log
```
{
  id: number,
  title: string,
  target: string,
  channel: string,
  status: "Sent" | "Failed",
  time: string
}
```

### Inventory
Products
```
{
  id: number,
  name: string,
  sku: string,
  category: string,
  stock: number,
  reorder: number,
  price: number,
  cost: number,
  updated: "YYYY-MM-DD",
  business: string
}
```

Stock movement
```
{
  id: number,
  business: string,
  type: "Stock In" | "Stock Adjustment" | "Transfer",
  item: string,
  qty: number,
  date: "YYYY-MM-DD"
}
```

Stock alert
```
{
  id: number,
  businessId: number,
  item: string,
  current: number,
  reorder: number
}
```

### Cashflow entry
```
{
  id: number,
  business: string,
  type: "In" | "Out",
  amount: number,
  category: string,
  date: "YYYY-MM-DD",
  note: string
}
```

### Expense
```
{
  id: number,
  business: string,
  category: string,
  amount: number,
  status: "Approved" | "Pending",
  date: "YYYY-MM-DD",
  note: string
}
```

### Customer
```
{
  id: number,
  name: string,
  phone: string,
  email: string,
  totalSpent: number,
  lastPurchase: "YYYY-MM-DD",
  creditBalance: number,
  status: "Active" | "Inactive"
}
```

### Report
```
{
  id: number,
  name: string,
  description: string,
  lastGenerated: string
}
```

### Audit log
```
{
  id: number,
  actor: string,
  action: string,
  target: string,
  time: string,
  status: "Success" | "Failed"
}
```

## Permission keys used by the UI
```
all,
/dashboard -> dashboard,
/users -> users,
/attendants -> attendants,
/customers -> customers,
/support -> support,
/onboarding-auth -> onboarding-auth,
/businesses -> businesses,
/transactions -> transactions,
/inventory -> inventory,
/cashflow -> cashflow,
/expenses -> expenses,
/refunds -> refunds,
/reports -> reports,
/analytics -> analytics,
/notifications -> notifications,
/emails -> emails,
/billing -> billing,
/feature-limits -> feature-limits,
/system-health -> system-health,
/audit-log -> audit-log,
/roles -> roles,
/settings -> settings
```

## Important UI behaviors to mirror in the backend
- Refund approvals update the linked transaction to `Refunded` and emit a notification.
- Creating or editing a user who is a Business Owner updates businesses to reflect the owner.
- User creation requires at least one assigned business in the UI.
- Users and businesses support a `?highlight=` query param to focus a row/card.
- PDF generation is client-side. If you provide server PDFs, map buttons accordingly.

## Next steps for full integration
1. Replace mock data sources with API calls and a small data layer (hooks or query client).
2. Add auth token handling and session refresh.
3. Wire mutations for create/edit/delete and propagate to UI state.
4. Add pagination to large lists and debounce search.
5. Replace derived metrics with backend aggregates where possible.

---
If you want this documentation split into separate backend and frontend guides, say the word and I will break it out.