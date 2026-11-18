import { AlertCircle, ArrowRight, Check, ClipboardCheck, LockKeyhole } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ConfigurationError from '../../components/shared/ConfigurationError'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function SuccessPage() {
  useScrollToTop()
  const { state } = useLocation()
  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!state?.reference) {
    return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><AlertCircle /><p className="max-w-[460px] m-0 text-center leading-[1.7]">We couldn’t verify a submitted response for this page.</p><Link className="button button-outline min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-[#455970] border-[#dce5ed] bg-white enabled:hover:border-[#b7c8d8] enabled:hover:bg-[#f8fafc] mt-1" to="/">Return to home</Link></div>
  }
  return (
    <div className="success-page min-h-screen bg-page">
     
      <main className="success-content w-[min(100%_-_38px,_510px)] min-h-[calc(100vh_-_116px)] m-auto pt-11 px-0 pb-[38px] flex flex-col items-center justify-center text-center max-mobile:min-h-[calc(100vh_-_106px)] max-mobile:pt-[30px]">
        <div className="success-art w-[124px] h-[124px] relative mb-[23px] grid place-items-center"><div className="success-ring ring-one absolute border border-[rgba(7,155,89,.18)] rounded-full inset-[5px]" /><div className="success-ring ring-two absolute border border-[rgba(7,155,89,.18)] rounded-full inset-[-5px] border-[rgba(7,155,89,.1)]" /><span className="w-[66px] h-[66px] border-[7px] border-[#d8f1e4] rounded-full grid place-items-center text-white bg-green shadow-[0_8px_19px_rgba(7,155,89,.2)]"><Check size={38} strokeWidth={2.2} /></span><i className="success-spark spark-one w-[7px] h-[7px] absolute rounded-sm bg-[#69c999] rotate-45 left-[4px] top-[29px]" /><i className="success-spark spark-two w-[7px] h-[7px] absolute rounded-sm bg-[#69c999] rotate-45 right-[5px] top-[27px] w-[5px] h-[5px]" /><i className="success-spark spark-three w-[7px] h-[7px] absolute rounded-sm bg-[#69c999] rotate-45 right-[19px] bottom-[4px] w-[5px] h-[5px]" /></div>
        <div className="eyebrow inline-flex items-center gap-[9px] text-[#708197] text-[10px] font-bold tracking-widest"><span className="eyebrow-dot w-[7px] h-[7px] inline-block rounded-full bg-green shadow-[0_0_0_4px_rgba(7,155,89,.1)]" />RESPONSE RECEIVED</div>
        <h1 className="mt-3 mx-0 mb-[9px] text-navy font-display text-[28px] tracking-[-.9px] max-mobile:text-2xl">Thank you for participating!</h1>
        <p className="max-w-[425px] m-0 text-[#718197] text-[11px] leading-[1.8]">Your questionnaire has been successfully submitted. Your contribution will help us better understand the pharmaceutical supply chain.</p>
        <div className="reference-card w-[min(100%,_330px)] mt-[21px] py-[13px] px-[18px] border border-[#dfe9e4] rounded-[9px] bg-white"><span className="flex items-center justify-center gap-1.5 text-[#72867d] text-[8px] font-bold tracking-[.8px]"><ClipboardCheck size={17} />SUBMISSION REFERENCE</span><strong className="mt-[9px] block text-navy font-display text-[17px] tracking-[.6px]">{state.reference}</strong><small className="mt-1 block text-[#93a095] text-[8px]">Keep this reference for your records.</small></div>
        {state.category && <div className="success-category mt-3.5 mx-0 mb-5 text-[#78899a] text-[9px]">Submitted as a <strong className="text-[#344d65]">{state.category}</strong></div>}
        <Link className="button button-navy min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-navy enabled:hover:bg-[#134478] mt-[23px]" to="/">Return to home <ArrowRight size={16} /></Link>
        <div className="success-privacy mt-[19px] flex items-center gap-1.5 text-[#8493a3] text-[9px]"><LockKeyhole size={14} />Your response has been securely recorded.</div>
      </main>
      <footer className="questionnaire-footer py-[15px] px-[25px] border-t border-[#e5ebf0] flex justify-between text-[#96a2b0] text-[8px] tracking-[.7px] max-mobile:py-[13px] max-mobile:px-4 max-mobile:text-[7px]"><span className="first:font-bold">PHARMAINSIGHT RESEARCH</span><span className="first:font-bold">Understand. Improve. Innovate.</span></footer>
    </div>
  )
}
