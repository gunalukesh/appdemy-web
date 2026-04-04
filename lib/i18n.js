'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      appName: 'Appdemy',
      login: 'Login', logout: 'Logout', switchLang: 'தமிழ்',
      student: 'Student', teacher: 'Teacher', parent: 'Parent',
      admin: 'Admin', contentMgr: 'Content Manager', superAdmin: 'Super Admin',
      dashboard: 'Dashboard', lessons: 'Lessons', quizzes: 'Quizzes',
      doubts: 'Doubts', concentration: 'Focus Tracker', reports: 'Reports',
      settings: 'Settings', users: 'Users', content: 'Content',
      analytics: 'Analytics', revenue: 'Revenue',
      welcome: 'Welcome back', todayGoal: "Today's Goal",
      streak: 'Day Streak', completed: 'Completed', inProgress: 'In Progress',
      chapter: 'Chapter', subject: 'Subject', standard: 'Standard',
      score: 'Score', duration: 'Duration',
      maths: 'Mathematics', science: 'Science', tamil: 'Tamil',
      english: 'English', socialScience: 'Social Science',
      startQuiz: 'Start Quiz', continueLesson: 'Continue',
      askDoubt: 'Ask a Doubt', liveNow: 'Live Now',
      queued: 'In Queue', resolved: 'Resolved',
      focusScore: 'Focus Score', avgAttention: 'Avg. Attention',
      childProgress: "Child's Progress", weeklyReport: 'Weekly Report',
      totalStudents: 'Total Students', activeToday: 'Active Today',
      monthlyRevenue: 'Monthly Revenue',
      enterPhone: 'Enter your phone number',
      sendOTP: 'Send OTP', verifyOTP: 'Verify OTP',
      enterOTP: 'Enter the 6-digit OTP',
      phoneLabel: 'Phone Number',
      loginSubtitle: 'Learn smarter with Appdemy',
      noAccount: 'New here? Sign up automatically on first login.',
      watchVideo: 'Watch Video', takeQuiz: 'Take Quiz',
      searchPlaceholder: 'Search lessons, quizzes...',
      free: 'Free', premium: 'Premium',
      subscribe: 'Subscribe Now',
      monthly: '₹99/month', yearly: '₹799/year', perSubject: '₹29/subject',
      selectStandard: 'Select Standard', selectSubject: 'Select Subject',
    }
  },
  ta: {
    translation: {
      appName: 'சமச்சீர் கல்வி LMS',
      login: 'உள்நுழை', logout: 'வெளியேறு', switchLang: 'English',
      student: 'மாணவர்', teacher: 'ஆசிரியர்', parent: 'பெற்றோர்',
      admin: 'நிர்வாகி', contentMgr: 'உள்ளடக்க மேலாளர்', superAdmin: 'சூப்பர் நிர்வாகி',
      dashboard: 'முகப்பு', lessons: 'பாடங்கள்', quizzes: 'வினாடி வினா',
      doubts: 'சந்தேகங்கள்', concentration: 'கவனிப்பு கண்காணிப்பு', reports: 'அறிக்கைகள்',
      settings: 'அமைப்புகள்', users: 'பயனர்கள்', content: 'உள்ளடக்கம்',
      analytics: 'பகுப்பாய்வு', revenue: 'வருவாய்',
      welcome: 'மீண்டும் வரவேற்கிறோம்', todayGoal: 'இன்றைய இலக்கு',
      streak: 'நாள் தொடர்', completed: 'நிறைவு', inProgress: 'நடப்பில்',
      chapter: 'அத்தியாயம்', subject: 'பாடம்', standard: 'வகுப்பு',
      score: 'மதிப்பெண்', duration: 'கால அளவு',
      maths: 'கணிதம்', science: 'அறிவியல்', tamil: 'தமிழ்',
      english: 'ஆங்கிலம்', socialScience: 'சமூக அறிவியல்',
      startQuiz: 'வினாடி வினா தொடங்கு', continueLesson: 'தொடர்',
      askDoubt: 'சந்தேகம் கேள்', liveNow: 'நேரலை',
      queued: 'காத்திருப்பு', resolved: 'தீர்வு',
      focusScore: 'கவனிப்பு மதிப்பெண்', avgAttention: 'சராசரி கவனிப்பு',
      childProgress: 'குழந்தையின் முன்னேற்றம்', weeklyReport: 'வாராந்திர அறிக்கை',
      totalStudents: 'மொத்த மாணவர்கள்', activeToday: 'இன்று செயலில்',
      monthlyRevenue: 'மாத வருவாய்',
      enterPhone: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
      sendOTP: 'OTP அனுப்பு', verifyOTP: 'OTP சரிபார்',
      enterOTP: '6 இலக்க OTP உள்ளிடவும்',
      phoneLabel: 'தொலைபேசி எண்',
      loginSubtitle: 'Appdemy-யுடன் சிறப்பாக கற்றுக்கொள்',
      noAccount: 'புதியவரா? முதல் உள்நுழைவில் தானாக பதிவு.',
      watchVideo: 'வீடியோ பார்', takeQuiz: 'வினாடி வினா',
      searchPlaceholder: 'பாடங்கள், வினாக்கள் தேடு...',
      free: 'இலவசம்', premium: 'பிரீமியம்',
      subscribe: 'இப்போது சந்தா செலுத்து',
      monthly: '₹99/மாதம்', yearly: '₹799/ஆண்டு', perSubject: '₹29/பாடம்',
      selectStandard: 'வகுப்பைத் தேர்வு செய்', selectSubject: 'பாடத்தைத் தேர்வு செய்',
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
