import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ConfigurationError({ message = 'PharmaInsight is not connected to its research database.' }) {
  return (
    <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]" role="alert">
      <AlertCircle size={25} />
      <h1>Research service unavailable</h1>
      <p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">{message}</p>
      <p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then reload the application.</p>
      <Link className="button button-outline [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [color:#455970] [border-color:#dce5ed] [background:#fff] enabled:hover:[border-color:#b7c8d8] enabled:hover:[background:#f8fafc] [margin-top:4px]" to="/">Return to home</Link>
    </div>
  )
}
