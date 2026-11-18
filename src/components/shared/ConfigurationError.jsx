import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ConfigurationError({ message = 'PharmaInsight is not connected to its research database.' }) {
  return (
    <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs" role="alert">
      <AlertCircle size={25} />
      <h1>Research service unavailable</h1>
      <p className="max-w-[460px] m-0 text-center leading-[1.7]">{message}</p>
      <p className="max-w-[460px] m-0 text-center leading-[1.7]">Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then reload the application.</p>
      <Link className="button button-outline min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-[#455970] border-[#dce5ed] bg-white enabled:hover:border-[#b7c8d8] enabled:hover:bg-[#f8fafc] mt-1" to="/">Return to home</Link>
    </div>
  )
}
