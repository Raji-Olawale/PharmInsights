import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { categories, categoryPath } from '../../data/questionnaires'
import ConfigurationError from '../../components/shared/ConfigurationError'
import PageLoader from '../../components/shared/PageLoader'
import { useCategories } from '../../hooks/useResearch'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getAccentStyle } from '../../utils/categoryStyles'

export default function CategoryPage() {
  const { data = [], isLoading, error } = useCategories()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('')

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (isLoading) return <PageLoader label="Loading stakeholder categories…" />
  if (error) return <ConfigurationError message={error.message} />

  return (
    <div className="onboarding-page [min-height:calc(100vh_-_78px)] [padding:27px_24px_24px] [display:flex] [flex-direction:column] [background:#f6f9fc] max-[620px]:[min-height:calc(100vh_-_66px)] max-[620px]:[padding:18px_19px]">
      <div className="onboarding-back [width:min(100%,_850px)] [margin:0_auto]"><Link to="/" className="[display:inline-flex] [align-items:center] [gap:7px] [color:#718198] [font-size:11px] [font-weight:600] hover:[color:var(--navy)]"><ArrowLeft size={16} />Back to home</Link></div>
      <div className="onboarding-shell [width:min(100%,_600px)] [margin:auto] [padding:23px_0_33px] max-[620px]:[padding:32px_0]">
        <div className="step-indicator [display:flex] [align-items:center] [gap:10px] [color:#8391a2] [font-size:9px] [font-weight:700] [letter-spacing:.9px]"><span className="step-current [color:var(--green)] [font-size:12px]">01</span><span className="step-track [width:31px] [height:1px] [background:#cbd8e1]" /><span>SELECT YOUR ROLE</span></div>
        <div className="onboarding-title [margin:21px_0_22px]"><h1 className="[margin:0_0_8px] [color:var(--navy)] [font-family:Manrope,_sans-serif] [font-size:30px] [letter-spacing:-1.1px] max-[620px]:[font-size:26px]">Which best describes you?</h1><p className="[margin:0] [color:#748398] [font-size:12px] [line-height:1.7]">Choose your role in the pharmaceutical supply chain to get started.</p></div>
        <div className="selection-list [display:grid] [gap:10px]">
          {data.map((category) => {
            const metadata = categories[category.slug]
            if (!metadata) return null
            const Icon = metadata.icon
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selectedCategory === category.slug}
                style={getAccentStyle(metadata.accent)}
                className={`selection-card accent-${metadata.accent} flex min-h-[86px] w-full items-center gap-[14px] rounded-[10px] border bg-white px-[15px] py-[14px] text-left text-[var(--text)] transition duration-200 hover:border-[#bacbd8] max-[620px]:min-h-[82px] max-[620px]:gap-[11px] max-[620px]:p-[11px] ${selectedCategory === category.slug ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_0_2px_var(--accent-soft),0_8px_20px_rgba(18,43,70,.08)]' : 'border-[#e0e7ed]'} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
                onClick={() => setSelectedCategory(category.slug)}
              >
                <span className="selection-icon [width:43px] [height:43px] [flex:0_0_auto] [border-radius:11px] [display:grid] [place-items:center] [color:var(--accent)] [background:var(--accent-soft)] max-[620px]:[width:38px] max-[620px]:[height:38px]"><Icon size={22} /></span>
                <span className="selection-copy [display:grid] [gap:5px]"><strong className="[color:#203954] [font-size:12px]">{category.name}</strong><small className="[color:#78889a] [font-size:10px] [line-height:1.5] max-[620px]:[font-size:9px]">{category.description}</small></span>
                <span className={`ml-auto grid size-6 shrink-0 place-items-center rounded-full transition ${selectedCategory === category.slug ? 'bg-[var(--accent)] text-white' : 'border border-[#dbe3eb] text-transparent'}`}>{selectedCategory === category.slug ? <Check size={15} /> : <ArrowRight size={15} className="text-[#8293a4]" />}</span>
              </button>
            )
          })}
          {data.length === 0 && <div className="admin-error [padding:34px] [border:1px_solid_#f0d7d1] [border-radius:9px] [background:#fff]"><h2 className="[margin:0_0_8px] [color:#934c43] [font-size:14px]">No categories are configured</h2><p className="[margin:0_0_17px] [color:#8c7671] [font-size:10px]">The database returned no stakeholder categories.</p></div>}
        </div>
        <div className="selection-actions [margin-top:20px] [display:flex] [justify-content:space-between] [align-items:center] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:15px]">
          <span className="selection-security [display:flex] [align-items:center] [gap:7px] [color:#77889b] [font-size:10px]">No account required</span>
          <button
            type="button"
            disabled={!selectedCategory}
            onClick={() => navigate(categoryPath(selectedCategory))}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#079b59] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#07844e] disabled:cursor-not-allowed disabled:bg-[#a8c9b8] disabled:shadow-none"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="onboarding-bottom [max-width:850px] [width:100%] [margin:0_auto] [padding-top:13px] [border-top:1px_solid_#e4eaf0] [display:flex] [justify-content:space-between] [color:#94a1b0] [font-size:9px] max-[620px]:[gap:10px] max-[620px]:[font-size:7px]"><span className="first:[font-weight:700] first:[letter-spacing:.9px]">PHARMAINSIGHT</span><span className="first:[font-weight:700] first:[letter-spacing:.9px]">Your contribution is confidential and secure.</span></div>
    </div>
  )
}
