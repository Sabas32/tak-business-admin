import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";
import Select from "../components/Select";
import Toast from "../components/Toast";

const formatTimestamp = (date) =>
  date.toISOString().slice(0, 16).replace("T", " ");

const RefundsPage = () => {
  const {
    refundRequests,
    setRefundRequests,
    setNotifications,
    transactions,
    setTransactions,
    currentUser,
  } = useAppContext();
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [activeRequest, setActiveRequest] = useState(null);
  const [decisionState, setDecisionState] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  const reasonOptions = useMemo(() => {
    const reasons = new Set(refundRequests.map((req) => req.reason));
    return [
      { value: "all", label: "All Reasons" },
      ...Array.from(reasons).map((reason) => ({
        value: reason,
        label: reason,
      })),
    ];
  }, [refundRequests]);

  const filteredRequests = refundRequests.filter((request) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      request.business.toLowerCase().includes(searchValue) ||
      request.id.toLowerCase().includes(searchValue) ||
      String(request.transactionId).includes(searchValue);
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesReason =
      reasonFilter === "all" || request.reason === reasonFilter;
    return matchesSearch && matchesStatus && matchesReason;
  });

  const totalRequests = refundRequests.length;
  const pendingCount = refundRequests.filter(
    (request) => request.status === "Pending"
  ).length;
  const approvedAmount = refundRequests
    .filter((request) => request.status === "Approved")
    .reduce((sum, request) => sum + request.amount, 0);
  const declinedCount = refundRequests.filter(
    (request) => request.status === "Declined"
  ).length;

  const pendingRequests = refundRequests.filter(
    (request) => request.status === "Pending"
  );

  const handleDecision = (requestId, decision) => {
    const targetRequest = refundRequests.find((req) => req.id === requestId);
    if (!targetRequest) return;

    const resolvedAt = formatTimestamp(new Date());
    setRefundRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: decision,
              resolvedAt,
              resolvedBy: currentUser?.username ?? "admin",
              communication: "Email sent",
            }
          : req
      )
    );
    setActiveRequest((prev) =>
      prev && prev.id === requestId
        ? {
            ...prev,
            status: decision,
            resolvedAt,
            resolvedBy: currentUser?.username ?? "admin",
            communication: "Email sent",
          }
        : prev
    );

    if (decision === "Approved") {
      setTransactions(
        transactions.map((txn) =>
          txn.id === targetRequest.transactionId
            ? { ...txn, status: "Refunded" }
            : txn
        )
      );
    }

    setNotifications((prev) => {
      const nextId = prev.length
        ? Math.max(...prev.map((notif) => notif.id)) + 1
        : 1;
      return [
        {
          id: nextId,
          title: `Refund ${decision.toLowerCase()}`,
          message: `${
            targetRequest.business
          } refund ${decision.toLowerCase()} for UGX ${targetRequest.amount.toLocaleString()}`,
          time: "Just now",
          read: false,
        },
        ...prev,
      ];
    });

    setToast({
      message: `Refund request ${decision.toLowerCase()} successfully.`,
      type: "success",
    });
  };

  const decisionRequest = decisionState
    ? refundRequests.find((request) => request.id === decisionState.requestId)
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Refunds
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Review subscription refund requests and communicate outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total Requests
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalRequests}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Approved Volume
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            UGX {approvedAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Declined</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {declinedCount}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="tak-search flex-1">
                <Search className="w-5 h-5 tak-search-icon" />
                <input
                  type="text"
                  placeholder="Search by business or request ID..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="tak-search-input"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "Pending", label: "Pending" },
                    { value: "Approved", label: "Approved" },
                    { value: "Declined", label: "Declined" },
                  ]}
                  className="w-36"
                />
                <Select
                  value={reasonFilter}
                  onChange={setReasonFilter}
                  options={reasonOptions}
                  className="w-44"
                />
                <button
                  type="button"
                  onClick={() => setShowInsights(true)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:border-gray-300/70 dark:hover:border-white/20 transition"
                >
                  View Insights
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="tak-table w-full min-w-[720px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Request
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Business
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Requested
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-mono">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {request.business}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                    UGX {request.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {request.requestedAt}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "Approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : request.status === "Declined"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="tak-actions">
                      <button
                        onClick={() => setActiveRequest(request)}
                        className="px-3 py-1 text-sm bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white dark:hover:bg-white/20 transition"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        title="Refund Insights"
      >
        <div className="bg-white/80 dark:bg-gray-900/60 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Pending Queue
          </h3>
          <div className="space-y-3">
            {pendingRequests.slice(0, 8).map((request) => (
              <div
                key={request.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {request.business}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {request.plan} . {request.reason}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
                  UGX {request.amount.toLocaleString()}
                </p>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No pending refund requests.
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(activeRequest)}
        onClose={() => setActiveRequest(null)}
        title="Refund Request Review"
      >
        {activeRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Request ID
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeRequest.id}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeRequest.status}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Business
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeRequest.business}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Plan
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeRequest.plan}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Amount
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  UGX {activeRequest.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Transaction
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  #{activeRequest.transactionId}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Requested By
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeRequest.requestedBy}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Requested At
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeRequest.requestedAt}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Customer Reason
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                {activeRequest.reason}
              </p>
            </div>

            {activeRequest.resolvedAt && (
              <div className="rounded-xl border border-gray-200/70 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Resolution
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                  {activeRequest.status} by {activeRequest.resolvedBy} on{" "}
                  {activeRequest.resolvedAt}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {activeRequest.communication ?? "Notification queued"}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveRequest(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
              {activeRequest.status === "Pending" && (
                <>
                  <button
                    onClick={() =>
                      setDecisionState({
                        requestId: activeRequest.id,
                        decision: "Declined",
                      })
                    }
                    className="px-4 py-2 border border-red-500/40 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() =>
                      setDecisionState({
                        requestId: activeRequest.id,
                        decision: "Approved",
                      })
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:shadow-lg transition"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(decisionState)}
        title={
          decisionState
            ? `${decisionState.decision} refund request?`
            : "Confirm refund action"
        }
        message={
          decisionRequest
            ? `${decisionState.decision} the refund request from ${decisionRequest.business} for UGX ${decisionRequest.amount.toLocaleString()}?`
            : "Confirm this refund action."
        }
        confirmLabel={decisionState?.decision ?? "Confirm"}
        tone={decisionState?.decision === "Approved" ? "success" : "danger"}
        onConfirm={() => {
          if (!decisionState) return;
          handleDecision(decisionState.requestId, decisionState.decision);
          setDecisionState(null);
        }}
        onClose={() => setDecisionState(null)}
      />
    </div>
  );
};

export default RefundsPage;
