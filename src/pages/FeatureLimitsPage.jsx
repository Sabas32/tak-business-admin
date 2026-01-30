import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { FEATURE_LIMITS } from "../data/mockData";

const FeatureLimitsPage = () => {
  const { businesses } = useAppContext();

  const limitMap = useMemo(() => {
    return FEATURE_LIMITS.reduce((acc, feature) => {
      acc[feature.feature] = {
        Basic: feature.basic,
        Premium: feature.premium,
        Enterprise: feature.enterprise,
      };
      return acc;
    }, {});
  }, []);

  const parseLimit = (value) => {
    if (!value) return null;
    if (value.toLowerCase() === "unlimited") return Number.POSITIVE_INFINITY;
    const numeric = parseInt(value.replace(/,/g, ""), 10);
    return Number.isNaN(numeric) ? null : numeric;
  };

  const usageRows = businesses.map((business) => {
    const attendantsLimit = parseLimit(limitMap["Attendants"]?.[business.plan]);
    const productsLimit = parseLimit(limitMap["Products"]?.[business.plan]);
    return {
      id: business.id,
      name: business.name,
      plan: business.plan,
      attendants: business.attendantsCount ?? 0,
      attendantsLimit,
      products: business.productsCount ?? 0,
      productsLimit,
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Feature Limits
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Compare plan entitlements across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">Basic Plan</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Entry level coverage
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Best for new businesses
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Premium Plan
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Growth focused
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Most popular for scaling
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Enterprise Plan
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Unlimited access
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Custom SLAs and support
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tak-table w-full min-w-[640px]">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Feature
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Basic
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Premium
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {FEATURE_LIMITS.map((limit) => (
              <tr
                key={limit.feature}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                  {limit.feature}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {limit.basic}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {limit.premium}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {limit.enterprise}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Plan Usage Monitor
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track business usage against plan limits.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="tak-table w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Business
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Attendants
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Products
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {usageRows.map((row) => {
                const attendantsExceeded =
                  row.attendantsLimit !== null &&
                  row.attendants > row.attendantsLimit;
                const productsExceeded =
                  row.productsLimit !== null && row.products > row.productsLimit;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {row.plan}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          attendantsExceeded
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {row.attendants} /{" "}
                        {row.attendantsLimit === Number.POSITIVE_INFINITY
                          ? "Unlimited"
                          : row.attendantsLimit ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          productsExceeded
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {row.products.toLocaleString()} /{" "}
                        {row.productsLimit === Number.POSITIVE_INFINITY
                          ? "Unlimited"
                          : row.productsLimit?.toLocaleString() ?? "N/A"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default FeatureLimitsPage;
