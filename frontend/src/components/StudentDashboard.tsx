import React, { useState, useEffect } from "react";
import {
  Brain,
  BarChart3,
  Lightbulb,
  FileText,
  BookOpen,
  Trophy,
  Globe,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Target,
  Award,
  BookMarked,
  Calculator,
  LogOut,
  Clock,
  Calendar,
} from "lucide-react";
import { StudentQuiz } from "./StudentQuiz";
import { User as AppUser } from "../App"; // Import User interface from App.tsx

interface StudentDashboardProps {
  currentUser: AppUser;
  onLanguageChange: (lang: "en" | "hi") => void;
  currentLanguage: "en" | "hi";
  onLogout: () => void;
  onAccessChatbot: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onLanguageChange,
  currentLanguage,
  onLogout,
  onAccessChatbot,
}) => {
  const [activeTab, setActiveTab] = useState("home");
  const [showQuiz, setShowQuiz] = useState(false);
  const [studentProgress, setStudentProgress] = useState(() => {
    const savedProgress = currentUser?.id
      ? localStorage.getItem(`student-progress-${currentUser.id}`)
      : null;
    return savedProgress
      ? JSON.parse(savedProgress)
      : {
          xp: 0,
          level: 1,
          quizzesTaken: 0,
          toolsViewed: 0,
          conversationsSaved: 0,
        };
  });

  // Daily tips and tools that change based on date
  const dailyTips = [
    {
      en: "Always validate root cause before implementing solutions",
      hi: "समाधान लागू करने से पहले हमेशा मूल कारण को मान्य करें",
    },
    {
      en: "Measure twice, cut once - accuracy is key in quality management",
      hi: "दो बार मापें, एक बार काटें - गुणवत्ता प्रबंधन में सटीकता महत्वपूर्ण है",
    },
    {
      en: "Document everything - good records lead to better decisions",
      hi: "सब कुछ दस्तावेज़ करें - अच्छे रिकॉर्ड बेहतर निर्णय लेने में मदद करते हैं",
    },
    {
      en: "Focus on prevention rather than detection",
      hi: "पता लगाने के बजाय रोकथाम पर ध्यान दें",
    },
    {
      en: "Continuous improvement is a journey, not a destination",
      hi: "निरंतर सुधार एक यात्रा है, गंतव्य नहीं",
    },
    {
      en: "Quality is everyone's responsibility",
      hi: "गुणवत्ता सभी की जिम्मेदारी है",
    },
    {
      en: "Standardize processes to reduce variation",
      hi: "भिन्नता को कम करने के लिए प्रक्रियाओं को मानकीकृत करें",
    },
  ];

  const dailyTools = [
    {
      name: { en: "Control Chart", hi: "नियंत्रण चार्ट" },
      desc: {
        en: "Monitor process stability over time",
        hi: "समय के साथ प्रक्रिया स्थिरता की निगरानी करें",
      },
    },
    {
      name: { en: "Pareto Chart", hi: "परेटो चार्ट" },
      desc: {
        en: "Identify the most critical quality issues",
        hi: "सबसे महत्वपूर्ण गुणवत्ता मुद्दों की पहचान करें",
      },
    },
    {
      name: { en: "Fishbone Diagram", hi: "फिशबोन डायग्राम" },
      desc: {
        en: "Analyze root causes systematically",
        hi: "मूल कारणों का व्यवस्थित विश्लेषण करें",
      },
    },
    {
      name: { en: "5 Whys Analysis", hi: "5 क्यों विश्लेषण" },
      desc: {
        en: "Dig deeper into problem causes",
        hi: "समस्या के कारणों में गहराई से जाएं",
      },
    },
    {
      name: { en: "Cp/Cpk Calculator", hi: "Cp/Cpk कैलकुलेटर" },
      desc: {
        en: "Measure process capability",
        hi: "प्रक्रिया क्षमता को मापें",
      },
    },
    {
      name: { en: "FMEA", hi: "FMEA" },
      desc: {
        en: "Identify potential failure modes",
        hi: "संभावित विफलता मोड की पहचान करें",
      },
    },
    {
      name: { en: "PDCA Cycle", hi: "PDCA चक्र" },
      desc: {
        en: "Plan-Do-Check-Act for continuous improvement",
        hi: "निरंतर सुधार के लिए योजना-करें-जांचें-कार्य करें",
      },
    },
  ];

  // Get daily tip and tool based on current date
  const getDailyContent = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const tipIndex = dayOfYear % dailyTips.length;
    const toolIndex = dayOfYear % dailyTools.length;

    return {
      tip: dailyTips[tipIndex],
      tool: dailyTools[toolIndex],
    };
  };

  const dailyContent = getDailyContent();

  const translations = {
    en: {
      home: "Home",
      quiz: "Quiz Zone",
      tools: "Tool Visualizer",
      tips: "Daily Tips",
      cases: "Case Studies",
      achievements: "Achievements",
      language: "Language",
      welcome: "Welcome back, Student!",
      welcomeSubtitle:
        "Ready to master quality management? Let's learn together!",
      dailyTip: "Daily Quality Tip",
      dailyTipText: "Always validate root cause before implementing solutions",
      toolOfDay: "Tool of the Day",
      toolOfDayText: "Control Chart",
      startQuiz: "Start Quiz",
      viewTools: "View Tools",
      readCases: "Read Case Studies",
      yourProgress: "Your Progress",
      xp: "XP",
      level: "Level",
      quizzesTaken: "Quizzes Taken",
      toolsViewed: "Tools Viewed",
      conversationsSaved: "Conversations Saved",
      qualityTools: "Quality Tools",
      toolVisualizer: "Quality Tool Visualizer",
      paretoChart: "Pareto Chart",
      paretoDescription:
        "Shows the most frequent quality issues in descending order",
      fishboneDiagram: "Fishbone Diagram",
      fishboneDescription:
        "Identifies potential root causes of quality problems",
      realWorldCases: "Real-World Case Studies",
      toyotaTitle: "Toyota's Fishbone Success",
      toyotaSummary:
        "How Toyota used Fishbone diagrams to solve production line defects",
      toyotaDetails:
        "Toyota implemented Fishbone diagrams to systematically analyze production line defects. They identified root causes in four main categories: Man (operator training), Machine (equipment maintenance), Method (process procedures), and Material (supplier quality). This led to a 40% reduction in defects and improved overall production efficiency.",
      samsungTitle: "Samsung's Pareto Strategy",
      samsungSummary:
        "Samsung Electronics used Pareto analysis to prioritize quality improvements",
      samsungDetails:
        "Samsung applied Pareto analysis to their smartphone manufacturing process. They discovered that 80% of quality issues came from just 20% of defect types. By focusing improvement efforts on these critical defects, they achieved a 60% reduction in customer complaints and increased customer satisfaction scores.",
      hondaTitle: "Honda's Control Charts",
      hondaSummary:
        "Honda used Statistical Process Control to monitor engine quality",
      hondaDetails:
        "Honda implemented Control Charts to monitor engine component dimensions during manufacturing. They set up real-time monitoring systems that alerted operators when processes went out of control. This proactive approach prevented defective engines from reaching customers and saved millions in warranty costs.",
      readMore: "Read More",
      close: "Close",
      yourAchievements: "Your Achievements",
      quizMaster: "Quiz Master",
      quizMasterDesc: "Completed your first quiz",
      toolExplorer: "Tool Explorer",
      toolExplorerDesc: "Viewed all quality tools",
      chatChampion: "Chat Champion",
      chatChampionDesc: "Saved 5 conversations",
      levelProgress: "Level Progress",
    },
    hi: {
      home: "होम",
      quiz: "क्विज़ ज़ोन",
      tools: "टूल विज़ुअलाइज़र",
      tips: "दैनिक टिप्स",
      cases: "केस स्टडीज़",
      achievements: "उपलब्धियां",
      language: "भाषा",
      welcome: "वापसी पर स्वागत है, छात्र!",
      welcomeSubtitle:
        "गुणवत्ता प्रबंधन में महारत हासिल करने के लिए तैयार हैं? आइए एक साथ सीखें!",
      dailyTip: "दैनिक गुणवत्ता टिप",
      dailyTipText: "समाधान लागू करने से पहले हमेशा मूल कारण को मान्य करें",
      toolOfDay: "आज का टूल",
      toolOfDayText: "नियंत्रण चार्ट",
      startQuiz: "क्विज़ शुरू करें",
      viewTools: "टूल देखें",
      readCases: "केस स्टडीज़ पढ़ें",
      yourProgress: "आपकी प्रगति",
      xp: "अनुभव",
      level: "स्तर",
      quizzesTaken: "क्विज़ लिए गए",
      toolsViewed: "टूल देखे गए",
      conversationsSaved: "बातचीत सहेजी गई",
      qualityTools: "गुणवत्ता उपकरण",
      toolVisualizer: "गुणवत्ता टूल विज़ुअलाइज़र",
      paretoChart: "परेटो चार्ट",
      paretoDescription:
        "सबसे अधिक बार आने वाले गुणवत्ता मुद्दों को अवरोही क्रम में दिखाता है",
      fishboneDiagram: "फिशबोन डायग्राम",
      fishboneDescription:
        "गुणवत्ता समस्याओं के संभावित मूल कारणों की पहचान करता है",
      realWorldCases: "वास्तविक दुनिया के केस स्टडीज़",
      toyotaTitle: "टोयोटा की फिशबोन सफलता",
      toyotaSummary:
        "टोयोटा ने उत्पादन लाइन दोषों को हल करने के लिए फिशबोन डायग्राम का उपयोग कैसे किया",
      toyotaDetails:
        "टोयोटा ने उत्पादन लाइन दोषों का व्यवस्थित विश्लेषण करने के लिए फिशबोन डायग्राम लागू किए। उन्होंने चार मुख्य श्रेणियों में मूल कारणों की पहचान की: मनुष्य (ऑपरेटर प्रशिक्षण), मशीन (उपकरण रखरखाव), विधि (प्रक्रिया प्रक्रियाएं), और सामग्री (आपूर्तिकर्ता गुणवत्ता)। इससे दोषों में 40% की कमी आई और समग्र उत्पादन दक्षता में सुधार हुआ।",
      samsungTitle: "सैमसंग की परेटो रणनीति",
      samsungSummary:
        "सैमसंग इलेक्ट्रॉनिक्स ने गुणवत्ता सुधारों को प्राथमिकता देने के लिए परेटो विश्लेषण का उपयोग किया",
      samsungDetails:
        "सैमसंग ने अपनी स्मार्टफोन निर्माण प्रक्रिया में परेटो विश्लेषण लागू किया। उन्होंने पाया कि 80% गुणवत्ता मुद्दे केवल 20% दोष प्रकारों से आते हैं। इन महत्वपूर्ण दोषों पर सुधार प्रयासों पर ध्यान केंद्रित करके, उन्होंने ग्राहक शिकायतों में 60% की कमी हासिल की और ग्राहक संतुष्टि स्कोर में वृद्धि की।",
      hondaTitle: "होंडा के नियंत्रण चार्ट",
      hondaSummary:
        "होंडा ने इंजन गुणवत्ता की निगरानी के लिए सांख्यिकीय प्रक्रिया नियंत्रण का उपयोग किया",
      hondaDetails:
        "होंडा ने निर्माण के दौरान इंजन घटक आयामों की निगरानी के लिए नियंत्रण चार्ट लागू किए। उन्होंने रीयल-टाइम निगरानी सिस्टम स्थापित किए जो ऑपरेटरों को सचेत करते थे जब प्रक्रियाएं नियंत्रण से बाहर हो जाती थीं। इस सक्रिय दृष्टिकोण ने दोषपूर्ण इंजनों को ग्राहकों तक पहुंचने से रोका और वारंटी लागतों में लाखों की बचत की।",
      readMore: "और पढ़ें",
      close: "बंद करें",
      yourAchievements: "आपकी उपलब्धियां",
      quizMaster: "क्विज़ मास्टर",
      quizMasterDesc: "अपना पहला क्विज़ पूरा किया",
      toolExplorer: "टूल एक्सप्लोरर",
      toolExplorerDesc: "सभी गुणवत्ता टूल देखे",
      chatChampion: "चैट चैंपियन",
      chatChampionDesc: "5 बातचीत सहेजी",
      levelProgress: "स्तर प्रगति",
    },
  };

  const t = translations[currentLanguage];

  const handleQuizComplete = (
    score: number,
    total: number,
    timeTaken: number
  ) => {
    const newXP = studentProgress.xp + score * 10;
    const newLevel = Math.floor(newXP / 100) + 1;

    const newProgress = {
      ...studentProgress,
      xp: newXP,
      level: newLevel,
      quizzesTaken: studentProgress.quizzesTaken + 1,
    };
    setStudentProgress(newProgress);
    localStorage.setItem(
      `student-progress-${currentUser?.id}`,
      JSON.stringify(newProgress)
    );
    setShowQuiz(false);

    // Save quiz attempt
    const newAttempt = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      timeTaken,
      score,
      total,
    };

    const updatedAttempts = [...quizAttempts, newAttempt];
    setQuizAttempts(updatedAttempts);
    localStorage.setItem(
      `quiz-attempts-${currentUser?.id}`,
      JSON.stringify(updatedAttempts)
    );

    // Show quiz results
    setQuizResults({
      score,
      total,
      completed: true,
      timeTaken,
      date: new Date().toLocaleDateString(),
    });
  };

  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    completed: boolean;
    timeTaken?: number;
    date?: string;
  } | null>(null);

  const [quizAttempts, setQuizAttempts] = useState<
    Array<{
      id: string;
      date: string;
      timeTaken: number;
      score: number;
      total: number;
    }>
  >([]);

  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(
    null
  );

  // Load saved quiz attempts and progress on component mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem(
      `quiz-attempts-${currentUser?.id}`
    );
    if (savedAttempts && currentUser?.id) {
      setQuizAttempts(JSON.parse(savedAttempts));
    } else {
      setQuizAttempts([]);
    }

    const savedProgress = localStorage.getItem(
      `student-progress-${currentUser?.id}`
    );
    if (savedProgress && currentUser?.id) {
      setStudentProgress(JSON.parse(savedProgress));
    } else {
      setStudentProgress({
        xp: 0,
        level: 1,
        quizzesTaken: 0,
        toolsViewed: 0,
        conversationsSaved: 0,
      });
    }
  }, []);

  const renderHome = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
          {currentLanguage === "hi"
            ? `वापसी पर स्वागत है, ${currentUser?.name || "छात्र"}!`
            : `Welcome back, ${currentUser?.name || "Student"}!`}
        </h2>
        <p className="text-sm sm:text-base text-purple-100">
          {t.welcomeSubtitle}
        </p>
      </div>

      {/* Daily Tip & Tool */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-500 group">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Lightbulb
              className="text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300"
              size={20}
              sm:size={24}
            />
            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
              {t.dailyTip}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
            {currentLanguage === "en"
              ? dailyContent.tip.en
              : dailyContent.tip.hi}
          </p>
          <div className="mt-2 sm:mt-3 text-xs text-yellow-600/70">
            {currentLanguage === "en"
              ? "Updated daily"
              : "दैनिक अपडेट किया गया"}
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-500 group">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Target
              className="text-blue-500 group-hover:text-blue-400 transition-colors duration-300"
              size={20}
              sm:size={24}
            />
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
              {t.toolOfDay}
            </h3>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-sm sm:text-base text-blue-300 font-semibold">
              {currentLanguage === "en"
                ? dailyContent.tool.name.en
                : dailyContent.tool.name.hi}
            </p>
            <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
              {currentLanguage === "en"
                ? dailyContent.tool.desc.en
                : dailyContent.tool.desc.hi}
            </p>
          </div>
          <div className="mt-2 sm:mt-3 text-xs text-blue-600/70">
            {currentLanguage === "en"
              ? "Updated daily"
              : "दैनिक अपडेट किया गया"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowQuiz(true)}
          className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 hover:bg-purple-500/20 transition-all duration-300 text-center"
        >
          <Brain
            className="text-purple-400 mx-auto mb-2"
            size={28}
            sm:size={32}
          />
          <h3 className="font-semibold text-purple-300 text-base sm:text-lg">
            {t.startQuiz}
          </h3>
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 hover:bg-green-500/20 transition-all duration-300 text-center"
        >
          <BarChart3
            className="text-green-400 mx-auto mb-2"
            size={28}
            sm:size={32}
          />
          <h3 className="font-semibold text-green-300 text-base sm:text-lg">
            {t.viewTools}
          </h3>
        </button>

        <button
          onClick={() => setActiveTab("cases")}
          className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 hover:bg-orange-500/20 transition-all duration-300 text-center"
        >
          <BookOpen
            className="text-orange-400 mx-auto mb-2"
            size={28}
            sm:size={32}
          />
          <h3 className="font-semibold text-orange-300 text-base sm:text-lg">
            {t.readCases}
          </h3>
        </button>
      </div>

      {/* Quiz Results */}
      {quizResults && quizResults.completed && (
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎉</div>
            <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-1 sm:mb-2">
              {currentLanguage === "en"
                ? "Quiz Completed!"
                : "क्विज़ पूरा हुआ!"}
            </h3>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-3 sm:mb-4">
              {quizResults.score}/{quizResults.total}
            </div>
            {quizResults.timeTaken && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mb-3 sm:mb-4 text-gray-300 text-sm sm:text-base">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="text-blue-400" size={16} sm:size={20} />
                  <span>
                    Time: {Math.floor(quizResults.timeTaken / 60)}m{" "}
                    {quizResults.timeTaken % 60}s
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="text-green-400" size={16} sm:size={20} />
                  <span>{quizResults.date}</span>
                </div>
              </div>
            )}
            <div className="text-base sm:text-lg text-gray-300 mb-3 sm:mb-4">
              {quizResults.score === quizResults.total ? (
                <div className="flex items-center justify-center gap-2">
                  <Star className="text-yellow-400" size={16} sm:size={20} />
                  {currentLanguage === "en"
                    ? "Perfect Score! You are a Quality Star ⭐"
                    : "बिल्कुल सही! आप एक गुणवत्ता स्टार हैं ⭐"}
                </div>
              ) : quizResults.score >= quizResults.total * 0.8 ? (
                currentLanguage === "en" ? (
                  "Excellent! You have great quality knowledge!"
                ) : (
                  "बहुत बढ़िया! आपके पास बेहतरीन गुणवत्ता ज्ञान है!"
                )
              ) : quizResults.score >= quizResults.total * 0.6 ? (
                currentLanguage === "en" ? (
                  "Good job! Keep learning!"
                ) : (
                  "अच्छा काम! सीखते रहें!"
                )
              ) : currentLanguage === "en" ? (
                "Keep practicing! Quality management takes time to master."
              ) : (
                "अभ्यास करते रहें! गुणवत्ता प्रबंधन में महारत हासिल करने में समय लगता है।"
              )}
            </div>
            <button
              onClick={() => setQuizResults(null)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              {currentLanguage === "en" ? "Close" : "बंद करें"}
            </button>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-3 sm:mb-4">
          {t.yourProgress}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-400">
              {studentProgress.xp}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">{t.xp}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-400">
              {studentProgress.level}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">{t.level}</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              {studentProgress.quizzesTaken}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              {t.quizzesTaken}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-yellow-400">
              {studentProgress.toolsViewed}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              {t.toolsViewed}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-400">
              {studentProgress.conversationsSaved}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              {t.conversationsSaved}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-gray-600/30 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-300">
            Student Dashboard
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onAccessChatbot}
              className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2 hover:bg-blue-600/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Brain className="text-blue-400" size={14} sm:size={16} />
              <span className="text-blue-300">
                {currentLanguage === "en"
                  ? "Access Chatbot"
                  : "चैटबॉट एक्सेस करें"}
              </span>
            </button>

            <button
              onClick={() =>
                onLanguageChange(currentLanguage === "en" ? "hi" : "en")
              }
              className="flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-2 hover:bg-purple-600/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Globe className="text-purple-400" size={14} sm:size={16} />
              <span className="text-purple-300">
                {currentLanguage === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 hover:bg-red-500/30 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <LogOut className="text-red-400" size={14} sm:size={16} />
              <span className="text-red-300">
                {currentLanguage === "en" ? "Logout" : "लॉगआउट"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 border-b border-gray-600/30">
        <div className="flex overflow-x-auto justify-between sm:justify-start">
          {[
            { id: "home", label: t.home, icon: "🏠" },
            { id: "quiz", label: t.quiz, icon: "🧠" },
            { id: "tools", label: t.tools, icon: "📊" },
            { id: "cases", label: t.cases, icon: "📚" },
            { id: "achievements", label: t.achievements, icon: "🏅" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab.id
                  ? "bg-purple-600/20 border-b-2 border-purple-500 text-purple-300"
                  : "text-gray-400 hover:text-gray-300 hover:bg-black/20"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {showQuiz ? (
          <StudentQuiz onQuizComplete={handleQuizComplete} />
        ) : (
          <>
            {activeTab === "home" && renderHome()}
            {activeTab === "quiz" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-base sm:text-lg"
                  >
                    <Brain className="inline mr-2" size={20} sm:size={24} />
                    {currentLanguage === "hi"
                      ? "गुणवत्ता प्रबंधन क्विज़ शुरू करें"
                      : "Start Quality Management Quiz"}
                  </button>
                </div>

                {/* Quiz History */}
                {quizAttempts.length > 0 && (
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-3 sm:mb-4">
                      {currentLanguage === "en"
                        ? "Quiz History"
                        : "क्विज़ इतिहास"}
                    </h3>
                    <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-64 overflow-y-auto">
                      {quizAttempts
                        .slice()
                        .reverse()
                        .map((attempt) => (
                          <div
                            key={attempt.id}
                            className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 sm:p-4"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
                                <div className="text-center">
                                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                                    {attempt.score}/{attempt.total}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {currentLanguage === "en"
                                      ? "Score"
                                      : "स्कोर"}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-sm sm:text-base">
                                  <Clock
                                    className="text-blue-400"
                                    size={14}
                                    sm:size={16}
                                  />
                                  <span>
                                    {Math.floor(attempt.timeTaken / 60)}m{" "}
                                    {attempt.timeTaken % 60}s
                                  </span>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <div className="text-xs sm:text-sm text-gray-300">
                                  {attempt.date}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {currentLanguage === "en" ? "Date" : "दिनांक"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "tools" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-2 sm:mb-4">
                    {t.toolVisualizer}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400 max-w-full sm:max-w-2xl mx-auto px-4">
                    {currentLanguage === "en"
                      ? "Explore essential quality management tools with interactive visualizations and detailed explanations"
                      : "इंटरैक्टिव विज़ुअलाइज़ेशन और विस्तृत स्पष्टीकरण के साथ आवश्यक गुणवत्ता प्रबंधन उपकरणों का अन्वेषण करें"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Pareto Chart */}
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-red-500/50 hover:scale-105 transition-all duration-500 group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <BarChart3
                        className="text-red-400 group-hover:text-red-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {t.paretoChart}
                      </h3>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-end justify-center gap-2 p-3 sm:p-4 mb-3 sm:mb-4">
                      <div className="bg-red-500 h-32 w-6 sm:w-8 rounded-t group-hover:bg-red-400 transition-all duration-300 animate-pulse"></div>
                      <div
                        className="bg-orange-500 h-24 w-6 sm:w-8 rounded-t group-hover:bg-orange-400 transition-all duration-300 animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="bg-yellow-500 h-16 w-6 sm:w-8 rounded-t group-hover:bg-yellow-400 transition-all duration-300 animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <div
                        className="bg-green-500 h-12 w-6 sm:w-8 rounded-t group-hover:bg-green-400 transition-all duration-300 animate-pulse"
                        style={{ animationDelay: "0.6s" }}
                      ></div>
                      <div
                        className="bg-blue-500 h-8 w-6 sm:w-8 rounded-t group-hover:bg-blue-400 transition-all duration-300 animate-pulse"
                        style={{ animationDelay: "0.8s" }}
                      ></div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {t.paretoDescription}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-red-600/70">
                      {currentLanguage === "en"
                        ? "80/20 Rule Visualization"
                        : "80/20 नियम विज़ुअलाइज़ेशन"}
                    </div>
                  </div>

                  {/* Fishbone Diagram */}
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-blue-500/50 hover:scale-105 transition-all duration-500 group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <BarChart3
                        className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {t.fishboneDiagram}
                      </h3>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <div className="text-center">
                        <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 group-hover:text-gray-300 transition-colors duration-300">
                          Problem
                        </div>
                        <div className="w-24 sm:w-32 h-1 bg-gray-600 mx-auto group-hover:bg-blue-400 transition-colors duration-300"></div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
                          <div className="text-xxs sm:text-xs text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                            Man
                          </div>
                          <div className="text-xxs sm:text-xs text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                            Machine
                          </div>
                          <div className="text-xxs sm:text-xs text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                            Material
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {t.fishboneDescription}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-blue-600/70">
                      {currentLanguage === "en"
                        ? "Root Cause Analysis"
                        : "मूल कारण विश्लेषण"}
                    </div>
                  </div>

                  {/* Control Chart */}
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-green-500/50 hover:scale-105 transition-all duration-500 group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <TrendingUp
                        className="text-green-400 group-hover:text-green-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {currentLanguage === "en"
                          ? "Control Chart"
                          : "नियंत्रण चार्ट"}
                      </h3>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <svg
                        className="w-full h-full p-3 sm:p-4"
                        viewBox="0 0 200 100"
                      >
                        <line
                          x1="20"
                          y1="50"
                          x2="180"
                          y2="50"
                          stroke="#6B7280"
                          strokeWidth="1"
                          className="group-hover:stroke-green-400 transition-colors duration-300"
                        />
                        <line
                          x1="20"
                          y1="20"
                          x2="180"
                          y2="20"
                          stroke="#EF4444"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                          className="group-hover:stroke-red-400 transition-colors duration-300"
                        />
                        <line
                          x1="20"
                          y1="80"
                          x2="180"
                          y2="80"
                          stroke="#EF4444"
                          strokeWidth="1"
                          strokeDasharray="5,5"
                          className="group-hover:stroke-red-400 transition-colors duration-300"
                        />
                        <path
                          d="M20 60 L40 45 L60 55 L80 40 L100 50 L120 35 L140 45 L160 30 L180 40"
                          stroke="#10B981"
                          strokeWidth="2"
                          fill="none"
                          className="group-hover:stroke-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="20"
                          cy="60"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="40"
                          cy="45"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="60"
                          cy="55"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="80"
                          cy="40"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="100"
                          cy="50"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="120"
                          cy="35"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="140"
                          cy="45"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="160"
                          cy="30"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                        <circle
                          cx="180"
                          cy="40"
                          r="2"
                          fill="#10B981"
                          className="group-hover:fill-green-300 transition-colors duration-300"
                        />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "Monitor process stability and detect variations"
                        : "प्रक्रिया स्थिरता की निगरानी करें और भिन्नताओं का पता लगाएं"}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-green-600/70">
                      {currentLanguage === "en"
                        ? "Statistical Process Control"
                        : "सांख्यिकीय प्रक्रिया नियंत्रण"}
                    </div>
                  </div>

                  {/* 5 Whys Analysis */}
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-purple-500/50 hover:scale-105 transition-all duration-500 group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Brain
                        className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {currentLanguage === "en"
                          ? "5 Whys Analysis"
                          : "5 क्यों विश्लेषण"}
                      </h3>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
                          Why 1?
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
                          Why 2?
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
                          Why 3?
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
                          Why 4?
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors duration-300">
                          Why 5?
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "Ask why five times to find root cause"
                        : "मूल कारण खोजने के लिए पांच बार क्यों पूछें"}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-purple-600/70">
                      {currentLanguage === "en"
                        ? "Root Cause Investigation"
                        : "मूल कारण जांच"}
                    </div>
                  </div>

                  {/* Cp/Cpk Calculator */}
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-orange-500/50 hover:scale-105 transition-all duration-500 group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Calculator
                        className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {currentLanguage === "en"
                          ? "Cp/Cpk Calculator"
                          : "Cp/Cpk कैलकुलेटर"}
                      </h3>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors duration-300">
                          Cp/Cpk
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 group-hover:text-gray-400 transition-colors duration-300">
                          {currentLanguage === "en"
                            ? "Process Capability"
                            : "प्रक्रिया क्षमता"}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "Calculate process capability indices"
                        : "प्रक्रिया क्षमता सूचकांकों की गणना करें"}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-orange-600/70">
                      {currentLanguage === "en"
                        ? "Statistical Analysis"
                        : "सांख्यिकीय विश्लेषण"}
                    </div>
                  </div>

                  {/* FMEA */}
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-pink-500/50 hover:scale-105 transition-all duration-500 group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <FileText
                        className="text-pink-400 group-hover:text-pink-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        FMEA
                      </h3>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-800/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <div className="text-center space-y-1 sm:space-y-2">
                        <div className="text-xxs sm:text-xs text-gray-500 group-hover:text-pink-400 transition-colors duration-300">
                          Failure Mode
                        </div>
                        <div className="text-xxs sm:text-xs text-gray-500 group-hover:text-pink-400 transition-colors duration-300">
                          Effects
                        </div>
                        <div className="text-xxs sm:text-xs text-gray-500 group-hover:text-pink-400 transition-colors duration-300">
                          Analysis
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "Identify potential failure modes and their effects"
                        : "संभावित विफलता मोड और उनके प्रभावों की पहचान करें"}
                    </p>
                    <div className="mt-2 sm:mt-3 text-xs text-pink-600/70">
                      {currentLanguage === "en"
                        ? "Risk Assessment"
                        : "जोखिम मूल्यांकन"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "cases" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4 sm:mb-6">
                  {t.realWorldCases}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-orange-500/50 hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <BookOpen
                        className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {t.toyotaTitle}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 group-hover:text-gray-300 transition-colors duration-300">
                      {t.toyotaSummary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors duration-300">
                        Toyota
                      </span>
                      <button
                        onClick={() => setSelectedCaseStudy("toyota")}
                        className="bg-purple-600 hover:bg-purple-700 hover:scale-110 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                      >
                        {t.readMore}
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-blue-500/50 hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <BookOpen
                        className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {t.samsungTitle}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 group-hover:text-gray-300 transition-colors duration-300">
                      {t.samsungSummary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors duration-300">
                        Samsung
                      </span>
                      <button
                        onClick={() => setSelectedCaseStudy("samsung")}
                        className="bg-purple-600 hover:bg-purple-700 hover:scale-110 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                      >
                        {t.readMore}
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6 hover:bg-black/30 hover:border-green-500/50 hover:scale-105 transition-all duration-500 cursor-pointer group">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <BookOpen
                        className="text-orange-400 group-hover:text-orange-300 transition-colors duration-300"
                        size={20}
                        sm:size={24}
                      />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                        {t.hondaTitle}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 group-hover:text-gray-300 transition-colors duration-300">
                      {t.hondaSummary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors duration-300">
                        Honda
                      </span>
                      <button
                        onClick={() => setSelectedCaseStudy("honda")}
                        className="bg-purple-600 hover:bg-purple-700 hover:scale-110 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                      >
                        {t.readMore}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Case Study Modal */}
                {selectedCaseStudy && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-gray-900 border border-gray-600/30 rounded-xl p-4 sm:p-6 max-w-full sm:max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto mx-auto my-auto">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-200">
                          {selectedCaseStudy === "toyota" && t.toyotaTitle}
                          {selectedCaseStudy === "samsung" && t.samsungTitle}
                          {selectedCaseStudy === "honda" && t.hondaTitle}
                        </h3>
                        <button
                          onClick={() => setSelectedCaseStudy(null)}
                          className="text-gray-400 hover:text-white transition-colors duration-300 text-lg sm:text-xl"
                          title={t.close}
                        >
                          <XCircle size={20} sm:size={24} />
                        </button>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <BookOpen
                            className="text-orange-400"
                            size={18}
                            sm:size={20}
                          />
                          <span className="text-purple-400 font-semibold text-sm sm:text-base">
                            {selectedCaseStudy === "toyota" && "Toyota"}
                            {selectedCaseStudy === "samsung" && "Samsung"}
                            {selectedCaseStudy === "honda" && "Honda"}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          {selectedCaseStudy === "toyota" && t.toyotaDetails}
                          {selectedCaseStudy === "samsung" && t.samsungDetails}
                          {selectedCaseStudy === "honda" && t.hondaDetails}
                        </p>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedCaseStudy(null)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
                          >
                            {t.close}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "achievements" && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-200 mb-4 sm:mb-6">
                  {t.yourAchievements}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-black/20 border border-yellow-500/50 rounded-xl p-4 sm:p-6 text-center hover:bg-yellow-500/10 hover:border-yellow-400/70 hover:scale-105 transition-all duration-500 group cursor-pointer">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 group-hover:animate-bounce transition-all duration-300">
                      🏅
                    </div>
                    <h3 className="font-semibold mb-2 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 text-base sm:text-lg">
                      {t.quizMaster}
                    </h3>
                    <p className="text-sm text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300">
                      {t.quizMasterDesc}
                    </p>
                    <div className="mt-3 text-xs text-yellow-600/70 group-hover:text-yellow-500/90 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "Achievement Unlocked!"
                        : "उपलब्धि अनलॉक!"}
                    </div>
                  </div>
                  <div className="bg-black/20 border border-gray-600/50 rounded-xl p-4 sm:p-6 text-center hover:bg-blue-500/10 hover:border-blue-400/70 hover:scale-105 transition-all duration-500 group cursor-pointer">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300">
                      📊
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-400 group-hover:text-blue-300 transition-colors duration-300 text-base sm:text-lg">
                      {t.toolExplorer}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-blue-400 transition-colors duration-300">
                      {t.toolExplorerDesc}
                    </p>
                    <div className="mt-3 text-xs text-gray-600/70 group-hover:text-blue-500/90 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "View all tools to unlock"
                        : "सभी टूल देखने के लिए अनलॉक करें"}
                    </div>
                  </div>
                  <div className="bg-black/20 border border-gray-600/50 rounded-xl p-4 sm:p-6 text-center hover:bg-green-500/10 hover:border-green-400/70 hover:scale-105 transition-all duration-500 group cursor-pointer">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300">
                      💬
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-400 group-hover:text-green-300 transition-colors duration-300 text-base sm:text-lg">
                      {t.chatChampion}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-green-400 transition-colors duration-300">
                      {t.chatChampionDesc}
                    </p>
                    <div className="mt-3 text-xs text-gray-600/70 group-hover:text-green-500/90 transition-colors duration-300">
                      {currentLanguage === "en"
                        ? "Save 5 conversations to unlock"
                        : "5 बातचीत सहेजने के लिए अनलॉक करें"}
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 border border-gray-600/30 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3 sm:mb-4">
                    {t.levelProgress}
                  </h3>
                  <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mb-1 sm:mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 sm:h-4 rounded-full transition-all duration-300"
                      style={{ width: `${studentProgress.xp % 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                    <span>
                      {t.level} {studentProgress.level}
                    </span>
                    <span>
                      {studentProgress.xp % 100}/100 {t.xp}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
