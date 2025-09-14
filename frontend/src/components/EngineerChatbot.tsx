import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  FileText,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";
import { authService } from "../services/authService";
import { User as AppUser } from "../App"; // Import User interface from App.tsx

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const CHAT_HISTORY_KEY = "engineer_chatbot_history";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  tools?: string[];
  examples?: string[];
  actions?: string[];
}

interface EngineerChatbotProps {
  currentUser: AppUser; // Use the imported User interface
  onBack: () => void;
}

export const EngineerChatbot: React.FC<EngineerChatbotProps> = ({
  currentUser,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]); // Initialize with empty array
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load chat history from session storage on mount
    const savedMessages = sessionStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // If no saved messages, add the initial bot welcome message
      setMessages([
        {
          id: "1",
          type: "bot",
          content: `Hello ${currentUser?.name}! I'm your advanced AI quality engineering assistant. I can help you with:

• Advanced root cause analysis
• Statistical process control
• FMEA generation
• Supplier quality management
• Real-time quality monitoring
• Industry-specific solutions

What quality challenge are you facing today?`,
          timestamp: new Date(),
          actions: [
            "Generate Root Cause Report",
            "Show Recommended Action Plan",
            "Create FMEA",
          ],
        },
      ]);
    }
  }, []); // Run only once on mount to load initial history

  useEffect(() => {
    scrollToBottom();
    // Save chat history to session storage whenever messages change
    sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]); // Rerun whenever messages change

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({
          prompt: currentInput,
          user_role: currentUser.role,
          language: "en", // Assuming English for engineer chatbot
          history: messages.map((msg) => ({
            type: msg.type,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling AI service:", error);

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

  const handleActionClick = async (action: string) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Generate: ${action}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, actionMessage]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({
          prompt: `Generate a detailed ${action} for quality management. Include analysis, recommendations, and next steps.`,
          user_role: currentUser.role,
          language: "en", // Assuming English for engineer chatbot
          history: messages.map((msg) => ({
            type: msg.type,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling AI service:", error);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-md sm:rounded-lg transition-all duration-200 border border-purple-500/30 text-xs sm:text-sm"
              >
                <ArrowLeft size={14} sm:size={16} />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Advanced QualityBot
                </h1>
                <p className="text-xxs sm:text-xs text-purple-300">
                  AI Assistant for Quality Engineers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30 text-xxs sm:text-sm">
                <Target size={14} sm:size={16} className="text-green-300" />
                <span>Engineer Mode</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4">
              <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Target size={20} />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  "Generate Root Cause Report",
                  "Create FMEA",
                  "Process Capability Study",
                  "Supplier Quality Audit",
                  "Quality System Review",
                ].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleActionClick(action)}
                    className="w-full text-left p-2 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all duration-200"
                    disabled={isTyping} // Disable when AI is typing
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Engineering Tools */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-blue-500/30 p-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                Engineering Tools
              </h3>
              <div className="space-y-2">
                {[
                  "FMEA Generator",
                  "Control Charts",
                  "Pareto Analysis",
                  "Fishbone Diagram",
                  "Statistical Analysis",
                ].map((tool) => (
                  <button
                    key={tool}
                    onClick={() =>
                      console.log(`Clicked Engineering Tool: ${tool}`)
                    } // Added onClick handler
                    className="w-full text-left p-2 text-sm text-gray-300 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                    disabled={isTyping} // Disable when AI is typing
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 h-[calc(100vh-180px)] sm:h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] text-sm sm:text-base ${
                        message.type === "user"
                          ? "bg-purple-500/20 border-purple-500/30"
                          : "bg-blue-500/20 border-blue-500/30"
                      } border rounded-xl p-3 sm:p-4 backdrop-blur-sm`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        {message.type === "bot" && (
                          <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                            <Bot
                              size={14}
                              sm:size={16}
                              className="text-white"
                            />
                          </div>
                        )}
                        {message.type === "user" && (
                          <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                            <User
                              size={14}
                              sm:size={16}
                              className="text-white"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-gray-200 whitespace-pre-wrap">
                            {message.content}
                          </p>

                          {message.actions && message.actions.length > 0 && (
                            <div className="mt-2 sm:mt-3">
                              <p className="text-xs sm:text-sm text-green-300 mb-1 sm:mb-2">
                                Quick Actions:
                              </p>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {message.actions.map((action) => (
                                  <button
                                    key={action}
                                    onClick={() => handleActionClick(action)}
                                    className="px-2 py-1 text-xxs sm:text-xs bg-green-500/30 hover:bg-green-500/50 text-green-200 rounded border border-green-500/50 transition-all duration-200"
                                    disabled={isTyping} // Disable when AI is typing
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.tools && message.tools.length > 0 && (
                            <div className="mt-2 sm:mt-3">
                              <p className="text-xs sm:text-sm text-purple-300 mb-1 sm:mb-2">
                                Suggested Tools:
                              </p>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {message.tools.map((tool) => (
                                  <button
                                    key={tool}
                                    className="px-2 py-1 text-xxs sm:text-xs bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 rounded border border-purple-500/50 transition-all duration-200"
                                    disabled={isTyping} // Disable when AI is typing
                                  >
                                    {tool}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.examples && message.examples.length > 0 && (
                            <div className="mt-2 sm:mt-3">
                              <p className="text-xs sm:text-sm text-blue-300 mb-1 sm:mb-2">
                                Related Examples:
                              </p>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {message.examples.map((example) => (
                                  <button
                                    key={example}
                                    className="px-2 py-1 text-xxs sm:text-xs bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 rounded border border-blue-500/50 transition-all duration-200"
                                    disabled={isTyping} // Disable when AI is typing
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
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                          <Bot size={14} sm:size={16} className="text-white" />
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
              <div className="border-t border-purple-500/30 p-3 sm:p-4">
                <div className="flex items-end gap-2 sm:gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your quality engineering challenge or ask for advanced analysis..."
                      className="w-full p-2 sm:p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm text-sm sm:text-base min-h-[60px] max-h-[120px]"
                      rows={2}
                      disabled={isTyping} // Disable when AI is typing
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send Message"
                    >
                      <Send size={18} sm:size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
