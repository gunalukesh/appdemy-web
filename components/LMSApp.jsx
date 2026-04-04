import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { BookOpen, Users, Video, Brain, MessageCircle, Bell, Settings, ChevronRight, ChevronDown, Play, CheckCircle, Clock, Award, TrendingUp, Eye, AlertTriangle, Star, Calendar, BarChart2, Shield, Globe, User, LogOut, Menu, X, Home, FileText, HelpCircle, Zap, Target, Activity, Layers } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// SAMACHEER KALVI LMS — Production Prototype
// 6 Roles | Bilingual (Tamil/English) | All 4 Core Features
// ═══════════════════════════════════════════════════════════════

const COLORS = { orange: "#FF4A13", clay: "#B8563B", blue: "#A5BAC2", grey: "#E4E9EB", granite: "#292827", white: "#FFFFFF" };

// ── i18n ─────────────────────────────────────────────────
const T = {
  en: {
    appName: "Samacheer Kalvi LMS", login: "Login", logout: "Logout", switchLang: "தமிழ்",
    student: "Student", teacher: "Teacher", parent: "Parent", admin: "Admin", contentMgr: "Content Manager", superAdmin: "Super Admin",
    dashboard: "Dashboard", lessons: "Lessons", quizzes: "Quizzes", doubts: "Doubts", concentration: "Focus Tracker", reports: "Reports", settings: "Settings", users: "Users", content: "Content", analytics: "Analytics", revenue: "Revenue", roles: "Roles",
    welcome: "Welcome back", todayGoal: "Today's Goal", streak: "Day Streak", completed: "Completed", inProgress: "In Progress",
    chapter: "Chapter", subject: "Subject", standard: "Standard", score: "Score", duration: "Duration", attempts: "Attempts",
    maths: "Mathematics", science: "Science", tamil: "Tamil", english: "English", socialScience: "Social Science",
    startQuiz: "Start Quiz", continueLesson: "Continue", downloadOffline: "Download Offline",
    askDoubt: "Ask a Doubt", liveNow: "Live Now", queued: "In Queue", resolved: "Resolved",
    focusScore: "Focus Score", attentionAlert: "Stay Focused!", avgAttention: "Avg. Attention", bestTime: "Best Study Time",
    childProgress: "Child's Progress", weeklyReport: "Weekly Report", attendance: "Attendance", notifications: "Notifications",
    totalStudents: "Total Students", activeToday: "Active Today", monthlyRevenue: "Monthly Revenue", churnRate: "Churn Rate",
    publishContent: "Publish Content", pendingReview: "Pending Review", videosUploaded: "Videos Uploaded", quizzesCreated: "Quizzes Created",
    platformHealth: "Platform Health", systemLoad: "System Load", errorRate: "Error Rate", uptime: "Uptime",
    selectRole: "Select your role to explore the platform",
    std10: "10th Standard", std9: "9th Standard", std11: "11th Standard", std12: "12th Standard",
    ch1: "Real Numbers", ch2: "Sets and Relations", ch3: "Algebra", ch4: "Geometry", ch5: "Coordinate Geometry",
    ch6: "Trigonometry", ch7: "Mensuration", ch8: "Statistics", ch9: "Probability",
    sciCh1: "Laws of Motion", sciCh2: "Optics", sciCh3: "Electricity", sciCh4: "Nuclear Physics",
    watchVideo: "Watch Video", takeQuiz: "Take Quiz", practice: "Practice",
    morning: "Morning", afternoon: "Afternoon", evening: "Evening",
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
    noDoubt: "No active doubts", askNew: "Ask a new doubt",
    searchPlaceholder: "Search lessons, quizzes...",
    qs1: "How to solve quadratic equations?", qs2: "Explain Newton's 3rd law", qs3: "What is Pythagoras theorem?",
  },
  ta: {
    appName: "சமச்சீர் கல்வி LMS", login: "உள்நுழை", logout: "வெளியேறு", switchLang: "English",
    student: "மாணவர்", teacher: "ஆசிரியர்", parent: "பெற்றோர்", admin: "நிர்வாகி", contentMgr: "உள்ளடக்க மேலாளர்", superAdmin: "சூப்பர் நிர்வாகி",
    dashboard: "முகப்பு", lessons: "பாடங்கள்", quizzes: "வினாடி வினா", doubts: "சந்தேகங்கள்", concentration: "கவனிப்பு கண்காணிப்பு", reports: "அறிக்கைகள்", settings: "அமைப்புகள்", users: "பயனர்கள்", content: "உள்ளடக்கம்", analytics: "பகுப்பாய்வு", revenue: "வருவாய்", roles: "பாத்திரங்கள்",
    welcome: "மீண்டும் வரவேற்கிறோம்", todayGoal: "இன்றைய இலக்கு", streak: "நாள் தொடர்", completed: "நிறைவு", inProgress: "நடப்பில்",
    chapter: "அத்தியாயம்", subject: "பாடம்", standard: "வகுப்பு", score: "மதிப்பெண்", duration: "கால அளவு", attempts: "முயற்சிகள்",
    maths: "கணிதம்", science: "அறிவியல்", tamil: "தமிழ்", english: "ஆங்கிலம்", socialScience: "சமூக அறிவியல்",
    startQuiz: "வினாடி வினா தொடங்கு", continueLesson: "தொடர்", downloadOffline: "ஆஃப்லைன் பதிவிறக்கம்",
    askDoubt: "சந்தேகம் கேள்", liveNow: "நேரலை", queued: "காத்திருப்பு", resolved: "தீர்வு",
    focusScore: "கவனிப்பு மதிப்பெண்", attentionAlert: "கவனம் செலுத்துங்கள்!", avgAttention: "சராசரி கவனிப்பு", bestTime: "சிறந்த படிப்பு நேரம்",
    childProgress: "குழந்தையின் முன்னேற்றம்", weeklyReport: "வாராந்திர அறிக்கை", attendance: "வருகை", notifications: "அறிவிப்புகள்",
    totalStudents: "மொத்த மாணவர்கள்", activeToday: "இன்று செயலில்", monthlyRevenue: "மாத வருவாய்", churnRate: "இழப்பு விகிதம்",
    publishContent: "உள்ளடக்கம் வெளியிடு", pendingReview: "மதிப்பாய்வு நிலுவை", videosUploaded: "பதிவேற்றிய வீடியோக்கள்", quizzesCreated: "உருவாக்கிய வினாக்கள்",
    platformHealth: "தளம் நிலை", systemLoad: "சிஸ்டம் சுமை", errorRate: "பிழை விகிதம்", uptime: "இயங்கு நேரம்",
    selectRole: "தளத்தை ஆராய உங்கள் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்",
    std10: "10ஆம் வகுப்பு", std9: "9ஆம் வகுப்பு", std11: "11ஆம் வகுப்பு", std12: "12ஆம் வகுப்பு",
    ch1: "மெய் எண்கள்", ch2: "கணங்கள் மற்றும் தொடர்புகள்", ch3: "இயற்கணிதம்", ch4: "வடிவியல்", ch5: "ஆய வடிவியல்",
    ch6: "முக்கோணவியல்", ch7: "அளவியல்", ch8: "புள்ளியியல்", ch9: "நிகழ்தகவு",
    sciCh1: "இயக்க விதிகள்", sciCh2: "ஒளியியல்", sciCh3: "மின்சாரம்", sciCh4: "அணுக்கரு இயற்பியல்",
    watchVideo: "வீடியோ பார்", takeQuiz: "வினாடி வினா", practice: "பயிற்சி",
    morning: "காலை", afternoon: "மதியம்", evening: "மாலை",
    mon: "திங்", tue: "செவ்", wed: "புத", thu: "வியா", fri: "வெள்", sat: "சனி", sun: "ஞாயி",
    jan: "ஜன", feb: "பிப்", mar: "மார்", apr: "ஏப்", may: "மே", jun: "ஜூன்",
    noDoubt: "செயலில் சந்தேகம் இல்லை", askNew: "புதிய சந்தேகம் கேள்",
    searchPlaceholder: "பாடங்கள், வினாக்கள் தேடு...",
    qs1: "இருபடி சமன்பாடுகளை எப்படி தீர்ப்பது?", qs2: "நியூட்டனின் 3வது விதி விளக்கு", qs3: "பித்தகோரஸ் தேற்றம் என்ன?",
  }
};

// ── Mock Data ────────────────────────────────────────────
const weeklyProgress = [
  { day: "mon", lessons: 4, quizzes: 2, focus: 82 },
  { day: "tue", lessons: 3, quizzes: 1, focus: 75 },
  { day: "wed", lessons: 5, quizzes: 3, focus: 88 },
  { day: "thu", lessons: 2, quizzes: 1, focus: 70 },
  { day: "fri", lessons: 6, quizzes: 4, focus: 91 },
  { day: "sat", lessons: 3, quizzes: 2, focus: 85 },
  { day: "sun", lessons: 1, quizzes: 0, focus: 65 },
];

const monthlyRevenue = [
  { month: "jan", revenue: 120000, students: 1500 },
  { month: "feb", revenue: 185000, students: 2300 },
  { month: "mar", revenue: 450000, students: 5600 },
  { month: "apr", revenue: 380000, students: 4700 },
  { month: "may", revenue: 220000, students: 2800 },
  { month: "jun", revenue: 160000, students: 2000 },
];

const subjectScores = [
  { name: "maths", score: 78, color: COLORS.orange },
  { name: "science", score: 85, color: COLORS.clay },
  { name: "tamil", score: 92, color: COLORS.blue },
  { name: "english", score: 71, color: COLORS.granite },
  { name: "socialScience", score: 88, color: "#6B8E6B" },
];

const focusData = Array.from({ length: 20 }, (_, i) => ({
  time: `${Math.floor(i * 1.5)}:${i % 2 === 0 ? "00" : "30"}`,
  score: Math.max(40, Math.min(100, 75 + Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 15)),
}));

const quizQuestions = [
  { q: "What is the value of √144?", options: ["10", "12", "14", "16"], correct: 1 },
  { q: "If x² + 5x + 6 = 0, find x:", options: ["-2, -3", "2, 3", "-1, -6", "1, 6"], correct: 0 },
  { q: "The sum of interior angles of a triangle is:", options: ["90°", "180°", "270°", "360°"], correct: 1 },
];

// ── Components ───────────────────────────────────────────

function Card({ children, className = "", onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${hover ? "hover:shadow-md hover:border-gray-200 cursor-pointer transition-all" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = COLORS.orange }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold" style={{ color: COLORS.granite }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: color + "15" }}>
          <Icon size={22} style={{ color }} />
        </div>
      </div>
    </Card>
  );
}

function Badge({ text, color = COLORS.orange }) {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "18", color }}>
      {text}
    </span>
  );
}

function ProgressBar({ value, color = COLORS.orange, height = 6 }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: COLORS.grey }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "text-white" : "text-gray-600 hover:bg-gray-50"}`}
      style={active ? { backgroundColor: COLORS.orange } : {}}
    >
      <Icon size={18} />
      <span className="flex-1 text-left">{label}</span>
      {count && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{count}</span>}
    </button>
  );
}

// ── Video Player ─────────────────────────────────────────
function VideoPlayer({ t, onFocusChange }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [focusScore, setFocusScore] = useState(85);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { setPlaying(false); return 100; } return p + 0.5; });
      const newScore = Math.max(30, Math.min(100, focusScore + (Math.random() - 0.45) * 8));
      setFocusScore(Math.round(newScore));
      if (newScore < 50) setShowAlert(true);
      else setShowAlert(false);
      onFocusChange?.(newScore);
    }, 200);
    return () => clearInterval(interval);
  }, [playing, focusScore]);

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg" />
        <div className="relative z-10 text-center">
          {!playing ? (
            <button onClick={() => setPlaying(true)} className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all">
              <Play size={40} className="text-white ml-1" />
            </button>
          ) : (
            <div className="text-white">
              <div className="text-lg font-medium mb-1">{t.ch1} — {t.watchVideo}</div>
              <div className="text-sm text-gray-400">{t.std10} • {t.maths}</div>
            </div>
          )}
        </div>
        {playing && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5">
            <Eye size={14} className="text-green-400" />
            <span className={`text-sm font-bold ${focusScore > 60 ? "text-green-400" : "text-red-400"}`}>{focusScore}%</span>
          </div>
        )}
        {showAlert && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 bg-red-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">{t.attentionAlert}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <div className="h-full transition-all" style={{ width: `${progress}%`, backgroundColor: COLORS.orange }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => setPlaying(!playing)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: COLORS.orange }}>
          {playing ? <Clock size={16} /> : <Play size={16} />}
          {playing ? `${Math.round(progress)}%` : t.continueLesson}
        </button>
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <Zap size={14} /> {t.downloadOffline}
        </button>
      </div>
    </Card>
  );
}

// ── Quiz Engine ──────────────────────────────────────────
function QuizEngine({ t }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const handleAnswer = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      setAnswers([...answers, idx]);
      if (current < quizQuestions.length - 1) { setCurrent(current + 1); setSelected(null); }
      else setDone(true);
    }, 600);
  };

  if (done) {
    const correct = answers.filter((a, i) => a === quizQuestions[i].correct).length;
    return (
      <Card>
        <div className="text-center py-6">
          <div className="text-5xl mb-3">{correct === quizQuestions.length ? "🏆" : correct >= 2 ? "👏" : "📚"}</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.granite }}>{t.score}: {correct}/{quizQuestions.length}</h3>
          <ProgressBar value={(correct / quizQuestions.length) * 100} color={correct === quizQuestions.length ? "#22c55e" : COLORS.orange} height={8} />
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setDone(false); }} className="mt-4 px-6 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: COLORS.orange }}>
            {t.practice}
          </button>
        </div>
      </Card>
    );
  }

  const q = quizQuestions[current];
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge text={`${current + 1}/${quizQuestions.length}`} />
        <span className="text-sm text-gray-400">{t.std10} • {t.maths}</span>
      </div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.granite }}>{q.q}</h3>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i} onClick={() => handleAnswer(i)}
            className={`w-full text-left p-3 rounded-lg border-2 text-sm font-medium transition-all ${
              selected === null ? "border-gray-200 hover:border-gray-300 text-gray-700" :
              i === q.correct ? "border-green-500 bg-green-50 text-green-700" :
              i === selected ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-400"
            }`}
          >
            <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-center text-xs leading-6 mr-2">{String.fromCharCode(65 + i)}</span>
            {opt}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ── Doubt Chat ───────────────────────────────────────────
function DoubtChat({ t }) {
  const [msgs, setMsgs] = useState([
    { from: "student", text: t.qs1, time: "10:30 AM" },
    { from: "teacher", text: "For ax² + bx + c = 0, use the formula: x = (-b ± √(b²-4ac)) / 2a. Let me explain step by step...", time: "10:31 AM" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { from: "student", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
    setTimeout(() => {
      setMsgs(prev => [...prev, { from: "teacher", text: "Great question! Let me work through this with you...", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1500);
  };

  return (
    <Card className="flex flex-col" style={{ height: 400 }}>
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.clay }}>R</div>
        <div>
          <p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Rajesh Kumar</p>
          <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{t.liveNow}</p>
        </div>
        <Badge text={t.maths} color={COLORS.clay} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "student" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${m.from === "student" ? "text-white" : "bg-gray-100 text-gray-800"}`} style={m.from === "student" ? { backgroundColor: COLORS.orange } : {}}>
              {m.text}
              <div className={`text-xs mt-1 ${m.from === "student" ? "text-white/70" : "text-gray-400"}`}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder={t.askDoubt + "..."} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300" />
        <button onClick={send} className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: COLORS.orange }}>→</button>
      </div>
    </Card>
  );
}

// ── Concentration Tracker ────────────────────────────────
function ConcentrationPanel({ t, liveScore }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: COLORS.granite }}>
        <Brain size={16} style={{ color: COLORS.orange }} /> {t.concentration}
      </h3>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: COLORS.grey }}>
          <p className="text-2xl font-bold" style={{ color: liveScore > 60 ? "#22c55e" : COLORS.orange }}>{liveScore || 85}%</p>
          <p className="text-xs text-gray-500">{t.focusScore}</p>
        </div>
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: COLORS.grey }}>
          <p className="text-2xl font-bold" style={{ color: COLORS.granite }}>82%</p>
          <p className="text-xs text-gray-500">{t.avgAttention}</p>
        </div>
        <div className="text-center p-3 rounded-lg" style={{ backgroundColor: COLORS.grey }}>
          <p className="text-2xl font-bold" style={{ color: COLORS.clay }}>6 PM</p>
          <p className="text-xs text-gray-500">{t.bestTime}</p>
        </div>
      </div>
      <div style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={focusData}>
            <defs>
              <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.3} />
                <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#999" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#999" }} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke={COLORS.orange} fill="url(#focusGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════
// ROLE DASHBOARDS
// ══════════════════════════════════════════════════════════

function StudentDashboard({ t, lang }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [focusScore, setFocusScore] = useState(85);
  const tabs = [
    { id: "dashboard", icon: Home, label: t.dashboard },
    { id: "lessons", icon: Video, label: t.lessons },
    { id: "quizzes", icon: FileText, label: t.quizzes },
    { id: "doubts", icon: MessageCircle, label: t.doubts, count: 2 },
    { id: "concentration", icon: Brain, label: t.concentration },
  ];

  const chapters = [
    { key: "ch1", progress: 85, lessons: 8, quizzes: 3 },
    { key: "ch2", progress: 60, lessons: 6, quizzes: 2 },
    { key: "ch3", progress: 45, lessons: 10, quizzes: 4 },
    { key: "ch4", progress: 20, lessons: 7, quizzes: 3 },
    { key: "ch5", progress: 0, lessons: 5, quizzes: 2 },
  ];

  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.orange }}>G</div>
          <div><p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Gunalukesh</p><p className="text-xs text-gray-400">{t.std10}</p></div>
        </div>
        {tabs.map(tab => <SidebarItem key={tab.id} icon={tab.icon} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} count={tab.count} />)}
      </div>
      <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: "#fafafa" }}>
        {activeTab === "dashboard" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: COLORS.granite }}>{t.welcome}, Gunalukesh! 👋</h2>
              <p className="text-sm text-gray-500">{t.std10} • {t.maths}, {t.science}</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <StatCard icon={Award} label={t.streak} value="12" sub="+3 this week" color={COLORS.orange} />
              <StatCard icon={BookOpen} label={t.completed} value="34" sub="lessons" color="#22c55e" />
              <StatCard icon={Target} label={t.todayGoal} value="3/5" sub="lessons left" color={COLORS.clay} />
              <StatCard icon={Brain} label={t.focusScore} value="82%" sub={t.avgAttention} color={COLORS.blue} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.weeklyReport}</h3>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgress.map(d => ({ ...d, day: t[d.day] }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                      <Tooltip />
                      <Bar dataKey="lessons" fill={COLORS.orange} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="quizzes" fill={COLORS.blue} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.subject} {t.score}</h3>
                <div className="space-y-3">
                  {subjectScores.map(s => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{t[s.name]}</span>
                        <span className="font-semibold" style={{ color: s.color }}>{s.score}%</span>
                      </div>
                      <ProgressBar value={s.score} color={s.color} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
        {activeTab === "lessons" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.maths} — {t.std10}</h2>
            <VideoPlayer t={t} onFocusChange={setFocusScore} />
            <div className="space-y-2">
              {chapters.map(ch => (
                <Card key={ch.key} hover className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold" style={{ color: COLORS.granite }}>{t[ch.key]}</h4>
                      {ch.progress === 100 && <CheckCircle size={14} className="text-green-500" />}
                    </div>
                    <p className="text-xs text-gray-400">{ch.lessons} {t.lessons} • {ch.quizzes} {t.quizzes}</p>
                    <ProgressBar value={ch.progress} height={4} color={ch.progress === 100 ? "#22c55e" : COLORS.orange} />
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === "quizzes" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.quizzes}</h2>
            <QuizEngine t={t} />
          </div>
        )}
        {activeTab === "doubts" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.doubts}</h2>
            <DoubtChat t={t} />
          </div>
        )}
        {activeTab === "concentration" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.concentration}</h2>
            <ConcentrationPanel t={t} liveScore={focusScore} />
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.weeklyReport} — {t.concentration}</h3>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress.map(d => ({ ...d, day: t[d.day] }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#999" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="focus" stroke={COLORS.orange} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function TeacherDashboard({ t }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", icon: Home, label: t.dashboard },
    { id: "doubts", icon: MessageCircle, label: t.doubts, count: 5 },
    { id: "analytics", icon: BarChart2, label: t.analytics },
    { id: "content", icon: Layers, label: t.content },
  ];
  const students = [
    { name: "Priya S.", score: 92, focus: 88, status: "active" },
    { name: "Karthik R.", score: 78, focus: 75, status: "active" },
    { name: "Deepa M.", score: 85, focus: 82, status: "idle" },
    { name: "Arun V.", score: 65, focus: 55, status: "attention" },
    { name: "Meena K.", score: 90, focus: 90, status: "active" },
  ];

  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.clay }}>R</div>
          <div><p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Rajesh Kumar</p><p className="text-xs text-gray-400">{t.teacher}</p></div>
        </div>
        {tabs.map(tab => <SidebarItem key={tab.id} icon={tab.icon} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} count={tab.count} />)}
      </div>
      <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: "#fafafa" }}>
        {activeTab === "dashboard" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.welcome}, Rajesh!</h2>
            <div className="grid grid-cols-4 gap-4">
              <StatCard icon={Users} label={t.totalStudents} value="156" sub="+12 this week" />
              <StatCard icon={MessageCircle} label={t.doubts} value="5" sub={t.queued} color={COLORS.clay} />
              <StatCard icon={Activity} label="Avg. Score" value="81%" sub="class average" color="#22c55e" />
              <StatCard icon={Brain} label={t.avgAttention} value="78%" sub="class focus" color={COLORS.blue} />
            </div>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Student Monitor</h3>
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: s.status === "attention" ? COLORS.orange : s.status === "active" ? "#22c55e" : COLORS.blue }}>
                      {s.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: COLORS.granite }}>{s.name}</span>
                        {s.status === "attention" && <Badge text="Needs Help" color={COLORS.orange} />}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400 mt-0.5">
                        <span>{t.score}: {s.score}%</span>
                        <span>{t.focusScore}: {s.focus}%</span>
                      </div>
                    </div>
                    <ProgressBar value={s.score} color={s.status === "attention" ? COLORS.orange : "#22c55e"} height={4} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        {activeTab === "doubts" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.doubts} Queue</h2>
            <DoubtChat t={t} />
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>Class {t.analytics}</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.subject} Performance</h3>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectScores.map(s => ({ name: t[s.name], score: s.score }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#999" }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#999" }} />
                      <Tooltip />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {subjectScores.map((s, i) => <Cell key={i} fill={s.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.concentration} Trends</h3>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyProgress.map(d => ({ ...d, day: t[d.day] }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#999" }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="focus" stroke={COLORS.orange} strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}
        {activeTab === "content" && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.content} Management</h2>
            <div className="grid grid-cols-3 gap-4">
              <StatCard icon={Video} label={t.videosUploaded} value="48" color={COLORS.orange} />
              <StatCard icon={FileText} label={t.quizzesCreated} value="23" color={COLORS.clay} />
              <StatCard icon={Clock} label={t.pendingReview} value="7" color={COLORS.blue} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ParentDashboard({ t }) {
  const dailyStudy = [
    { day: t.mon, minutes: 45, focus: 82 },
    { day: t.tue, minutes: 30, focus: 75 },
    { day: t.wed, minutes: 60, focus: 88 },
    { day: t.thu, minutes: 20, focus: 70 },
    { day: t.fri, minutes: 55, focus: 91 },
    { day: t.sat, minutes: 40, focus: 85 },
    { day: t.sun, minutes: 15, focus: 65 },
  ];

  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#22c55e" }}>L</div>
          <div><p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Lakshmi</p><p className="text-xs text-gray-400">{t.parent}</p></div>
        </div>
        <SidebarItem icon={Home} label={t.childProgress} active onClick={() => {}} />
        <SidebarItem icon={BarChart2} label={t.reports} onClick={() => {}} />
        <SidebarItem icon={Bell} label={t.notifications} count={3} onClick={() => {}} />
        <SidebarItem icon={Settings} label={t.settings} onClick={() => {}} />
      </div>
      <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: "#fafafa" }}>
        <div className="space-y-5">
          <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.childProgress} — Gunalukesh</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={Clock} label="Study Time Today" value="45 min" sub="Goal: 60 min" />
            <StatCard icon={Brain} label={t.focusScore} value="82%" sub={t.avgAttention} color={COLORS.blue} />
            <StatCard icon={Award} label="Quiz Avg" value="81%" sub="This week" color="#22c55e" />
            <StatCard icon={TrendingUp} label={t.streak} value="12 days" sub="Best: 18" color={COLORS.clay} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Daily Study Time (min)</h3>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStudy}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                    <Tooltip />
                    <Bar dataKey="minutes" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.subject} Performance</h3>
              <div className="space-y-3">
                {subjectScores.map(s => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{t[s.name]}</span>
                      <span className="font-semibold" style={{ color: s.color }}>{s.score}%</span>
                    </div>
                    <ProgressBar value={s.score} color={s.color} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.concentration} — {t.weeklyReport}</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStudy}>
                  <defs>
                    <linearGradient id="focusGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#999" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="focus" stroke={COLORS.blue} fill="url(#focusGrad2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Recent {t.notifications}</h3>
            <div className="space-y-2">
              {[
                { icon: CheckCircle, text: "Gunalukesh completed Chapter 3 quiz — Score: 85%", time: "2h ago", color: "#22c55e" },
                { icon: AlertTriangle, text: "Low focus detected during Science lesson (45%)", time: "Yesterday", color: COLORS.orange },
                { icon: Award, text: "12-day study streak achieved!", time: "2 days ago", color: COLORS.clay },
              ].map((n, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <n.icon size={16} style={{ color: n.color }} />
                  <span className="text-sm flex-1" style={{ color: COLORS.granite }}>{n.text}</span>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ t }) {
  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.granite }}>A</div>
          <div><p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Admin Panel</p><p className="text-xs text-gray-400">{t.admin}</p></div>
        </div>
        <SidebarItem icon={Home} label={t.dashboard} active onClick={() => {}} />
        <SidebarItem icon={Users} label={t.users} onClick={() => {}} />
        <SidebarItem icon={BarChart2} label={t.analytics} onClick={() => {}} />
        <SidebarItem icon={Zap} label={t.revenue} onClick={() => {}} />
        <SidebarItem icon={Settings} label={t.settings} onClick={() => {}} />
      </div>
      <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: "#fafafa" }}>
        <div className="space-y-5">
          <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.admin} {t.dashboard}</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={Users} label={t.totalStudents} value="12,450" sub="+1,200 this month" />
            <StatCard icon={Activity} label={t.activeToday} value="3,218" sub="25.8% DAU" color="#22c55e" />
            <StatCard icon={Zap} label={t.monthlyRevenue} value="₹4.8L" sub="+18% MoM" color={COLORS.clay} />
            <StatCard icon={TrendingUp} label={t.churnRate} value="3.2%" sub="-0.5% MoM" color={COLORS.blue} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>{t.revenue} Trend</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenue.map(d => ({ ...d, month: t[d.month] }))}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#999" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                    <Tooltip formatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Area type="monotone" dataKey="revenue" stroke={COLORS.orange} fill="url(#revGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Student Growth</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue.map(d => ({ ...d, month: t[d.month] }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#999" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke={COLORS.clay} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Subscription Breakdown</h3>
            <div className="flex items-center gap-8">
              <div style={{ width: 160, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "₹99/mo", value: 45 }, { name: "₹799/yr", value: 35 }, { name: "₹29/subj", value: 20 }]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      <Cell fill={COLORS.orange} />
                      <Cell fill={COLORS.clay} />
                      <Cell fill={COLORS.blue} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {[{ plan: "₹99/month (Sachet)", pct: 45, color: COLORS.orange }, { plan: "₹799/year (Full Year)", pct: 35, color: COLORS.clay }, { plan: "₹29/subject (Single)", pct: 20, color: COLORS.blue }].map(p => (
                  <div key={p.plan} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-sm text-gray-600">{p.plan}</span>
                    <span className="text-sm font-semibold" style={{ color: COLORS.granite }}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContentMgrDashboard({ t }) {
  const pipeline = [
    { title: "Real Numbers — Video 3", status: "Recording", progress: 30, subject: t.maths },
    { title: "Laws of Motion — Quiz", status: "Review", progress: 70, subject: t.science },
    { title: "Algebra — Interactive", status: "Published", progress: 100, subject: t.maths },
    { title: "Optics — Video 1", status: "Editing", progress: 55, subject: t.science },
    { title: "Tamil Grammar — Quiz", status: "Draft", progress: 15, subject: t.tamil },
  ];

  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.blue }}>C</div>
          <div><p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Content Mgr</p><p className="text-xs text-gray-400">{t.contentMgr}</p></div>
        </div>
        <SidebarItem icon={Home} label={t.dashboard} active onClick={() => {}} />
        <SidebarItem icon={Layers} label="Pipeline" onClick={() => {}} />
        <SidebarItem icon={Video} label={t.lessons} onClick={() => {}} />
        <SidebarItem icon={FileText} label={t.quizzes} onClick={() => {}} />
      </div>
      <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: "#fafafa" }}>
        <div className="space-y-5">
          <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.content} Pipeline</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={Video} label={t.videosUploaded} value="284" sub="across 12 standards" />
            <StatCard icon={FileText} label={t.quizzesCreated} value="156" sub="2,340 questions" color={COLORS.clay} />
            <StatCard icon={Clock} label={t.pendingReview} value="12" sub="avg 2 day review" color={COLORS.orange} />
            <StatCard icon={CheckCircle} label={t.publishContent} value="97%" sub="acceptance rate" color="#22c55e" />
          </div>
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Content Pipeline</h3>
            <div className="space-y-3">
              {pipeline.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: i % 2 === 0 ? COLORS.grey : "white" }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: COLORS.granite }}>{item.title}</span>
                      <Badge text={item.subject} color={COLORS.blue} />
                    </div>
                    <ProgressBar value={item.progress} height={4} color={item.progress === 100 ? "#22c55e" : item.progress > 50 ? COLORS.clay : COLORS.orange} />
                  </div>
                  <Badge
                    text={item.status}
                    color={item.status === "Published" ? "#22c55e" : item.status === "Review" ? COLORS.clay : item.status === "Editing" ? COLORS.blue : COLORS.orange}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SuperAdminDashboard({ t }) {
  const services = [
    { name: "Auth Service", status: "healthy", cpu: 23, memory: 45, latency: "12ms" },
    { name: "Content Service", status: "healthy", cpu: 56, memory: 72, latency: "45ms" },
    { name: "Video CDN", status: "warning", cpu: 78, memory: 81, latency: "120ms" },
    { name: "Quiz Engine", status: "healthy", cpu: 34, memory: 55, latency: "28ms" },
    { name: "Concentration AI", status: "healthy", cpu: 45, memory: 63, latency: "85ms" },
    { name: "Doubt Service", status: "healthy", cpu: 29, memory: 42, latency: "18ms" },
  ];

  return (
    <div className="flex h-full">
      <div className="w-56 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#dc2626" }}>S</div>
          <div><p className="text-sm font-semibold" style={{ color: COLORS.granite }}>Super Admin</p><p className="text-xs text-gray-400">{t.superAdmin}</p></div>
        </div>
        <SidebarItem icon={Shield} label={t.platformHealth} active onClick={() => {}} />
        <SidebarItem icon={Users} label={t.roles} onClick={() => {}} />
        <SidebarItem icon={BarChart2} label={t.analytics} onClick={() => {}} />
        <SidebarItem icon={Settings} label={t.settings} onClick={() => {}} />
      </div>
      <div className="flex-1 p-6 overflow-y-auto" style={{ backgroundColor: "#fafafa" }}>
        <div className="space-y-5">
          <h2 className="text-xl font-bold" style={{ color: COLORS.granite }}>{t.platformHealth}</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={Activity} label={t.uptime} value="99.97%" sub="Last 30 days" color="#22c55e" />
            <StatCard icon={Zap} label={t.systemLoad} value="45%" sub="6 services" color={COLORS.blue} />
            <StatCard icon={AlertTriangle} label={t.errorRate} value="0.03%" sub="-0.01% MoM" color={COLORS.orange} />
            <StatCard icon={Users} label="Concurrent" value="3,218" sub="Peak: 8,540" color={COLORS.clay} />
          </div>
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Microservices Status</h3>
            <div className="space-y-2">
              {services.map(s => (
                <div key={s.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.status === "healthy" ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
                  <span className="text-sm font-medium w-40" style={{ color: COLORS.granite }}>{s.name}</span>
                  <div className="flex-1 flex items-center gap-6">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">CPU</span>
                      <div className="w-20"><ProgressBar value={s.cpu} height={4} color={s.cpu > 70 ? COLORS.orange : "#22c55e"} /></div>
                      <span className="text-xs font-medium" style={{ color: COLORS.granite }}>{s.cpu}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">MEM</span>
                      <div className="w-20"><ProgressBar value={s.memory} height={4} color={s.memory > 75 ? COLORS.orange : COLORS.blue} /></div>
                      <span className="text-xs font-medium" style={{ color: COLORS.granite }}>{s.memory}%</span>
                    </div>
                    <span className="text-xs text-gray-400">Latency: <span className="font-medium" style={{ color: COLORS.granite }}>{s.latency}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.granite }}>Request Volume (24h)</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, requests: Math.round(1000 + Math.sin(i * 0.5) * 800 + (i > 16 && i < 22 ? 2000 : 0)) }))}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#999" }} interval={3} />
                  <YAxis tick={{ fontSize: 10, fill: "#999" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke={COLORS.blue} fill="url(#reqGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════

export default function App() {
  const [lang, setLang] = useState("en");
  const [role, setRole] = useState(null);
  const t = T[lang];

  const roles = [
    { id: "student", icon: BookOpen, label: t.student, color: COLORS.orange, desc: "Learn lessons, take quizzes, track focus" },
    { id: "teacher", icon: Users, label: t.teacher, color: COLORS.clay, desc: "Monitor students, clear doubts, track analytics" },
    { id: "parent", icon: User, label: t.parent, color: "#22c55e", desc: "View child progress, concentration reports" },
    { id: "admin", icon: Shield, label: t.admin, color: COLORS.granite, desc: "Manage users, revenue, platform analytics" },
    { id: "contentMgr", icon: Layers, label: t.contentMgr, color: COLORS.blue, desc: "Create, review, publish educational content" },
    { id: "superAdmin", icon: Zap, label: t.superAdmin, color: "#dc2626", desc: "System health, microservices, infrastructure" },
  ];

  if (!role) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.grey }}>
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.orange }}>
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: COLORS.granite }}>{t.appName}</h1>
              <p className="text-xs text-gray-400">Samacheer Kalvi • Tamil Nadu State Board</p>
            </div>
          </div>
          <button onClick={() => setLang(lang === "en" ? "ta" : "en")} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50" style={{ color: COLORS.granite }}>
            <Globe size={16} /> {t.switchLang}
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.granite }}>{t.welcome}!</h2>
          <p className="text-gray-500 mb-8">{t.selectRole}</p>
          <div className="grid grid-cols-3 gap-4 max-w-3xl">
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className="bg-white rounded-xl p-5 border-2 border-transparent hover:border-gray-200 hover:shadow-lg transition-all text-left group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: r.color + "15" }}>
                  <r.icon size={24} style={{ color: r.color }} />
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: COLORS.granite }}>{r.label}</h3>
                <p className="text-xs text-gray-400">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const Dashboard = { student: StudentDashboard, teacher: TeacherDashboard, parent: ParentDashboard, admin: AdminDashboard, contentMgr: ContentMgrDashboard, superAdmin: SuperAdminDashboard }[role];

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setRole(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronDown size={18} className="text-gray-400 rotate-90" />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.orange }}>
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: COLORS.granite }}>{t.appName}</span>
          <Badge text={t[role]} color={roles.find(r => r.id === role)?.color} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLang(lang === "en" ? "ta" : "en")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50" style={{ color: COLORS.granite }}>
            <Globe size={14} /> {t.switchLang}
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 relative">
            <Bell size={18} className="text-gray-400" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </button>
          <button onClick={() => setRole(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <LogOut size={18} className="text-gray-400" />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <Dashboard t={t} lang={lang} />
      </div>
    </div>
  );
}
