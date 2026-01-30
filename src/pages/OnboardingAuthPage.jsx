import { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { AUTH_REQUESTS, ACCOUNT_REQUESTS } from "../data/mockData";

const OnboardingAuthPage = () => {
  const { users, setUsers } = useAppContext();
  const [authRequests, setAuthRequests] = useState(AUTH_REQUESTS);
  const [accountRequests, setAccountRequests] = useState(ACCOUNT_REQUESTS);

  const onboardingData = useMemo(() => {
    const stages = ["Invited", "Registered", "Verified", "Setup", "Live"];
    return stages.map((stage) => ({
      stage,
      count: users.filter((user) => (user.onboardingStage ?? "Invited") === stage)
        .length,
    }));
  }, [users]);

  const invited =
    onboardingData.find((stage) => stage.stage === "Invited")?.count ?? 0;
  const verified =
    onboardingData.find((stage) => stage.stage === "Verified")?.count ?? 0;
  const conversionRate =
    invited === 0 ? 0 : Math.round((verified / invited) * 100);

  const passwordResets = authRequests.filter(
    (request) => request.type === "Password Reset"
  ).length;
  const deletionRequests = accountRequests.filter(
    (request) => request.request === "Account Deletion"
  ).length;

  const pendingVerifications = useMemo(
    () =>
      users.filter(
        (user) => !user.emailVerified || !user.phoneVerified
      ),
    [users]
  );

  const updateUserVerification = (userId, field) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const nextUser = { ...user, [field]: true };
        if (nextUser.emailVerified && nextUser.phoneVerified) {
          nextUser.onboardingStage =
            nextUser.onboardingStage === "Live"
              ? "Live"
              : "Verified";
        }
        return nextUser;
      })
    );
  };

  const markAuthRequest = (id, status) => {
    setAuthRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const markAccountRequest = (id, status) => {
    setAccountRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Onboarding & Authentication
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Monitor registration flow, OTP activity, and account requests
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Onboarding Invites
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {invited}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Verified Accounts
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {verified}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Conversion Rate
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {conversionRate}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Password Resets
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {passwordResets}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Onboarding Funnel
          </h2>
          <div className="space-y-3">
            {onboardingData.map((stage) => (
              <div
                key={stage.stage}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stage.stage}
                </p>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Conversion rate based on invited vs verified accounts.
          </p>
        </div>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Authentication Requests
                </h2>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                  {authRequests.length} active
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="tak-table w-full min-w-[640px]">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Request
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Channel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {authRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      {request.user}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {request.type}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {request.channel}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === "Completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="tak-actions">
                        {request.status !== "Completed" ? (
                          <button
                            onClick={() =>
                              markAuthRequest(request.id, "Completed")
                            }
                            className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Done
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {request.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Account Requests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {deletionRequests} deletion request
              {deletionRequests !== 1 ? "s" : ""} pending
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {ACCOUNT_REQUESTS.length} total
          </span>
        </div>
        <div className="space-y-3">
          {accountRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {request.request}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {request.user} . {request.submitted}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === "Resolved"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : request.status === "Review"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {request.status}
                </span>
                {request.status !== "Resolved" && (
                  <button
                    onClick={() => markAccountRequest(request.id, "Resolved")}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Pending Verifications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Users needing email or phone verification.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            {pendingVerifications.length} pending
          </span>
        </div>
        <div className="space-y-3">
          {pendingVerifications.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user.email} . {user.phoneCountryCode} {user.phoneNumber}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.emailVerified
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  Email {user.emailVerified ? "Verified" : "Pending"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.phoneVerified
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  Phone {user.phoneVerified ? "Verified" : "Pending"}
                </span>
                {!user.emailVerified && (
                  <button
                    onClick={() => updateUserVerification(user.id, "emailVerified")}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    Mark Email Verified
                  </button>
                )}
                {!user.phoneVerified && (
                  <button
                    onClick={() => updateUserVerification(user.id, "phoneVerified")}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    Mark Phone Verified
                  </button>
                )}
              </div>
            </div>
          ))}
          {pendingVerifications.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All users are fully verified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingAuthPage;
