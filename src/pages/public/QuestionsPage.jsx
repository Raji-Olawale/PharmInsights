import { useMemo } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Save } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Brand from '../../components/layout/Brand'
import ConfigurationError from '../../components/shared/ConfigurationError'
import { categories, categoryPath } from '../../data/questionnaires'
import { useDrafts } from '../../hooks/useDrafts'
import { useQuestionnaire } from '../../hooks/useResearch'
import { isSupabaseConfigured } from '../../lib/supabase'
import { getAccentStyle } from '../../utils/categoryStyles'

export default function QuestionsPage() {
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
  const section = questionnaire?.sections.find((item) => item.questions.some((current) => current.id === question?.id))
  const isFirstInSection = section?.questions[0]?.id === question?.id
  const progress = total ? ((index + 1) / total) * 100 : 0
  const answered = Boolean(response.answer.trim() || response.followUp.trim())

  const setAnswer = (answer) => saveAnswer(slug, question.id, answer, response.followUp)
  const setFollowUp = (followUp) => saveAnswer(slug, question.id, response.answer, followUp)
  const move = (offset) => {
    const next = index + offset
    if (next < 0) return
    if (next >= total) navigate(categoryPath(slug, 'review'))
    else setSearchParams({ q: String(next) })
  }

  const status = useMemo(() => {
    if (storageError) return <span className="save-status save-error [display:inline-flex] [align-items:center] [gap:5px] [color:#bf554a]"><AlertCircle size={14} />Not saved</span>
    return answered
      ? <span className="save-status save-done [display:inline-flex] [align-items:center] [gap:5px] [color:#32835c]"><Check size={14} />Saved in this session</span>
      : <span className="save-status [display:inline-flex] [align-items:center] [gap:5px]"><Clock3 size={14} />Optional answer</span>
  }, [answered, storageError])

  if (!isSupabaseConfigured) return <ConfigurationError />
  if (!metadata) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><AlertCircle /><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">This stakeholder category is not supported.</p><Link to="/select-category">Choose category</Link></div>
  if (isLoading) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]">Loading questionnaire…</div>
  if (error) return <ConfigurationError message={error.message} />
  if (!draft) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><AlertCircle /><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">Start a new response to continue.</p><Link className="button button-green [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [color:#fff] [background:var(--green)] [box-shadow:0_5px_13px_rgba(7,155,89,.13)] enabled:hover:[background:var(--green-dark)] enabled:hover:[box-shadow:0_8px_18px_rgba(7,155,89,.2)] [margin-top:4px]" to={categoryPath(slug)}>Begin questionnaire</Link></div>
  if (!total) return <div className="question-loading [min-height:100vh] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [gap:13px] [color:#6f8092] [background:#f6f9fc] [font-size:12px]"><AlertCircle /><p className="[max-width:460px] [margin:0] [text-align:center] [line-height:1.7]">No questions are configured for this category.</p><Link to="/select-category">Choose another category</Link></div>

  return (
    <div className="questionnaire-page [min-height:100vh] [color:var(--text)] [background:#f5f8fc]">
      <header className="questionnaire-header [height:66px] [padding:0_max(25px,_calc((100%_-_1050px)/2))] [border-bottom:1px_solid_#e6ecf1] [display:flex] [align-items:center] [justify-content:space-between] [background:#fff] max-[620px]:[height:58px] max-[620px]:[padding:0_16px]"><Brand size="questionnaire" /><div style={getAccentStyle(metadata.accent)} className={[(`question-category accent-${metadata.accent}`), "[display:inline-flex] [align-items:center] [gap:7px] [color:#4a6078] [font-size:10px] [font-weight:600] max-[620px]:[font-size:8px]"].filter(Boolean).join(' ')}><span className="[width:7px] [height:7px] [border-radius:50%] [background:var(--accent)]" />{questionnaire.category.name}</div><div className="question-safe [display:inline-flex] [align-items:center] [gap:6px] [color:#74869a] [font-size:9px] max-[620px]:[font-size:0]"><LockKeyhole size={15} />Private & secure</div></header>
      <main className="questionnaire-main [width:min(100%_-_40px,_720px)] [margin:0_auto] [padding:30px_0_34px] max-[620px]:[width:calc(100%_-_32px)] max-[620px]:[padding:21px_0_27px]">
        <div className="question-step-label [margin-bottom:29px] [display:flex] [align-items:center] [justify-content:space-between] [color:#95a1ae] [font-size:8px] [font-weight:700] [letter-spacing:1px] max-[620px]:[margin-bottom:23px]"><Link to={categoryPath(slug)} className="[display:inline-flex] [align-items:center] [gap:6px] [color:#718198] [font-size:10px] [font-weight:600] [letter-spacing:0] hover:[color:var(--navy)]"><ArrowLeft size={15} />Exit questionnaire</Link><span>RESEARCH QUESTIONNAIRE</span></div>
        <div className="question-progress-header [margin-bottom:9px] [display:flex] [justify-content:space-between] [align-items:center] [color:#8492a2] [font-size:9px]"><div><span className="question-number [color:var(--navy)] [font-weight:700] [letter-spacing:.7px]">QUESTION {String(index + 1).padStart(2, '0')}</span><span className="question-total [color:#9eabb8]"> / {total}</span></div><span>{Math.round(progress)}% complete</span></div>
        <div className="question-progress-track [height:4px] [overflow:hidden] [border-radius:5px] [background:#e2e9ee]"><span style={{ width: `${progress}%` }} className="[height:100%] [display:block] [border-radius:inherit] [background:var(--green)] [transition:width_.25s_ease]" /></div>
        <section className="question-card [margin-top:22px] [padding:27px_30px_22px] [border:1px_solid_#e3eaf0] [border-radius:13px] [background:#fff] [box-shadow:var(--shadow-card)] max-[620px]:[margin-top:17px] max-[620px]:[padding:19px_16px_16px]">
          <div className="question-card-top [display:flex] [align-items:center] [justify-content:space-between] [color:#94a1b0] [font-size:9px]"><span style={getAccentStyle(metadata.accent)} className={[(`question-category-badge accent-${metadata.accent}`), "[padding:6px_9px] [border-radius:5px] [color:var(--accent)] [background:var(--accent-soft)] [font-size:9px] [font-weight:700]"].filter(Boolean).join(' ')}>{questionnaire.category.name}</span><span>Question {index + 1} of {total}</span></div>
          {isFirstInSection && <div className="question-section-intro">{section.title && <h2>{section.title}</h2>}{section.intro && <p>{section.intro}</p>}</div>}
          <h1 className="[margin:25px_0_26px] [color:#153655] [font-family:Manrope,_sans-serif] [font-size:22px] [font-weight:700] [line-height:1.57] [letter-spacing:-.45px] [white-space:pre-line] max-[620px]:[margin:21px_0] max-[620px]:[font-size:18px] max-[620px]:[line-height:1.55]">{question.text}</h1>
          <label className="answer-label [margin-bottom:9px] [display:flex] [justify-content:space-between] [align-items:baseline] [gap:10px] [color:#273f59] [font-size:10px] [font-weight:700] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:4px]" htmlFor="question-answer">Your answer <span className="[color:#92a0af] [font-size:9px] [font-weight:400]">Take your time — the more detail, the better.</span></label>
          <textarea id="question-answer" value={response.answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Share your experience here…" rows={7} maxLength={5000} className="[width:100%] [min-height:155px] [resize:vertical] [padding:13px_14px] [outline:none] [border:1px_solid_#dce5ec] [border-radius:8px] [color:#233b55] [background:#fbfcfd] [font-size:11px] [line-height:1.75] [transition:border-color_.18s,_box-shadow_.18s] placeholder:[color:#a2adba] focus:[border-color:#62bb90] focus:[box-shadow:0_0_0_3px_rgba(7,155,89,.08)] focus:[background:#fff] max-[620px]:[min-height:165px]" />
          <div className="answer-meta [margin-top:7px] [display:flex] [justify-content:space-between] [gap:8px] [color:#93a0ae] [font-size:8px]"><span>Your answer is optional. Your response is confidential.</span><span>{response.answer.length} / 5,000</span></div>
          {question.followUp && <div className="follow-up-field"><label className="answer-label [margin-bottom:9px] [display:flex] [justify-content:space-between] [align-items:baseline] [gap:10px] [color:#273f59] [font-size:10px] [font-weight:700] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:4px]" htmlFor="follow-up-answer">{question.followUp}</label><textarea id="follow-up-answer" value={response.followUp} onChange={(event) => setFollowUp(event.target.value)} placeholder="Add a follow-up response (optional)…" rows={3} maxLength={5000} className="[width:100%] [min-height:155px] [resize:vertical] [padding:13px_14px] [outline:none] [border:1px_solid_#dce5ec] [border-radius:8px] [color:#233b55] [background:#fbfcfd] [font-size:11px] [line-height:1.75] [transition:border-color_.18s,_box-shadow_.18s] placeholder:[color:#a2adba] focus:[border-color:#62bb90] focus:[box-shadow:0_0_0_3px_rgba(7,155,89,.08)] focus:[background:#fff] max-[620px]:[min-height:165px]" /><div className="answer-meta [margin-top:7px] [display:flex] [justify-content:space-between] [gap:8px] [color:#93a0ae] [font-size:8px]"><span>Optional follow-up</span><span>{response.followUp.length} / 5,000</span></div></div>}
          {storageError && <p className="inline-error [margin:9px_0_0] [color:#b54d42] [font-size:10px]" role="alert">{storageError}</p>}
          <div className="question-card-footer [margin-top:21px] [padding-top:16px] [border-top:1px_solid_#eef1f4] [display:flex] [justify-content:space-between] [align-items:center] [gap:15px] max-[620px]:[align-items:flex-start] max-[620px]:[flex-direction:column] max-[620px]:[gap:13px]"><div className="autosave-note [display:flex] [align-items:center] [gap:6px] [color:#7c8a9a] [font-size:9px]"><Save size={15} />{status}</div><div className="question-actions [display:flex] [gap:8px] max-[620px]:[width:100%]">{index > 0 && <button className="button button-outline [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [color:#455970] [border-color:#dce5ed] [background:#fff] enabled:hover:[border-color:#b7c8d8] enabled:hover:[background:#f8fafc] [min-height:39px] [padding:0_13px] [font-size:10px] max-[620px]:[min-height:39px]" onClick={() => move(-1)}><ArrowLeft size={16} />Previous</button>}<button className="button button-green [min-height:42px] [padding:0_16px] [border:1px_solid_transparent] [border-radius:8px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:9px] [font-size:12px] [font-weight:700] [transition:background_.18s,_border-color_.18s,_box-shadow_.18s,_transform_.18s] enabled:hover:[transform:translateY(-1px)] [color:#fff] [background:var(--green)] [box-shadow:0_5px_13px_rgba(7,155,89,.13)] enabled:hover:[background:var(--green-dark)] enabled:hover:[box-shadow:0_8px_18px_rgba(7,155,89,.2)] [min-height:39px] [padding:0_13px] [font-size:10px] [min-width:137px] max-[620px]:[flex:1] max-[620px]:[min-height:39px]" onClick={() => move(1)}>{index === total - 1 ? 'Review answers' : 'Next question'} <ArrowRight size={16} /></button></div></div>
        </section>
        <div className="question-footnote [margin-top:17px] [display:flex] [align-items:center] [gap:8px] [color:#8896a5] [font-size:9px] max-[620px]:[line-height:1.55]"><LockKeyhole size={14} /><span>Your unfinished responses are stored only in this browser session until you submit.</span></div>
      </main>
      <footer className="questionnaire-footer [padding:15px_25px] [border-top:1px_solid_#e5ebf0] [display:flex] [justify-content:space-between] [color:#96a2b0] [font-size:8px] [letter-spacing:.7px] max-[620px]:[padding:13px_16px] max-[620px]:[font-size:7px]"><span className="first:[font-weight:700]">PHARMAINSIGHT RESEARCH</span><span className="first:[font-weight:700]">Understand. Improve. Innovate.</span></footer>
    </div>
  )
}
