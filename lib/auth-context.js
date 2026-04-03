'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, auth as authHelpers } from './supabase'
import { useAppStore } from './store'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const { setUser, setProfile, setLoading, setSubscription } = useAppStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          const { data: profile } = await authHelpers.getProfile(session.user.id)
          if (profile) setProfile(profile)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        setLoading(false)
        setReady(true)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        const { data: profile } = await authHelpers.getProfile(session.user.id)
        if (profile) setProfile(profile)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setSubscription(null)
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-grey">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-granite font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
