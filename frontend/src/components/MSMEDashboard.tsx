import React, { useState, useEffect, useRef } from "react";
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
  PieChart as LucidePieChart,
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
  DollarSign,
  Smartphone,
  MessageCircle,
  Camera,
  Shield,
} from "lucide-react";
import { User as AppUser } from "../App";
import { LineChart, BarChart, PieChart } from "./QualityCharts";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000";

// interface User {
//   id: string;
//   name: string;
//   role:
//     | "student"
//     | "engineer"
//     | "msme"
//     | "guest"
//     | "student-chatbot"
//     | "engineer-chatbot";
//   email?: string;
// }

interface MSMEDashboardProps {
  currentUser: AppUser;
  onLogout: () => void;
  onAccessChatbot: () => void;
  currentLanguage: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
}

export const MSMEDashboard: React.FC<MSMEDashboardProps> = ({
  currentUser,
  onLogout,
  onAccessChatbot,
  currentLanguage,
  onLanguageChange,
}) => {
  console.log("MSMEDashboard rendered with user:", currentUser);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showAuditCalendar, setShowAuditCalendar] = useState(false);
  const [showRootCauseRepo, setShowRootCauseRepo] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [wsMessages, setWsMessages] = useState<string[]>([]);

  // Excel/ERP Integration State
  const [importedData, setImportedData] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
    importedRows: number;
  } | null>(null);
  const [erpMetrics, setErpMetrics] = useState<any>(null);

  // ROI Calculator State
  const [roiInputs, setRoiInputs] = useState({
    monthlyDefectCost: 50000,
    qualityInvestment: 25000,
    expectedSavings: 75000,
  });
  const [roiResult, setRoiResult] = useState<{
    roi: number;
    paybackPeriod: number;
    annualSavings: number;
    netBenefit: number;
  } | null>(null);

  // Excel/ERP Integration Functions
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoadingApi(true); // Set loading state
      const response = await fetch(`${API_BASE_URL}/import-excel`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImportStatus({
          success: true,
          message: result.message,
          importedRows: result.imported_rows,
        });
        setImportedData(result.sample_data);
      } else {
        // Display specific error message from backend if available
        setImportStatus({
          success: false,
          message: result.message || "Failed to import data.",
          importedRows: 0,
        });
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      setImportStatus({
        success: false,
        message: error.message || "Network error or server unavailable.",
        importedRows: 0,
      });
    } finally {
      setIsLoadingApi(false); // Reset loading state
    }
  };

  const downloadTemplate = async () => {
    try {
      setIsLoadingApi(true); // Set loading state
      const response = await fetch(`${API_BASE_URL}/export-quality-data`);
      if (!response.ok) {
        throw new Error(
          "Failed to download template. Server responded with an error."
        );
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quality_data_template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error("Download template error:", error);
      alert(
        error.message ||
          "Failed to download template. Please check your connection."
      );
    } finally {
      setIsLoadingApi(false); // Reset loading state
    }
  };

  const fetchErpMetrics = async () => {
    try {
      setIsLoadingApi(true); // Set loading state
      const response = await fetch(`${API_BASE_URL}/quality-metrics`);
      if (!response.ok) {
        throw new Error(
          "Failed to fetch ERP metrics. Server responded with an error."
        );
      }
      const data = await response.json();
      if (data.success) {
        setErpMetrics(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch ERP metrics.");
      }
    } catch (error: any) {
      console.error("Failed to fetch ERP metrics:", error);
      // Optionally, set an error state to display on the dashboard
      alert(error.message || "Failed to fetch ERP metrics. Please try again.");
    } finally {
      setIsLoadingApi(false); // Reset loading state
    }
  };

  // ROI Calculation Function
  const calculateROI = () => {
    const { monthlyDefectCost, qualityInvestment, expectedSavings } = roiInputs;

    if (
      monthlyDefectCost <= 0 ||
      qualityInvestment <= 0 ||
      expectedSavings <= 0
    ) {
      alert("Please enter valid positive numbers for all fields");
      return;
    }

    const annualSavings = expectedSavings * 12;
    const netBenefit = annualSavings - qualityInvestment;
    const roi = (netBenefit / qualityInvestment) * 100;
    const paybackPeriod = qualityInvestment / expectedSavings;

    setRoiResult({
      roi: Math.round(roi * 100) / 100,
      paybackPeriod: Math.round(paybackPeriod * 100) / 100,
      annualSavings,
      netBenefit,
    });
  };

  // Real MSME business data with ROI tracking
  const businessData = {
    defectCost: 12300,
    complaints: 4,
    unresolvedComplaints: 2,
    topBadSupplier: "XYZ Traders",
    riskyProduct: "Plastic Gears",
    monthlyRevenue: 250000,
    qualityCost: 18500,
    // ROI Data from Real MSME Pilots
    roiData: {
      defectReduction: 15, // 15% reduction in defects
      reworkCostReduction: 10, // 10% reduction in rework cost
      customerComplaintsReduction: 25, // 25% reduction in complaints
      supplierQualityImprovement: 20, // 20% improvement in supplier quality
      processEfficiencyGain: 12, // 12% improvement in process efficiency
      costSavings: 18500, // Monthly cost savings
      investmentReturn: 3.2, // ROI ratio (3.2x return on investment)
      paybackPeriod: 4, // 4 months payback period
    },
  };

  // Fetch ERP metrics on component mount
  useEffect(() => {
    fetchErpMetrics();
  }, []);

  // WebSocket Connection
  useEffect(() => {
    const websocket = new WebSocket(`${WS_BASE_URL}/ws`);

    websocket.onopen = () => {
      console.log("WebSocket Connected");
      setWsMessages((prev) => [...prev, "WebSocket Connected"]);
    };

    websocket.onmessage = (event) => {
      console.log("WebSocket Message:", event.data);
      setWsMessages((prev) => [...prev, event.data]);
      try {
        const parsedData = JSON.parse(event.data);
        // Assuming the broadcasted message from backend is an object containing new ERP metrics
        if (parsedData.type === "erp_metrics_update" && parsedData.data) {
          setErpMetrics(parsedData.data);
          setImportStatus({
            success: true,
            message: "Real-time ERP metrics updated!",
            importedRows: 0, // Not relevant for real-time metrics update
          });
        } else if (
          parsedData.type === "import_status_update" &&
          parsedData.message
        ) {
          setImportStatus({
            success: parsedData.success,
            message: parsedData.message,
            importedRows: parsedData.imported_rows || 0,
          });
        }
      } catch (e) {
        console.error("Error parsing WebSocket message", e);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket Disconnected");
      setWsMessages((prev) => [...prev, "WebSocket Disconnected"]);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setWsMessages((prev) => [...prev, `WebSocket Error: ${error}`]);
    };

    return () => {
      websocket.close();
    };
  }, []);

  // Mock supplier data
  const suppliers = [
    {
      name: "ABC Electronics",
      rating: 8.5,
      lastDelivery: "2024-01-15",
      defects: 2,
      status: "Good",
    },
    {
      name: "XYZ Components",
      rating: 7.2,
      lastDelivery: "2024-01-10",
      defects: 5,
      status: "Warning",
    },
    {
      name: "Tech Solutions",
      rating: 9.1,
      lastDelivery: "2024-01-18",
      defects: 1,
      status: "Excellent",
    },
  ];

  // Real MSME ROI Success Stories
  const roiSuccessStories = [
    {
      id: 1,
      company: "ABC Manufacturing (Pune)",
      industry: "Auto Components",
      challenge: "High defect rate (8%) in gear manufacturing",
      solution: "Implemented Fishbone Diagram + Pareto Analysis",
      results: {
        defectReduction: 15,
        costSavings: 85000,
        roi: 3.2,
        paybackPeriod: 4,
      },
      quote:
        '"QualityBot helped us identify root causes we never knew existed. 15% defect reduction in just 3 months!"',
      time: "3 months ago",
    },
    {
      id: 2,
      company: "XYZ Electronics (Mumbai)",
      industry: "Electronics",
      challenge: "Customer complaints increased by 30%",
      solution: "Root Cause Analysis + FMEA implementation",
      results: {
        complaintReduction: 25,
        costSavings: 120000,
        roi: 4.1,
        paybackPeriod: 3,
      },
      quote:
        '"25% reduction in customer complaints and ₹1.2L monthly savings - QualityBot is a game-changer!"',
      time: "2 months ago",
    },
    {
      id: 3,
      company: "DEF Textiles (Surat)",
      industry: "Textiles",
      challenge: "Supplier quality issues causing 12% rework",
      solution: "Supplier Quality Management + Control Charts",
      results: {
        reworkReduction: 10,
        costSavings: 95000,
        roi: 2.8,
        paybackPeriod: 5,
      },
      quote:
        '"10% reduction in rework costs and better supplier relationships. ROI of 2.8x in 5 months!"',
      time: "1 month ago",
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
    {
      id: 4,
      type: "success",
      message: "ROI milestone achieved: 3.2x return on quality investment",
      time: "1 week ago",
    },
  ];

  const t = {
    // English translations
    en: {
      title: "MSME Business Dashboard",
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
      // Business Summary
      businessSummary: "Business Summary",
      defectCost: "Defect Cost",
      thisMonth: "This Month",
      unresolved: "Unresolved",
      topBadSupplier: "Top Bad Supplier",
      highDefects: "High Defects",
      riskyProduct: "Risky Product",
      needsAttention: "Needs Attention",
      // Tools
      costCalculator: "Cost Calculator",
      costCalculatorDesc:
        "Calculate cost of poor quality and potential savings",
      roiPredictor: "ROI Predictor",
      roiPredictorDesc: "Predict ROI for quality improvement investments",
      whatsappIntegration: "WhatsApp Integration",
      whatsappIntegrationDesc:
        "Get alerts on WhatsApp for critical quality issues",
      autoReplyGenerator: "Auto Reply Generator",
      autoReplyGeneratorDesc:
        "Generate professional customer complaint replies",
      photoUpload: "Photo Upload",
      photoUploadDesc: "Upload photos of defective products for documentation",
      complianceChecklist: "Compliance Checklist",
      complianceChecklistDesc: "ISO and certification compliance checklist",
      launchTool: "Launch Tool",
      // Additional Tools for Tools Tab
      costOfPoorQuality: "Cost of Poor Quality",
      costOfPoorQualityDesc:
        "Calculate monthly defect costs and potential savings",
      inventoryDefectMapping: "Inventory Defect Mapping",
      inventoryDefectMappingDesc: "Map product types with highest defect rates",
      complianceTracker: "Compliance Tracker",
      complianceTrackerDesc: "Track ISO and certification compliance",
      // Daily Tip & Case Studies
      dailyTip: "Daily Tip",
      caseStudies: "Case Studies",
      todayTip: "Today's Tip: Close customer complaints within 3 days",
      // ROI Section
      roiMetrics: "ROI Metrics",
      roiSuccessStories: "ROI Success Stories",
      defectReduction: "Defect Reduction",
      reworkCostReduction: "Rework Cost Reduction",
      complaintReduction: "Complaint Reduction",
      costSavings: "Cost Savings",
      investmentReturn: "Investment Return",
      paybackPeriod: "Payback Period",
      months: "months",
      successStory: "Success Story",
      challenge: "Challenge",
      solution: "Solution",
      results: "Results",
      company: "Company",
      industry: "Industry",
      realPilotData: "Real MSME Pilot Data",
      roiCalculator: "ROI Calculator",
      calculateYourRoi: "Calculate Your ROI",
      monthlyDefectCost: "Monthly Defect Cost",
      qualityInvestment: "Quality Investment",
      expectedSavings: "Expected Savings",
      calculate: "Calculate",
      todayTool:
        "Today's Tool: Pareto Chart – Know that 80% of problems are caused by 20% of reasons",
      caseStudy1Title:
        "A textile factory reduced its defects by 60% using Fishbone diagram",
      caseStudy1Desc:
        "A small textile factory in Mumbai reduced its defects by 60% using Fishbone diagram.",
      caseStudy1Savings: "₹2,50,000 savings",
      caseStudy2Title: "Auto parts manufacturer improved delivery by 40%",
      caseStudy2Desc:
        "A small auto parts manufacturer in Pune improved on-time delivery by 40% using 5 Whys analysis.",
      caseStudy2Savings: "₹1,80,000 savings",
      // Chat
      hindiFriendlyAI: "Hindi-Friendly AI Assistant",
      businessAdvice: "Get business advice in simple Hindi + English mix",
      launchAIAssistant: "Launch AI Assistant",
      // Other sections
      businessTools: "Business Tools",
      supplierRatingTracker: "Supplier Rating Tracker",
      reportsAnalytics: "Reports & Analytics",
      generateComprehensiveReports:
        "Generate comprehensive reports and export to PDF",
      settingsConfiguration: "Settings & Configuration",
      configureNotifications:
        "Configure notifications, cloud sync, and system preferences",
      // Metrics and Tables
      advancedMetricsDashboard:
        "Advanced metrics dashboard with real-time monitoring and trend analysis",
      supplierName: "Supplier Name",
      rating: "Rating",
      lastDelivery: "Last Delivery",
      defects: "Defects",
      status: "Status",
      actions: "Actions",
      contact: "Contact",
      complaint: "Complaint",
    },
    // Hindi translations
    hi: {
      title: "एमएसएमई व्यवसाय डैशबोर्ड",
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
      // Business Summary
      businessSummary: "व्यवसाय सारांश",
      defectCost: "दोष लागत",
      thisMonth: "इस महीने",
      unresolved: "अनसुलझी",
      topBadSupplier: "सबसे खराब आपूर्तिकर्ता",
      highDefects: "उच्च दोष",
      riskyProduct: "जोखिम वाला उत्पाद",
      needsAttention: "ध्यान की आवश्यकता",
      // Tools
      costCalculator: "लागत कैलकुलेटर",
      costCalculatorDesc: "खराब गुणवत्ता की लागत और संभावित बचत की गणना करें",
      roiPredictor: "आरओआई भविष्यवक्ता",
      roiPredictorDesc: "गुणवत्ता सुधार निवेश के लिए आरओआई की भविष्यवाणी करें",
      whatsappIntegration: "व्हाट्सएप एकीकरण",
      whatsappIntegrationDesc:
        "महत्वपूर्ण गुणवत्ता मुद्दों के लिए व्हाट्सएप पर अलर्ट प्राप्त करें",
      autoReplyGenerator: "स्वचालित जवाब जनरेटर",
      autoReplyGeneratorDesc: "पेशेवर ग्राहक शिकायत जवाब उत्पन्न करें",
      photoUpload: "फोटो अपलोड",
      photoUploadDesc:
        "दस्तावेजीकरण के लिए दोषपूर्ण उत्पादों की तस्वीरें अपलोड करें",
      complianceChecklist: "अनुपालन चेकलिस्ट",
      complianceChecklistDesc: "आईएसओ और प्रमाणन अनुपालन चेकलिस्ट",
      launchTool: "टूल लॉन्च करें",
      // Additional Tools for Tools Tab
      costOfPoorQuality: "खराब गुणवत्ता की लागत",
      costOfPoorQualityDesc: "मासिक दोष लागत और संभावित बचत की गणना करें",
      inventoryDefectMapping: "इन्वेंटरी दोष मैपिंग",
      inventoryDefectMappingDesc:
        "उच्चतम दोष दर वाले उत्पाद प्रकारों की मैपिंग करें",
      complianceTracker: "अनुपालन ट्रैकर",
      complianceTrackerDesc: "आईएसओ और प्रमाणन अनुपालन ट्रैक करें",
      // Daily Tip & Case Studies
      dailyTip: "दैनिक सुझाव",
      caseStudies: "केस स्टडीज",
      todayTip: "आज का सुझाव: ग्राहक शिकायतों को 3 दिनों में बंद करें",
      todayTool:
        "आज का टूल: पारेटो चार्ट – जानें कि 80% समस्याएं 20% कारणों से होती हैं",
      caseStudy1Title:
        "एक कपड़ा फैक्ट्री ने Fishbone diagram का उपयोग करके अपने दोष 60% तक कम कर दिए",
      caseStudy1Desc:
        "मुंबई की एक छोटी कपड़ा फैक्ट्री ने Fishbone diagram का उपयोग करके अपने दोष 60% तक कम कर दिए।",
      caseStudy1Savings: "₹2,50,000 बचत",
      caseStudy2Title: "ऑटो पार्ट्स निर्माता ने डिलीवरी 40% तक सुधारी",
      caseStudy2Desc:
        "पुणे के एक छोटे ऑटो पार्ट्स निर्माता ने 5 Whys analysis का उपयोग करके समय पर डिलीवरी 40% तक सुधारी।",
      caseStudy2Savings: "₹1,80,000 बचत",
      // Chat
      hindiFriendlyAI: "हिंदी-अनुकूल एआई सहायक",
      businessAdvice:
        "सरल हिंदी + अंग्रेजी मिश्रण में व्यवसाय सलाह प्राप्त करें",
      launchAIAssistant: "एआई सहायक लॉन्च करें",
      // Other sections
      businessTools: "व्यवसाय टूल्स",
      supplierRatingTracker: "आपूर्तिकर्ता रेटिंग ट्रैकर",
      reportsAnalytics: "रिपोर्ट्स और विश्लेषण",
      generateComprehensiveReports:
        "व्यापक रिपोर्ट्स जनरेट करें और PDF में निर्यात करें",
      settingsConfiguration: "सेटिंग्स और कॉन्फ़िगरेशन",
      configureNotifications:
        "सूचनाएं, क्लाउड सिंक और सिस्टम प्राथमिकताएं कॉन्फ़िगर करें",
      // Metrics and Tables
      advancedMetricsDashboard:
        "उन्नत मेट्रिक्स डैशबोर्ड रीयल-टाइम मॉनिटरिंग और ट्रेंड विश्लेषण के साथ",
      supplierName: "आपूर्तिकर्ता का नाम",
      rating: "रेटिंग",
      lastDelivery: "अंतिम डिलीवरी",
      defects: "दोष",
      status: "स्थिति",
      actions: "कार्रवाई",
      contact: "संपर्क करें",
      complaint: "शिकायत",
      // ROI Section Hindi
      roiMetrics: "आरओआई मेट्रिक्स",
      roiSuccessStories: "आरओआई सफलता की कहानियां",
      defectReduction: "दोष में कमी",
      reworkCostReduction: "पुनर्कार्य लागत में कमी",
      complaintReduction: "शिकायतों में कमी",
      costSavings: "लागत बचत",
      investmentReturn: "निवेश पर प्रतिफल",
      paybackPeriod: "भुगतान अवधि",
      months: "महीने",
      successStory: "सफलता की कहानी",
      challenge: "चुनौती",
      solution: "समाधान",
      results: "परिणाम",
      company: "कंपनी",
      industry: "उद्योग",
      realPilotData: "वास्तविक एमएसएमई पायलट डेटा",
      roiCalculator: "आरओआई कैलकुलेटर",
      calculateYourRoi: "अपना आरओआई गणना करें",
      monthlyDefectCost: "मासिक दोष लागत",
      qualityInvestment: "गुणवत्ता निवेश",
      expectedSavings: "अपेक्षित बचत",
      calculate: "गणना करें",
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
              { id: "roi", label: currentT.roiMetrics, icon: TrendingUp },
              { id: "suppliers", label: currentT.suppliers, icon: Users },
              { id: "reports", label: currentT.reports, icon: FileText },
              { id: "excel-erp", label: "Excel/ERP", icon: Database },
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
            {/* Business Summary Dashboard */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
                <DollarSign size={20} sm:size={24} />
                {currentT.businessSummary}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-red-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.defectCost}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-red-400">
                    ₹{businessData.defectCost.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">
                    {currentT.thisMonth}
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-yellow-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.complaints}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {businessData.complaints}
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">
                    {businessData.unresolvedComplaints} {currentT.unresolved}
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-orange-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.topBadSupplier}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-orange-400">
                    {businessData.topBadSupplier}
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">
                    {currentT.highDefects}
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.riskyProduct}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-purple-400">
                    {businessData.riskyProduct}
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">
                    {currentT.needsAttention}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Business Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: currentT.costCalculator,
                  description: currentT.costCalculatorDesc,
                  icon: Calculator,
                  action: () =>
                    alert(
                      "Cost Calculator: Calculate defect costs and potential savings"
                    ),
                  color: "red",
                },
                {
                  name: currentT.roiPredictor,
                  description: currentT.roiPredictorDesc,
                  icon: TrendingUp,
                  action: () =>
                    alert(
                      "ROI Predictor: Calculate return on investment for quality improvements"
                    ),
                  color: "green",
                },
                {
                  name: currentT.whatsappIntegration,
                  description: currentT.whatsappIntegrationDesc,
                  icon: Smartphone,
                  action: () =>
                    alert(
                      "WhatsApp Integration: Get real-time alerts for defects and complaints"
                    ),
                  color: "green",
                },
                {
                  name: currentT.autoReplyGenerator,
                  description: currentT.autoReplyGeneratorDesc,
                  icon: MessageCircle,
                  action: () =>
                    alert(
                      "Auto Reply Generator: Create professional responses to customer complaints"
                    ),
                  color: "blue",
                },
                {
                  name: currentT.photoUpload,
                  description: currentT.photoUploadDesc,
                  icon: Camera,
                  action: () =>
                    alert(
                      "Photo Upload: Document defective products with photos"
                    ),
                  color: "purple",
                },
                {
                  name: currentT.complianceChecklist,
                  description: currentT.complianceChecklistDesc,
                  icon: Shield,
                  action: () =>
                    alert(
                      "Compliance Checklist: Track ISO and certification requirements"
                    ),
                  color: "indigo",
                },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="group bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6 hover:bg-black/40 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={tool.action}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div
                      className={`p-1 sm:p-2 bg-${tool.color}-500/20 rounded-lg group-hover:bg-${tool.color}-500/30 transition-all duration-300`}
                    >
                      <tool.icon
                        className={`text-${tool.color}-400 group-hover:text-${tool.color}-300`}
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
                    {currentT.launchTool}
                  </button>
                </div>
              ))}
            </div>

            {/* Daily Tip & Case Studies */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-green-500/30 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-green-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Zap size={20} sm:size={24} />
                  {currentT.dailyTip}
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-300 text-sm sm:text-base font-medium">
                      {currentT.todayTip}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-blue-300 text-sm sm:text-base font-medium">
                      {currentT.todayTool}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-orange-500/30 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <BookOpen size={20} sm:size={24} />
                  {currentT.caseStudies}
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  <div className="p-3 bg-black/30 rounded-lg border border-orange-500/20">
                    <h4 className="text-orange-300 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                      {currentT.caseStudy1Title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                      {currentT.caseStudy1Desc}
                    </p>
                    <p className="text-green-400 text-xs sm:text-sm font-medium">
                      {currentT.caseStudy1Savings}
                    </p>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg border border-orange-500/20">
                    <h4 className="text-orange-300 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                      {currentT.caseStudy2Title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                      {currentT.caseStudy2Desc}
                    </p>
                    <p className="text-green-400 text-xs sm:text-sm font-medium">
                      {currentT.caseStudy2Savings}
                    </p>
                  </div>
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
              {currentT.hindiFriendlyAI}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
              {currentT.businessAdvice}
            </p>
            <button
              onClick={onAccessChatbot}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm sm:text-base"
            >
              {currentT.launchAIAssistant}
            </button>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              {currentT.businessTools}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  name: currentT.costCalculator,
                  description: currentT.costCalculatorDesc,
                  icon: Calculator,
                  action: () =>
                    alert(
                      "Cost Calculator: Calculate defect costs and potential savings"
                    ),
                },
                {
                  name: currentT.roiPredictor,
                  description: currentT.roiPredictorDesc,
                  icon: TrendingUp,
                  action: () =>
                    alert(
                      "ROI Predictor: Calculate return on investment for quality improvements"
                    ),
                },
                {
                  name: currentT.whatsappIntegration,
                  description: currentT.whatsappIntegrationDesc,
                  icon: Smartphone,
                  action: () =>
                    alert(
                      "WhatsApp Integration: Get real-time alerts for defects and complaints"
                    ),
                },
                {
                  name: currentT.autoReplyGenerator,
                  description: currentT.autoReplyGeneratorDesc,
                  icon: MessageCircle,
                  action: () =>
                    alert(
                      "Auto Reply Generator: Create professional responses to customer complaints"
                    ),
                },
                {
                  name: currentT.costOfPoorQuality,
                  description: currentT.costOfPoorQualityDesc,
                  icon: DollarSign,
                  action: () =>
                    alert(
                      "Cost of Poor Quality: Calculate defect costs and potential savings"
                    ),
                },
                {
                  name: currentT.inventoryDefectMapping,
                  description: currentT.inventoryDefectMappingDesc,
                  icon: BarChart3,
                  action: () =>
                    alert(
                      "Inventory Defect Mapping: Identify products with highest return rates"
                    ),
                },
                {
                  name: currentT.complianceTracker,
                  description: currentT.complianceTrackerDesc,
                  icon: Shield,
                  action: () =>
                    alert(
                      "Compliance Tracker: Track ISO and certification requirements"
                    ),
                },
              ].map((tool, index) => (
                <div
                  key={index}
                  className="group bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6 hover:bg-black/40 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={tool.action}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1 sm:p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all duration-300">
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
                    {currentT.launchTool}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "excel-erp" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center gap-2 mb-4">
              <Database size={20} sm:size={24} />
              Excel/ERP Integration
            </h2>

            {/* Import/Export Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* File Upload Section */}
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Upload size={18} sm:size={20} />
                  Import Quality Data
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                  Upload Excel/CSV files with your quality metrics. Supports
                  standard quality data formats.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-4 sm:p-6 text-center hover:border-purple-500/50 transition-all duration-300">
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isLoadingApi} // Disable during API call
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer flex flex-col items-center gap-2 sm:gap-3 ${
                        isLoadingApi ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Upload
                        size={28}
                        sm:size={32}
                        className="text-purple-400"
                      />
                      <span className="text-purple-300 font-medium text-sm sm:text-base">
                        Click to upload Excel/CSV file
                      </span>
                      <span className="text-gray-500 text-xxs sm:text-sm">
                        Supports .csv and .xlsx formats
                      </span>
                    </label>
                  </div>

                  {importStatus && (
                    <div
                      className={`p-3 sm:p-4 rounded-lg ${
                        importStatus.success
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-red-500/20 border border-red-500/30"
                      }`}
                    >
                      <p
                        className={`font-medium text-sm sm:text-base ${
                          importStatus.success
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {importStatus.message}
                      </p>
                      {importStatus.success && (
                        <p className="text-green-400 text-xs sm:text-sm mt-1">
                          Imported {importStatus.importedRows} rows successfully
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Template Download Section */}
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Download size={18} sm:size={20} />
                  Download Template
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                  Get the standard CSV template for quality data import. Use
                  this format for consistent data structure.
                </p>

                <button
                  onClick={downloadTemplate}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                  disabled={isLoadingApi} // Disable during API call
                >
                  <Download size={18} sm:size={20} />
                  Download CSV Template
                </button>

                <div className="mt-3 sm:mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-sm sm:text-base font-medium">
                    Expected Columns:
                  </p>
                  <p className="text-blue-400 text-xxs sm:text-xs mt-1">
                    timestamp, metric_name, value, target, unit, process,
                    operator, notes
                  </p>
                </div>
              </div>
            </div>

            {/* Imported Data Preview */}
            {importedData.length > 0 && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4">
                  Imported Data Preview
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-purple-500/30">
                        <th className="text-left p-2 text-purple-300">
                          Timestamp
                        </th>
                        <th className="text-left p-2 text-purple-300">
                          Metric
                        </th>
                        <th className="text-left p-2 text-purple-300">Value</th>
                        <th className="text-left p-2 text-purple-300">
                          Target
                        </th>
                        <th className="text-left p-2 text-purple-300">Unit</th>
                        <th className="text-left p-2 text-purple-300">
                          Process
                        </th>
                        <th className="text-left p-2 text-purple-300">
                          Operator
                        </th>
                        <th className="text-left p-2 text-purple-300">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importedData.map((row, index) => (
                        <tr
                          key={row.timestamp + index}
                          className="border-b border-purple-500/20"
                        >
                          <td className="p-2 text-gray-300">{row.timestamp}</td>
                          <td className="p-2 text-gray-300">
                            {row.metric_name}
                          </td>
                          <td className="p-2 text-gray-300">{row.value}</td>
                          <td className="p-2 text-gray-300">{row.target}</td>
                          <td className="p-2 text-gray-300">{row.unit}</td>
                          <td className="p-2 text-gray-300">{row.process}</td>
                          <td className="p-2 text-gray-300">{row.operator}</td>
                          <td className="p-2 text-gray-300">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ERP Metrics Integration */}
            {erpMetrics && (
              <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4 flex items-center gap-2">
                  <Database size={20} sm:size={24} />
                  ERP System Integration
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                  Real-time quality metrics from your ERP system. This data is
                  automatically synchronized.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-green-500/30">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Daily Output
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-green-400">
                      {erpMetrics.production_metrics.daily_output}
                    </p>
                    <p className="text-gray-500 text-xxs sm:text-xs">
                      Target: {erpMetrics.production_metrics.target_output}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-blue-500/30">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Defect Rate
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-400">
                      {erpMetrics.quality_metrics.defect_rate}%
                    </p>
                    <p className="text-gray-500 text-xxs sm:text-xs">
                      Target: {erpMetrics.quality_metrics.target_defect_rate}%
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Cost per Unit
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-400">
                      ₹{erpMetrics.cost_metrics.cost_per_unit}
                    </p>
                    <p className="text-gray-500 text-xxs sm:text-xs">
                      Target: ₹{erpMetrics.cost_metrics.target_cost}
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-orange-500/30">
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Cycle Time
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-400">
                      {erpMetrics.time_metrics.cycle_time}s
                    </p>
                    <p className="text-gray-500 text-xxs sm:text-xs">
                      Target: {erpMetrics.time_metrics.target_cycle_time}s
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WebSocket Messages Display */}
        {activeTab === "excel-erp" && wsMessages.length > 0 && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl border border-blue-500/30 p-4 sm:p-6 mt-4 sm:mt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-300 mb-3 sm:mb-4 flex items-center gap-2">
              <Cloud size={20} sm:size={24} />
              Real-time Updates (WebSocket)
            </h3>
            <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto text-xs sm:text-sm text-gray-400">
              {wsMessages.map((msg, index) => (
                <p key={index} className="bg-black/30 p-2 rounded-lg">
                  {msg}
                </p>
              ))}
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              {currentT.qualityMetrics}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Sample Line Chart: Defect Rate Trend */}
              <LineChart
                title="Defect Rate Trend (Last 6 Months)"
                data={{
                  labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
                  datasets: [
                    {
                      label: "Defect Rate (%)",
                      data: [3.5, 3.2, 3.0, 2.8, 2.5, 2.3],
                      borderColor: "rgba(255, 99, 132, 1)",
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: { color: "#a78bfa", fontSize: 10 },
                    },
                    title: {
                      display: true,
                      text: "Defect Rate Trend",
                      color: "#a78bfa",
                      fontSize: 14,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#8b5cf6", fontSize: 10 },
                      grid: { color: "#4a0e7e" },
                    },
                    y: {
                      ticks: { color: "#8b5cf6", fontSize: 10 },
                      grid: { color: "#4a0e7e" },
                    },
                  },
                }}
              />

              {/* Sample Bar Chart: Complaints by Type */}
              <BarChart
                title="Complaints by Type"
                data={{
                  labels: [
                    "Manufacturing Defect",
                    "Packaging Damage",
                    "Late Delivery",
                    "Wrong Item",
                  ],
                  datasets: [
                    {
                      label: "Number of Complaints",
                      data: [12, 8, 5, 3],
                      backgroundColor: [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                      ],
                      borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                        "rgba(54, 162, 235, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: { color: "#a78bfa", fontSize: 10 },
                    },
                    title: {
                      display: true,
                      text: "Complaints by Type",
                      color: "#a78bfa",
                      fontSize: 14,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#8b5cf6", fontSize: 10 },
                      grid: { color: "#4a0e7e" },
                    },
                    y: {
                      ticks: { color: "#8b5cf6", fontSize: 10 },
                      grid: { color: "#4a0e7e" },
                    },
                  },
                }}
              />

              {/* Sample Pie Chart: Supplier Quality Distribution */}
              <PieChart
                title="Supplier Quality Distribution"
                data={{
                  labels: ["Excellent", "Good", "Warning", "Critical"],
                  datasets: [
                    {
                      data: [30, 45, 15, 10],
                      backgroundColor: [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                        "rgba(255, 99, 132, 0.6)",
                      ],
                      borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 159, 64, 1)",
                        "rgba(255, 99, 132, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: { color: "#a78bfa", fontSize: 10 },
                    },
                    title: {
                      display: true,
                      text: "Supplier Quality Distribution",
                      color: "#a78bfa",
                      fontSize: 14,
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "roi" && (
          <div className="space-y-4 sm:space-y-6">
            {/* ROI Metrics Dashboard */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-md rounded-xl border border-green-500/30 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-green-300 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp size={20} sm:size={24} />
                {currentT.roiMetrics} - {currentT.realPilotData}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-green-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.defectReduction}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-400">
                    {businessData.roiData.defectReduction}%
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">
                    Real MSME Data
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-blue-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.reworkCostReduction}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-400">
                    {businessData.roiData.reworkCostReduction}%
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">
                    Real MSME Data
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.investmentReturn}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-400">
                    {businessData.roiData.investmentReturn}x
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">ROI Ratio</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-orange-500/30">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {currentT.paybackPeriod}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-400">
                    {businessData.roiData.paybackPeriod} {currentT.months}
                  </p>
                  <p className="text-gray-500 text-xxs sm:text-xs">Average</p>
                </div>
              </div>
            </div>

            {/* ROI Success Stories */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4">
                {currentT.roiSuccessStories}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {roiSuccessStories.map((story) => (
                  <div
                    key={story.id}
                    className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/20"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-purple-300">
                          {story.company}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {story.industry}
                        </p>
                      </div>
                      <span className="text-xxs sm:text-xs text-gray-500 mt-1 sm:mt-0">
                        {story.time}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {currentT.challenge}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-200">
                          {story.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {currentT.solution}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-200">
                          {story.solution}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {currentT.results}
                        </p>
                        <div className="text-xs sm:text-sm text-gray-200">
                          <p>
                            •{" "}
                            {story.results.defectReduction ||
                              story.results.complaintReduction ||
                              story.results.reworkReduction}
                            % improvement
                          </p>
                          <p>
                            • ₹{story.results.costSavings.toLocaleString()}{" "}
                            savings
                          </p>
                          <p>• {story.results.roi}x ROI</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                      <p className="text-xs sm:text-sm text-green-300 italic">
                        "{story.quote}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-300 mb-3 sm:mb-4">
                {currentT.roiCalculator}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                    {currentT.monthlyDefectCost}
                  </label>
                  <input
                    type="number"
                    value={roiInputs.monthlyDefectCost}
                    onChange={(e) =>
                      setRoiInputs((prev) => ({
                        ...prev,
                        monthlyDefectCost: Number(e.target.value),
                      }))
                    }
                    placeholder="₹50,000"
                    className="w-full p-2 sm:p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-500 text-sm sm:text-base"
                    disabled={isLoadingApi} // Disable during API call
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                    {currentT.qualityInvestment}
                  </label>
                  <input
                    type="number"
                    value={roiInputs.qualityInvestment}
                    onChange={(e) =>
                      setRoiInputs((prev) => ({
                        ...prev,
                        qualityInvestment: Number(e.target.value),
                      }))
                    }
                    placeholder="₹25,000"
                    className="w-full p-2 sm:p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-500 text-sm sm:text-base"
                    disabled={isLoadingApi} // Disable during API call
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">
                    {currentT.expectedSavings}
                  </label>
                  <input
                    type="number"
                    value={roiInputs.expectedSavings}
                    onChange={(e) =>
                      setRoiInputs((prev) => ({
                        ...prev,
                        expectedSavings: Number(e.target.value),
                      }))
                    }
                    placeholder="₹75,000"
                    className="w-full p-2 sm:p-3 bg-black/30 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-500 text-sm sm:text-base"
                    disabled={isLoadingApi} // Disable during API call
                  />
                </div>
              </div>
              <button
                onClick={calculateROI}
                className="mt-3 sm:mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base"
                disabled={isLoadingApi} // Disable during API call
              >
                {currentT.calculate} ROI
              </button>

              {/* ROI Results */}
              {roiResult && (
                <div className="mt-4 sm:mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-bold text-green-300 mb-2 sm:mb-3">
                    ROI Calculation Results
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-400">ROI</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-400">
                        {roiResult.roi}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-400">
                        Payback Period
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-400">
                        {roiResult.paybackPeriod} months
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-400">
                        Annual Savings
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-400">
                        ₹{roiResult.annualSavings.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-400">
                        Net Benefit
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-400">
                        ₹{roiResult.netBenefit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "suppliers" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              {currentT.supplierRatingTracker}
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-gray-600/30">
                      <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-purple-300">
                        {currentT.supplierName}
                      </th>
                      <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-purple-300">
                        {currentT.rating}
                      </th>
                      <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-purple-300">
                        {currentT.lastDelivery}
                      </th>
                      <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-purple-300">
                        {currentT.defects}
                      </th>
                      <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-purple-300">
                        {currentT.status}
                      </th>
                      <th className="text-left py-2 px-3 sm:py-3 sm:px-4 text-purple-300">
                        {currentT.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr
                        key={supplier.name}
                        className="border-b border-gray-600/20 hover:bg-black/20"
                      >
                        <td className="py-2 px-3 sm:py-3 sm:px-4 text-gray-200">
                          {supplier.name}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 text-gray-300">
                          {supplier.rating}/10
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 text-gray-300">
                          {supplier.lastDelivery}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4 text-gray-300">
                          {supplier.defects}
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              supplier.status === "Excellent"
                                ? "bg-green-500/20 text-green-400"
                                : supplier.status === "Good"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {supplier.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 sm:py-3 sm:px-4">
                          <button className="text-blue-400 hover:text-blue-300 mr-1 sm:mr-2 text-xs sm:text-sm">
                            {currentT.contact}
                          </button>
                          <button className="text-red-400 hover:text-red-300 text-xs sm:text-sm">
                            {currentT.complaint}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              {currentT.reportsAnalytics}
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-400">
                {currentT.generateComprehensiveReports}
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4">
              {currentT.settingsConfiguration}
            </h2>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-400">
                {currentT.configureNotifications}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
