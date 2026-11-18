import { useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Edit3, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
// import Brand from '../../components/layout/Brand'
import ConfigurationError from '../../components/shared/ConfigurationError'
import { categories, categoryPath } from '../../data/questionnaires'
import { useDrafts } from '../../hooks/useDrafts'
import { useQuestionnaire, useSubmitResponse } from '../../hooks/useResearch'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getAccentStyle } from '../../utils/categoryStyles'

export default function ReviewPage() {
  useScrollToTop()
  const { category: slug } = useParams()
  const metadata = categories[slug]
  const { data: questionnaire, isLoading, error } = useQuestionnaire(slug)
  const { drafts, clearDraft, storageError } = useDrafts()
  const draft = drafts[slug]
  const [submissionError, setSubmissionError] = useState('')
  const navigate = useNavigate()
  const submitMutation = useSubmitResponse()

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!metadata) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><AlertCircle /><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose category</Link></div>
  if (isLoading) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]">Loading your review…</div>
  if (error) return <ConfigurationError message={error.message} />
  if (!draft) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><AlertCircle /><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">Start a new response to review answers.</p><Link to={categoryPath(slug)}>Begin questionnaire</Link></div>

  const questions = questionnaire.questions
  const answers = questions.map((question) => ({
    question,
    response: draft.answers[question.id] || { answer: '', followUp: '' },
  }))
  const answeredCount = answers.filter(({ response }) => response.answer.trim() || response.followUp.trim()).length

  const handleSubmit = async () => {
    setSubmissionError('')
    try {
      const submittedAnswers = answers
        .filter(({ response }) => response.answer.trim() || response.followUp.trim())
        .map(({ question, response }) => ({
          questionId: question.id,
          answer: response.answer.trim(),
          followUp: response.followUp.trim(),
        }))
      const id = await submitMutation.mutateAsync({
        categorySlug: slug,
        isAnonymous: draft.isAnonymous,
        respondent: draft.isAnonymous ? {} : draft.respondent,
        answers: submittedAnswers,
      })
      clearDraft(slug)
      const reference = `PI-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`
      navigate('/questionnaire/success', { replace: true, state: { reference, category: questionnaire.category.name } })
    } catch (submitError) {
      setSubmissionError(submitError.message)
    }
  }

  return (
    <div className="questionnaire-page review-page [min-height:100vh] [color:var(--text)] [background:#f5f8fc]">
      
      <main className="review-main [width:min(100%_-_40px,_800px)] [margin:auto] [padding:30px_0_48px] max-[620px]:[width:calc(100%_-_32px)] max-[620px]:[padding:22px_0_30px]">
        <div className="question-step-label [margin-bottom:29px] [display:flex] [align-items:center] [justify-content:space-between] [color:#95a1ae] [font-size:8px] [font-weight:700] [letter-spacing:1px] max-[620px]:[margin-bottom:23px]"><Link to={categoryPath(slug, 'questions')} className="[display:inline-flex] [align-items:center] [gap:6px] [color:#718198] [font-size:10px] [font-weight:600] [letter-spacing:0] hover:[color:var(--navy)]"><ArrowLeft size={15} />Back to questionnaire</Link><span>FINAL STEP</span></div>
        <div className="review-heading [margin:0_0_24px] [display:flex] [align-items:center] [gap:14px] max-[620px]:[align-items:flex-start] max-[620px]:[gap:10px]"><div className="review-check [width:42px] [height:42px] [border-radius:12px] [display:grid] [place-items:center] [color:var(--green)] [background:#eaf7f0] max-[620px]:[width:36px] max-[620px]:[height:36px] max-[620px]:[flex:0_0_auto]"><Check size={20} /></div><div><h1 className="[margin:0_0_4px] [color:var(--navy)] [font-family:Manrope,_sans-serif] [font-size:23px] [letter-spacing:-.6px] max-[620px]:[font-size:20px]">Review your responses</h1><p className="[margin:0] [color:#8290a1] [font-size:10px] max-[620px]:[line-height:1.6]">Take a moment to make sure everything looks right before submitting.</p></div></div>
        <section className="review-info-card [border:1px_solid_#e2e9ef] [border-radius:10px] [background:#fff] [padding:17px_19px_19px] max-[620px]:[padding:13px]">
          <div className="review-section-heading [display:flex] [align-items:center] [gap:10px] [padding-bottom:14px] [border-bottom:1px_solid_#eef1f4]"><span className="review-section-icon [width:30px] [height:30px] [border-radius:8px] [display:grid] [place-items:center] [color:var(--green)] [background:#eaf7f0]"><span className="profile-symbol [font-size:15px] [font-weight:700]">i</span></span><div><strong className="[display:block] [color:#243d57] [font-size:10px]">Respondent information</strong><small className="[display:block] [margin-top:3px] [color:#8795a4] [font-size:8px]">{draft.isAnonymous ? 'Anonymous response' : 'Named response'}</small></div><span style={getAccentStyle(metadata.accent)} className={[(`review-category-pill accent-${metadata.accent}`), "[margin-left:auto] [padding:6px_9px] [border-radius:5px] [color:var(--accent)] [background:var(--accent-soft)] [font-size:8px] [font-weight:700]"].filter(Boolean).join(' ')}>{questionnaire.category.name}</span></div>
          {draft.isAnonymous ? <p className="anonymous-summary">No identifying information will be included with your submission.</p> : <div className="review-info-grid [padding-top:14px] [display:grid] [grid-template-columns:repeat(3,1fr)] [gap:15px_18px] max-[620px]:[grid-template-columns:1fr_1fr] max-[620px]:[gap:12px]">{[['Business / organisation', draft.respondent.business], ['Contact person', draft.respondent.name], ['Location', draft.respondent.location], ['Contact details', draft.respondent.contact || 'Not provided']].map(([label, value]) => <div key={label} className="[min-width:0]"><span className="[display:block] [margin-bottom:4px] [color:#8c9aaa] [font-size:8px]">{label}</span><strong className="[display:block] [overflow-wrap:anywhere] [color:#354d66] [font-size:9px] [font-weight:600]">{value || '—'}</strong></div>)}</div>}
        </section>
        <div className="answers-heading [margin:27px_0_12px] [display:flex] [align-items:end] [justify-content:space-between] max-[620px]:[align-items:flex-start] max-[620px]:[gap:8px]"><div><h2 className="[margin:0_0_4px] [color:var(--navy)] [font-family:Manrope,_sans-serif] [font-size:17px] max-[620px]:[font-size:15px]">Your answers</h2><p className="[margin:0] [color:#8290a1] [font-size:9px]">{questions.length} questions in your {questionnaire.category.name.toLowerCase()} questionnaire.</p></div><span className="[color:#65788e] [font-size:9px] [font-weight:600] max-[620px]:[padding-top:3px] max-[620px]:[white-space:nowrap]">{answeredCount} / {questions.length} answered</span></div>
        {answeredCount === 0 && <div className="review-warning [margin-bottom:12px] [padding:10px_12px] [border:1px_solid_#f2d5a5] [border-radius:8px] [display:flex] [align-items:center] [gap:8px] [color:#8b662b] [background:#fffaf0] [font-size:9px]"><AlertCircle size={17} />Answer at least one question before submitting. Individual questions may be left blank.</div>}
        {storageError && <div className="form-error [margin-top:13px] [padding:10px_12px] [border:1px_solid_#f1c5bf] [border-radius:7px] [color:#a94438] [background:#fff5f4] [font-size:10px]" role="alert">{storageError}</div>}
        {submissionError && <div className="form-error [margin-top:13px] [padding:10px_12px] [border:1px_solid_#f1c5bf] [border-radius:7px] [color:#a94438] [background:#fff5f4] [font-size:10px]" role="alert">{submissionError}</div>}
        <div className="review-answers">{answers.map(({ question, response }, index) => (
          <article className={[(`review-answer${!(response.answer.trim() || response.followUp.trim()) ? ' answer-missing' : ''}`), "[border:1px_solid_#e2e9ef] [border-radius:10px] [background:#fff] [margin-bottom:9px] [padding:15px_17px] [&.answer-missing]:[border-color:#f1d3cb] max-[620px]:[padding:13px]"].filter(Boolean).join(' ')} key={question.id}>
            <div className="review-answer-top [display:flex] [justify-content:space-between] [align-items:center] [color:#8796a6] [font-size:8px] [font-weight:700] [letter-spacing:.7px]"><span>QUESTION {String(question.position || index + 1).padStart(2, '0')}</span><Link to={`${categoryPath(slug, 'questions')}?q=${index}`} className="[display:inline-flex] [align-items:center] [gap:5px] [color:#54806b] [font-size:9px] [font-weight:600] [letter-spacing:0] hover:[color:var(--green)]"><Edit3 size={14} />Edit</Link></div>
            <h3 className="[margin:10px_0_8px] [color:#203c58] [font-family:Manrope,_sans-serif] [font-size:11px] [line-height:1.7] [white-space:pre-line]">{question.text}</h3>
            <p className="[margin:0] [color:#60738a] [font-size:10px] [line-height:1.75] [white-space:pre-wrap] [overflow-wrap:anywhere] [.answer-missing_&]:[color:#b78a7e] [.answer-missing_&]:[font-style:italic]">{response.answer.trim() || 'Skipped'}</p>
            {question.followUp && <div className="review-follow-up"><strong>{question.followUp}</strong><p className="[margin:0] [color:#60738a] [font-size:10px] [line-height:1.75] [white-space:pre-wrap] [overflow-wrap:anywhere] [.answer-missing_&]:[color:#b78a7e] [.answer-missing_&]:[font-style:italic]">{response.followUp.trim() || 'Skipped'}</p></div>}
          </article>
        ))}</div>
        <div className="review-submit [margin-top:20px] [padding:16px_0_0] [border-top:1px_solid_#e2e9ef] [display:flex] [justify-content:space-between] [align-items:center] [gap:16px] max-[620px]:[align-items:stretch] max-[620px]:[flex-direction:column]"><span className="[max-width:340px] [display:flex] [align-items:flex-start] [gap:7px] [color:#8291a1] [font-size:9px] [line-height:1.6]"><LockKeyhole size={15} />Your answers are sent securely only when you submit. You can no longer edit them after submission.</span><button className="button button-green button-lg [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [min-height:49px] [padding:0_20px] [font-size:13px] [color:#fff] [background:var(--green)] [box-shadow:0_5px_13px_rgba(7,155,89,.13)] enabled:hover:[background:var(--green-dark)] enabled:hover:[box-shadow:0_8px_18px_rgba(7,155,89,.2)] max-[620px]:[width:100%]" onClick={handleSubmit} disabled={submitMutation.isPending || answeredCount === 0}>{submitMutation.isPending ? <><LoaderCircle className="spin animate-spin" size={17} />Submitting…</> : <>Submit questionnaire <ArrowRight size={17} /></>}</button></div>
      </main>
      <footer className="questionnaire-footer [padding:15px_25px] [border-top:1px_solid_#e5ebf0] [display:flex] [justify-content:space-between] [color:#96a2b0] [font-size:8px] [letter-spacing:.7px] max-[620px]:[padding:13px_16px] max-[620px]:[font-size:7px]"><span className="first:[font-weight:700]">PHARMAINSIGHT RESEARCH</span><span className="first:[font-weight:700]">Understand. Improve. Innovate.</span></footer>
    </div>
  )
}
