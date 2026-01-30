import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginScreen from "./pages/LoginScreen";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import BusinessesPage from "./pages/BusinessesPage";
import BusinessDetailsPage from "./pages/BusinessDetailsPage";
import AttendantsPage from "./pages/AttendantsPage";
import BillingPage from "./pages/BillingPage";
import TransactionsPage from "./pages/TransactionsPage";
import SalesOpsPage from "./pages/SalesOpsPage";
import InventoryPage from "./pages/InventoryPage";
import CashflowPage from "./pages/CashflowPage";
import ExpensesPage from "./pages/ExpensesPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import EmailsPage from "./pages/EmailsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FeatureLimitsPage from "./pages/FeatureLimitsPage";
import SupportPage from "./pages/SupportPage";
import OnboardingAuthPage from "./pages/OnboardingAuthPage";
import RolesPage from "./pages/RolesPage";
import RefundsPage from "./pages/RefundsPage";
import SettingsPage from "./pages/SettingsPage";
import SystemHealthPage from "./pages/SystemHealthPage";
import AuditLogPage from "./pages/AuditLogPage";
import PageSkeleton from "./components/PageSkeleton";

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/businesses/:id" element={<BusinessDetailsPage />} />
        <Route path="/attendants" element={<AttendantsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/sales-ops" element={<SalesOpsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/cashflow" element={<CashflowPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/emails" element={<EmailsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/refunds" element={<RefundsPage />} />
        <Route path="/feature-limits" element={<FeatureLimitsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/onboarding-auth" element={<OnboardingAuthPage />} />
        <Route path="/system-health" element={<SystemHealthPage />} />
        <Route path="/audit-log" element={<AuditLogPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const RequireAuth = ({ children }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const LoginRoute = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LoginScreen
      onLogin={(user) => {
        setCurrentUser(user);
        navigate("/dashboard", { replace: true });
      }}
    />
  );
};

const AppLayout = () => {
  const { sidebarOpen, isLoading, setIsLoading } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 550);
    return () => clearTimeout(timer);
  }, [location.pathname, setIsLoading]);

  return (
    <div className="tak-app min-h-screen transition-colors">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Navbar />
        <main className="p-4 pt-20 sm:p-6 sm:pt-25">
          {isLoading ? <PageSkeleton /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default App;
