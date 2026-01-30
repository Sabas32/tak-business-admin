import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  DollarSign,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const {
    isDark,
    toggleDarkMode,
    notifications,
    setNotifications,
    sidebarOpen,
    currentUser,
    users,
    businesses,
    transactions,
  } = useAppContext();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifFilter, setNotifFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [localSearchResults, setLocalSearchResults] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && !event.target.closest(".search-container")) {
        setShowSearch(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
        setLocalSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showSearch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setLocalSearchResults([]);
      setShowSearch(false);
      return;
    }

    const results = [];

    const appPages = [
      {
        id: "dashboard",
        name: "Dashboard",
        description: "Overview and statistics",
        icon: "DB",
      },
      {
        id: "users",
        name: "User Management",
        description: "Manage all users",
        icon: "US",
      },
      {
        id: "businesses",
        name: "Businesses",
        description: "Manage registered businesses",
        icon: "BZ",
      },
      {
        id: "attendants",
        name: "Attendants",
        description: "Manage attendants and roles",
        icon: "AT",
      },
      {
        id: "billing",
        name: "Billing & Subscriptions",
        description: "Manage subscription plans",
        icon: "BL",
      },
      {
        id: "feature-limits",
        name: "Feature Limits",
        description: "Plan entitlements and limits",
        icon: "FL",
      },
      {
        id: "transactions",
        name: "Transactions",
        description: "View and manage transactions",
        icon: "TX",
      },
      {
        id: "inventory",
        name: "Inventory",
        description: "Review stock levels and movement",
        icon: "IV",
      },
      {
        id: "cashflow",
        name: "Cashflow",
        description: "Track cash in and cash out",
        icon: "CF",
      },
      {
        id: "expenses",
        name: "Expenses",
        description: "Monitor expense approvals and spend",
        icon: "EX",
      },
      {
        id: "refunds",
        name: "Refunds",
        description: "Review subscription refund requests",
        icon: "RF",
      },
      {
        id: "customers",
        name: "Customers",
        description: "Monitor customer balances and activity",
        icon: "CU",
      },
      {
        id: "reports",
        name: "Reports",
        description: "Generate operational reports",
        icon: "RP",
      },
      {
        id: "emails",
        name: "Email Management",
        description: "Send broadcast emails",
        icon: "EM",
      },
      {
        id: "notifications",
        name: "Notifications",
        description: "Manage alert rules and logs",
        icon: "NT",
      },
      {
        id: "support",
        name: "Support",
        description: "Track support queue and requests",
        icon: "SU",
      },
      {
        id: "onboarding-auth",
        name: "Onboarding & Auth",
        description: "Registration and authentication monitoring",
        icon: "OA",
      },
      {
        id: "analytics",
        name: "Analytics",
        description: "Detailed insights and metrics",
        icon: "AN",
      },
      {
        id: "system-health",
        name: "System Health",
        description: "Sync, integrity, and auth monitoring",
        icon: "HL",
      },
      {
        id: "audit-log",
        name: "Audit Log",
        description: "Track admin actions and changes",
        icon: "AL",
      },
      {
        id: "roles",
        name: "Admin Roles",
        description: "Manage admin permissions",
        icon: "RL",
      },
      {
        id: "settings",
        name: "Settings",
        description: "Application settings",
        icon: "ST",
      },
    ];

    appPages.forEach((page) => {
      if (
        page.name.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase()) ||
        page.id.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ type: "page", data: page, page: page.id });
      }
    });

    users.forEach((user) => {
      if (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ type: "user", data: user, page: "users" });
      }
    });

    businesses.forEach((business) => {
      if (
        business.name.toLowerCase().includes(query.toLowerCase()) ||
        business.owner.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ type: "business", data: business, page: "businesses" });
      }
    });

    transactions.forEach((transaction) => {
      if (transaction.business.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: "transaction",
          data: transaction,
          page: "transactions",
        });
      }
    });

    setLocalSearchResults(results);
    setShowSearch(results.length > 0);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications =
    notifFilter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handleResultClick = (result) => {
    if (result.type === "user") {
      navigate(`/users?highlight=${result.data.id}`);
    } else if (result.type === "business") {
      navigate(`/businesses?highlight=${result.data.id}`);
    } else {
      navigate(`/${result.page}`);
    }
    setShowSearch(false);
    setSearchQuery("");
    setLocalSearchResults([]);
  };

  return (
    <header
      className={`tak-navbar fixed top-0 right-0 ${
        sidebarOpen ? "lg:left-64" : "lg:left-20"
      } left-0 z-30 transition-all duration-300`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4 gap-2 lg:gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-2xl relative search-container">
          <div className="relative">
            <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() =>
                searchQuery.length >= 2 &&
                localSearchResults.length > 0 &&
                setShowSearch(true)
              }
              placeholder="Search..."
              className="tak-nav-search-input border-none outline-none w-full pl-9 lg:pl-12 pr-4 lg:pr-5 py-2.5 lg:py-3 text-sm lg:text-base bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-red-500/30 focus:border-transparent transition text-gray-900 dark:text-white shadow-[0_12px_32px_-20px_rgba(15,23,42,0.35)]"
            />
          </div>

          {showSearch && localSearchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 tak-card rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
              <div className="p-2">
                {localSearchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        {result.type === "page" && (
                          <>
                            <span className="w-8 h-8 rounded-lg bg-gray-900 text-white text-xs font-semibold flex items-center justify-center">
                              {result.data.icon}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {result.data.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {result.data.description}
                              </p>
                            </div>
                          </>
                        )}
                        {result.type === "user" && (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                              {result.data.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {result.data.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {result.data.email}
                              </p>
                            </div>
                          </>
                        )}
                        {result.type === "business" && (
                          <>
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {result.data.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Owner: {result.data.owner}
                              </p>
                            </div>
                          </>
                        )}
                        {result.type === "transaction" && (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                              <DollarSign className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {result.data.business}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Amount: UGX {result.data.amount.toLocaleString()}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-lg text-white font-medium ${
                          result.type === "page"
                            ? "bg-red-500"
                            : result.type === "user"
                            ? "bg-blue-500"
                            : result.type === "business"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {result.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {localSearchResults.length} result
                  {localSearchResults.length !== 1 ? "s" : ""}. Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                    ESC
                  </kbd>{" "}
                  to close
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 lg:p-3 hover:bg-white/70 dark:hover:bg-white/10 rounded-2xl transition"
          >
            {isDark ? (
              <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 lg:p-3 hover:bg-white/70 dark:hover:bg-white/10 rounded-2xl transition relative"
            >
              <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-[calc(100vw-2rem)]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {unreadCount} unread message
                        {unreadCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 transition"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setNotifFilter("all")}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                        notifFilter === "all"
                          ? "bg-red-500 text-white shadow"
                          : "bg-white/70 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter("unread")}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                        notifFilter === "unread"
                          ? "bg-red-500 text-white shadow"
                          : "bg-white/70 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      Unread
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {visibleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`group p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-white/10 cursor-pointer transition ${
                        !notif.read ? "bg-red-50/80 dark:bg-red-500/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-[#CD192F]" />
                            )}
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                              {notif.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notif.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))}
                  {visibleNotifications.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      No notifications to show.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {currentUser?.username}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.role}</p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold">
              {currentUser?.username[0].toUpperCase()}
            </div>
          </div>

          <div className="sm:hidden w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {currentUser?.username[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

