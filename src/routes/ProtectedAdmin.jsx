import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoaderCircle } from 'lucide-react'

export default function ProtectedAdmin() {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <div className="full-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><LoaderCircle className="spin animate-spin" size={28} /><span>Verifying administrator access…</span></div>
  }
  return session ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location }} />
}
