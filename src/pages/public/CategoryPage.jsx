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
    <div className="onboarding-page min-h-[calc(100vh_-_78px)] pt-[27px] px-6 pb-6 flex flex-col bg-[#f6f9fc] max-mobile:min-h-[calc(100vh_-_66px)] max-mobile:py-[18px] max-mobile:px-[19px]">
      <div className="onboarding-back w-[min(100%,_850px)] my-0 mx-auto"><Link to="/" className="inline-flex items-center gap-[7px] text-[#718198] text-[11px] font-semibold hover:text-navy"><ArrowLeft size={16} />Back to home</Link></div>
      <div className="onboarding-shell w-[min(100%,_600px)] m-auto pt-[23px] px-0 pb-[33px] max-mobile:py-8 max-mobile:px-0">
        <div className="step-indicator flex items-center gap-2.5 text-[#8391a2] text-[9px] font-bold tracking-[.9px]"><span className="step-current text-green text-xs">01</span><span className="step-track w-[31px] h-px bg-[#cbd8e1]" /><span>SELECT YOUR ROLE</span></div>
        <div className="onboarding-title mt-[21px] mx-0 mb-[22px]"><h1 className="mt-0 mx-0 mb-2 text-navy font-display text-3xl tracking-[-1.1px] max-mobile:text-[26px]">Which best describes you?</h1><p className="m-0 text-[#748398] text-xs leading-[1.7]">Choose your role in the pharmaceutical supply chain to get started.</p></div>
        <div className="selection-list grid gap-2.5">
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
                className={`selection-card accent-${metadata.accent} flex min-h-[86px] w-full items-center gap-[14px] rounded-[10px] border bg-white px-[15px] py-[14px] text-left text-[var(--text)] transition duration-200 hover:border-[#bacbd8] max-mobile:min-h-[82px] max-mobile:gap-[11px] max-mobile:p-[11px] ${selectedCategory === category.slug ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_0_0_2px_var(--accent-soft),0_8px_20px_rgba(18,43,70,.08)]' : 'border-[#e0e7ed]'} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
                onClick={() => setSelectedCategory(category.slug)}
              >
                <span className="selection-icon w-[43px] h-[43px] flex-none rounded-[11px] grid place-items-center text-[var(--accent)] bg-[var(--accent-soft)] max-mobile:w-[38px] max-mobile:h-[38px]"><Icon size={22} /></span>
                <span className="selection-copy grid gap-[5px]"><strong className="text-[#203954] text-xs">{category.name}</strong><small className="text-[#78889a] text-[10px] leading-normal max-mobile:text-[9px]">{category.description}</small></span>
                <span className={`ml-auto grid size-6 shrink-0 place-items-center rounded-full transition ${selectedCategory === category.slug ? 'bg-[var(--accent)] text-white' : 'border border-[#dbe3eb] text-transparent'}`}>{selectedCategory === category.slug ? <Check size={15} /> : <ArrowRight size={15} className="text-[#8293a4]" />}</span>
              </button>
            )
          })}
          {data.length === 0 && <div className="admin-error p-[34px] border border-[#f0d7d1] rounded-[9px] bg-white"><h2 className="mt-0 mx-0 mb-2 text-[#934c43] text-sm">No categories are configured</h2><p className="mt-0 mx-0 mb-[17px] text-[#8c7671] text-[10px]">The database returned no stakeholder categories.</p></div>}
        </div>
        <div className="selection-actions mt-5 flex justify-between items-center max-mobile:items-start max-mobile:flex-col max-mobile:gap-[15px]">
          <span className="selection-security flex items-center gap-[7px] text-[#77889b] text-[10px]">No account required</span>
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
      <div className="onboarding-bottom max-w-[850px] w-full my-0 mx-auto pt-[13px] border-t border-[#e4eaf0] flex justify-between text-[#94a1b0] text-[9px] max-mobile:gap-2.5 max-mobile:text-[7px]"><span className="first:font-bold first:tracking-[.9px]">PHARMAINSIGHT</span><span className="first:font-bold first:tracking-[.9px]">Your contribution is confidential and secure.</span></div>
    </div>
  )
}
