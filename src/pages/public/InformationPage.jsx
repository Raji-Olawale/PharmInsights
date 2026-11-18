import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CircleHelp, LoaderCircle, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import Brand from '../../components/layout/Brand'
import ConfigurationError from '../../components/shared/ConfigurationError'
import { categories, categoryPath } from '../../data/questionnaires'
import { useCategories } from '../../hooks/useResearch'
import { useDrafts } from '../../hooks/useDrafts'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getAccentStyle } from '../../utils/categoryStyles'

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
  const CategoryIcon = metadata?.icon
  const navigate = useNavigate()
  const { data: categoryRows = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { startDraft } = useDrafts()
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { email: '', phone: '' } })
  const category = categoryRows.find((item) => item.slug === slug)

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!metadata) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose a category</Link></div>
  if (categoriesLoading) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><LoaderCircle className="spin animate-spin" />Loading stakeholder category…</div>
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
      <div className="form-topbar [height:66px] [padding:0_max(28px,_calc((100%_-_1160px)/2))] [border-bottom:1px_solid_#e6ecf1] [display:flex] [justify-content:space-between] [align-items:center] [background:#fff] max-[620px]:[height:59px] max-[620px]:[padding:0_18px]"><Brand size="small" /><div className="form-secure [display:inline-flex] [align-items:center] [gap:7px] [color:#6d8093] [font-size:10px] [font-weight:600]"><ShieldCheck size={16} />Secure & confidential</div></div>
      <div className="form-layout [width:min(100%_-_48px,_1060px)] [min-height:calc(100vh_-_66px)] [margin:0_auto] [padding:37px_0_52px] [display:grid] [grid-template-columns:310px_1fr] [align-items:start] [gap:65px] max-[800px]:[grid-template-columns:250px_1fr] max-[800px]:[gap:30px] max-[620px]:[width:min(100%_-_36px,_520px)] max-[620px]:[padding:20px_0_34px] max-[620px]:[display:flex] max-[620px]:[flex-direction:column] max-[620px]:[gap:21px]">
        <aside style={getAccentStyle(metadata.accent)} className={`form-aside [min-height:438px] [padding:22px_22px_20px] [border-radius:13px] [color:#fff] [background:#0b2e59] [position:relative] [overflow:hidden] after:content-[''] after:[position:absolute] after:[width:215px] after:[height:215px] after:[right:-107px] after:[bottom:-132px] after:[border:1px_solid_rgba(255,255,255,.14)] after:[border-radius:50%] after:[box-shadow:0_0_0_22px_rgba(255,255,255,.03),_0_0_0_45px_rgba(255,255,255,.025)] max-[800px]:[min-height:430px] max-[800px]:[padding:18px] max-[620px]:[width:100%] max-[620px]:[min-height:0] max-[620px]:[padding:15px_16px]`}>
          <Link className="back-link [display:inline-flex] [align-items:center] [gap:7px] [color:#718198] [font-size:11px] [font-weight:600] hover:[color:var(--navy)] [color:#b5c5d5]" to="/select-category"><ArrowLeft size={15} />Change category</Link>
          <span className="aside-label [margin-top:61px] [display:block] [color:#aabdd0] [font-size:8px] [font-weight:700] [letter-spacing:1.25px] max-[800px]:[margin-top:48px] max-[620px]:[margin-top:21px]">YOUR STAKEHOLDER PROFILE</span>
          <h1 className="[max-width:245px] [margin:12px_0_10px] [color:#fff] [font-family:Manrope,_sans-serif] [font-size:25px] [line-height:1.26] [letter-spacing:-.7px] max-[800px]:[font-size:23px] max-[620px]:[max-width:380px] max-[620px]:[margin-top:8px] max-[620px]:[font-size:20px]">Tell us about your experience.</h1>
          <p className="[max-width:235px] [margin:0] [color:#b9cad8] [font-size:10px] [line-height:1.75] max-[620px]:[max-width:470px]">Share your perspective anonymously or provide a few details to help us understand your role in the supply chain.</p>
          <div className="aside-category [margin-top:32px] [padding:12px] [border:1px_solid_rgba(255,255,255,.15)] [border-radius:9px] [display:flex] [align-items:center] [gap:10px] [background:rgba(255,255,255,.05)] max-[620px]:[margin-top:15px] max-[620px]:[padding:9px]"><span className="[width:32px] [height:32px] [border-radius:9px] [display:grid] [place-items:center] [color:var(--profile)] [background:rgba(255,255,255,.08)]"><CategoryIcon size={18} /></span><div><small className="[display:block] [color:#9eb4c9] [font-size:7px] [letter-spacing:.8px]">YOUR CATEGORY</small><strong className="[display:block] [margin-top:4px] [font-size:11px]">{category.name}</strong></div></div>
          <div className="aside-note [position:relative] [z-index:1] [margin-top:24px] [display:flex] [align-items:flex-start] [gap:9px] [color:#a9bfd3] [font-size:9px] [line-height:1.6] max-[620px]:[margin-top:12px]"><CircleHelp size={17} /><span>There are no right or wrong answers. We value your honest experience.</span></div>
        </aside>
        <section className="form-main [padding-top:8px] max-[620px]:[width:100%] max-[620px]:[padding:0]">
          <div className="form-progress-meta [display:flex] [justify-content:space-between] [color:#8a98a9] [font-size:9px]"><span className="first:[color:var(--green)] first:[font-size:8px] first:[font-weight:700] first:[letter-spacing:.7px]">STEP 02 OF 03</span><span className="first:[color:var(--green)] first:[font-size:8px] first:[font-weight:700] first:[letter-spacing:.7px]">Choose how to participate</span></div><div className="form-progress [height:3px] [margin-top:10px] [overflow:hidden] [border-radius:10px] [background:#e6edf2]"><span style={{ width: '33%' }} className="[height:100%] [display:block] [border-radius:inherit] [background:var(--green)]" /></div>
          <header className="form-heading [margin:25px_0_22px] [position:relative] [padding-left:46px] max-[620px]:[margin:19px_0]"><span className="form-icon [width:34px] [height:34px] [position:absolute] [left:0] [top:0] [border-radius:10px] [display:grid] [place-items:center] [color:var(--green)] [background:#e8f7ef]"><UserRound size={20} /></span><h2 className="[margin:0_0_4px] [color:var(--navy)] [font-family:Manrope,_sans-serif] [font-size:19px] [letter-spacing:-.45px]">How would you like to respond?</h2><p className="[margin:0] [color:#8794a4] [font-size:9px]">You can continue without sharing identifying details.</p></header>
          <button type="button" className="anonymous-option" onClick={beginAnonymous}><span><ShieldCheck size={19} /></span><span><strong>Answer anonymously</strong><small>Your name and business details will not be collected.</small></span><ArrowRight size={17} /></button>
          <div className="form-divider"><span />OR SHARE YOUR BUSINESS DETAILS<span /></div>
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
        </section>
      </div>
    </div>
  )
}

function Field({ label, name, placeholder, type = 'text', register, error, required }) {
  return <label className="form-field [min-width:0] [display:flex] [flex-direction:column] [gap:6px] [color:#344a62] [font-size:10px] [font-weight:600] max-[620px]:[font-size:9px]"><span>{label} {required && <b className="[color:#e2725e]">*</b>}</span><input type={type} placeholder={placeholder} autoComplete="on" maxLength={200} {...register(name)} aria-invalid={Boolean(error)} className="[width:100%] [height:40px] [padding:0_11px] [outline:none] [border:1px_solid_#dfe6ed] [border-radius:7px] [color:#203751] [background:#fff] [font-size:10px] [transition:border-color_.17s,_box-shadow_.17s] placeholder:[color:#a5b0bc] focus:[border-color:#57ba89] focus:[box-shadow:0_0_0_3px_rgba(7,155,89,.09)] aria-invalid:[border-color:#dc7868] max-[620px]:[height:39px] max-[620px]:[padding:0_9px] max-[620px]:[font-size:9px]" />{error && <small className="field-error [color:#be4f44] [font-size:9px] [font-weight:500]">{error.message}</small>}</label>
}
