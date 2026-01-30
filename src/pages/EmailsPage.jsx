import { useMemo, useState } from "react";
import { Mail, Send, Users, UserCheck, UserCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import Toast from "../components/Toast";
import Select from "../components/Select";

const EmailsPage = () => {
  const { users } = useAppContext();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    preheader: "",
    message: "",
    target: "all",
  });

  const counts = useMemo(() => {
    const active = users.filter((u) => u.status === "Active").length;
    const owners = users.filter((u) => u.role === "Business Owner").length;
    return {
      all: users.length,
      active,
      owners,
    };
  }, [users]);

  const targetOptions = [
    { value: "all", label: `All Users (${counts.all})` },
    { value: "active", label: `Active Users (${counts.active})` },
    { value: "owners", label: `Business Owners (${counts.owners})` },
  ];

  const subjectLength = formData.subject.trim().length;
  const messageLength = formData.message.trim().length;
  const wordCount = formData.message.trim()
    ? formData.message.trim().split(/\s+/).length
    : 0;
  const targetLabel =
    targetOptions.find((option) => option.value === formData.target)?.label ??
    "All Users";
  const previewText =
    formData.message.trim().split("\n").find(Boolean) ??
    "Start typing to preview your message.";
  const canSend = formData.subject.trim() && formData.message.trim();

  const handleSend = () => {
    if (!canSend) {
      setToast({ message: "Add a subject and message first.", type: "error" });
      return;
    }
    setToast({ message: "Email sent successfully!", type: "success" });
    setFormData({ subject: "", preheader: "", message: "", target: "all" });
  };

  return (
    <div className="relative">
      <div className="grid min-h-screen grid-rows-[auto,1fr] gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Email Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Send broadcast emails to your users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[color:var(--tak-muted)]">
                    Selected Audience
                  </p>
                  <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                    {counts[formData.target]}
                  </p>
                  <p className="text-xs text-[color:var(--tak-muted)]">
                    {targetLabel}
                  </p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-bg-soft)] text-[color:var(--tak-text-gray)] flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[color:var(--tak-muted)]">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                    {counts.active}
                  </p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-success-soft)] text-[color:var(--tak-success)] flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[color:var(--tak-muted)]">
                    Business Owners
                  </p>
                  <p className="text-2xl font-bold text-[color:var(--tak-text)]">
                    {counts.owners}
                  </p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-accent-soft)] text-[color:var(--tak-accent)] flex items-center justify-center">
                  <UserCircle2 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-4 sm:gap-6 min-h-0">
          <div className="tak-card rounded-2xl p-5 sm:p-6 border border-[color:var(--tak-border)] h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-2xl bg-[color:var(--tak-accent-soft)] text-[color:var(--tak-accent)] flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[color:var(--tak-text)]">
                  Compose Email
                </h2>
                <p className="text-xs text-[color:var(--tak-muted)]">
                  Write a clear message and target the right audience
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                  Target Audience
                </label>
                <Select
                  value={formData.target}
                  onChange={(value) =>
                    setFormData({ ...formData, target: value })
                  }
                  options={targetOptions}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(event) =>
                      setFormData({ ...formData, subject: event.target.value })
                    }
                    className="w-full"
                    placeholder="Email subject..."
                    required
                  />
                  <p className="mt-1 text-xs text-[color:var(--tak-muted)]">
                    {subjectLength} characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--tak-text)] mb-2">
                    Preview Text
                  </label>
                  <input
                    type="text"
                    value={formData.preheader}
                    onChange={(event) =>
                      setFormData({ ...formData, preheader: event.target.value })
                    }
                    className="w-full"
                    placeholder="Optional preheader shown in inbox"
                  />
                  <p className="mt-1 text-xs text-[color:var(--tak-muted)]">
                    {formData.preheader.trim().length} characters
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[color:var(--tak-text)]">
                    Message
                  </label>
                  <span className="text-xs text-[color:var(--tak-muted)]">
                    {wordCount} words
                  </span>
                </div>
                <textarea
                  value={formData.message}
                  onChange={(event) =>
                    setFormData({ ...formData, message: event.target.value })
                  }
                  rows="10"
                  className="w-full"
                  placeholder="Compose your message..."
                  required
                />
                <p className="mt-2 text-xs text-[color:var(--tak-muted)]">
                  {messageLength} characters. Keep it concise for best delivery.
                </p>
              </div>

              <button
                onClick={handleSend}
                className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-[color:var(--tak-accent)] hover:bg-[color:var(--tak-accent-light)] transition inline-flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Email
              </button>
            </div>
          </div>

          <div className="flex h-full flex-col gap-4">
            <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
              <h3 className="text-base font-semibold text-[color:var(--tak-text)] mb-3">
                Live Preview
              </h3>
              <div className="rounded-2xl border border-[color:var(--tak-border-strong)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--tak-muted)]">
                  {targetLabel}
                </p>
                <p className="mt-2 text-sm font-semibold text-[color:var(--tak-text)]">
                  {formData.subject || "Your subject line"}
                </p>
                <p className="mt-2 text-xs text-[color:var(--tak-muted)]">
                  {formData.preheader || "Preview text will appear here."}
                </p>
                <p className="mt-3 text-sm text-[color:var(--tak-text-gray)]">
                  {previewText}
                </p>
              </div>
            </div>

            <div className="tak-card rounded-2xl p-4 sm:p-5 border border-[color:var(--tak-border)]">
              <h3 className="text-base font-semibold text-[color:var(--tak-text)] mb-3">
                Delivery Summary
              </h3>
              <div className="space-y-3 text-sm text-[color:var(--tak-text-gray)]">
                <div className="flex items-center justify-between">
                  <span>Recipients</span>
                  <span className="font-semibold text-[color:var(--tak-text)]">
                    {counts[formData.target]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audience</span>
                  <span className="font-semibold text-[color:var(--tak-text)]">
                    {targetLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Message length</span>
                  <span className="font-semibold text-[color:var(--tak-text)]">
                    {messageLength} chars
                  </span>
                </div>
                <div className="rounded-xl border border-[color:var(--tak-border-strong)] p-3 text-xs text-[color:var(--tak-muted)]">
                  Tip: Keep subject lines under 60 characters for best open rates.
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default EmailsPage;
