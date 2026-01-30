const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white dark:bg-gray-800 tak-card rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        {trend && (
          <span
            className={`text-xs sm:text-sm font-semibold ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">
        {title}
      </h3>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default StatCard;

