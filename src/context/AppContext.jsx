import React, { createContext, useContext, useEffect, useState } from "react";
import {
  MOCK_USERS,
  MOCK_BUSINESSES,
  MOCK_TRANSACTIONS,
  REFUND_REQUESTS,
  TEST_ADMINS,
} from "../data/mockData";

const AppContext = createContext();
const USER_STORAGE_KEY = "tak-admin-user";
const THEME_STORAGE_KEY = "tak-admin-theme";

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export const AppProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === "dark") return true;
      if (storedTheme === "light") return false;
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });
  const loadStoredUser = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.username || !parsed.role) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  };
  const [currentUser, setCurrentUserState] = useState(loadStoredUser);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New user registered",
      message: "John Doe just signed up",
      time: "5m ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment received",
      message: "UGX 50,000 from Electric Store",
      time: "1h ago",
      read: false,
    },
    {
      id: 3,
      title: "Refund processed",
      message: "Refund of UGX 12,000 completed",
      time: "3h ago",
      read: true,
    },
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState(MOCK_USERS);
  const [businesses, setBusinesses] = useState(MOCK_BUSINESSES);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [refundRequests, setRefundRequests] = useState(REFUND_REQUESTS);
  const [admins, setAdmins] = useState(TEST_ADMINS);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, "light");
      }
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const setCurrentUser = (user) => {
    const safeUser =
      user && typeof user === "object"
        ? Object.keys(user).reduce((acc, key) => {
            if (key !== "password") acc[key] = user[key];
            return acc;
          }, {})
        : null;

    setCurrentUserState(safeUser);

    if (typeof window === "undefined") return;
    if (safeUser) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.permissions.includes("all")) return true;
    return currentUser.permissions.includes(permission);
  };

  return (
    <AppContext.Provider
      value={{
        isDark,
        setIsDark,
        toggleDarkMode,
        currentUser,
        setCurrentUser,
        isLoading,
        setIsLoading,
        sidebarOpen,
        setSidebarOpen,
        notifications,
        setNotifications,
        searchResults,
        setSearchResults,
        users,
        setUsers,
        businesses,
        setBusinesses,
        transactions,
        setTransactions,
        refundRequests,
        setRefundRequests,
        admins,
        setAdmins,
        hasPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
