import React, { useState, useEffect } from "react";
import {
  Bot,
  User,
  LogOut,
  Wrench,
  BookOpen,
  Calculator,
  Upload,
  Zap,
  TrendingUp,
  FileText,
  Users,
  Bell,
  Cloud,
  Globe,
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Image,
  Calendar,
  Target,
  Database,
  Settings,
} from "lucide-react";
import { User as AppUser } from "../App"; // Import User interface from App.tsx

// interface User {
//   id: string;
//   name: string;
//   role: 'student' | 'engineer' | 'msme' | 'guest' | 'student-chatbot' | 'engineer-chatbot';
//   email?: string;
// }

interface EngineerDashboardProps {
  currentUser: AppUser;
  onLogout: () => void;
  onAccessChatbot: () => void;
  currentLanguage: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
}

export const EngineerDashboard: React.FC<EngineerDashboardProps> = ({
  currentUser,
  onLogout,
  onAccessChatbot,
  currentLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showAuditCalendar, setShowAuditCalendar] = useState(false);
  const [showRootCauseRepo, setShowRootCauseRepo] = useState(false);

  // Mock data for KPIs
  const kpiData = {
    defectRate: 2.3,
    customerComplaints: 15,
    onTimeDelivery: 94.5,
    equipmentDowntime: 3.2,
    supplierRating: 8.7,
    processCapability: 1.25,
  };

  // Mock supplier data
  const suppliers = [
    {
      name: "ABC Electronics",
      rating: 8.5,
      lastDelivery: "2024-01-15",
      status: "Good",
    },
    {
      name: "XYZ Components",
      rating: 7.2,
      lastDelivery: "2024-01-10",
      status: "Warning",
    },
    {
      name: "Tech Solutions",
      rating: 9.1,
      lastDelivery: "2024-01-18",
      status: "Excellent",
    },
  ];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "alert",
      message: "Cp/Cpk score below threshold on Line 3",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      message: "New customer complaint added",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "success",
      message: "Quality audit completed successfully",
      time: "1 day ago",
    },
  ];

  const t = {
    // English translations
    en: {
      title: "Engineer Dashboard",
      dashboard: "Dashboard",
      chat: "AI Chat",
      tools: "Quality Tools",
      metrics: "Metrics",
      suppliers: "Suppliers",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout",
      accessChatbot: "Access Chatbot",
      language: "🇬🇧 English",
      defectRate: "Defect Rate",
      complaints: "Complaints",
      delivery: "On-Time Delivery",
      downtime: "Equipment Downtime",
      supplierRating: "Supplier Rating",
      processCapability: "Process Capability",
      quickActions: "Quick Actions",
      generateReport: "Generate Report",
      uploadImage: "Upload Image",
      auditCalendar: "Audit Calendar",
      rootCauseRepo: "Root Cause Repository",
      notifications: "Notifications",
      cloudSync: "Cloud Sync",
      recentActivity: "Recent Activity",
      supplierTracker: "Supplier Tracker",
      qualityMetrics: "Quality Metrics",
      exportPDF: "Export PDF",
      viewDetails: "View Details",
    },
    // Hindi translations
    hi: {
      title: "इंजीनियर डैशबोर्ड",
      dashboard: "डैशबोर्ड",
      chat: "एआई चैट",
      tools: "क्वालिटी टूल्स",
      metrics: "मेट्रिक्स",
      suppliers: "आपूर्तिकर्ता",
      reports: "रिपोर्ट्स",
      settings: "सेटिंग्स",
      logout: "लॉगआउट",
      accessChatbot: "चैटबॉट एक्सेस करें",
      language: "🇮🇳 हिंदी",
      defectRate: "दोष दर",
      complaints: "शिकायतें",
      delivery: "समय पर डिलीवरी",
      downtime: "उपकरण डाउनटाइम",
      supplierRating: "आपूर्तिकर्ता रेटिंग",
      processCapability: "प्रक्रिया क्षमता",
      quickActions: "त्वरित कार्य",
      generateReport: "रिपोर्ट जनरेट करें",
      uploadImage: "छवि अपलोड करें",
      auditCalendar: "ऑडिट कैलेंडर",
      rootCauseRepo: "मूल कारण रिपॉजिटरी",
      notifications: "सूचनाएं",
      cloudSync: "क्लाउड सिंक",
      recentActivity: "हाल की गतिविधि",
      supplierTracker: "आपूर्तिकर्ता ट्रैकर",
      qualityMetrics: "गुणवत्ता मेट्रिक्स",
      exportPDF: "PDF निर्यात करें",
      viewDetails: "विवरण देखें",
    },
  };

  const currentT = t[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-gray-600/30 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-300">
            {currentT.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onAccessChatbot}
              className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2 hover:bg-blue-600/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Bot className="text-blue-400" size={14} sm:size={16} />
              <span className="text-blue-300">{currentT.accessChatbot}</span>
            </button>

            <button
              onClick={() =>
                onLanguageChange(currentLanguage === "en" ? "hi" : "en")
              }
              className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-2 hover:bg-purple-600/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Globe className="text-purple-400" size={14} sm:size={16} />
              <span className="text-purple-300">{currentT.language}</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-lg px-3 py-2 hover:bg-red-600/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <LogOut className="text-red-400" size={14} sm:size={16} />
              <span className="text-red-300">{currentT.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 border-b border-gray-600/30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto space-x-4 sm:space-x-8">
            {[
              { id: "dashboard", label: currentT.dashboard, icon: BarChart3 },
              { id: "chat", label: currentT.chat, icon: Bot },
              { id: "tools", label: currentT.tools, icon: Wrench },
              { id: "metrics", label: currentT.metrics, icon: TrendingUp },
              { id: "suppliers", label: currentT.suppliers, icon: Users },
              { id: "reports", label: currentT.reports, icon: FileText },
              { id: "settings", label: currentT.settings, icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 whitespace-nowrap transition-all duration-300 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-300"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                <tab.icon size={18} sm:size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  label: currentT.defectRate,
                  value: `${kpiData.defectRate}%`,
                  icon: AlertTriangle,
                  color: "red",
                },
                {
                  label: currentT.complaints,
                  value: kpiData.customerComplaints,
                  icon: Bell,
                  color: "yellow",
                },
                {
                  label: currentT.delivery,
                  value: `${kpiData.onTimeDelivery}%`,
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  label: currentT.downtime,
                  value: `${kpiData.equipmentDowntime}%`,
                  icon: Clock,
                  color: "orange",
                },
                {
                  label: currentT.supplierRating,
                  value: kpiData.supplierRating,
                  icon: Users,
                  color: "blue",
                },
                {
                  label: currentT.processCapability,
                  value: kpiData.processCapability,
                  icon: Target,
                  color: "purple",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="group bg-black/20 backdrop-blur-md rounded-xl border border-gray-600/30 p-4 sm:p-6 hover:bg-black/40 hover:border-gray-500/50 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">
                        {kpi.label}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                        {kpi.value}
                      </p>
                    </div>
                    <div
                      className={`p-2 sm:p-3 rounded-lg bg-${kpi.color}-500/20 border border-${kpi.color}-500/30 group-hover:bg-${kpi.color}-500/30 group-hover:border-${kpi.color}-500/50 transition-all duration-300`}
                    >
                      <kpi.icon
                        className={`text-${kpi.color}-400 group-hover:text-${kpi.color}-300`}
                        size={20}
                        sm:size={24}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
                <Zap size={20} sm:size={24} />
                {currentT.quickActions}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: currentT.generateReport,
                    icon: FileText,
                    action: () =>
                      alert(
                        "Generate Report: Creating comprehensive quality report with charts and analysis..."
                      ),
                  },
                  {
                    label: currentT.uploadImage,
                    icon: Image,
                    action: () => {
                      setShowImageUpload(true);
                      alert(
                        "Image Upload: Upload defect images for AI-powered analysis"
                      );
                    },
                  },
                  {
                    label: currentT.auditCalendar,
                    icon: Calendar,
                    action: () => {
                      setShowAuditCalendar(true);
                      alert(
                        "Audit Calendar: Schedule and manage quality audits"
                      );
                    },
                  },
                  {
                    label: currentT.rootCauseRepo,
                    icon: Database,
                    action: () => {
                      setShowRootCauseRepo(true);
                      alert(
                        "Root Cause Repository: Access knowledge base of common quality issues and solutions"
                      );
                    },
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105 w-full justify-start"
                  >
                    <div className="p-1 bg-purple-500/20 rounded group-hover:bg-purple-500/30 transition-all duration-300">
                      <action.icon
                        className="text-purple-400 group-hover:text-purple-300"
                        size={18}
                        sm:size={20}
                      />
                    </div>
                    <span className="text-purple-300 font-medium group-hover:text-purple-200 transition-colors duration-300 text-sm sm:text-base">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-blue-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Bell size={20} sm:size={24} />
                  {currentT.notifications}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center gap-2 sm:gap-3 p-3 bg-black/30 rounded-lg"
                    >
                      <div
                        className={`p-1 sm:p-2 rounded-full ${
                          notification.type === "alert"
                            ? "bg-red-500/20"
                            : notification.type === "success"
                            ? "bg-green-500/20"
                            : "bg-blue-500/20"
                        }`}
                      >
                        {notification.type === "alert" ? (
                          <AlertTriangle
                            size={14}
                            sm:size={16}
                            className="text-red-400"
                          />
                        ) : notification.type === "success" ? (
                          <CheckCircle
                            size={14}
                            sm:size={16}
                            className="text-green-400"
                          />
                        ) : (
                          <Bell
                            size={14}
                            sm:size={16}
                            className="text-blue-400"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200 text-xs sm:text-sm">
                          {notification.message}
                        </p>
                        <p className="text-gray-500 text-xxs sm:text-xs">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-green-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Users size={20} sm:size={24} />
                  {currentT.supplierTracker}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier.name}
                      className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-200 font-medium text-sm sm:text-base">
                          {supplier.name}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          Rating: {supplier.rating}/10
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs ${
                          supplier.status === "Excellent"
                            ? "bg-green-500/20 text-green-400"
                            : supplier.status === "Good"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {supplier.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="text-center py-8 sm:py-12">
            <Bot
              size={48}
              sm:size={64}
              className="text-purple-400 mx-auto mb-3 sm:mb-4"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4">
              Advanced AI Chat Assistant
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
              Access the enhanced chatbot with advanced features for engineers
            </p>
            <button
              onClick={onAccessChatbot}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm sm:text-base"
            >
              Launch AI Chat
            </button>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              Advanced Quality Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: "FMEA Generator",
                  description: "Auto-generate FMEA with AI assistance",
                  icon: FileText,
                  action: () =>
                    alert(
                      "FMEA Generator launched! Generate comprehensive Failure Mode and Effects Analysis with AI assistance."
                    ),
                },
                {
                  name: "Control Charts",
                  description: "Real-time SPC monitoring",
                  icon: Activity,
                  action: () =>
                    alert(
                      "Control Charts launched! Monitor Statistical Process Control with real-time data visualization."
                    ),
                },
                {
                  name: "Pareto Analysis",
                  description: "Identify critical issues",
                  icon: BarChart3,
                  action: () =>
                    alert(
                      "Pareto Analysis launched! Identify the most critical quality issues using the 80/20 rule."
                    ),
                },
                {
                  name: "Fishbone Diagram",
                  description: "Root cause analysis tool",
                  icon: PieChart,
                  action: () =>
                    alert(
                      "Fishbone Diagram launched! Create Ishikawa diagrams for systematic root cause analysis."
                    ),
                },
                {
                  name: "A3/8D Templates",
                  description: "Standard problem-solving formats",
                  icon: Target,
                  action: () =>
                    alert(
                      "A3/8D Templates launched! Generate standardized problem-solving reports and action plans."
                    ),
                },
                {
                  name: "Image Analysis",
                  description: "Defect classification with AI",
                  icon: Image,
                  action: () =>
                    alert(
                      "Image Analysis launched! Upload defect images for AI-powered classification and analysis."
                    ),
                },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="group bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6 hover:bg-black/40 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={tool.action}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1 bg-purple-500/20 rounded group-hover:bg-purple-500/30 transition-all duration-300">
                      <tool.icon
                        className="text-purple-400 group-hover:text-purple-300"
                        size={20}
                        sm:size={24}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {tool.description}
                  </p>
                  <button className="w-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-purple-200 py-2 rounded-lg transition-all duration-300 border border-purple-500/30 hover:border-purple-500/50 group-hover:shadow-md text-sm sm:text-base">
                    Launch Tool
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
              {currentT.qualityMetrics}
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-400">
                Advanced metrics dashboard with real-time monitoring and trend
                analysis
              </p>
            </div>
          </div>
        )}

        {activeTab === "suppliers" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
              {currentT.supplierTracker}
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-400">
                Comprehensive supplier management and rating system
              </p>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
              Reports & Analytics
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-400">
                Generate comprehensive reports and export to PDF
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300">
              Settings & Configuration
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-400">
                Configure notifications, cloud sync, and system preferences
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
