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
    <div className="login-page [min-height:100vh] [position:relative] [overflow:hidden] [background:#f5f8fc]">
      <header className="login-topbar [height:68px] [padding:0_36px] [border-bottom:1px_solid_#e4ebf1] [display:flex] [align-items:center] [justify-content:space-between] [background:#fff] max-[620px]:[height:60px] max-[620px]:[padding:0_17px]"><Brand size="small" /><Link to="/" className="[display:flex] [align-items:center] [gap:6px] [color:#718198] [font-size:10px] [font-weight:600] hover:[color:var(--navy)]"><ArrowLeft size={16} />Back to website</Link></header>
      <main className="login-main [min-height:calc(100vh_-_68px)] [position:relative] [z-index:1] [padding:34px_20px_18px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] max-[620px]:[min-height:calc(100vh_-_60px)] max-[620px]:[padding:26px_17px_15px]">
        <div className="login-card [width:min(100%,_410px)] [padding:31px_31px_23px] [border:1px_solid_#e4eaf0] [border-radius:13px] [background:#fff] [box-shadow:0_15px_40px_rgba(17,43,74,.07)] max-[620px]:[padding:25px_21px_19px]">
          <div className="login-symbol [width:43px] [height:43px] [margin-bottom:18px] [border-radius:12px] [display:grid] [place-items:center] [color:var(--green)] [background:#eaf7f0]"><LockKeyhole size={23} /></div>
          <span className="login-eyebrow [color:#7b8b9b] [font-size:8px] [font-weight:700] [letter-spacing:1px]">PHARMAINSIGHT RESEARCH PORTAL</span>
          <h1 className="[margin:8px_0_6px] [color:var(--navy)] [font-family:Manrope,_sans-serif] [font-size:25px] [letter-spacing:-.8px]">Welcome back</h1><p className="[margin:0_0_21px] [color:#7b8998] [font-size:10px]">Sign in to securely manage research responses.</p>
          {authError && <div className="form-error [margin-top:13px] [padding:10px_12px] [border:1px_solid_#f1c5bf] [border-radius:7px] [color:#a94438] [background:#fff5f4] [font-size:10px]" role="alert">{authError}</div>}
          {!isSupabaseConfigured && <div className="setup-notice [margin:0_0_17px] [padding:10px_11px] [border:1px_solid_#f1d7af] [border-radius:8px] [display:flex] [align-items:flex-start] [gap:8px] [color:#795b2d] [background:#fffaf1]"><ShieldCheck size={18} /><div><strong className="[display:block] [font-size:9px]">Admin access is not configured</strong><span className="[display:block] [margin-top:4px] [font-size:8px] [line-height:1.6]">Connect your Supabase project to enable authenticated administrator access.</span></div></div>}
          <form onSubmit={onSubmit} className="[display:grid] [gap:14px]">
            <label className="form-field [min-width:0] [display:flex] [flex-direction:column] [gap:6px] [color:#344a62] [font-size:10px] [font-weight:600] [gap:7px] max-[620px]:[font-size:9px]"><span className="[font-size:9px]">Administrator email</span><input type="email" placeholder="you@organisation.org" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required className="[width:100%] [height:40px] [padding:0_11px] [outline:none] [border:1px_solid_#dfe6ed] [border-radius:7px] [color:#203751] [background:#fff] [font-size:10px] [transition:border-color_.17s,_box-shadow_.17s] placeholder:[color:#a5b0bc] focus:[border-color:#57ba89] focus:[box-shadow:0_0_0_3px_rgba(7,155,89,.09)] [height:42px] max-[620px]:[height:39px] max-[620px]:[padding:0_9px] max-[620px]:[font-size:9px]" /></label>
            <label className="form-field [min-width:0] [display:flex] [flex-direction:column] [gap:6px] [color:#344a62] [font-size:10px] [font-weight:600] [gap:7px] max-[620px]:[font-size:9px]"><span className="[font-size:9px]">Password</span><div className="password-wrap [position:relative]"><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="[width:100%] [height:40px] [padding:0_11px] [outline:none] [border:1px_solid_#dfe6ed] [border-radius:7px] [color:#203751] [background:#fff] [font-size:10px] [transition:border-color_.17s,_box-shadow_.17s] placeholder:[color:#a5b0bc] focus:[border-color:#57ba89] focus:[box-shadow:0_0_0_3px_rgba(7,155,89,.09)] [height:42px] [padding-right:40px] max-[620px]:[height:39px] max-[620px]:[padding:0_9px] max-[620px]:[font-size:9px]" /><button type="button" className="password-toggle [width:33px] [height:38px] [position:absolute] [right:1px] [top:1px] [border:0] [display:grid] [place-items:center] [color:#8998a8] [background:transparent]" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {error && <div className="form-error [margin-top:13px] [padding:10px_12px] [border:1px_solid_#f1c5bf] [border-radius:7px] [color:#a94438] [background:#fff5f4] [font-size:10px]" role="alert">{error}</div>}
            <button type="submit" className="button button-green login-submit [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [color:#fff] [background:var(--green)] [box-shadow:0_5px_13px_rgba(7,155,89,.13)] enabled:hover:[background:var(--green-dark)] enabled:hover:[box-shadow:0_8px_18px_rgba(7,155,89,.2)] [width:100%] [margin-top:3px] [min-height:43px]" disabled={!isSupabaseConfigured || loading || submitting}>{submitting ? <><LoaderCircle className="spin animate-spin" size={17} />Verifying access…</> : <>Sign in securely <ArrowRight size={17} /></>}</button>
          </form>
          <div className="login-security [margin-top:19px] [padding-top:14px] [border-top:1px_solid_#edf1f4] [display:flex] [align-items:flex-start] [gap:7px] [color:#8795a4] [font-size:8px] [line-height:1.6]"><KeyRound size={14} />Administrator access is protected by Supabase Authentication and role policies.</div>
        </div>
        <div className="login-bottom [width:min(100%,_900px)] [margin-top:auto] [padding-top:29px] [display:flex] [justify-content:space-between] [color:#9ba8b5] [font-size:8px] [letter-spacing:.6px] max-[620px]:[font-size:7px]"><span>UNDERSTAND. IMPROVE. INNOVATE.</span><span>© {new Date().getFullYear()} PharmaInsight</span></div>
      </main>
      <div className="login-decoration login-decoration-a [position:absolute] [width:330px] [height:330px] [border:1px_solid_rgba(7,155,89,.07)] [border-radius:50%] [left:-180px] [top:160px] [box-shadow:0_0_0_35px_rgba(7,155,89,.018),_0_0_0_72px_rgba(7,155,89,.015)]" /><div className="login-decoration login-decoration-b [position:absolute] [width:330px] [height:330px] [border:1px_solid_rgba(7,155,89,.07)] [border-radius:50%] [right:-190px] [bottom:-120px] [border-color:rgba(23,105,170,.07)] [box-shadow:0_0_0_42px_rgba(23,105,170,.018)]" />
    </div>
  )
}
