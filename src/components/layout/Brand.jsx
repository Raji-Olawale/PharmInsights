import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function Brand({ light = false, compact = false, size = 'default' }) {
  const small = size !== 'default'
  const markClass = small
    ? 'size-[31px] rounded-[9px] max-mobile:size-[28px]'
    : 'size-[35px] rounded-[11px] max-mobile:size-[35px]'
  const nameClass = size === 'questionnaire'
    ? 'text-[16px] max-mobile:text-[14px]'
    : size === 'sidebar'
      ? 'text-[16px]'
      : small
        ? 'text-[17px]'
        : 'text-[19px] max-mobile:text-[17px]'

  return (
    <Link className={`brand inline-flex shrink-0 items-center gap-[10px] ${light ? 'brand-light text-white' : 'text-[#0b2e59]'}`} to="/" aria-label="PharmaInsight home">
      <span className={`brand-mark inline-grid place-items-center bg-[#079b59] text-white shadow-[0_5px_13px_rgba(7,155,89,.2)] ${light ? 'bg-[#11a568]' : ''} ${markClass}`}><Activity size={small ? 18 : 21} strokeWidth={2.5} /></span>
      {!compact && <span className={`brand-name font-[Manrope,sans-serif] font-extrabold tracking-[-.8px] ${nameClass}`}>Pharma<span className="text-[#079b59]">Insight</span></span>}
    </Link>
  )
}
