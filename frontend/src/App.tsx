import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Wrench,
  BookOpen,
  Calculator,
  Upload,
  Zap,
  Users,
  Eye,
  EyeOff,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { ConversationManager } from "./components/ConversationManager";
import { QualityMetrics } from "./components/QualityMetrics";
import { WelcomePage } from "./components/WelcomePage";
import { StudentDashboard } from "./components/StudentDashboard";
import { EngineerDashboard } from "./components/EngineerDashboard";
import { EngineerChatbot } from "./components/EngineerChatbot";
import { MSMEDashboard } from "./components/MSMEDashboard";
import { authService, User as AuthUser } from "./services/authService";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  tools?: string[];
  examples?: string[];
}

interface User {
  id: string;
  name: string;
  role:
    | "student"
    | "engineer"
    | "msme"
    | "guest"
    | "student-chatbot"
    | "engineer-chatbot"
    | "msme-chatbot";
  email?: string;
}

const QUALITY_TOOLS = [
  "Fishbone Diagram (Ishikawa)",
  "Pareto Chart",
  "5 Whys Analysis",
  "Process Capability (Cp/Cpk)",
  "Control Charts (SPC)",
  "FMEA (Failure Mode Analysis)",
  "Root Cause Analysis",
  "PDCA Cycle",
  "Six Sigma DMAIC",
  "Statistical Process Control",
];

const USE_CASES = [
  "Packaging defects in manufacturing",
  "Customer complaints about product quality",
  "High rework rates in production",
  "Inconsistent product dimensions",
  "Supplier quality issues",
  "Process variation problems",
  "Equipment breakdowns",
  "Safety incidents",
  "Cost overruns",
  "Delivery delays",
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm QualityBot, your AI assistant for quality management. I can help you solve quality-related problems using proven tools and methodologies. What quality issue are you facing today?",
      timestamp: new Date(),
      tools: ["Fishbone Diagram", "5 Whys Analysis", "Pareto Chart"],
    },
  ]);
  const [inputText, setInputText] = useState("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showQualityMetrics, setShowQualityMetrics] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi">("en");
  const [isLoading, setIsLoading] = useState(true);

  // Calculator state
  const [measurementData, setMeasurementData] = useState("");
  const [usl, setUsl] = useState("");
  const [lsl, setLsl] = useState("");
  const [calculatorResults, setCalculatorResults] = useState<{
    mean: number;
    stdDev: number;
    cp: number;
    cpk: number;
  } | null>(null);

  // Login/Signup state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupRole, setSignupRole] = useState<User["role"]>("student");
  const [signupPassword, setSignupPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check for existing authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.verifyToken();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear any invalid stored data
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Call real AI backend
      const API_BASE_URL = import.meta.env.VITE_API_URL; 

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          user_role: currentUser?.role || "general",
          language: currentLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("AI service error");
      }

      const aiResponse = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: aiResponse.response,
        timestamp: new Date(),
        tools: ["Cp/Cpk Calculator", "Pareto Chart", "Fishbone Diagram"],
        examples: ["Process improvement", "Quality analysis"],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling AI service:", error);

      // Show error message to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `❌ Sorry, I encountered an error while processing your request. Please try again or check your connection.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToolClick = (tool: string) => {
    const toolMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Tell me more about ${tool}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, toolMessage]);
    handleSendMessage(`Tell me more about ${tool}`);
  };

  const handleExampleClick = (example: string) => {
    const exampleMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Show me an example of ${example}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, exampleMessage]);
    handleSendMessage(`Show me an example of ${example}`);
  };

  const handleLoadConversation = (conversationMessages: Message[]) => {
    setMessages(conversationMessages);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setMessages([
      {
        id: "1",
        type: "bot",
        content:
          "Hello! I'm QualityBot, your AI assistant for quality management. I can help you solve quality-related problems using proven tools and methodologies. What quality issue are you facing today?",
        timestamp: new Date(),
        tools: ["Fishbone Diagram", "5 Whys Analysis", "Pareto Chart"],
      },
    ]);
  };

  const handleLanguageChange = (lang: "en" | "hi") => {
    setCurrentLanguage(lang);
  };

  const calculateCpCpk = () => {
    if (!measurementData.trim() || !usl || !lsl) return;

    try {
      const data = measurementData
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      if (data.length === 0) return;

      const mean = data.reduce((sum, val) => sum + val, 0) / data.length;

      // Calculate standard deviation with proper handling for single values
      let stdDev = 0;
      if (data.length > 1) {
        const variance =
          data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
          (data.length - 1);
        stdDev = Math.sqrt(variance);
      }

      const uslNum = parseFloat(usl);
      const lslNum = parseFloat(lsl);

      // Handle edge cases for Cp and Cpk calculations
      let cp = 0;
      let cpk = 0;

      if (stdDev > 0) {
        cp = (uslNum - lslNum) / (6 * stdDev);
        const cpu = (uslNum - mean) / (3 * stdDev);
        const cpl = (mean - lslNum) / (3 * stdDev);
        cpk = Math.min(cpu, cpl);
      } else {
        // For single value or zero standard deviation
        if (mean >= lslNum && mean <= uslNum) {
          cp = Infinity; // Process is perfectly centered
          cpk = Infinity; // Process is perfectly capable
        } else {
          cp = 0; // Process is outside specifications
          cpk = 0; // Process is not capable
        }
      }

      setCalculatorResults({ mean, stdDev, cp, cpk });
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleLoginSubmit = async () => {
    setAuthError(null);
    try {
      const user = await authService.login(loginEmail, loginPassword);
      handleLogin(user);
      setShowLogin(false);
    } catch (error: any) {
      setAuthError(error.message || "Login failed. Please check credentials.");
    }
  };

  const handleSignupSubmit = async () => {
    setAuthError(null);
    try {
      const user = await authService.signup(
        signupName,
        signupEmail,
        signupRole,
        signupPassword
      );
      handleLogin(user);
      setShowSignup(false);
    } catch (error: any) {
      setAuthError(error.message || "Signup failed. Please try again.");
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading QualityBot...</p>
        </div>
      </div>
    );
  }

  // Show welcome page if not authenticated
  if (!isAuthenticated) {
    return <WelcomePage onLogin={handleLogin} />;
  }

  // Show engineer dashboard for engineer users
  if (currentUser?.role === "engineer") {
    return (
      <EngineerDashboard
        currentUser={currentUser}
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
        onLogout={handleLogout}
        onAccessChatbot={() => {
          // Switch to regular chatbot view for engineers
          setCurrentUser({ ...currentUser, role: "engineer-chatbot" });
        }}
      />
    );
  }

  // Show student dashboard for student users
  if (currentUser?.role === "student") {
    return (
      <StudentDashboard
        currentUser={currentUser}
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
        onLogout={handleLogout}
        onAccessChatbot={() => {
          // Switch to regular chatbot view for students
          setCurrentUser({ ...currentUser, role: "student-chatbot" });
        }}
      />
    );
  }

  // Show engineer chatbot for engineers who want to access it
  if (currentUser?.role === "engineer-chatbot") {
    return (
      <EngineerChatbot
        currentUser={currentUser}
        onBack={() => {
          setCurrentUser({ ...currentUser, role: "engineer" });
        }}
      />
    );
  }

  // Show MSME dashboard for MSME owners
  if (currentUser?.role === "msme") {
    return (
      <MSMEDashboard
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onAccessChatbot={() =>
          setCurrentUser({ ...currentUser, role: "msme-chatbot" })
        }
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
    );
  }

  // Show regular chatbot for students who want to access it
  if (currentUser?.role === "student-chatbot") {
    // Continue to the regular chatbot interface
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-2 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  QualityBot
                </h1>
                <p className="text-xxs sm:text-xs text-purple-300">
                  AI Assistant for Quality Management
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto mt-3 sm:mt-0">
              <ConversationManager
                messages={messages}
                onLoadConversation={handleLoadConversation}
              />
              {currentUser ? (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 w-full justify-center sm:w-auto">
                    <Users size={16} className="text-purple-300" />
                    <span className="text-sm text-purple-300">
                      {currentUser.role}
                    </span>
                  </div>
                  {currentUser.role === "student-chatbot" && (
                    <button
                      onClick={() =>
                        setCurrentUser({ ...currentUser, role: "student" })
                      }
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-200 border border-green-500/30 w-full justify-center sm:w-auto"
                    >
                      <ArrowLeft size={16} />
                      {currentLanguage === "en"
                        ? "Back to Dashboard"
                        : "डैशबोर्ड पर वापस जाएं"}
                    </button>
                  )}
                  {currentUser.role === "msme-chatbot" && (
                    <button
                      onClick={() =>
                        setCurrentUser({ ...currentUser, role: "msme" })
                      }
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-200 border border-green-500/30 w-full justify-center sm:w-auto"
                    >
                      <ArrowLeft size={16} />
                      {currentLanguage === "en"
                        ? "Back to Dashboard"
                        : "डैशबोर्ड पर वापस जाएं"}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200 border border-red-500/30 w-full justify-center sm:w-auto"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all duration-200 border border-purple-500/30 w-full justify-center sm:w-auto"
                  >
                    <LogIn size={16} />
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-200 border border-blue-500/30 w-full justify-center sm:w-auto"
                  >
                    <UserPlus size={16} />
                    Signup
                  </button>
                  <button
                    onClick={() => {
                      setShowSignup(true);
                      // Pre-select MSME role
                      const msmeUser: User = {
                        id: "msme-" + Date.now(),
                        name: "MSME Owner",
                        role: "msme",
                        email: "msme@example.com",
                      };
                      setCurrentUser(msmeUser);
                      setIsAuthenticated(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-200 border border-green-500/30 w-full justify-center sm:w-auto"
                  >
                    <UserPlus size={16} />
                    MSME Owner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Tools */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Wrench size={20} />
                Quality Tools
              </h3>
              <div className="space-y-2">
                {QUALITY_TOOLS.slice(0, 5).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleToolClick(tool)}
                    className="w-full text-left p-2 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all duration-200"
                    disabled={isTyping} // Disable during AI response
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-green-500/30 p-4">
              <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                <Zap size={20} />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="w-full flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                  disabled={isTyping} // Disable during AI response
                >
                  <Calculator size={16} />
                  Cp/Cpk Calculator
                </button>
                <button
                  className="w-full flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                  disabled={isTyping} // Disable during AI response
                >
                  <Upload size={16} />
                  Upload Documents
                </button>
                <button
                  onClick={() => setShowQualityMetrics(true)}
                  className="w-full flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                  disabled={isTyping} // Disable during AI response
                >
                  <Zap size={16} />
                  Quality Metrics
                </button>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 h-[calc(100vh-180px)] sm:h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.type === "user"
                          ? "bg-purple-500/20 border-purple-500/30"
                          : "bg-blue-500/20 border-blue-500/30"
                      } border rounded-xl p-4 backdrop-blur-sm`}
                    >
                      <div className="flex items-start gap-3">
                        {message.type === "bot" && (
                          <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                            <Bot size={16} className="text-white" />
                          </div>
                        )}
                        {message.type === "user" && (
                          <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                            <User size={16} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-gray-200 whitespace-pre-wrap">
                            {message.content}
                          </p>
                          {message.tools && message.tools.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-purple-300 mb-2">
                                Suggested Tools:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {message.tools.map((tool) => (
                                  <button
                                    key={tool}
                                    onClick={() => handleToolClick(tool)}
                                    className="px-2 py-1 text-xs bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 rounded border border-purple-500/50 transition-all duration-200"
                                    disabled={isTyping} // Disable during AI response
                                  >
                                    {tool}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {message.examples && message.examples.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-blue-300 mb-2">
                                Related Examples:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {message.examples.map((example) => (
                                  <button
                                    key={example}
                                    onClick={() => handleExampleClick(example)}
                                    className="px-2 py-1 text-xs bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 rounded border border-blue-500/50 transition-all duration-200"
                                    disabled={isTyping} // Disable during AI response
                                  >
                                    {example}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                          <Bot size={16} className="text-white" />
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-purple-500/30 p-4">
                <div className="flex flex-wrap items-end justify-center gap-3">
                  <div className="flex-1 relative w-full sm:w-auto">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your quality issue or ask a question..."
                      className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm min-h-[60px] max-h-[120px]"
                      rows={2}
                      disabled={isTyping} // Disable during AI response
                    />
                  </div>
                  <div className="flex gap-2 w-full justify-center sm:w-auto">
                    <button
                      onClick={() => setShowCalculator(true)}
                      className="p-3 bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 rounded-lg transition-all duration-200"
                      title="Cp/Cpk Calculator"
                      disabled={isTyping} // Disable during AI response
                    >
                      <Calculator size={20} />
                    </button>
                    <button
                      onClick={() => setShowQualityMetrics(true)}
                      className="p-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-all duration-200"
                      title="Quality Metrics"
                      disabled={isTyping} // Disable during AI response
                    >
                      <TrendingUp size={20} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send Message"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cp/Cpk Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-slate-800 border border-green-500/30 rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-2xl mx-auto my-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-green-300 flex items-center gap-2">
                <Calculator size={20} sm:size={24} />
                Cp/Cpk Calculator
              </h2>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-gray-400 hover:text-white text-lg sm:text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter measurement data (comma-separated):
                </label>
                <textarea
                  value={measurementData}
                  onChange={(e) => setMeasurementData(e.target.value)}
                  placeholder="10.2, 10.1, 10.3, 10.0, 10.2, 10.1, 10.4, 10.2, 10.1, 10.3"
                  className="w-full p-3 bg-black/30 border border-green-500/30 rounded-lg text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                  rows={3}
                  disabled={isTyping} // Disable during AI response
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upper Specification Limit (USL):
                  </label>
                  <input
                    type="number"
                    value={usl}
                    onChange={(e) => setUsl(e.target.value)}
                    placeholder="10.5"
                    className="w-full p-3 bg-black/30 border border-green-500/30 rounded-lg text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                    disabled={isTyping} // Disable during AI response
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Lower Specification Limit (LSL):
                  </label>
                  <input
                    type="number"
                    value={lsl}
                    onChange={(e) => setLsl(e.target.value)}
                    placeholder="9.5"
                    className="w-full p-3 bg-black/30 border border-green-500/30 rounded-lg text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                    disabled={isTyping} // Disable during AI response
                  />
                </div>
              </div>

              <button
                onClick={calculateCpCpk}
                disabled={!measurementData.trim() || !usl || !lsl || isTyping}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-medium text-base sm:text-lg"
              >
                Calculate Cp/Cpk
              </button>

              {calculatorResults && (
                <div className="bg-black/30 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">
                    Results:
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-400">Mean:</p>
                      <p className="text-white font-mono">
                        {calculatorResults.mean.toFixed(3)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Std Dev:</p>
                      <p className="text-white font-mono">
                        {calculatorResults.stdDev.toFixed(3)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cp:</p>
                      <p className="text-white font-mono">
                        {isFinite(calculatorResults.cp)
                          ? calculatorResults.cp.toFixed(3)
                          : "∞"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Cpk:</p>
                      <p className="text-white font-mono">
                        {isFinite(calculatorResults.cpk)
                          ? calculatorResults.cpk.toFixed(3)
                          : "∞"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded">
                    <p className="text-xs sm:text-sm text-green-300">
                      {!isFinite(calculatorResults.cpk)
                        ? "✅ Process is perfectly capable (single value within specs)"
                        : calculatorResults.cpk >= 1.33
                        ? "✅ Process is capable"
                        : calculatorResults.cpk >= 1.0
                        ? "⚠️ Process needs improvement"
                        : "❌ Process is not capable"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-md mx-auto my-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              Login to QualityBot
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-400 pr-10 text-sm sm:text-base"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLoginSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium text-base sm:text-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className="flex-1 bg-gray-600 text-gray-200 py-3 rounded-lg font-medium text-base sm:text-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-slate-800 border border-blue-500/30 rounded-xl p-4 sm:p-6 w-full max-w-full sm:max-w-md mx-auto my-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-300 mb-4">
              Join QualityBot
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <select
                className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 text-sm sm:text-base"
                title="Select your role"
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value as User["role"])}
              >
                <option value="student">Student</option>
                <option value="engineer">Engineer</option>
                <option value="msme">MSME Owner</option>
              </select>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg-black/30 border border-blue-500/30 rounded-lg text-gray-200 placeholder-gray-400 pr-10 text-sm sm:text-base"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  title={showSignupPassword ? "Hide password" : "Show password"}
                >
                  {showSignupPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSignupSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium text-base sm:text-lg"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowSignup(false)}
                  className="flex-1 bg-gray-600 text-gray-200 py-3 rounded-lg font-medium text-base sm:text-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality Metrics Modal */}
      <QualityMetrics
        isOpen={showQualityMetrics}
        onClose={() => setShowQualityMetrics(false)}
      />
    </div>
  );
}

export default App;
