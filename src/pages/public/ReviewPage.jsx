import { useState } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Edit3, LoaderCircle, LockKeyhole } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
// import Brand from '../../components/layout/Brand'
import ConfigurationError from '../../components/shared/ConfigurationError'
import { categories, categoryPath } from '../../data/questionnaires'
import { useDrafts } from '../../hooks/useDrafts'
import { useQuestionnaire, useSubmitResponse } from '../../hooks/useResearch'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getAccentStyle } from '../../utils/categoryStyles'

export default function ReviewPage() {
  const { category: slug } = useParams()
  const metadata = categories[slug]
  const { data: questionnaire, isLoading, error } = useQuestionnaire(slug)
  const { drafts, clearDraft, storageError } = useDrafts()
  const draft = drafts[slug]
  const [submissionError, setSubmissionError] = useState('')
  const navigate = useNavigate()
  const submitMutation = useSubmitResponse()

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!metadata) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><AlertCircle /><p className="max-w-[460px] m-0 text-center leading-[1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose category</Link></div>
  if (isLoading) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs">Loading your review…</div>
  if (error) return <ConfigurationError message={error.message} />
  if (!draft) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><AlertCircle /><p className="max-w-[460px] m-0 text-center leading-[1.7]">Start a new response to review answers.</p><Link to={categoryPath(slug)}>Begin questionnaire</Link></div>

  const questions = questionnaire.questions
  const answers = questions.map((question) => ({
    question,
    response: draft.answers[question.id] || { answer: '', followUp: '' },
  }))
  const isComplete = ({ question, response }) => Boolean(
    response.answer.trim() && (!question.followUp || response.followUp.trim()),
  )
  const answeredCount = answers.filter(isComplete).length
  const unansweredCount = answers.length - answeredCount

  const handleSubmit = async () => {
    setSubmissionError('')
    if (unansweredCount > 0) {
      setSubmissionError('Answer every question and required follow-up before submitting.')
      return
    }

    try {
      const submittedAnswers = answers.map(({ question, response }) => ({
        questionId: question.id,
        answer: response.answer.trim(),
        followUp: response.followUp.trim(),
      }))
      const respondent = draft.isAnonymous ? {} : draft.respondent
      const id = await submitMutation.mutateAsync({
        categorySlug: slug,
        isAnonymous: draft.isAnonymous,
        respondent,
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
    <div className="questionnaire-page review-page min-h-screen text-text bg-page">
      
      <main className="review-main w-[min(100%_-_40px,_800px)] m-auto pt-[30px] px-0 pb-12 max-mobile:w-[calc(100%_-_32px)] max-mobile:pt-[22px] max-mobile:px-0 max-mobile:pb-[30px]">
        <div className="question-step-label mb-[29px] flex items-center justify-between text-[#95a1ae] text-[8px] font-bold tracking-wide max-mobile:mb-[23px]"><Link to={categoryPath(slug, 'questions')} className="inline-flex items-center gap-1.5 text-[#718198] text-[10px] font-semibold tracking-normal hover:text-navy"><ArrowLeft size={15} />Back to questionnaire</Link><span>FINAL STEP</span></div>
        <div className="review-heading mt-0 mx-0 mb-6 flex items-center gap-3.5 max-mobile:items-start max-mobile:gap-2.5"><div className="review-check w-[42px] h-[42px] rounded-xl grid place-items-center text-green bg-soft-green max-mobile:w-9 max-mobile:h-9 max-mobile:flex-none"><Check size={20} /></div><div><h1 className="mt-0 mx-0 mb-1 text-navy font-display text-[23px] tracking-[-.6px] max-mobile:text-xl">Review your responses</h1><p className="m-0 text-[#8290a1] text-[10px] max-mobile:leading-relaxed">Take a moment to make sure everything looks right before submitting.</p></div></div>
        <section className="review-info-card border border-[#e2e9ef] rounded-[10px] bg-white pt-[17px] px-[19px] pb-[19px] max-mobile:p-[13px]">
          <div className="review-section-heading flex items-center gap-2.5 pb-3.5 border-b border-[#eef1f4]"><span className="review-section-icon w-[30px] h-[30px] rounded-lg grid place-items-center text-green bg-soft-green"><span className="profile-symbol text-[15px] font-bold">i</span></span><div><strong className="block text-[#243d57] text-[10px]">Respondent information</strong><small className="block mt-0.75 text-[#8795a4] text-[8px]">{draft.isAnonymous ? 'Anonymous response' : 'Named response'}</small></div><span style={getAccentStyle(metadata.accent)} className={[(`review-category-pill accent-${metadata.accent}`), "ml-auto py-1.5 px-[9px] rounded-[5px] text-[var(--accent)] bg-[var(--accent-soft)] text-[8px] font-bold"].filter(Boolean).join(' ')}>{questionnaire.category.name}</span></div>
          {draft.isAnonymous ? <p className="anonymous-summary">No identifying information will be included with your submission.</p> : <div className="review-info-grid pt-3.5 grid grid-cols-3 gap-y-[15px] gap-x-[18px] max-mobile:grid-cols-2 max-mobile:gap-3">{[['Business / organisation name', draft.respondent.business], ['Contact person’s full name', draft.respondent.name], ['Job position', draft.respondent.jobPosition], ['Years of experience', draft.respondent.yearsExperience], ['Number of employees', draft.respondent.employeeCount], ['Company operating duration (years)', draft.respondent.yearsOperating]].map(([label, value]) => <div key={label} className="min-w-0"><span className="block mb-1 text-[#8c9aaa] text-[8px]">{label}</span><strong className="block wrap-anywhere text-[#354d66] text-[9px] font-semibold">{value ?? '—'}</strong></div>)}</div>}
        </section>
        <div className="answers-heading mt-[27px] mx-0 mb-3 flex items-end justify-between max-mobile:items-start max-mobile:gap-2"><div><h2 className="mt-0 mx-0 mb-1 text-navy font-display text-[17px] max-mobile:text-[15px]">Your answers</h2><p className="m-0 text-[#8290a1] text-[9px]">{questions.length} questions in your {questionnaire.category.name.toLowerCase()} questionnaire.</p></div><span className="text-[#65788e] text-[9px] font-semibold max-mobile:pt-0.75 max-mobile:whitespace-nowrap">{answeredCount} / {questions.length} answered</span></div>
        {unansweredCount > 0 && <div className="review-warning mb-3 py-2.5 px-3 border border-[#f2d5a5] rounded-lg flex items-center gap-2 text-[#8b662b] bg-[#fffaf0] text-[9px]"><AlertCircle size={17} />Complete all {questions.length} questions and their required follow-ups before submitting. {unansweredCount} {unansweredCount === 1 ? 'response is' : 'responses are'} still incomplete.</div>}
        {storageError && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{storageError}</div>}
        {submissionError && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{submissionError}</div>}
        <div className="review-answers">{answers.map(({ question, response }, index) => {
          const answerMissing = !isComplete({ question, response })
          return (
          <article className={`review-answer border border-[#e2e9ef] rounded-[10px] bg-white mb-[9px] py-[15px] px-[17px] max-mobile:p-[13px] ${answerMissing ? 'answer-missing border-[#f1d3cb]' : ''}`} key={question.id}>
            <div className="review-answer-top flex justify-between items-center text-[#8796a6] text-[8px] font-bold tracking-[.7px]"><span>QUESTION {String(question.position || index + 1).padStart(2, '0')}</span><Link to={`${categoryPath(slug, 'questions')}?q=${index}`} className="inline-flex items-center gap-[5px] text-[#54806b] text-[9px] font-semibold tracking-normal hover:text-green"><Edit3 size={14} />Edit</Link></div>
            <h3 className="mt-2.5 mx-0 mb-2 text-[#203c58] font-display text-[11px] leading-[1.7] whitespace-pre-line">{question.text}</h3>
            <p className={`m-0 text-[#60738a] text-[10px] leading-loose whitespace-pre-wrap wrap-anywhere ${answerMissing ? 'text-[#b78a7e] italic' : ''}`}>{response.answer.trim() || 'Skipped'}</p>
            {question.followUp && <div className="review-follow-up"><strong>{question.followUp}</strong><p className={`m-0 text-[#60738a] text-[10px] leading-loose whitespace-pre-wrap wrap-anywhere ${answerMissing ? 'text-[#b78a7e] italic' : ''}`}>{response.followUp.trim() || 'Skipped'}</p></div>}
          </article>
          )
        })}</div>
        <div className="review-submit mt-5 pt-4 px-0 pb-0 border-t border-[#e2e9ef] flex justify-between items-center gap-4 max-mobile:items-stretch max-mobile:flex-col"><span className="max-w-[340px] flex items-start gap-[7px] text-[#8291a1] text-[9px] leading-relaxed"><LockKeyhole size={15} />Your answers are sent securely only when you submit. You can no longer edit them after submission.</span><button className="button button-green button-lg min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px min-h-[49px] py-0 px-5 text-[13px] text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] max-mobile:w-full disabled:cursor-not-allowed disabled:opacity-50" onClick={handleSubmit} disabled={submitMutation.isPending || unansweredCount > 0}>{submitMutation.isPending ? <><LoaderCircle className="spin animate-spin" size={17} />Submitting…</> : <>Submit questionnaire <ArrowRight size={17} /></>}</button></div>
      </main>
      <footer className="questionnaire-footer py-[15px] px-[25px] border-t border-[#e5ebf0] flex justify-between text-[#96a2b0] text-[8px] tracking-[.7px] max-mobile:py-[13px] max-mobile:px-4 max-mobile:text-[7px]"><span className="first:font-bold">PHARMAINSIGHT RESEARCH</span><span className="first:font-bold">Understand. Improve. Innovate.</span></footer>
    </div>
  )
}
