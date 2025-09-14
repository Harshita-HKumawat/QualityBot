import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, Star, Trophy, Clock, Calendar } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface QuizAttempt {
  id: string;
  date: string;
  timeTaken: number; // in seconds
  score: number;
  total: number;
  questions: QuizQuestion[];
}

interface StudentQuizProps {
  onQuizComplete: (score: number, total: number, timeTaken: number) => void;
}

export const StudentQuiz: React.FC<StudentQuizProps> = ({ onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);

  // Large pool of questions
  const allQuizQuestions: QuizQuestion[] = [
    // Cp/Cpk Questions
    {
      id: 1,
      question: "What does Cp measure in process capability analysis?",
      options: [
        "Process centering",
        "Process spread relative to specifications",
        "Process variation",
        "Process accuracy"
      ],
      correctAnswer: 1,
      explanation: "Cp measures the process spread relative to specification limits. It indicates how well the process variation fits within the specification range.",
      category: "Cp/Cpk"
    },
    {
      id: 2,
      question: "What does a Cp value of 1.33 indicate?",
      options: [
        "Process is barely capable",
        "Process is well within specifications",
        "Process is out of control",
        "Process needs immediate improvement"
      ],
      correctAnswer: 1,
      explanation: "Cp = 1.33 indicates the process spread is well within specification limits, showing good process capability.",
      category: "Cp/Cpk"
    },
    {
      id: 3,
      question: "What is the difference between Cp and Cpk?",
      options: [
        "Cp considers centering, Cpk doesn't",
        "Cpk considers centering, Cp doesn't",
        "Cp is for continuous data, Cpk for discrete",
        "There is no difference"
      ],
      correctAnswer: 1,
      explanation: "Cpk considers both process spread and centering, while Cp only considers spread relative to specifications.",
      category: "Cp/Cpk"
    },
    {
      id: 4,
      question: "A process with Cp = 2.0 and Cpk = 1.0 indicates:",
      options: [
        "Process is well centered and capable",
        "Process is capable but not centered",
        "Process is centered but not capable",
        "Process is neither centered nor capable"
      ],
      correctAnswer: 1,
      explanation: "High Cp (2.0) shows good spread, but low Cpk (1.0) indicates the process is not well centered within specifications.",
      category: "Cp/Cpk"
    },
    {
      id: 5,
      question: "What is the minimum acceptable Cp value for a capable process?",
      options: [
        "0.5",
        "1.0",
        "1.33",
        "2.0"
      ],
      correctAnswer: 2,
      explanation: "Cp ≥ 1.33 is generally considered the minimum for a capable process in most industries.",
      category: "Cp/Cpk"
    },

    // 5 Whys Questions
    {
      id: 6,
      question: "In 5 Whys analysis, how many times should you ask 'Why'?",
      options: [
        "Exactly 5 times",
        "Until you reach the root cause",
        "3-7 times depending on complexity",
        "As many times as needed"
      ],
      correctAnswer: 1,
      explanation: "The goal is to reach the root cause, not necessarily exactly 5 times. Sometimes it takes 3 times, sometimes 7 times.",
      category: "5 Whys"
    },
    {
      id: 7,
      question: "What is the main purpose of 5 Whys analysis?",
      options: [
        "To assign blame",
        "To identify root causes",
        "To document problems",
        "To create action plans"
      ],
      correctAnswer: 1,
      explanation: "5 Whys is a systematic approach to identify the root cause of a problem by repeatedly asking 'Why'.",
      category: "5 Whys"
    },
    {
      id: 8,
      question: "Which of the following is a common pitfall in 5 Whys analysis?",
      options: [
        "Asking too many questions",
        "Stopping too early",
        "Involving too many people",
        "Taking too much time"
      ],
      correctAnswer: 1,
      explanation: "A common pitfall is stopping at symptoms rather than continuing until you reach the true root cause.",
      category: "5 Whys"
    },

    // Quality Tools Questions
    {
      id: 9,
      question: "Which quality tool is best for identifying the most frequent defects?",
      options: [
        "Fishbone Diagram",
        "Pareto Chart",
        "Control Chart",
        "5 Whys Analysis"
      ],
      correctAnswer: 1,
      explanation: "Pareto Chart is specifically designed to identify the most frequent issues using the 80/20 principle.",
      category: "Quality Tools"
    },
    {
      id: 10,
      question: "What is the purpose of a Fishbone Diagram?",
      options: [
        "To show process flow",
        "To identify root causes",
        "To measure process capability",
        "To track trends over time"
      ],
      correctAnswer: 1,
      explanation: "Fishbone Diagram (Ishikawa) helps identify potential root causes by organizing them into categories like Man, Machine, Material, Method, Environment, and Measurement.",
      category: "Fishbone"
    },
    {
      id: 11,
      question: "What does the 80/20 rule in Pareto analysis mean?",
      options: [
        "80% of problems come from 20% of causes",
        "80% of time should be spent on 20% of tasks",
        "80% of defects are acceptable",
        "80% of processes are automated"
      ],
      correctAnswer: 0,
      explanation: "The Pareto principle states that roughly 80% of effects come from 20% of causes, helping prioritize improvement efforts.",
      category: "Quality Tools"
    },
    {
      id: 12,
      question: "Which tool is best for monitoring process stability over time?",
      options: [
        "Pareto Chart",
        "Control Chart",
        "Fishbone Diagram",
        "5 Whys Analysis"
      ],
      correctAnswer: 1,
      explanation: "Control Charts are specifically designed to monitor process stability and detect when a process goes out of control.",
      category: "Quality Tools"
    },
    {
      id: 13,
      question: "What are the three zones in a Control Chart?",
      options: [
        "Green, Yellow, Red",
        "Zone A, Zone B, Zone C",
        "Upper, Middle, Lower",
        "Safe, Warning, Danger"
      ],
      correctAnswer: 1,
      explanation: "Control charts typically have three zones: Zone A (closest to center line), Zone B (middle), and Zone C (outer zones).",
      category: "Quality Tools"
    },
    {
      id: 14,
      question: "What is the primary purpose of a Scatter Diagram?",
      options: [
        "To show trends over time",
        "To identify relationships between variables",
        "To categorize problems",
        "To measure process capability"
      ],
      correctAnswer: 1,
      explanation: "Scatter Diagrams help identify potential relationships between two variables by plotting data points.",
      category: "Quality Tools"
    },
    {
      id: 15,
      question: "Which quality tool is also known as the Ishikawa Diagram?",
      options: [
        "Pareto Chart",
        "Fishbone Diagram",
        "Control Chart",
        "Scatter Diagram"
      ],
      correctAnswer: 1,
      explanation: "The Fishbone Diagram was developed by Kaoru Ishikawa, hence it's also called the Ishikawa Diagram.",
      category: "Quality Tools"
    },

    // Quality Management Questions
    {
      id: 16,
      question: "What does TQM stand for?",
      options: [
        "Total Quality Management",
        "Team Quality Management",
        "Technical Quality Metrics",
        "Total Quality Metrics"
      ],
      correctAnswer: 0,
      explanation: "TQM stands for Total Quality Management, a comprehensive approach to quality improvement.",
      category: "Quality Management"
    },
    {
      id: 17,
      question: "What is the purpose of a Quality Policy?",
      options: [
        "To set quality standards",
        "To define organizational quality objectives",
        "To assign quality responsibilities",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "A Quality Policy defines the overall quality objectives and commitment of an organization.",
      category: "Quality Management"
    },
    {
      id: 18,
      question: "What is the first step in the PDCA cycle?",
      options: [
        "Plan",
        "Do",
        "Check",
        "Act"
      ],
      correctAnswer: 0,
      explanation: "PDCA stands for Plan-Do-Check-Act, with Plan being the first step in the continuous improvement cycle.",
      category: "Quality Management"
    },
    {
      id: 19,
      question: "What is the main goal of Six Sigma?",
      options: [
        "To reduce defects to 3.4 per million",
        "To improve customer satisfaction",
        "To reduce costs",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Six Sigma aims to reduce defects, improve customer satisfaction, and reduce costs through systematic improvement.",
      category: "Quality Management"
    },
    {
      id: 20,
      question: "What does DMAIC stand for in Six Sigma?",
      options: [
        "Define, Measure, Analyze, Improve, Control",
        "Design, Measure, Analyze, Implement, Control",
        "Define, Monitor, Analyze, Improve, Control",
        "Design, Monitor, Analyze, Implement, Control"
      ],
      correctAnswer: 0,
      explanation: "DMAIC is the core methodology of Six Sigma: Define, Measure, Analyze, Improve, Control.",
      category: "Quality Management"
    }
  ];

  // Function to shuffle and select random questions
  const shuffleQuestions = () => {
    const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5); // Select 5 random questions
  };

  // Initialize quiz with random questions
  useEffect(() => {
    setCurrentQuestions(shuffleQuestions());
    setStartTime(Date.now());
  }, []);

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestions[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = quizScore + (selectedAnswer === currentQuestions[currentQuestion].correctAnswer ? 1 : 0);
      const timeTaken = Math.round((Date.now() - startTime) / 1000); // Convert to seconds
      setQuizCompleted(true);
      onQuizComplete(finalScore, currentQuestions.length, timeTaken);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestions(shuffleQuestions()); // Get new random questions
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setStartTime(Date.now());
  };

  if (quizCompleted) {
    const finalScore = quizScore + (selectedAnswer === currentQuestions[currentQuestion].correctAnswer ? 1 : 0);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    return (
      <div className="bg-black/20 border border-gray-600/30 rounded-xl p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-200 mb-2">Quiz Completed!</h2>
        <div className="text-4xl font-bold text-purple-400 mb-4">{finalScore}/{currentQuestions.length}</div>
        
        <div className="flex justify-center items-center gap-6 mb-4 text-gray-300">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            <span>Time: {minutes}m {seconds}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-green-400" size={20} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="text-lg text-gray-300 mb-6">
          {finalScore === currentQuestions.length ? (
            <div className="flex items-center justify-center gap-2">
              <Star className="text-yellow-400" size={24} />
              Perfect Score! You are a Quality Star ⭐
            </div>
          ) : finalScore >= currentQuestions.length * 0.8 ? (
            'Excellent! You have great quality knowledge!'
          ) : finalScore >= currentQuestions.length * 0.6 ? (
            'Good job! Keep learning!'
          ) : (
            'Keep practicing! Quality management takes time to master.'
          )}
        </div>
        <button
          onClick={restartQuiz}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
        >
          Take New Quiz
        </button>
      </div>
    );
  }

  if (currentQuestions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="bg-black/20 border border-gray-600/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-200">Question {currentQuestion + 1} of {currentQuestions.length}</h2>
        <div className="text-purple-400 font-semibold">Score: {quizScore}</div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg text-gray-200 mb-4">{currentQuestions[currentQuestion]?.question}</h3>
        <div className="space-y-3">
          {currentQuestions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleQuizAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-lg border transition-all duration-300 text-left ${
                selectedAnswer === index
                  ? index === currentQuestions[currentQuestion]?.correctAnswer
                    ? 'bg-green-500/20 border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border-red-500/50 text-red-300'
                  : 'bg-gray-700/50 border-gray-600/50 text-gray-200 hover:bg-gray-600/50'
              }`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-400 mb-2">Explanation:</h4>
          <p className="text-gray-300">{currentQuestions[currentQuestion]?.explanation}</p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={nextQuestion}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          {currentQuestion < currentQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
}; 