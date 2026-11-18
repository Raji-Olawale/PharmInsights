import { useEffect, useMemo, useState } from 'react'
import { researchService } from '../services/researchService'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './ProviderContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }
    let active = true
    researchService.getAdminSession()
      .then((value) => { if (active) setSession(value) })
      .catch((error) => { if (active) setAuthError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, value) => {
      if (!value) {
        setSession(null)
        setLoading(false)
        return
      }
      setTimeout(() => {
        researchService.getAdminSession()
          .then(setSession)
          .catch((error) => setAuthError(error.message))
          .finally(() => setLoading(false))
      }, 0)
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    session,
    loading,
    authError,
    signIn: async (email, password) => {
      setAuthError('')
      setLoading(true)
      try {
        const result = await researchService.signIn(email, password)
        setSession(result.session)
      } finally {
        setLoading(false)
      }
    },
    signOut: async () => {
      await researchService.signOut()
      setSession(null)
    },
  }), [session, loading, authError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
