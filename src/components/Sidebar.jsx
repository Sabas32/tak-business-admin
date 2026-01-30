import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Building2,
  Boxes,
  Bell,
  CreditCard,
  ChevronDown,
  DollarSign,
  FileText,
  Home,
  LifeBuoy,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Receipt,
  Settings,
  SlidersHorizontal,
  UserPlus,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import logoImage from "../assets/TakBusinessLogo.svg";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, setCurrentUser, hasPermission } =
    useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const navScrollRef = useRef(null);
  const lastPathRef = useRef(location.pathname);
  const lastSidebarOpenRef = useRef(sidebarOpen);
  const [expandedSections, setExpandedSections] = useState({
    overview: false,
    operations: false,
    finance: false,
    platform: false,
  });

  useEffect(() => {
    const navElement = navRef.current;
    const scrollContainer = navScrollRef.current;
    if (!navElement || !scrollContainer) return;
    const pathChanged = lastPathRef.current !== location.pathname;
    const sidebarOpened = !lastSidebarOpenRef.current && sidebarOpen;
    lastPathRef.current = location.pathname;
    lastSidebarOpenRef.current = sidebarOpen;
    if (!pathChanged && !sidebarOpened) return;
    if (!sidebarOpen) return;
    if (window.innerWidth < 1024 && !sidebarOpen) return;
    const activeItem = navElement.querySelector(
      `[data-path="${location.pathname}"]`
    );
    if (!activeItem) return;
    requestAnimationFrame(() => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const offset =
        itemRect.top -
        containerRect.top +
        scrollContainer.scrollTop -
        scrollContainer.clientHeight / 2 +
        itemRect.height / 2;
      scrollContainer.scrollTo({ top: offset, behavior: "smooth" });
    });
  }, [location.pathname, sidebarOpen]);

  const menuSections = [
    {
      id: "overview",
      label: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          permission: "dashboard",
          path: "/dashboard",
        },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      items: [
        {
          id: "businesses",
          label: "Businesses",
          icon: Building2,
          permission: "businesses",
          path: "/businesses",
        },
        {
          id: "users",
          label: "User Management",
          icon: Users,
          permission: "users",
          path: "/users",
        },
        {
          id: "attendants",
          label: "Attendants",
          icon: UserCheck,
          permission: "attendants",
          path: "/attendants",
        },
        {
          id: "customers",
          label: "Customers",
          icon: Users,
          permission: "customers",
          path: "/customers",
        },
        {
          id: "transactions",
          label: "Transactions",
          icon: DollarSign,
          permission: "transactions",
          path: "/transactions",
        },
        {
          id: "inventory",
          label: "Inventory",
          icon: Boxes,
          permission: "inventory",
          path: "/inventory",
        },
        {
          id: "support",
          label: "Support",
          icon: LifeBuoy,
          permission: "support",
          path: "/support",
        },
      ],
    },
    {
      id: "finance",
      label: "Finance",
      items: [
        {
          id: "cashflow",
          label: "Cashflow",
          icon: Wallet,
          permission: "cashflow",
          path: "/cashflow",
        },
        {
          id: "expenses",
          label: "Expenses",
          icon: Receipt,
          permission: "expenses",
          path: "/expenses",
        },
        {
          id: "refunds",
          label: "Refunds",
          icon: DollarSign,
          permission: "refunds",
          path: "/refunds",
        },
        {
          id: "reports",
          label: "Reports",
          icon: FileText,
          permission: "reports",
          path: "/reports",
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: BarChart3,
          permission: "analytics",
          path: "/analytics",
        },
      ],
    },
    {
      id: "platform",
      label: "Platform",
      items: [
        {
          id: "onboarding-auth",
          label: "Onboarding & Auth",
          icon: UserPlus,
          permission: "onboarding-auth",
          path: "/onboarding-auth",
        },
        {
          id: "billing",
          label: "Billing & Subscriptions",
          icon: CreditCard,
          permission: "billing",
          path: "/billing",
        },
        {
          id: "feature-limits",
          label: "Feature Limits",
          icon: SlidersHorizontal,
          permission: "feature-limits",
          path: "/feature-limits",
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: Bell,
          permission: "notifications",
          path: "/notifications",
        },
        {
          id: "emails",
          label: "Emails",
          icon: Mail,
          permission: "emails",
          path: "/emails",
        },
        {
          id: "system-health",
          label: "System Health",
          icon: Activity,
          permission: "system-health",
          path: "/system-health",
        },
        {
          id: "audit-log",
          label: "Audit Log",
          icon: ListChecks,
          permission: "audit-log",
          path: "/audit-log",
        },
        {
          id: "roles",
          label: "Admin Roles",
          icon: Users,
          permission: "roles",
          path: "/roles",
        },
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
          permission: "settings",
          path: "/settings",
        },
      ],
    },
  ];

  const filteredMenuSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.permission === "all" ||
          hasPermission(item.permission) ||
          hasPermission("all")
      ),
    }))
    .filter((section) => section.items.length > 0);

  useEffect(() => {
    if (!sidebarOpen) return;
    const activeSection = filteredMenuSections.find((section) =>
      section.items.some((item) => item.path === location.pathname)
    );
    if (activeSection && !expandedSections[activeSection.id]) {
      setExpandedSections((prev) => ({
        ...prev,
        [activeSection.id]: true,
      }));
    }
  }, [location.pathname, sidebarOpen]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const allCollapsed =
    filteredMenuSections.length > 0 &&
    filteredMenuSections.every(
      (section) => !expandedSections[section.id]
    );

  const toggleAllSections = () => {
    const nextValue = allCollapsed;
    const nextState = filteredMenuSections.reduce((acc, section) => {
      acc[section.id] = nextValue;
      return acc;
    }, {});
    setExpandedSections((prev) => ({ ...prev, ...nextState }));
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`tak-sidebar fixed left-0 top-0 h-full transition-all duration-300 z-40 flex flex-col ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        } ${
          sidebarOpen
            ? "translate-x-0"
            : "opacity-0 -translate-x-full lg:translate-x-0 lg:opacity-100 "
        }`}
      >
        <div className="flex items-center justify-between p-5">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/90 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-sm">
                <img
                  src={logoImage}
                  className="w-6 h-6"
                  alt="Tak Business Logo"
                />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Tak Business
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-lg transition lg:block"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-black dark:text-white" />
            ) : (
              <Menu className="w-5 h-5 text-black dark:text-white" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4" ref={navScrollRef}>
          <nav className="space-y-4" ref={navRef}>
            {sidebarOpen && (
              <div className="px-3 pt-2">
                <button
                  type="button"
                  onClick={toggleAllSections}
                  className="w-full flex items-center justify-between rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400 hover:border-gray-300/70 dark:hover:border-white/20 transition"
                >
                  <span>{allCollapsed ? "Expand all" : "Collapse all"}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      allCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>
              </div>
            )}
            {filteredMenuSections.map((section) => (
              <div key={section.id} className="space-y-1">
                {sidebarOpen && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 pt-4 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400"
                    aria-expanded={expandedSections[section.id]}
                  >
                    <span>{section.label}</span>
                    <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] text-gray-400 dark:text-gray-500">
                      <span>{section.items.length}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          expandedSections[section.id] ? "" : "-rotate-90"
                        }`}
                      />
                    </span>
                  </button>
                )}
                {(sidebarOpen ? expandedSections[section.id] : true) &&
                  section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      data-path={item.path}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-2xl transition-all ${
                        location.pathname === item.path
                          ? "bg-gradient-to-r from-[#CD192F] to-[#D74759] text-white shadow-lg"
                          : "text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </button>
                  ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="px-3 pb-4">
          <button
            onClick={() => {
              setCurrentUser(null);
              navigate("/login");
            }}
            className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 dark:text-red-400 hover:bg-white/70 dark:hover:bg-white/10 rounded-2xl transition"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
