import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Toast from "../components/Toast";
import Select from "../components/Select";

const SettingsPage = () => {
  const { isDark, toggleDarkMode } = useAppContext();
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    companyName: "Tak Business",
    email: "admin@takbusiness.com",
    notifications: true,
    emailAlerts: true,
    currency: "UGX",
    timezone: "EAT",
    enforce2fa: true,
    sessionTimeout: "30",
    auditRetention: "90",
  });

  const handleSave = () => {
    setToast({ message: "Settings saved successfully!", type: "success" });
  };

  const SettingToggle = ({ label, description, checked, onToggle }) => (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--tak-border-strong)] bg-white/70 dark:bg-white/5 px-4 py-3">
      <div>
        <h3 className="font-semibold text-[color:var(--tak-text)]">{label}</h3>
        <p className="text-sm text-[color:var(--tak-muted)]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${
          checked
            ? "bg-[color:var(--tak-accent)] border-transparent"
            : "bg-[color:var(--tak-bg-soft)] border-[color:var(--tak-border-strong)]"
        }`}
      >
        <span
          className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <div className="tak-card rounded-2xl p-5 sm:p-6 border border-[color:var(--tak-border)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                  Organization
                </h2>
                <p className="text-xs text-[color:var(--tak-muted)]">
                  Basic details shown across the admin
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      companyName: event.target.value,
                    })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(event) =>
                    setSettings({ ...settings, email: event.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                  Currency
                </label>
                <Select
                  value={settings.currency}
                  onChange={(value) =>
                    setSettings({ ...settings, currency: value })
                  }
                  options={["UGX", "USD", "EUR"]}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                  Timezone
                </label>
                <Select
                  value={settings.timezone}
                  onChange={(value) =>
                    setSettings({ ...settings, timezone: value })
                  }
                  options={["EAT", "UTC", "EST"]}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="tak-card rounded-2xl p-5 sm:p-6 border border-[color:var(--tak-border)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                  Security & Compliance
                </h2>
                <p className="text-xs text-[color:var(--tak-muted)]">
                  Control access, session policy, and audit retention
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Enforce Admin 2FA"
                description="Require two-factor authentication for admin users"
                checked={settings.enforce2fa}
                onToggle={() =>
                  setSettings({
                    ...settings,
                    enforce2fa: !settings.enforce2fa,
                  })
                }
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                    Session Timeout (minutes)
                  </label>
                  <Select
                    value={settings.sessionTimeout}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        sessionTimeout: value,
                      })
                    }
                    options={[
                      { value: "15", label: "15" },
                      { value: "30", label: "30" },
                      { value: "60", label: "60" },
                    ]}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                    Audit Log Retention (days)
                  </label>
                  <Select
                    value={settings.auditRetention}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        auditRetention: value,
                      })
                    }
                    options={[
                      { value: "30", label: "30" },
                      { value: "60", label: "60" },
                      { value: "90", label: "90" },
                      { value: "180", label: "180" },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="tak-card rounded-2xl p-5 sm:p-6 border border-[color:var(--tak-border)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                  Appearance
                </h2>
                <p className="text-xs text-[color:var(--tak-muted)]">
                  Theme and visual preferences
                </p>
              </div>
            </div>
            <SettingToggle
              label="Dark Mode"
              description="Toggle dark mode on or off"
              checked={isDark}
              onToggle={toggleDarkMode}
            />
          </div>

          <div className="tak-card rounded-2xl p-5 sm:p-6 border border-[color:var(--tak-border)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                  Notifications
                </h2>
                <p className="text-xs text-[color:var(--tak-muted)]">
                  Configure delivery channels
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Push Notifications"
                description="Receive push notifications"
                checked={settings.notifications}
                onToggle={() =>
                  setSettings({
                    ...settings,
                    notifications: !settings.notifications,
                  })
                }
              />
              <SettingToggle
                label="Email Alerts"
                description="Receive email notifications"
                checked={settings.emailAlerts}
                onToggle={() =>
                  setSettings({
                    ...settings,
                    emailAlerts: !settings.emailAlerts,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-[color:var(--tak-accent)] hover:bg-[color:var(--tak-accent-light)] transition"
        >
          Save Settings
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SettingsPage;

