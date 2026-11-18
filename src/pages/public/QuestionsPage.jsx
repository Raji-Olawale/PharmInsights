import { useMemo } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Save } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ConfigurationError from '../../components/shared/ConfigurationError'
import PageLoader from '../../components/shared/PageLoader'
import { categories, categoryPath } from '../../data/questionnaires'
import { useDrafts } from '../../hooks/useDrafts'
import { useQuestionnaire } from '../../hooks/useResearch'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getAccentStyle } from '../../utils/categoryStyles'

export default function QuestionsPage() {
  useScrollToTop()
  const { category: slug } = useParams()
  const metadata = categories[slug]
  const { data: questionnaire, isLoading, error } = useQuestionnaire(slug)
  const { drafts, saveAnswer, storageError } = useDrafts()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const draft = drafts[slug]
  const total = questionnaire?.questions.length || 0
  const requestedIndex = Number.parseInt(searchParams.get('q') || '0', 10)
  const index = Number.isInteger(requestedIndex) ? Math.min(Math.max(0, requestedIndex), Math.max(0, total - 1)) : 0
  const question = questionnaire?.questions[index]
  const response = draft?.answers?.[question?.id] || { answer: '', followUp: '' }
  const progress = total ? ((index + 1) / total) * 100 : 0
  const answerProvided = Boolean(response.answer.trim())
  const followUpProvided = !question?.followUp || Boolean(response.followUp.trim())
  const canContinue = answerProvided && followUpProvided

  const setAnswer = (answer) => saveAnswer(slug, question.id, answer, response.followUp)
  const setFollowUp = (followUp) => saveAnswer(slug, question.id, response.answer, followUp)
  const move = (offset) => {
    if (offset > 0 && !canContinue) return
    const next = index + offset
    if (next < 0) return
    if (next >= total) navigate(categoryPath(slug, 'review'))
    else setSearchParams({ q: String(next) })
  }

  const status = useMemo(() => {
    if (storageError) return <span className="save-status save-error inline-flex items-center gap-[5px] text-[#bf554a]"><AlertCircle size={14} />Not saved</span>
    return canContinue
      ? <span className="save-status save-done inline-flex items-center gap-[5px] text-[#32835c]"><Check size={14} />Saved in this session</span>
      : <span className="save-status inline-flex items-center gap-[5px] text-[#7c8a9a]"><Clock3 size={14} />Answer required</span>
  }, [canContinue, storageError])

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!metadata) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><AlertCircle /><p className="max-w-[460px] m-0 text-center leading-[1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose category</Link></div>
  if (isLoading) return <PageLoader label="Loading questionnaire…" />
  if (error) return <ConfigurationError message={error.message} />
  if (!draft) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><AlertCircle /><p className="max-w-[460px] m-0 text-center leading-[1.7]">Start a new response to continue.</p><Link className="button button-green min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] mt-1" to={categoryPath(slug)}>Begin questionnaire</Link></div>
  if (!total) return <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs"><AlertCircle /><p className="max-w-[460px] m-0 text-center leading-[1.7]">No questions are configured for this category.</p><Link to="/select-category">Choose another category</Link></div>

  return (
    <div className="questionnaire-page min-h-screen text-text bg-page">
    
      <main className="questionnaire-main w-[min(100%_-_40px,_720px)] my-0 mx-auto pt-[30px] px-0 pb-[34px] max-mobile:w-[calc(100%_-_32px)] max-mobile:pt-[21px] max-mobile:px-0 max-mobile:pb-[27px]">
        <div className="question-step-label mb-[29px] flex items-center justify-between text-[#95a1ae] text-[8px] font-bold tracking-wide max-mobile:mb-[23px]"><Link to={categoryPath(slug)} className="inline-flex items-center gap-1.5 text-[#718198] text-[10px] font-semibold tracking-normal hover:text-navy"><ArrowLeft size={15} />Exit questionnaire</Link><span>RESEARCH QUESTIONNAIRE</span></div>
        <div className="question-progress-header mb-[9px] flex justify-between items-center text-[#8492a2] text-[9px]"><div><span className="question-number text-navy font-bold tracking-[.7px]">QUESTION {String(index + 1).padStart(2, '0')}</span><span className="question-total text-[#9eabb8]"> / {total}</span></div><span>{Math.round(progress)}% complete</span></div>
        <div className="question-progress-track h-1 overflow-hidden rounded-[5px] bg-[#e2e9ee]"><span style={{ width: `${progress}%` }} className="h-full block rounded-[inherit] bg-green transition-[width] duration-300" /></div>
        <section className="question-card mt-[22px] pt-[27px] px-[30px] pb-[22px] border border-[#e3eaf0] rounded-[13px] bg-white shadow-[var(--shadow-card)] max-mobile:mt-[17px] max-mobile:pt-[19px] max-mobile:px-4 max-mobile:pb-4">
          <div className="question-card-top flex items-center justify-between text-[#94a1b0] text-[9px]"><span style={getAccentStyle(metadata.accent)} className={[(`question-category-badge accent-${metadata.accent}`), "py-1.5 px-[9px] rounded-[5px] text-[var(--accent)] bg-[var(--accent-soft)] text-[9px] font-bold"].filter(Boolean).join(' ')}>{questionnaire.category.name}</span><span>Question {index + 1} of {total}</span></div>
          <h1 className="mt-[25px] mx-0 mb-[26px] text-[#153655] font-display text-[22px] font-bold leading-[1.57] tracking-[-.45px] whitespace-pre-line max-mobile:my-[21px] max-mobile:mx-0 max-mobile:text-lg max-mobile:leading-[1.55]">{question.text}</h1>
          <label className="answer-label mb-[9px] flex justify-between items-baseline gap-2.5 text-[#273f59] text-[10px] font-bold max-mobile:items-start max-mobile:flex-col max-mobile:gap-1" htmlFor="question-answer">Your answer <span className="text-green">*</span><span className="text-[#92a0af] text-[9px] font-normal">Required — your response is confidential.</span></label>
          <textarea id="question-answer" value={response.answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Share your experience here…" rows={7} maxLength={5000} required aria-required="true" aria-invalid={!answerProvided} className="w-full min-h-[155px] resize-y py-[13px] px-3.5 outline-none border border-[#dce5ec] rounded-lg text-[#233b55] bg-[#fbfcfd] text-[11px] leading-loose transition-colors duration-200 placeholder:text-[#a2adba] focus:border-[#62bb90] focus:shadow-[0_0_0_3px_rgba(7,155,89,.08)] focus:bg-white max-mobile:min-h-[165px]" />
          <div className="answer-meta mt-[7px] flex justify-between gap-2 text-[#93a0ae] text-[8px]"><span>All questions require an answer.</span><span>{response.answer.length} / 5,000</span></div>
          {question.followUp && <div className="follow-up-field"><label className="answer-label mb-[9px] flex justify-between items-baseline gap-2.5 text-[#273f59] text-[10px] font-bold max-mobile:items-start max-mobile:flex-col max-mobile:gap-1" htmlFor="follow-up-answer">{question.followUp} <span className="text-green">*</span></label><textarea id="follow-up-answer" value={response.followUp} onChange={(event) => setFollowUp(event.target.value)} placeholder="Add your response here…" rows={3} maxLength={5000} required aria-required="true" aria-invalid={!response.followUp.trim()} className="w-full min-h-[155px] resize-y py-[13px] px-3.5 outline-none border border-[#dce5ec] rounded-lg text-[#233b55] bg-[#fbfcfd] text-[11px] leading-loose transition-colors duration-200 placeholder:text-[#a2adba] focus:border-[#62bb90] focus:shadow-[0_0_0_3px_rgba(7,155,89,.08)] focus:bg-white max-mobile:min-h-[165px]" /><div className="answer-meta mt-[7px] flex justify-between gap-2 text-[#93a0ae] text-[8px]"><span>Required follow-up</span><span>{response.followUp.length} / 5,000</span></div></div>}
          {storageError && <p className="inline-error mt-[9px] mx-0 mb-0 text-[#b54d42] text-[10px]" role="alert">{storageError}</p>}
          <div className="question-card-footer mt-[21px] pt-4 border-t border-[#eef1f4] flex justify-between items-center gap-[15px] max-mobile:items-start max-mobile:flex-col max-mobile:gap-[13px]"><div className="autosave-note flex items-center gap-1.5 text-[#7c8a9a] text-[9px]"><Save size={15} />{status}</div><div className="question-actions flex gap-2 max-mobile:w-full">{index > 0 && <button className="button button-outline min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-[#455970] border-[#dce5ed] bg-white enabled:hover:border-[#b7c8d8] enabled:hover:bg-[#f8fafc] min-h-[39px] py-0 px-[13px] text-[10px] max-mobile:min-h-[39px]" onClick={() => move(-1)}><ArrowLeft size={16} />Previous</button>}<button className="button button-green min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] min-h-[39px] py-0 px-[13px] text-[10px] min-w-[137px] max-mobile:flex-1 max-mobile:min-h-[39px] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => move(1)} disabled={!canContinue}>{index === total - 1 ? 'Review answers' : 'Next question'} <ArrowRight size={16} /></button></div></div>
        </section>
        <div className="question-footnote mt-[17px] flex items-center gap-2 text-[#8896a5] text-[9px] max-mobile:leading-[1.55]"><LockKeyhole size={14} /><span>Your unfinished responses are stored only in this browser session until you submit.</span></div>
      </main>
      <footer className="questionnaire-footer py-[15px] px-[25px] border-t border-[#e5ebf0] flex justify-between text-[#96a2b0] text-[8px] tracking-[.7px] max-mobile:py-[13px] max-mobile:px-4 max-mobile:text-[7px]"><span className="first:font-bold">PHARMAINSIGHT RESEARCH</span><span className="first:font-bold">Understand. Improve. Innovate.</span></footer>
    </div>
  )
}
