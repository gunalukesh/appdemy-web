'use client'
import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // Auth state
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  // Language
  lang: 'en',
  toggleLang: () => set((s) => ({ lang: s.lang === 'en' ? 'ta' : 'en' })),

  // Navigation
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Curriculum selection
  selectedStandard: null,
  selectedSubject: null,
  selectedChapter: null,
  setSelectedStandard: (s) => set({ selectedStandard: s, selectedSubject: null, selectedChapter: null }),
  setSelectedSubject: (s) => set({ selectedSubject: s, selectedChapter: null }),
  setSelectedChapter: (c) => set({ selectedChapter: c }),

  // Active subscription
  subscription: null,
  setSubscription: (sub) => set({ subscription: sub }),

  // Helper: check if user has access to a lesson
  hasAccess: (lesson) => {
    const { subscription } = get()
    if (lesson?.is_free) return true
    if (!subscription) return false
    if (subscription.plan === 'monthly_99' || subscription.plan === 'yearly_799') return true
    if (subscription.plan === 'single_subject_29' && subscription.subject_id === lesson?.subject_id) return true
    return false
  }
}))
