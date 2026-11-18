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
  if (!metadata) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose a category</Link></div>
  if (categoriesLoading) return <PageLoader label="Loading stakeholder category…" />
  if (categoriesError) return <ConfigurationError message={categoriesError.message} />
  if (!category) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">This stakeholder category is not available in the research database.</p><Link to="/select-category">Choose another category</Link></div>

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
    <div className="form-page [min-height:100vh] [background:#f5f8fc]">
      <div className="form-layout [width:min(100%_-_48px,_1060px)] [min-height:calc(100vh_-_66px)] [margin:0_auto] [padding:37px_0_52px] [display:grid] [align-items:start] [gap:65px] max-[800px]:[gap:30px] max-[620px]:[width:min(100%_-_36px,_520px)] max-[620px]:[padding:20px_0_34px] max-[620px]:[display:flex] max-[620px]:[flex-direction:column] max-[620px]:[gap:21px]">
        
        <section className="form-main [padding-top:8px] max-[620px]:[width:100%] max-[620px]:[padding:0]">
          <div className="form-progress-meta [display:flex] [justify-content:space-between] [color:#8a98a9] [font-size:9px]"><span className="first:[color:var(--green)] first:[font-size:8px] first:[font-weight:700] first:[letter-spacing:.7px]">STEP 02 OF 03</span><span className="first:[color:var(--green)] first:[font-size:8px] first:[font-weight:700] first:[letter-spacing:.7px]">{shareDetails ? 'Business information' : 'Choose how to participate'}</span></div><div className="form-progress [height:3px] [margin-top:10px] [overflow:hidden] [border-radius:10px] [background:#e6edf2]"><span style={{ width: '33%' }} className="[height:100%] [display:block] [border-radius:inherit] [background:var(--green)]" /></div>
          <header className="form-heading [margin:25px_0_22px] [position:relative] [padding-left:46px] max-[620px]:[margin:19px_0]"><span className="form-icon [width:34px] [height:34px] [position:absolute] [left:0] [top:0] [border-radius:10px] [display:grid] [place-items:center] [color:var(--green)] [background:#e8f7ef]">{shareDetails ? <UserRound size={20} /> : <ShieldCheck size={20} />}</span>
          <h2 className="[margin:0_0_4px] [color:var(--navy)] [font-family:Manrope,_sans-serif] [font-size:19px] [letter-spacing:-.45px]">{shareDetails ? 'Tell us about your business' : 'How would you like to respond?'}</h2>
          {/* <p className="[margin:0] [color:#8794a4] [font-size:9px]">{shareDetails ? 'Your information is only shared with your consent.' : 'You can continue without sharing identifying details.'}</p> */}
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
            <div className="form-grid [display:grid] [grid-template-columns:1fr_1fr] [gap:15px_13px] max-[620px]:[gap:13px_10px]">
              <Field label="Business / organisation name" name="businessName" placeholder="e.g. Acacia Healthcare Ltd" register={register} error={errors.businessName} required />
              <Field label="Contact person’s full name" name="contactName" placeholder="Full name" register={register} error={errors.contactName} required />
              <Field label="Business email (optional)" name="email" placeholder="name@business.com" type="email" register={register} error={errors.email} />
              <Field label="Phone number (optional)" name="phone" placeholder="+256 700 000 000" type="tel" register={register} error={errors.phone} />
              <Field label="Country" name="country" placeholder="e.g. Uganda" register={register} error={errors.country} required />
              <Field label="City / location" name="city" placeholder="e.g. Kampala" register={register} error={errors.city} required />
            </div>
            {submitError && <div className="form-error [margin-top:13px] [padding:10px_12px] [border:1px_solid_#f1c5bf] [border-radius:7px] [color:#a94438] [background:#fff5f4] [font-size:10px] [margin-top:14px]" role="alert">{submitError}</div>}
            <div className="form-submit-row [margin-top:24px] [display:flex] [justify-content:space-between] [align-items:center] [gap:12px] max-[620px]:[align-items:stretch] max-[620px]:[flex-direction:column-reverse] max-[620px]:[gap:12px]"><span className="[display:inline-flex] [align-items:center] [gap:6px] [color:#8190a0] [font-size:9px]"><ShieldCheck size={15} />Only submitted with your consent</span><button className="button button-green [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [color:#fff] [background:var(--green)] [box-shadow:0_5px_13px_rgba(7,155,89,.13)] enabled:hover:[background:var(--green-dark)] enabled:hover:[box-shadow:0_8px_18px_rgba(7,155,89,.2)] max-[620px]:[width:100%]" disabled={isSubmitting}>{isSubmitting ? <><LoaderCircle className="spin animate-spin" size={17} />Starting…</> : <>Continue to questions <ArrowRight size={17} /></>}</button></div>
          </form>
          </div>}
        </section>
      </div>
    </div>
  )
}

function Field({ label, name, placeholder, type = 'text', register, error, required }) {
  return <label className="form-field [min-width:0] [display:flex] [flex-direction:column] [gap:6px] [color:#344a62] [font-size:10px] [font-weight:600] max-[620px]:[font-size:9px]"><span>{label} {required && <b className="[color:#e2725e]">*</b>}</span><input type={type} placeholder={placeholder} autoComplete="on" maxLength={200} {...register(name)} aria-invalid={Boolean(error)} className="[width:100%] [height:40px] [padding:0_11px] [outline:none] [border:1px_solid_#dfe6ed] [border-radius:7px] [color:#203751] [background:#fff] [font-size:10px] [transition:border-color_.17s,_box-shadow_.17s] placeholder:[color:#a5b0bc] focus:[border-color:#57ba89] focus:[box-shadow:0_0_0_3px_rgba(7,155,89,.09)] aria-invalid:[border-color:#dc7868] max-[620px]:[height:39px] max-[620px]:[padding:0_9px] max-[620px]:[font-size:9px]" />{error && <small className="field-error [color:#be4f44] [font-size:9px] [font-weight:500]">{error.message}</small>}</label>
}
