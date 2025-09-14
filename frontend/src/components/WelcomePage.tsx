import {
  Bot,
  LogIn,
  UserPlus,
  Shield,
  Zap,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  authService,
  User,
  LoginCredentials,
  SignupData,
} from "../services/authService";

interface WelcomePageProps {
  onLogin: (user: User) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as const,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: loginForm.email,
        password: loginForm.password,
      };

      const response = await authService.login(credentials);
      setSuccess("Login successful! Redirecting to QualityBot...");

      setTimeout(() => {
        onLogin(response.user);
      }, 1500);
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (signupForm.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      setIsLoading(false);
      return;
    }

    try {
      const userData: SignupData = {
        name: signupForm.name.trim(),
        email: signupForm.email.toLowerCase().trim(),
        password: signupForm.password,
        role: signupForm.role,
      };

      await authService.signup(userData);
      setSuccess(
        "Account created successfully! Please login with your credentials."
      );

      setTimeout(() => {
        handleCloseSignup();
        setShowLogin(true);
        setLoginForm({
          email: userData.email,
          password: "",
        });
      }, 1500);
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: "guest",
      name: "Guest User",
      email: "guest@qualitybot.com",
      role: "guest",
    };
    onLogin(guestUser);
  };

  const clearForms = () => {
    setLoginForm({ email: "", password: "" });
    setSignupForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
    });
    setError("");
    setSuccess("");
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    clearForms();
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
    clearForms();
  };

  const handleShowSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    clearForms();
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    clearForms();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Simple Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-full sm:max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg">
                <Bot className="text-white" size={32} sm:size={48} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">
              QualityBot
            </h1>
            <p className="text-base sm:text-xl text-purple-300 mb-4 sm:mb-8">
              AI-Powered Quality Management Assistant
            </p>
            <p className="text-sm sm:text-base text-gray-400 max-w-full sm:max-w-2xl mx-auto px-4">
              Transform your quality management with intelligent tools,
              real-time analytics, and expert guidance. Designed for engineers,
              students, and MSME owners.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="p-2 sm:p-3 bg-purple-500/20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="text-purple-400" size={20} sm:size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-1 sm:mb-2">
                Smart AI Assistant
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Get instant quality problem-solving guidance with our
                intelligent chatbot
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="p-2 sm:p-3 bg-blue-500/20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="text-blue-400" size={20} sm:size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-1 sm:mb-2">
                Quality Tools
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Access 10+ proven quality management tools and methodologies
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="p-2 sm:p-3 bg-green-500/20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="text-green-400" size={20} sm:size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-green-300 mb-1 sm:mb-2">
                Role-Based Access
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Tailored experience for students, engineers, and MSME owners
              </p>
            </div>
          </div>

          {/* Authentication Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <button
              onClick={handleShowLogin}
              className="flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full justify-center sm:w-auto"
            >
              <LogIn size={18} sm:size={20} />
              Login
            </button>

            <button
              onClick={handleShowSignup}
              className="flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full justify-center sm:w-auto"
            >
              <UserPlus size={18} sm:size={20} />
              Sign Up
            </button>

            <button
              onClick={handleGuestLogin}
              className="flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full justify-center sm:w-auto"
            >
              <Shield size={18} sm:size={20} />
              Try as Guest
            </button>
          </div>

          {/* Info */}
          <div className="text-center px-4">
            <p className="text-gray-400 text-xs sm:text-sm">
              Create an account to save your conversations and access all
              features
            </p>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-4 sm:p-8 w-full max-w-full sm:max-w-md mx-auto my-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center gap-2">
                <LogIn size={20} sm:size={24} />
                Login to QualityBot
              </h2>
              <button
                onClick={handleCloseLogin}
                className="text-gray-400 hover:text-white text-lg sm:text-xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-base sm:text-lg"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs sm:text-sm">
                Don't have an account?{" "}
                <button
                  onClick={handleShowSignup}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-slate-800 border border-blue-500/30 rounded-xl p-4 sm:p-8 w-full max-w-full sm:max-w-md mx-auto my-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-300 flex items-center gap-2">
                <UserPlus size={20} sm:size={24} />
                Join QualityBot
              </h2>
              <button
                onClick={handleCloseSignup}
                className="text-gray-400 hover:text-white text-lg sm:text-xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={signupForm.role}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      role: e.target.value as any,
                    })
                  }
                  className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                  aria-label="Select your role"
                >
                  <option value="student">Student</option>
                  <option value="engineer">Engineer</option>
                  <option value="msme">MSME Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                  className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 text-base sm:text-lg"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs sm:text-sm">
                Already have an account?{" "}
                <button
                  onClick={handleShowLogin}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
