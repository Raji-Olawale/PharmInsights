import { useEffect, useMemo, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, BarChart3, Check, ChevronDown, Download, FileSpreadsheet, FileText, Info, LockKeyhole, MessageSquareText, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useAnswersForQuestion, useQuestionnaires, useSubmissions } from '../../hooks/useResearch'
import { categories } from '../../data/questionnaires'
import { isSupabaseConfigured } from '../../lib/supabase'
import { exportRespondents } from '../../utils/exportData'
import { Link } from 'react-router-dom'

const categorySlugs = ['wholesaler', 'buyer', 'logistics']
const categoryColors = { wholesaler: '#2367b0', buyer: '#119668', logistics: '#e48a34' }
const themeGroups = [
  { name: 'Current operations', terms: ['order', 'process', 'manage', 'current', 'workflow', 'system'], color: '#2367b0' },
  { name: 'Problems & challenges', terms: ['challenge', 'problem', 'difficult', 'delay', 'issue', 'shortage'], color: '#d66c61' },
  { name: 'Financial & operational losses', terms: ['cost', 'money', 'loss', 'time', 'price', 'payment'], color: '#e48a34' },
  { name: 'Adoption requirements', terms: ['platform', 'tool', 'feature', 'information', 'use', 'need'], color: '#079b59' },
  { name: 'Trust & participation barriers', terms: ['trust', 'safe', 'risk', 'reluctant', 'verified', 'secure'], color: '#8266bd' },
  { name: 'Unexpected opportunities', terms: ['opportunity', 'improve', 'change', 'better', 'growth', 'partner'], color: '#139aa0' },
]

export default function AdminDataPage({ mode }) {
  const submissionsQuery = useSubmissions()
  const questionnairesQuery = useQuestionnaires(categorySlugs)
  const data = submissionsQuery.data || []
  const questionnaires = questionnairesQuery.data || []
  const [questionId, setQuestionId] = useState('')
  const answersQuery = useAnswersForQuestion(questionId)

  if (mode === 'settings') return <SettingsPage />
  if (submissionsQuery.error) return <ErrorState message={submissionsQuery.error.message} retry={() => submissionsQuery.refetch()} />
  if (mode === 'analytics') return <AnalyticsPage data={data} isLoading={submissionsQuery.isLoading} questionnaires={questionnaires} questionnairesLoading={questionnairesQuery.isLoading} questionnairesError={questionnairesQuery.error} questionId={questionId} setQuestionId={setQuestionId} answersQuery={answersQuery} />
  return <ExportPage data={data} isLoading={submissionsQuery.isLoading} questionnaires={questionnaires} questionnairesLoading={questionnairesQuery.isLoading} questionnairesError={questionnairesQuery.error} />
}

function AnalyticsPage({ data, isLoading, questionnaires, questionnairesLoading, questionnairesError, questionId, setQuestionId, answersQuery }) {
  const categoriesData = categorySlugs.map((slug) => ({
    name: data.find((item) => item.categorySlug === slug)?.category || categories[slug].name,
    respondents: data.filter((item) => item.categorySlug === slug).length,
    fill: categoryColors[slug],
  }))
  const themes = useMemo(() => themeGroups.map((theme) => ({
    ...theme,
    mentions: data.reduce((count, response) => {
      const text = response.answers.map((answer) => `${answer.answerText || ''} ${answer.followUpAnswer || ''}`).join(' ').toLowerCase()
      return count + theme.terms.filter((term) => text.includes(term)).length
    }, 0),
  })), [data])
  const answeredCount = data.reduce((total, response) => total + response.answers.filter((answer) => answer.answerText?.trim() || answer.followUpAnswer?.trim()).length, 0)
  const questionOptions = questionnaires.flatMap((questionnaire) => questionnaire.sections.flatMap((section) => section.questions.map((question) => ({
    ...question,
    categoryName: questionnaire.category.name,
    sectionTitle: section.title,
  }))))
  const selectedQuestion = questionOptions.find((question) => String(question.id) === questionId)
  const showError = answersQuery.error

  return (
    <div className="analytics-page">
      <div className="admin-page-heading mb-5 flex justify-between items-end gap-5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-3"><div><span className="admin-eyebrow text-[#8796a7] text-[8px] font-bold tracking-[1.1px]">RESEARCH INSIGHTS</span><h1 className="mt-[5px] mx-0 mb-1 text-[#143353] font-display text-2xl tracking-[-.8px] max-mobile:text-[22px]">Analytics</h1><p className="m-0 text-[#7c8b9c] text-[10px]">Explore participation and themes across stakeholder responses.</p></div><div className="data-refresh flex items-center gap-[7px] text-[#7d9084] text-[8px]"><span className="status-dot w-[7px] h-[7px] rounded-full inline-block bg-[#12a269] shadow-[0_0_0_3px_rgba(18,162,105,.1)] w-1.5 h-1.5" />Updated live</div></div>
      <div className="admin-notice insight-notice mb-[17px] py-2.5 px-[13px] border border-[#d9e8f1] rounded-lg flex items-center gap-[9px] text-[#61798b] bg-[#f4f9fc] text-[9px] leading-relaxed items-start"><Info size={16} /><span className="first:text-[#5282a4] first:text-sm first:font-bold"><strong className="text-[#465f75]">Exploratory overview.</strong> Theme indicators below are keyword matches to help navigate responses, not validated findings. Original answers remain unchanged; interpret them through careful qualitative analysis.</span></div>
      <div className="analytics-kpis mb-3.5 grid grid-cols-3 gap-3 max-mobile:grid-cols-1 max-mobile:gap-2">
        <Kpi icon={Check} color="green" value={isLoading ? '—' : data.length} title="Submitted responses" />
        <Kpi icon={FileText} color="blue" value={isLoading ? '—' : answeredCount} title="Answered questions" />
        <Kpi icon={SlidersHorizontal} color="orange" value={categorySlugs.filter((slug) => data.some((item) => item.categorySlug === slug)).length} title="Stakeholder groups" />
      </div>
      <div className="chart-grid analytics-chart-grid grid grid-cols-[1.55fr_1fr] gap-3.5 grid-cols-2 max-tablet:grid-cols-[1.3fr_1fr] max-mobile:grid-cols-1">
       
        {/* <section className="panel theme-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] min-w-0 pt-[15px] px-[17px] pb-[13px] min-h-[270px] py-[15px] px-4 max-mobile:min-h-[245px]"><div className="panel-heading flex items-start justify-between gap-[15px]"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Research themes</h2><p className="m-0 text-[#8b98a6] text-[8px]">Keyword references across submitted responses.</p></div><span className="panel-icon w-[27px] h-[27px] flex-none rounded-[7px] grid place-items-center text-[#5a7892] bg-[#f1f6fa]"><SlidersHorizontal size={17} /></span></div><div className="theme-list mt-[19px] grid gap-3">{themes.map((theme) => <div className="theme-row" key={theme.name}><div className="theme-row-head flex items-center gap-[7px] text-[#607489] text-[8px]"><span className="theme-dot w-[7px] h-[7px] flex-none rounded-full last:text-[#536b80] last:text-[8px] last:font-bold" style={{ background: theme.color }} /><strong className="flex-1 text-[#51677c] text-[8px] font-semibold">{theme.name}</strong><span className="last:text-[#536b80] last:text-[8px] last:font-bold">{isLoading ? '—' : theme.mentions}</span></div><div className="theme-track h-1 mt-1.5 mr-0 mb-0 ml-3.5 overflow-hidden rounded-[5px] bg-[#eff2f5]"><span style={{ width: `${theme.mentions ? Math.max(6, Math.min(100, (theme.mentions / Math.max(...themes.map((item) => item.mentions), 1)) * 100)) : 0}%`, background: theme.color }} className="h-full block rounded-[inherit] transition-[width] duration-300" /></div></div>)}</div><div className="theme-footnote mt-3.5 pt-2.5 border-t border-[#edf1f4] flex items-center gap-1.5 text-[#8a98a5] text-[7px]"><Info size={13} />Keyword matches are directional, not sentiment or frequency estimates.</div></section> */}
      </div>
      <section className="panel question-analysis-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] my-4.5 py-[15px] px-4">
        <div className="panel-heading flex items-start justify-between gap-[15px]"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">By question</h2><p className="m-0 text-[#8b98a6] text-[8px]">Review submitted responses to a specific question.</p></div><span className="panel-icon w-[27px] h-[27px] flex-none rounded-[7px] grid place-items-center text-[#5a7892] bg-[#f1f6fa]"><MessageSquareText size={17} /></span></div>
        {questionnairesLoading
          ? <div className="table-loading py-8 px-2.5 text-[#8291a0] text-center text-[10px]">Loading survey questions…</div>
          : <QuestionPicker questionnaires={questionnaires} questionId={questionId} onSelect={setQuestionId} />}
        {questionnairesError && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{questionnairesError.message}</div>}
        {selectedQuestion && <div className="question-analysis-results max-w-[900px] mt-[18px] grid gap-[9px]"><h3 className="mt-0 mx-0 mb-0.5 text-[#29445f] font-display text-[11px] leading-[1.7]">{selectedQuestion.text}</h3>{answersQuery.isLoading ? <div className="table-loading py-8 px-2.5 text-[#8291a0] text-center text-[10px]">Loading answers…</div> : showError ? <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{showError.message}</div> : answersQuery.data?.length ? answersQuery.data.map((answer) => <article className="question-analysis-answer p-3 border border-[#edf0f3] rounded-[7px] bg-[#fcfdfd]" key={answer.id}><div className="flex items-center justify-between gap-3 text-[#718296] text-[8px]"><strong className="text-[#445c73]">{answer.isAnonymous ? 'Anonymous' : answer.respondentName || answer.businessName || 'Named respondent'}</strong><span>{answer.submittedAt ? new Date(answer.submittedAt).toLocaleDateString() : ''}</span></div><p className="mt-[9px] mx-0 mb-0 text-[#607489] text-[9px] leading-loose whitespace-pre-wrap wrap-anywhere">{answer.answerText || 'Skipped'}</p>{answer.followUpAnswer && <p className="follow-up-text mt-[9px] mx-0 mb-0 text-[#607489] text-[9px] leading-loose whitespace-pre-wrap wrap-anywhere pt-2 border-t border-[#edf1f4] text-[#718296]">{answer.followUpAnswer}</p>}</article>) : <div className="empty-table min-h-[167px] flex flex-col items-center justify-center"><strong className="text-[#435b72] text-[10px]">No responses to this question yet</strong></div>}</div>}
      </section>

      <section className="panel analytics-chart-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] min-w-0 pt-[15px] px-[17px] pb-[13px] min-h-[270px] py-[15px] px-4 max-mobile:min-h-[245px]">
        <div className="panel-heading flex items-start justify-between gap-[15px]"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Participation by stakeholder</h2><p className="m-0 text-[#8b98a6] text-[8px]">Submitted responses by supply chain role.</p></div><span className="panel-icon w-[27px] h-[27px] flex-none rounded-[7px] grid place-items-center text-[#5a7892] bg-[#f1f6fa]"><BarChart3 size={17} /></span></div><div className="analytics-chart h-[200px] mt-2.5">{isLoading ? <div className="table-loading py-8 px-2.5 text-[#8291a0] text-center text-[10px]">Loading analytics…</div> : <ResponsiveContainer width="100%" height="100%"><BarChart data={categoriesData} margin={{ top: 8, right: 12, left: -20, bottom: 4 }}><CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#778599', fontSize: 11 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#8a97a8', fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e6ebf0', fontSize: 12 }} /><Bar dataKey="respondents" name="Responses" radius={[5, 5, 0, 0]} barSize={42}>{categoriesData.map((item) => <Cell key={item.name} fill={item.fill} />)}</Bar></BarChart></ResponsiveContainer>}</div>
      </section>

      
      {/* <section className="panel insight-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] mt-3.5 py-[15px] px-4"><div className="panel-heading flex items-start justify-between gap-[15px] mb-3"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Qualitative research themes</h2><p className="m-0 text-[#8b98a6] text-[8px]">Use these lenses when reviewing original stakeholder answers.</p></div></div><div className="insight-card-grid grid grid-cols-3 gap-[9px] max-mobile:grid-cols-2">{themeGroups.map((group, index) => <article className="insight-card min-h-[113px] p-3 border border-[#edf0f3] rounded-[7px] relative bg-[#fcfdfd]" key={group.name}><span className="insight-card-number absolute top-[11px] right-[12px] text-[#bdc7d0] text-[8px] font-bold">0{index + 1}</span><span className="insight-card-dot w-[7px] h-[7px] rounded-full block" style={{ backgroundColor: group.color }} /><h3 className="mt-2 mx-0 mb-1 text-[#3e566c] text-[9px]">{group.name}</h3><p className="max-w-[230px] m-0 text-[#8795a2] text-[8px] leading-relaxed">{insightDescription(index)}</p><span className="insight-mentions mt-2 inline-block text-[#799084] text-[7px] font-semibold">{isLoading ? '—' : themes[index].mentions} keyword matches</span></article>)}</div>
      </section> */}
      <div className="analytics-bottom-note mt-[13px] flex items-center gap-1.5 text-[#8996a4] text-[8px]"><LockKeyhole size={15} />All responses shown here have been submitted.</div>
    </div>
  )
}

function Kpi({ icon: Icon, color, value, title }) {
  return <article className="analytics-kpi min-h-[77px] py-[13px] px-[15px] border border-[#e6ebf0] rounded-lg flex items-center gap-[11px] bg-white max-mobile:min-h-[65px]"><span className={[(`kpi-icon kpi-${color}`), "w-[34px] h-[34px] rounded-[9px] grid place-items-center block"].filter(Boolean).join(' ')}><Icon size={18} /></span><div><strong className="block text-[#1b3c5a] font-display text-[19px]">{value}</strong><span className="block mt-0.75 text-[#7c8d9f] text-[8px]">{title}</span></div></article>
}

function QuestionPicker({ questionnaires, questionId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const pickerRef = useRef(null)
  const options = questionnaires.map((questionnaire) => ({
    category: questionnaire.category,
    questions: questionnaire.sections.flatMap((section) => section.questions.map((question) => ({
      ...question,
      sectionTitle: section.title,
    }))),
  }))
  const selectedQuestion = options
    .flatMap((group) => group.questions.map((question) => ({ ...question, categoryName: group.category.name })))
    .find((question) => String(question.id) === questionId)
  const normalizedSearch = search.trim().toLowerCase()
  const filteredOptions = options.map((group) => ({
    ...group,
    questions: group.questions.filter((question) => (
      !normalizedSearch
      || `${question.position} ${question.text} ${question.sectionTitle || ''} ${group.category.name}`.toLowerCase().includes(normalizedSearch)
    )),
  })).filter((group) => group.questions.length)

  useEffect(() => {
    if (!open) return undefined

    const closeOnOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const selectQuestion = (questionIdValue) => {
    onSelect(String(questionIdValue))
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="question-picker relative flex max-w-[760px] flex-col gap-1.5 text-[9px] font-semibold text-[#465d74]" ref={pickerRef}>
      <span id="question-picker-label">Choose a question</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="question-picker-label"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-[42px] w-full items-center justify-between gap-3 rounded-md border border-[#dfe6ed] bg-white px-3 py-2.5 text-left text-[11px] font-medium text-[#42586f] shadow-sm transition hover:border-[#75c399] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769aa]"
      >
        <span className="min-w-0 truncate">
          {selectedQuestion
            ? <><span className="mr-2 text-[9px] font-bold uppercase tracking-wide text-[#718296]">{selectedQuestion.categoryName}</span>{selectedQuestion.position}. {selectedQuestion.text}</>
            : <span className="text-[#8b98a6]">Select a category question</span>}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-[#718296] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#e1e7ed] bg-white shadow-[0_12px_30px_rgba(20,43,68,.16)]">
          <label className="flex items-center gap-2 border-b border-[#edf1f4] px-3 py-2.5 text-[#8190a0]">
            <Search size={15} aria-hidden="true" />
            <input
              autoFocus
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search category or question…"
              aria-label="Search questionnaire questions"
              className="min-w-0 flex-1 border-0 bg-transparent text-[11px] font-normal text-[#344a62] outline-none placeholder:text-[#9aa7b4]"
            />
          </label>
          <div className="max-h-[min(55vh,360px)] overflow-y-auto p-1.5" role="listbox" aria-labelledby="question-picker-label">
            {filteredOptions.map((group) => (
              <div key={group.category.slug} role="group" aria-label={group.category.name}>
                <p className="sticky top-0 z-10 m-0 bg-[#f7f9fb] px-2.5 py-2 text-[8px] font-bold uppercase tracking-[.08em] text-[#8291a0]">{group.category.name}</p>
                {group.questions.map((question) => {
                  const selected = String(question.id) === questionId
                  return (
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      key={question.id}
                      onClick={() => selectQuestion(question.id)}
                      className={`flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left text-[10px] font-normal leading-relaxed transition hover:bg-[#f4f8f6] ${selected ? 'bg-[#eaf7f0] text-[#087c4b]' : 'text-[#42586f]'}`}
                    >
                      <span className="mt-0.5 w-5 shrink-0 text-right text-[9px] font-semibold text-[#8b98a6]">{question.position}.</span>
                      <span className="min-w-0 flex-1">{question.text}</span>
                      {selected && <Check size={14} className="mt-0.5 shrink-0 text-[#079b59]" />}
                    </button>
                  )
                })}
              </div>
            ))}
            {filteredOptions.length === 0 && <p className="m-0 px-3 py-5 text-center text-[10px] font-normal text-[#8291a0]">No questions match your search.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function insightDescription(index) {
  return [
    'How orders, sourcing, fulfilment and delivery work today.',
    'Friction points, unmet needs and recurring operational barriers.',
    'Time, affordability and other costs stakeholders identify.',
    'Features and conditions respondents say would support adoption.',
    'Requirements for confidence, safety and participation.',
    'Respondent suggestions that could strengthen the ecosystem.',
  ][index]
}

function ExportPage({ data, isLoading, questionnaires, questionnairesLoading, questionnairesError }) {
  const [category, setCategory] = useState('')
  const [identity, setIdentity] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [format, setFormat] = useState('excel')
  const filtered = data.filter((item) => {
    const date = item.submittedAt?.slice(0, 10) || ''
    return (!category || item.categorySlug === category)
      && (!identity || (identity === 'anonymous' ? item.isAnonymous : !item.isAnonymous))
      && (!location || item.location?.toLowerCase().includes(location.toLowerCase()))
      && (!startDate || date >= startDate)
      && (!endDate || date <= endDate)
  })
  const download = () => exportRespondents(filtered, format, `pharmainsight-${category || 'all'}-responses`, questionnaires)

  return (
    <div className="export-page">
      <div className="admin-page-heading mb-5 flex justify-between items-end gap-5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-3"><div><span className="admin-eyebrow text-[#8796a7] text-[8px] font-bold tracking-[1.1px]">DATA MANAGEMENT</span><h1 className="mt-[5px] mx-0 mb-1 text-[#143353] font-display text-2xl tracking-[-.8px] max-mobile:text-[22px]">Export data</h1><p className="m-0 text-[#7c8b9c] text-[10px]">Download respondent records and answers for your research analysis.</p></div></div>
      <div className="admin-notice insight-notice mb-[17px] py-2.5 px-[13px] border border-[#d9e8f1] rounded-lg flex items-center gap-[9px] text-[#61798b] bg-[#f4f9fc] text-[9px] leading-relaxed items-start"><ShieldCheck size={17} /><span className="first:text-[#5282a4] first:text-sm first:font-bold">Research exports contain confidential business and respondent information. Store and share exported files securely.</span></div>
      <div className="export-layout grid grid-cols-[1.2fr_.8fr] items-start gap-3.5 max-mobile:grid-cols-1">
        <section className="panel export-config-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] p-[18px]"><div className="panel-heading flex items-start justify-between gap-[15px] mb-5 items-center"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Configure your export</h2><p className="m-0 text-[#8b98a6] text-[8px]">Choose which responses and file type to include.</p></div><span className="panel-icon w-[27px] h-[27px] flex-none rounded-[7px] grid place-items-center text-[#5a7892] bg-[#f1f6fa]"><Download size={17} /></span></div>
          <label className="export-field mb-3.5 flex flex-col gap-1.5 text-[#465d74] text-[9px] font-semibold"><span>Stakeholder category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-[38px] py-0 px-2.5 border border-[#dfe6ed] rounded-md outline-0 text-[#42586f] bg-white text-[9px] focus:border-[#75c399]"><option value="">All categories</option>{questionnaires.map((item) => <option value={item.category.slug} key={item.category.slug}>{item.category.name}</option>)}</select></label>
          <label className="export-field mb-3.5 flex flex-col gap-1.5 text-[#465d74] text-[9px] font-semibold"><span>Respondent type</span><select value={identity} onChange={(event) => setIdentity(event.target.value)} className="h-[38px] py-0 px-2.5 border border-[#dfe6ed] rounded-md outline-0 text-[#42586f] bg-white text-[9px] focus:border-[#75c399]"><option value="">Named and anonymous</option><option value="named">Named</option><option value="anonymous">Anonymous</option></select></label>
          <div className="export-extra-filters grid grid-cols-2 gap-y-0 gap-x-2.5 max-mobile:grid-cols-2 max-mobile:gap-y-0 gap-x-2"><label className="export-field mb-3.5 flex flex-col gap-1.5 text-[#465d74] text-[9px] font-semibold"><span>Location</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Any location" className="h-[38px] py-0 px-2.5 border border-[#dfe6ed] rounded-md outline-0 text-[#42586f] bg-white text-[9px] focus:border-[#75c399]" /></label><label className="export-field mb-3.5 flex flex-col gap-1.5 text-[#465d74] text-[9px] font-semibold"><span>Submitted from</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-[38px] py-0 px-2.5 border border-[#dfe6ed] rounded-md outline-0 text-[#42586f] bg-white text-[9px] focus:border-[#75c399]" /></label><label className="export-field mb-3.5 flex flex-col gap-1.5 text-[#465d74] text-[9px] font-semibold"><span>Submitted to</span><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="h-[38px] py-0 px-2.5 border border-[#dfe6ed] rounded-md outline-0 text-[#42586f] bg-white text-[9px] focus:border-[#75c399]" /></label></div>
          <div className="export-format-label mt-[19px] mx-0 mb-2 text-[#8290a0] text-[7px] font-bold tracking-[.9px]">FILE FORMAT</div><div className="format-options grid gap-2"><button className={`format-option w-full min-h-[55px] py-2 px-2.5 border rounded-[7px] flex items-center gap-[9px] text-left bg-white ${format === 'excel' ? 'format-selected border-[#74bf96] bg-[#f7fcf8] shadow-[0_0_0_2px_rgba(7,155,89,.05)]' : 'border-[#e4e9ee]'}`} onClick={() => setFormat('excel')}><span className="format-icon format-excel w-[33px] h-[33px] rounded-[7px] grid place-items-center text-[#148653] bg-soft-green flex-1"><FileSpreadsheet size={20} /></span><span className="flex-1"><strong className="block text-[#415970] text-[9px]">Excel workbook</strong><small className="block mt-0.75 text-[#8a98a6] text-[8px]">.xls spreadsheet</small></span><i className={`w-4 h-4 border rounded-full grid place-items-center text-white not-italic ${format === 'excel' ? 'border-green bg-green' : 'border-[#dbe4e9]'}`}>{format === 'excel' && <Check size={13} />}</i></button><button className={`format-option w-full min-h-[55px] py-2 px-2.5 border rounded-[7px] flex items-center gap-[9px] text-left bg-white ${format === 'csv' ? 'format-selected border-[#74bf96] bg-[#f7fcf8] shadow-[0_0_0_2px_rgba(7,155,89,.05)]' : 'border-[#e4e9ee]'}`} onClick={() => setFormat('csv')}><span className="format-icon format-csv w-[33px] h-[33px] rounded-[7px] grid place-items-center text-[#4a80ac] bg-[#edf5fb] flex-1"><FileText size={20} /></span><span className="flex-1"><strong className="block text-[#415970] text-[9px]">CSV file</strong><small className="block mt-0.75 text-[#8a98a6] text-[8px]">.csv, plain text</small></span><i className={`w-4 h-4 border rounded-full grid place-items-center text-white not-italic ${format === 'csv' ? 'border-green bg-green' : 'border-[#dbe4e9]'}`}>{format === 'csv' && <Check size={13} />}</i></button></div>
          {questionnairesError && <div className="form-error mt-[13px] py-2.5 px-3 border border-[#f1c5bf] rounded-[7px] text-[#a94438] bg-[#fff5f4] text-[10px]" role="alert">{questionnairesError.message}</div>}
          <button className="button button-green export-button min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] w-full mt-[18px]" onClick={download} disabled={isLoading || questionnairesLoading || Boolean(questionnairesError) || filtered.length === 0}><Download size={17} />Download {format === 'csv' ? 'CSV' : 'Excel'} file <ArrowRight size={16} /></button>
        </section>
        <aside className="export-preview p-[18px] border border-[#e3eaf0] rounded-[9px] bg-[linear-gradient(145deg,#fff,#f8fbfc)]"><div className="preview-top flex items-center justify-between"><span className="preview-icon w-[37px] h-[37px] rounded-[10px] grid place-items-center text-[#138354] bg-[#e9f6ef]"><FileSpreadsheet size={20} /></span><span className="preview-badge py-[5px] px-[7px] border border-[#e3ece6] rounded-[15px] flex items-center gap-[5px] text-[#698476] bg-[#f8fbf8] text-[7px]"><span className="w-[5px] h-[5px] rounded-full bg-green" />Ready to export</span></div><span className="preview-label mt-[25px] block text-[#8c9aa8] text-[7px] font-bold tracking-wide">MATCHING RESPONSES</span><strong className="preview-count mt-1 block text-[#1c3b59] font-display text-[35px]">{isLoading ? '—' : filtered.length}</strong><span className="preview-description text-[#7d8c9b] text-[9px]">{filtered.length === 1 ? 'response' : 'responses'} match your selected filters</span><div className="preview-divider h-px mt-[18px] mx-0 mb-3.5 bg-[#e9eef2]" /><div className="preview-includes"><strong className="block mb-[9px] text-[#445c73] text-[9px]">This file includes</strong><span className="mt-2 flex items-center gap-[7px] text-[#718296] text-[8px]"><Check size={14} />Response and respondent information</span><span className="mt-2 flex items-center gap-[7px] text-[#718296] text-[8px]"><Check size={14} />Category and submission timestamp</span><span className="mt-2 flex items-center gap-[7px] text-[#718296] text-[8px]"><Check size={14} />Question and follow-up answer columns</span></div><div className="preview-confidential mt-[17px] py-2.5 px-[9px] border border-[#e3ece5] rounded-md flex items-start gap-[7px] text-[#73897b] bg-[#f8fbf8] text-[8px] leading-normal"><LockKeyhole size={15} />Handle exports as confidential research data.</div></aside>
      </div>
      <section className="panel export-info border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] mt-3.5 py-3 px-3.5 flex items-center gap-2.5 max-mobile:items-start max-mobile:flex-wrap"><div className="export-info-icon w-[31px] h-[31px] flex-none rounded-lg grid place-items-center text-[#6489a3] bg-[#edf5fa]"><Download size={18} /></div><div><h3 className="mt-0 mx-0 mb-1 text-[#465e75] text-[9px]">Need an individual response?</h3><p className="m-0 text-[#8492a0] text-[8px]">Open any response record to export a single questionnaire, or print a formatted response.</p></div><Link to="/admin/respondents" className="panel-link inline-flex items-center gap-[5px] text-[#287451] text-[9px] font-semibold hover:text-green ml-auto whitespace-nowrap max-mobile:w-full max-mobile:ml-[41px]">Browse responses <ArrowRight size={15} /></Link></section>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="admin-page-heading mb-5 flex justify-between items-end gap-5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-3"><div><span className="admin-eyebrow text-[#8796a7] text-[8px] font-bold tracking-[1.1px]">WORKSPACE CONFIGURATION</span><h1 className="mt-[5px] mx-0 mb-1 text-[#143353] font-display text-2xl tracking-[-.8px] max-mobile:text-[22px]">Settings</h1><p className="m-0 text-[#7c8b9c] text-[10px]">Review the research database connection and administrator access model.</p></div></div>
      <section className="panel settings-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] pt-4 px-[18px] pb-1"><div className="panel-heading flex items-start justify-between gap-[15px] mb-[11px] items-center"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Research data connection</h2><p className="m-0 text-[#8b98a6] text-[8px]">Responses are submitted through the Supabase submit_response RPC.</p></div><span className={`connection-status flex items-center gap-[5px] rounded-[15px] px-2 py-[5px] text-[8px] font-semibold ${isSupabaseConfigured ? 'bg-soft-green text-[#238056]' : 'bg-[#fff5e5] text-[#a8752e]'} `}><i className="h-[5px] w-[5px] rounded-full bg-[currentColor]" />{isSupabaseConfigured ? 'Connected' : 'Not configured'}</span></div><div className="setting-row min-h-[60px] py-3 px-0 border-t border-[#edf1f4] flex items-center justify-between gap-3.5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-2"><div><strong className="block text-[#4a6075] text-[9px]">Supabase URL</strong><span className="block mt-1 text-[#8493a1] text-[8px] max-mobile:leading-relaxed">Project API endpoint configured using VITE_SUPABASE_URL.</span></div><span className={`py-[5px] px-[7px] rounded-[5px] whitespace-nowrap text-[7px] font-semibold ${isSupabaseConfigured ? 'text-[#4d8067] bg-[#eff8f2]' : 'text-[#9a753d] bg-[#fff7e9]'}`}>{isSupabaseConfigured ? 'Configured' : 'Missing'}</span></div><div className="setting-row min-h-[60px] py-3 px-0 border-t border-[#edf1f4] flex items-center justify-between gap-3.5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-2"><div><strong className="block text-[#4a6075] text-[9px]">Public API key</strong><span className="block mt-1 text-[#8493a1] text-[8px] max-mobile:leading-relaxed">Configured using VITE_SUPABASE_ANON_KEY; row-level security remains enabled.</span></div><span className={`py-[5px] px-[7px] rounded-[5px] whitespace-nowrap text-[7px] font-semibold ${isSupabaseConfigured ? 'text-[#4d8067] bg-[#eff8f2]' : 'text-[#9a753d] bg-[#fff7e9]'}`}>{isSupabaseConfigured ? 'Configured' : 'Missing'}</span></div><div className="setting-row min-h-[60px] py-3 px-0 border-t border-[#edf1f4] flex items-center justify-between gap-3.5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-2"><div><strong className="block text-[#4a6075] text-[9px]">Administrator authorization</strong><span className="block mt-1 text-[#8493a1] text-[8px] max-mobile:leading-relaxed">Authenticated sessions are verified using the is_admin database function.</span></div><span className="setting-value py-[5px] px-[7px] rounded-[5px] whitespace-nowrap text-[7px] font-semibold text-[#4d8067] bg-[#eff8f2]">Role protected</span></div><div className="setting-row min-h-[60px] py-3 px-0 border-t border-[#edf1f4] flex items-center justify-between gap-3.5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-2"><div><strong className="block text-[#4a6075] text-[9px]">Anonymous drafts</strong><span className="block mt-1 text-[#8493a1] text-[8px] max-mobile:leading-relaxed">Unsubmitted respondent details and answers are stored in session storage only.</span></div><span className="setting-value py-[5px] px-[7px] rounded-[5px] whitespace-nowrap text-[7px] font-semibold text-[#4d8067] bg-[#eff8f2]">Client session</span></div></section>
      <div className="settings-callout mt-[13px] py-[11px] px-[13px] border border-[#f1dcb7] rounded-[7px] flex items-center gap-2 text-[#82683d] bg-[#fffaf1] text-[8px]"><LockKeyhole size={17} /><span>The client uses the public anon key only. Never include a Supabase service-role key in the application bundle.</span></div>
      {!isSupabaseConfigured && <div className="settings-next mt-[13px] p-[13px] border border-[#dceaf1] rounded-[7px] flex items-start gap-[9px] text-[#628096] bg-[#f5fafc]"><Info size={17} /><div><strong className="text-[#47657a] text-[9px]">Connect a Supabase project to enable live administration.</strong><p className="mt-[5px] mx-0 mb-[9px] text-[#71889a] text-[8px] leading-[1.65]">Set the public project URL and anon key in your local environment, then reload the application.</p><code className="py-2 px-[9px] rounded-[5px] block text-[#4a6576] bg-[#eaf2f6] text-[8px] leading-[1.7]">VITE_SUPABASE_URL=…<br />VITE_SUPABASE_ANON_KEY=…</code></div></div>}
    </div>
  )
}

function ErrorState({ message, retry }) {
  return <div className="admin-error p-[34px] border border-[#f0d7d1] rounded-[9px] bg-white"><h2 className="mt-0 mx-0 mb-2 text-[#934c43] text-sm">Couldn’t load research data</h2><p className="mt-0 mx-0 mb-[17px] text-[#8c7671] text-[10px]">{message}</p><button className="button button-outline min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-[#455970] border-[#dce5ed] bg-white enabled:hover:border-[#b7c8d8] enabled:hover:bg-[#f8fafc] min-h-[34px]" onClick={retry}>Try again</button></div>
}
