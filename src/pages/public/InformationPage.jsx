import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import ConfigurationError from '../../components/shared/ConfigurationError'
import PageLoader from '../../components/shared/PageLoader'
import { categories, categoryPath } from '../../data/questionnaires'
import { useCategories } from '../../hooks/useResearch'
import { useDrafts } from '../../hooks/useDrafts'
import { isSupabaseConfigured } from '../../lib/supabase'

const optionalContact = z.string().trim().max(200, 'Use 200 characters or fewer.')
  .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Enter a valid email address.')

const schema = z.object({
  businessName: z.string().trim().min(1, 'Enter your business or organisation name.').max(200, 'Use 200 characters or fewer.'),
  contactName: z.string().trim().min(1, 'Enter the contact person’s full name.').max(200, 'Use 200 characters or fewer.'),
  email: optionalContact,
  phone: z.string().trim().max(200, 'Use 200 characters or fewer.'),
  country: z.string().trim().min(1, 'Enter your country.').max(200, 'Use 200 characters or fewer.'),
  city: z.string().trim().min(1, 'Enter your city or location.').max(200, 'Use 200 characters or fewer.'),
}).superRefine((values, context) => {
  if (`${values.city}, ${values.country}`.length > 200) {
    context.addIssue({ code: 'custom', path: ['city'], message: 'City and country together must be 200 characters or fewer.' })
  }
  if ([values.email, values.phone].filter(Boolean).join(' / ').length > 200) {
    context.addIssue({ code: 'custom', path: ['phone'], message: 'Email and phone together must be 200 characters or fewer.' })
  }
})

export default function InformationPage() {
  const { category: slug } = useParams()
  const metadata = categories[slug]
  const navigate = useNavigate()
  const { data: categoryRows = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { startDraft } = useDrafts()
  const [submitError, setSubmitError] = useState('')
  const [shareDetails, setShareDetails] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { email: '', phone: '' } })
  const category = categoryRows.find((item) => item.slug === slug)

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!metadata) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><p className="max-w-[460px] m-0 text-center leading-[1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose a category</Link></div>
  if (categoriesLoading) return <PageLoader label="Loading stakeholder category…" />
  if (categoriesError) return <ConfigurationError message={categoriesError.message} />
  if (!category) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><p className="max-w-[460px] m-0 text-center leading-[1.7]">This stakeholder category is not available in the research database.</p><Link to="/select-category">Choose another category</Link></div>

  const beginAnonymous = () => {
    startDraft(slug, true, {})
    navigate(categoryPath(slug, 'questions'))
  }

  const onSubmit = (values) => {
    setSubmitError('')
    const respondent = {
      name: values.contactName.trim(),
      business: values.businessName.trim(),
      location: `${values.city.trim()}, ${values.country.trim()}`,
      contact: [values.email.trim(), values.phone.trim()].filter(Boolean).join(' / '),
    }
    if (respondent.contact.length > 200) {
      setSubmitError('Email and phone together must be 200 characters or fewer.')
      return
    }
    startDraft(slug, false, respondent)
    navigate(categoryPath(slug, 'questions'))
  }

  return (
    <div className="form-page min-h-screen bg-page">
      <div className="form-layout w-[min(100%_-_48px,_1060px)] min-h-[calc(100vh_-_66px)] my-0 mx-auto pt-[37px] px-0 pb-[52px] grid items-start gap-[65px] max-tablet:gap-[30px] max-mobile:w-[min(100%_-_36px,_520px)] max-mobile:pt-5 max-mobile:px-0 max-mobile:pb-[34px] max-mobile:flex max-mobile:flex-col max-mobile:gap-[21px]">
        
        <section className="form-main pt-2 max-mobile:w-full max-mobile:p-0">
          <div className="form-progress-meta flex justify-between text-[#8a98a9] text-[9px]"><span className="first:text-green first:text-[8px] first:font-bold first:tracking-[.7px]">STEP 02 OF 03</span><span className="first:text-green first:text-[8px] first:font-bold first:tracking-[.7px]">{shareDetails ? 'Business information' : 'Choose how to participate'}</span></div><div className="form-progress h-0.75 mt-2.5 overflow-hidden rounded-[10px] bg-[#e6edf2]"><span style={{ width: '33%' }} className="h-full block rounded-[inherit] bg-green" /></div>
          <header className="form-heading mt-[25px] mx-0 mb-[22px] relative pl-[46px] max-mobile:my-[19px] max-mobile:mx-0"><span className="form-icon w-[34px] h-[34px] absolute left-0 top-0 rounded-[10px] grid place-items-center text-green bg-[#e8f7ef]">{shareDetails ? <UserRound size={20} /> : <ShieldCheck size={20} />}</span>
          <h2 className="mt-0 mx-0 mb-1 text-navy font-display text-[19px] tracking-[-.45px]">{shareDetails ? 'Tell us about your business' : 'How would you like to respond?'}</h2>
          {/* <p className="m-0 text-[#8794a4] text-[9px]">{shareDetails ? 'Your information is only shared with your consent.' : 'You can continue without sharing identifying details.'}</p> */}
          </header>
          {!shareDetails ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Choose how to participate">
            <button
              type="button"
              onClick={beginAnonymous}
              className="group flex min-h-[130px] flex-col items-start rounded-xl border border-[#dfe8ef] bg-white p-4 text-left shadow-[0_4px_14px_rgba(18,43,70,.035)] transition hover:-translate-y-0.5 hover:border-[#79c9a1] hover:shadow-[0_10px_24px_rgba(18,43,70,.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769aa]"
            >
              <span className="mb-3 grid size-10 place-items-center rounded-xl bg-[#eaf7f0] text-[#079b59]"><ShieldCheck size={20} /></span>
              <span className="flex w-full items-center justify-between gap-2 text-[13px] font-bold text-[#203751]">
                Answer anonymously <ArrowRight size={16} className="text-[#8293a4] transition group-hover:translate-x-0.5 group-hover:text-[#079b59]" />
              </span>
              <span className="mt-1.5 text-[10px] leading-relaxed text-[#74869a]">Continue without sharing your name or business details.</span>
            </button>
            <button
              type="button"
              onClick={() => setShareDetails(true)}
              className="group flex min-h-[130px] flex-col items-start rounded-xl border border-[#dfe8ef] bg-white p-4 text-left shadow-[0_4px_14px_rgba(18,43,70,.035)] transition hover:-translate-y-0.5 hover:border-[#79c9a1] hover:shadow-[0_10px_24px_rgba(18,43,70,.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769aa]"
            >
              <span className="mb-3 grid size-10 place-items-center rounded-xl bg-[#edf5fd] text-[#1769aa]"><UserRound size={20} /></span>
              <span className="flex w-full items-center justify-between gap-2 text-[13px] font-bold text-[#203751]">
                Share your details <ArrowRight size={16} className="text-[#8293a4] transition group-hover:translate-x-0.5 group-hover:text-[#079b59]" />
              </span>
              <span className="mt-1.5 text-[10px] leading-relaxed text-[#74869a]">Tell us about your business to help us understand your perspective.</span>
            </button>
          </div> : <div>
          <button type="button" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#60738a] transition hover:text-[#0b2e59]" onClick={() => setShareDetails(false)}><ArrowLeft size={15} />Back to participation options</button>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-grid grid grid-cols-2 gap-y-[15px] gap-x-[13px] max-mobile:gap-y-[13px] gap-x-2.5">
              <Field label="Business / organisation name" name="businessName" placeholder="e.g. Acacia Healthcare Ltd" register={register} error={errors.businessName} required />
              <Field label="Contact person’s full name" name="contactName" placeholder="Full name" register={register} error={errors.contactName} required />
              <Field label="Business email (optional)" name="email" placeholder="name@business.com" type="email" register={register} error={errors.email} />
              <Field label="Phone number (optional)" name="phone" placeholder="+256 700 000 000" type="tel" register={register} error={errors.phone} />
              <Field label="Country" name="country" placeholder="e.g. Uganda" register={register} error={errors.country} required />
              <Field label="City / location" name="city" placeholder="e.g. Kampala" register={register} error={errors.city} required />
            </div>
            {submitError && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px] mt-3.5" role="alert">{submitError}</div>}
            <div className="form-submit-row mt-6 flex justify-between items-center gap-3 max-mobile:items-stretch max-mobile:flex-col-reverse max-mobile:gap-3"><span className="inline-flex items-center gap-1.5 text-[#8190a0] text-[9px]"><ShieldCheck size={15} />Only submitted with your consent</span><button className="button button-green min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] max-mobile:w-full" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin animate-spin" size={17} />Starting…</> : <>Continue to questions <ArrowRight size={17} /></>}</button></div>
          </form>
          </div>}
        </section>
      </div>
    </div>
  )
}

function Field({ label, name, placeholder, type = 'text', register, error, required }) {
  return <label className="form-field min-w-0 flex flex-col gap-1.5 text-[#344a62] text-[10px] font-semibold max-mobile:text-[9px]"><span>{label} {required && <b className="text-[#e2725e]">*</b>}</span><input type={type} placeholder={placeholder} autoComplete="on" maxLength={200} {...register(name)} aria-invalid={Boolean(error)} className="w-full h-10 py-0 px-[11px] outline-none border border-[#dfe6ed] rounded-[7px] text-[#203751] bg-white text-[10px] transition-colors duration-200 placeholder:text-[#a5b0bc] focus:border-[#57ba89] focus:shadow-[0_0_0_3px_rgba(7,155,89,.09)] aria-invalid:border-[#dc7868] max-mobile:h-[39px] max-mobile:py-0 max-mobile:px-[9px] max-mobile:text-[9px]" />{error && <small className="field-error text-[#be4f44] text-[9px] font-medium">{error.message}</small>}</label>
}
