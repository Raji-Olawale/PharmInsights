import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoaderCircle } from 'lucide-react'

export default function ProtectedAdmin() {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <div className="full-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><LoaderCircle className="spin animate-spin" size={28} /><span>Verifying administrator access…</span></div>
  }
  return session ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location }} />
}
