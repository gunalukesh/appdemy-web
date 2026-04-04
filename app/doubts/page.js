'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'
import { doubts } from '../../lib/supabase'
import Navbar from '../../components/ui/Navbar'
import Sidebar from '../../components/ui/Sidebar'
import { Send, ChevronRight, MessageCircle, Clock, CheckCircle, Plus } from 'lucide-react'

export default function DoubtsPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const sessionParam = searchParams.get('session')
  const { profile, sidebarOpen } = useAppStore()

  const [doubtList, setDoubtList] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [newDoubt, setNewDoubt] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const subscriptionRef = useRef(null)

  const isTeacher = profile?.role === 'teacher'

  useEffect(() => {
    const load = async () => {
      try {
        if (isTeacher) {
          const queue = await doubts.getTeacherQueue(profile.id)
          setDoubtList(queue || [])
        } else {
          const list = await doubts.getStudentDoubts(profile.id)
          setDoubtList(list || [])
        }
      } catch (err) {
        console.error('Doubts load error:', err)
      } finally {
        setLoading(false)
      }
    }
    if (profile?.id) load()
  }, [profile?.id])

  // Open a session
  const openSession = async (session) => {
    setActiveSession(session)
    const msgs = await doubts.getMessages(session.id)
    setMessages(msgs || [])

    // Subscribe to real-time messages
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe()
    subscriptionRef.current = doubts.subscribeToMessages(session.id, (payload) => {
      setMessages(prev => [...prev, payload.new])
    })
  }

  // Accept doubt (teacher)
  const handleAccept = async (doubt) => {
    await doubts.acceptDoubt(doubt.id, profile.id)
    openSession({ ...doubt, status: 'active', teacher_id: profile.id })
  }

  // Send message
  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeSession) return

    await doubts.sendMessage(activeSession.id, profile.id, newMessage.trim())
    setNewMessage('')
  }

  // Create new doubt (student)
  const handleCreateDoubt = async (e) => {
    e.preventDefault()
    if (!newDoubt.trim()) return

    const { data } = await doubts.createDoubt(profile.id, null, null, newDoubt.trim())
    if (data) {
      setDoubtList(prev => [data, ...prev])
      setNewDoubt('')
      setShowNewForm(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe()
    }
  }, [])

  // Fallback doubts for demo
  const displayDoubts = doubtList.length > 0 ? doubtList : [
    { id: 1, question_text: 'How to solve quadratic equations with complex roots?', status: 'queued', created_at: new Date().toISOString(), subjects: { name_en: 'Mathematics' } },
    { id: 2, question_text: "Explain Newton's 3rd law with real-world examples", status: 'active', created_at: new Date(Date.now() - 3600000).toISOString(), subjects: { name_en: 'Science' } },
    { id: 3, question_text: 'What is the Pythagorean theorem and how to use it?', status: 'resolved', created_at: new Date(Date.now() - 86400000).toISOString(), subjects: { name_en: 'Mathematics' } },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className={`transition-all duration-200 pt-4 pb-8 px-4 lg:px-6 ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-brand-granite">{t('doubts')}</h1>
              <p className="text-sm text-brand-clay mt-1">
                {isTeacher ? 'Help students with their questions' : 'Get help from qualified teachers'}
              </p>
            </div>
            {!isTeacher && (
              <button
                onClick={() => setShowNewForm(true)}
                className="px-4 py-2.5 bg-brand-orange text-white rounded-lg font-semibold text-sm hover:bg-brand-clay transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('askDoubt')}
              </button>
            )}
          </div>

          {/* New Doubt Form */}
          {showNewForm && (
            <form onSubmit={handleCreateDoubt} className="bg-white rounded-xl border border-brand-grey p-4 mb-6">
              <textarea
                value={newDoubt}
                onChange={(e) => setNewDoubt(e.target.value)}
                placeholder="Type your question here... (Tamil or English)"
                className="w-full p-3 border border-brand-grey rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand-orange outline-none"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowNewForm(false)} className="px-4 py-2 text-sm text-brand-clay hover:text-brand-granite">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDoubt.trim()}
                  className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium hover:bg-brand-clay disabled:opacity-50"
                >
                  Submit Doubt
                </button>
              </div>
            </form>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Doubt List */}
            <div className={`lg:col-span-1 ${activeSession ? 'hidden lg:block' : ''}`}>
              <div className="space-y-2">
                {displayDoubts.map((doubt) => (
                  <button
                    key={doubt.id}
                    onClick={() => isTeacher && doubt.status === 'queued' ? handleAccept(doubt) : openSession(doubt)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      activeSession?.id === doubt.id
                        ? 'border-brand-orange bg-orange-50'
                        : 'border-brand-grey bg-white hover:border-brand-blue'
                    }`}
                  >
                    <p className="text-sm font-medium text-brand-granite line-clamp-2">{doubt.question_text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        doubt.status === 'queued' ? 'bg-yellow-100 text-yellow-700' :
                        doubt.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {doubt.status === 'queued' ? t('queued') : doubt.status === 'active' ? t('liveNow') : t('resolved')}
                      </span>
                      <span className="text-xs text-brand-clay">{doubt.subjects?.name_en}</span>
                    </div>
                    {isTeacher && doubt.status === 'queued' && (
                      <span className="block mt-2 text-xs text-brand-orange font-medium">Click to accept</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {activeSession ? (
                <div className="bg-white rounded-xl border border-brand-grey flex flex-col h-[500px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-brand-grey">
                    <p className="font-medium text-brand-granite text-sm">{activeSession.question_text}</p>
                    <p className="text-xs text-brand-clay mt-0.5">
                      {activeSession.subjects?.name_en || 'General'} &middot; {activeSession.status}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="w-10 h-10 text-brand-blue mx-auto mb-2" />
                        <p className="text-sm text-brand-clay">Start the conversation</p>
                      </div>
                    )}
                    {messages.map((msg, i) => {
                      const isMe = msg.sender_id === profile?.id
                      return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? 'bg-brand-orange text-white rounded-br-sm'
                              : 'bg-brand-grey text-brand-granite rounded-bl-sm'
                          }`}>
                            {!isMe && <p className="text-xs font-medium mb-1 opacity-70">{msg.profiles?.name_en || 'User'}</p>}
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSend} className="p-3 border-t border-brand-grey">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 border border-brand-grey rounded-xl text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2.5 bg-brand-orange text-white rounded-xl hover:bg-brand-clay disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-brand-grey p-12 text-center">
                  <MessageCircle className="w-14 h-14 text-brand-blue mx-auto mb-4" />
                  <h3 className="font-bold text-brand-granite">Select a doubt to start chatting</h3>
                  <p className="text-sm text-brand-clay mt-1">
                    {isTeacher ? 'Pick a question from the queue to help a student' : 'Choose from your doubts or ask a new one'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
