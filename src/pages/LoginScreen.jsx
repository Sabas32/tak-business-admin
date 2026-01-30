import { useState } from "react";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import logoImage from "../assets/TakBusinessLogo.svg";
import { useAppContext } from "../context/AppContext";
import { TEST_ADMINS } from "../data/mockData";

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { isDark, toggleDarkMode } = useAppContext();

  const handleLogin = (e) => {
    e.preventDefault();
    const admin = TEST_ADMINS.find(
      (a) => a.username === username && a.password === password
    );
    if (admin) {
      onLogin(admin);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark
          ? "bg-gray-950"
          : "bg-gradient-to-br from-[#FAE8EA] via-white to-[#F8F9F9]"
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-3 rounded-xl bg-white dark:bg-gray-800 tak-card shadow-lg"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      <div className="w-full max-w-md px-6">
        <div className="bg-white dark:bg-gray-800 tak-card rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className=" relative w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <img
                src={logoImage}
                className="w-8 h-8"
                alt="Tak Business Logo"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tak Business
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Admin Dashboard</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
                className="border-none outline-none w-full px-4 py-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/30 focus:border-transparent transition shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
                  className="border-none outline-none w-full px-4 py-3 pr-12 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500/30 focus:border-transparent transition shadow-[0_12px_32px_-22px_rgba(15,23,42,0.35)]"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

