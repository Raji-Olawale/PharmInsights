import { useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Brand from '../../components/layout/Brand'
import { useAuth } from '../../hooks/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function LoginPage() {
  const { session, signIn, loading, authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  if (session) return <Navigate to="/admin/dashboard" replace />
  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="login-page min-h-screen relative overflow-hidden bg-page">
      <header className="login-topbar h-[68px] py-0 px-9 border-b border-[#e4ebf1] flex items-center justify-between bg-white max-mobile:h-[60px] max-mobile:py-0 max-mobile:px-[17px]"><Brand size="small" /><Link to="/" className="flex items-center gap-1.5 text-[#718198] text-[10px] font-semibold hover:text-navy"><ArrowLeft size={16} />Go back Home</Link></header>
      <main className="login-main min-h-[calc(100vh_-_68px)] relative z-1 pt-[34px] px-5 pb-[18px] flex flex-col items-center justify-center max-mobile:min-h-[calc(100vh_-_60px)] max-mobile:pt-[26px] max-mobile:px-[17px] max-mobile:pb-[15px]">
        <div className="login-card w-[min(100%,_410px)] pt-[31px] px-[31px] pb-[23px] border border-[#e4eaf0] rounded-[13px] bg-white shadow-[0_15px_40px_rgba(17,43,74,.07)] max-mobile:pt-[25px] max-mobile:px-[21px] max-mobile:pb-[19px]">
          <div className="login-symbol w-[43px] h-[43px] mb-[18px] rounded-xl grid place-items-center text-green bg-soft-green"><LockKeyhole size={23} /></div>
          <span className="login-eyebrow text-[#7b8b9b] text-[8px] font-bold tracking-wide">PHARMAINSIGHT RESEARCH PORTAL</span>
          <h1 className="mt-2 mx-0 mb-1.5 text-navy font-display text-[25px] tracking-[-.8px]">Welcome back</h1><p className="mt-0 mx-0 mb-[21px] text-[#7b8998] text-[10px]">Sign in to securely manage research responses.</p>
          {authError && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{authError}</div>}
          {!isSupabaseConfigured && <div className="setup-notice mt-0 mx-0 mb-[17px] py-2.5 px-[11px] border border-[#f1d7af] rounded-lg flex items-start gap-2 text-[#795b2d] bg-[#fffaf1]"><ShieldCheck size={18} /><div><strong className="block text-[9px]">Admin access is not configured</strong><span className="block mt-1 text-[8px] leading-relaxed">Connect your Supabase project to enable authenticated administrator access.</span></div></div>}
          <form onSubmit={onSubmit} className="grid gap-3.5">
            <label className="form-field min-w-0 flex flex-col gap-1.5 text-[#344a62] text-[10px] font-semibold gap-[7px] max-mobile:text-[9px]"><span className="text-[9px]">Administrator email</span><input type="email" placeholder="you@organisation.org" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required className="w-full h-10 py-0 px-[11px] outline-none border border-[#dfe6ed] rounded-[7px] text-[#203751] bg-white text-[10px] transition-colors duration-200 placeholder:text-[#a5b0bc] focus:border-[#57ba89] focus:shadow-[0_0_0_3px_rgba(7,155,89,.09)] h-[42px] max-mobile:h-[39px] max-mobile:py-0 max-mobile:px-[9px] max-mobile:text-[9px]" /></label>
            <label className="form-field min-w-0 flex flex-col gap-1.5 text-[#344a62] text-[10px] font-semibold gap-[7px] max-mobile:text-[9px]"><span className="text-[9px]">Password</span><div className="password-wrap relative"><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="w-full h-10 py-0 px-[11px] outline-none border border-[#dfe6ed] rounded-[7px] text-[#203751] bg-white text-[10px] transition-colors duration-200 placeholder:text-[#a5b0bc] focus:border-[#57ba89] focus:shadow-[0_0_0_3px_rgba(7,155,89,.09)] h-[42px] pr-10 max-mobile:h-[39px] max-mobile:py-0 max-mobile:px-[9px] max-mobile:text-[9px]" /><button type="button" className="password-toggle w-[33px] h-[38px] absolute right-[1px] top-[1px] border-0 grid place-items-center text-[#8998a8] bg-transparent" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {error && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{error}</div>}
            <button type="submit" className="button button-green login-submit min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] w-full mt-0.75 min-h-[43px]" disabled={!isSupabaseConfigured || loading || submitting}>{submitting ? <><LoaderCircle className="spin animate-spin" size={17} />Verifying access…</> : <>Sign in securely <ArrowRight size={17} /></>}</button>
          </form>
          <div className="login-security mt-[19px] pt-3.5 border-t border-[#edf1f4] flex items-start gap-[7px] text-[#8795a4] text-[8px] leading-relaxed"><KeyRound size={14} />Administrator access is protected by Supabase Authentication and role policies.</div>
        </div>
        <div className="login-bottom w-[min(100%,_900px)] mt-auto pt-[29px] flex justify-between text-[#9ba8b5] text-[8px] tracking-[.6px] max-mobile:text-[7px]"><span>UNDERSTAND. IMPROVE. INNOVATE.</span><span>© {new Date().getFullYear()} PharmaInsight</span></div>
      </main>
      <div className="login-decoration login-decoration-a absolute w-[330px] h-[330px] border border-[rgba(7,155,89,.07)] rounded-full left-[-180px] top-[160px] shadow-[0_0_0_35px_rgba(7,155,89,.018),_0_0_0_72px_rgba(7,155,89,.015)]" /><div className="login-decoration login-decoration-b absolute w-[330px] h-[330px] border border-[rgba(7,155,89,.07)] rounded-full right-[-190px] bottom-[-120px] border-[rgba(23,105,170,.07)] shadow-[0_0_0_42px_rgba(23,105,170,.018)]" />
    </div>
  )
}
