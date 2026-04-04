'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../../lib/store'
import { curriculum, progress, attention } from '../../../lib/supabase'
import Navbar from '../../../components/ui/Navbar'
import Sidebar from '../../../components/ui/Sidebar'
import { Play, Pause, Eye, Brain, ChevronRight, ChevronLeft, MessageCircle, HelpCircle } from 'lucide-react'

export default function LessonPlayerPage() {
  const { chapterId } = useParams()
  const searchParams = useSearchParams()
  const lessonId = searchParams.get('lesson')
  const { t } = useTranslation()
  const { profile, sidebarOpen } = useAppStore()

  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [focusScore, setFocusScore] = useState(85)
  const [sessionId, setSessionId] = useState(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const videoRef = useRef(null)
  const focusInterval = useRef(null)

  useEffect(() => {
    const load = async () => {
      const lsns = await curriculum.getLessons(chapterId)
      setLessons(lsns || [])
      if (lessonId && lsns) {
        setCurrentLesson(lsns.find(l => l.id === lessonId) || lsns[0])
      } else if (lsns?.length) {
        setCurrentLesson(lsns[0])
      }
    }
    if (chapterId) load()
  }, [chapterId, lessonId])

  // Start attention tracking session
  const startTracking = useCallback(async () => {
    if (!profile?.id || !currentLesson?.id) return
    const { data } = await attention.startSession(profile.id, currentLesson.id)
    if (data) {
      setSessionId(data.id)
      // Simulate focus score updates (replace with actual camera-based detection)
      focusInterval.current = setInterval(() => {
        const newScore = Math.max(40, Math.min(100, focusScore + (Math.random() - 0.45) * 10))
        setFocusScore(Math.round(newScore))
        if (data.id) attention.addSnapshot(data.id, Math.round(newScore), true)
      }, 5000)
    }
  }, [profile?.id, currentLesson?.id])

  const stopTracking = useCallback(async () => {
    if (focusInterval.current) clearInterval(focusInterval.current)
    if (sessionId) await attention.endSession(sessionId)
  }, [sessionId])

  useEffect(() => {
    return () => {
      if (focusInterval.current) clearInterval(focusInterval.current)
    }
  }, [])

  const handlePlay = () => {
    setPlaying(true)
    startTracking()
    if (videoRef.current) videoRef.current.play()
  }

  const handlePause = () => {
    setPlaying(false)
    stopTracking()
    if (videoRef.current) videoRef.current.pause()
  }

  const handleTimeUpdate = async () => {
    if (!videoRef.current) return
    const pct = Math.round((videoRef.current.currentTime / videoRef.current.duration) * 100) || 0
    setProgressPercent(pct)
    // Save progress every 10%
    if (pct % 10 === 0 && profile?.id && currentLesson?.id) {
      await progress.updateLessonProgress(profile.id, currentLesson.id, pct, Math.round(videoRef.current.currentTime))
    }
  }

  const focusColor = focusScore >= 75 ? 'text-green-500' : focusScore >= 50 ? 'text-yellow-500' : 'text-red-500'

  // Fallback lesson data
  const lesson = currentLesson || {
    title_en: 'Introduction to Real Numbers',
    title_ta: 'மெய் எண்கள் அறிமுகம்',
    duration_minutes: 15,
    video_url: null,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={`transition-all duration-200 pt-4 pb-8 px-4 lg:px-6 ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-brand-clay mb-4">
            <Link href="/dashboard" className="hover:text-brand-orange">{t('dashboard')}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/learn" className="hover:text-brand-orange">{t('lessons')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-granite font-medium">{lesson.title_en}</span>
          </div>

          {/* Video Player */}
          <div className="relative bg-black rounded-2xl overflow-hidden mb-6 aspect-video">
            {lesson.video_url ? (
              <video
                ref={videoRef}
                src={lesson.video_url}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => { handlePause(); setProgressPercent(100) }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-granite">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-3 text-brand-orange" />
                  <p className="font-bold text-lg">{lesson.title_en}</p>
                  <p className="text-sm text-brand-blue mt-1">Video will appear here when uploaded</p>
                  <p className="text-xs text-brand-blue/60 mt-2">Duration: {lesson.duration_minutes || 15} minutes</p>
                </div>
              </div>
            )}

            {/* Focus Score Overlay */}
            {playing && (
              <div className="focus-overlay flex items-center gap-2">
                <Eye className={`w-4 h-4 ${focusColor}`} />
                <span className={focusColor}>{focusScore}%</span>
                <span className="text-brand-blue text-xs">Focus</span>
              </div>
            )}

            {/* Play/Pause Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="h-1 bg-white/20 rounded-full mb-3 cursor-pointer">
                <div className="h-full bg-brand-orange rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={playing ? handlePause : handlePlay}
                  className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center hover:bg-brand-clay transition-colors"
                >
                  {playing ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                </button>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/doubts?chapter=${chapterId}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-lg text-white text-xs font-medium hover:bg-white/30 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {t('askDoubt')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-xl font-bold text-brand-granite">{lesson.title_en}</h1>
              <p className="text-sm text-brand-clay mt-1">{lesson.title_ta}</p>

              {/* Focus Summary */}
              <div className="mt-4 bg-white rounded-xl border border-brand-grey p-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-brand-orange" />
                  <div>
                    <p className="font-medium text-brand-granite text-sm">{t('focusScore')}: {focusScore}%</p>
                    <p className="text-xs text-brand-clay mt-0.5">
                      {focusScore >= 75 ? 'Great concentration! Keep it up.' :
                       focusScore >= 50 ? 'Try to focus more on the screen.' :
                       'Your attention seems low. Take a short break?'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson List Sidebar */}
            <div>
              <h3 className="font-bold text-brand-granite mb-3 text-sm">All Lessons</h3>
              <div className="space-y-2">
                {(lessons.length > 0 ? lessons : [
                  { id: 1, title_en: 'Introduction to Real Numbers', sort_order: 1 },
                  { id: 2, title_en: 'Types of Real Numbers', sort_order: 2 },
                  { id: 3, title_en: 'Properties of Real Numbers', sort_order: 3 },
                  { id: 4, title_en: 'Decimal Expansion', sort_order: 4 },
                  { id: 5, title_en: 'Practice Problems', sort_order: 5 },
                ]).map((l) => (
                  <Link
                    key={l.id}
                    href={`/learn/${chapterId}?lesson=${l.id}`}
                    className={`block p-3 rounded-lg text-sm transition-colors ${
                      currentLesson?.id === l.id || (!currentLesson && l.sort_order === 1)
                        ? 'bg-brand-orange/10 text-brand-orange font-medium border border-brand-orange/20'
                        : 'bg-white border border-brand-grey text-brand-granite hover:border-brand-blue'
                    }`}
                  >
                    <span className="text-xs text-brand-clay mr-2">{l.sort_order}.</span>
                    {l.title_en}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
