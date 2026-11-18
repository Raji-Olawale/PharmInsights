import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BarChart3, Building2, ClipboardList, Download, PackageCheck, Truck, UsersRound } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAdminStats, useDailySubmissions, useSubmissions } from '../../hooks/useResearch'
import { categories } from '../../data/questionnaires'
import { getAccentStyle } from '../../utils/categoryStyles'

const colors = { wholesaler: '#2367b0', buyer: '#119668', logistics: '#e48a34' }
const icons = { wholesaler: PackageCheck, buyer: Building2, logistics: Truck }

export default function DashboardPage() {
  const statsQuery = useAdminStats()
  const dailyQuery = useDailySubmissions()
  const submissionsQuery = useSubmissions()
  const stats = statsQuery.data || []
  const responses = submissionsQuery.data || []
  const total = stats.reduce((sum, item) => sum + Number(item.total_responses || 0), 0)
  const named = stats.reduce((sum, item) => sum + Number(item.named_responses || 0), 0)
  const anonymous = stats.reduce((sum, item) => sum + Number(item.anonymous_responses || 0), 0)
  const counts = stats.map((item) => ({
    name: item.category,
    key: item.category_slug,
    value: Number(item.total_responses || 0),
    fill: colors[item.category_slug] || '#6b8298',
  }))
  const trends = useMemo(() => trendData(dailyQuery.data || []), [dailyQuery.data])
  const error = statsQuery.error || dailyQuery.error || submissionsQuery.error
  const loading = statsQuery.isLoading || dailyQuery.isLoading || submissionsQuery.isLoading
  const statCards = [
    { label: 'Total submissions', value: total, helper: 'All submitted responses', icon: UsersRound, tone: 'navy' },
    ...stats.map((item) => {
      const Icon = icons[item.category_slug] || Building2
      return {
        label: item.category,
        value: Number(item.total_responses || 0),
        helper: `${Number(item.anonymous_responses || 0)} anonymous · ${Number(item.named_responses || 0)} named`,
        icon: Icon,
        tone: categories[item.category_slug]?.accent || 'navy',
      }
    }),
  ]

  if (error) return <div className="admin-error p-[34px] border border-[#f0d7d1] rounded-[9px] bg-white"><h2 className="mt-0 mx-0 mb-2 text-[#934c43] text-sm">Couldn’t load research data</h2><p className="mt-0 mx-0 mb-[17px] text-[#8c7671] text-[10px]">{error.message}</p><button className="button button-outline min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-[#455970] border-[#dce5ed] bg-white enabled:hover:border-[#b7c8d8] enabled:hover:bg-[#f8fafc] min-h-[34px]" onClick={() => { statsQuery.refetch(); dailyQuery.refetch(); submissionsQuery.refetch() }}>Try again</button></div>
  return (
    <div className="dashboard-page">
      <div className="admin-page-heading mb-5 flex justify-between items-end gap-5 max-mobile:items-start max-mobile:flex-col max-mobile:gap-3"><div><span className="admin-eyebrow text-[#8796a7] text-[8px] font-bold tracking-[1.1px]">RESEARCH OVERVIEW</span><h1 className="mt-[5px] mx-0 mb-1 text-[#143353] font-display text-2xl tracking-[-.8px] max-mobile:text-[22px]">Dashboard</h1><p className="m-0 text-[#7c8b9c] text-[10px]">A clear view of your pharmaceutical supply chain research.</p></div><Link className="button button-green min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] min-h-[37px] text-[9px] max-mobile:self-stretch" to="/admin/export"><Download size={16} />Export responses</Link></div>
      <div className="stats-grid grid grid-cols-4 gap-[13px] max-tablet:gap-2 max-mobile:grid-cols-2">{statCards.map(({ label, value, helper, icon: Icon, tone }) => <article className="stat-card min-h-[132px] py-[15px] px-4 border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] max-tablet:p-[13px] max-mobile:min-h-[118px]" key={label}><div className={[(`stat-icon tone-${tone}`), "w-[31px] h-[31px] rounded-[9px] grid place-items-center"].filter(Boolean).join(' ')}><Icon size={19} /></div><div className="stat-value mt-2.5 text-[#193958] font-display text-[23px] font-bold leading-none max-mobile:text-xl">{loading ? '—' : value}</div><div className="stat-label mt-[5px] text-[#3e556d] text-[9px] font-bold">{label}</div><div className="stat-helper mt-1 text-[#96a2af] text-[8px]">{helper}</div></article>)}</div>
      <div className="status-summary min-h-12 mt-3 mx-0 mb-3.5 py-0 px-3.5 border border-[#e6ebf0] rounded-lg flex items-center gap-[26px] bg-white max-tablet:gap-3.5 max-mobile:p-[11px] max-mobile:items-start max-mobile:flex-col max-mobile:gap-2.5"><div className="flex items-center gap-2 text-[#718195] text-[8px]"><span className="status-summary-dot complete w-1.5 h-1.5 rounded-full bg-[#0b9a60]" /><span>Named responses</span><strong className="text-[#28415c] text-[10px]">{loading ? '—' : named}</strong></div><div className="flex items-center gap-2 text-[#718195] text-[8px]"><span className="status-summary-dot progress w-1.5 h-1.5 rounded-full bg-[#e2a04b]" /><span>Anonymous responses</span><strong className="text-[#28415c] text-[10px]">{loading ? '—' : anonymous}</strong></div><div className="summary-action flex items-center gap-2 text-[#718195] text-[8px] ml-auto text-[#648274] max-mobile:ml-0 max-mobile:pt-2 max-mobile:border-t border-[#edf1f4] max-mobile:w-full"><ClipboardList size={17} /><Link to="/admin/respondents" className="inline-flex items-center gap-[5px] font-semibold">View all responses <ArrowRight size={15} /></Link></div></div>
      <div className="chart-grid grid grid-cols-[1.55fr_1fr] gap-3.5 max-tablet:grid-cols-[1.3fr_1fr] max-mobile:grid-cols-1">
        {/* <section className="panel trend-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] min-w-0 pt-[15px] px-[17px] pb-[13px]"><div className="panel-heading flex items-start justify-between gap-[15px]"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Submission trends</h2><p className="m-0 text-[#8b98a6] text-[8px]">Responses over the last 30 days (Africa/Kampala)</p></div><span className="panel-icon w-[27px] h-[27px] flex-none rounded-[7px] grid place-items-center text-[#5a7892] bg-[#f1f6fa]"><BarChart3 size={17} /></span></div><div className="chart-area h-[190px] mt-[9px] max-mobile:h-[175px]">{loading ? <ChartSkeleton /> : <ResponsiveContainer width="100%" height="100%"><AreaChart data={trends} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}><defs><linearGradient id="submissionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#079b59" stopOpacity={0.17} /><stop offset="90%" stopColor="#079b59" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef2f6" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#8a97a8', fontSize: 10 }} interval={4} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#8a97a8', fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e6ebf0', fontSize: 12 }} /><Area type="monotone" dataKey="submissions" stroke="#079b59" strokeWidth={2.5} fill="url(#submissionFill)" activeDot={{ r: 5, fill: '#079b59', stroke: '#fff', strokeWidth: 3 }} /></AreaChart></ResponsiveContainer>}</div></section> */}
        <section className="panel distribution-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] min-w-0 pt-[15px] px-[17px] pb-[13px]"><div className="panel-heading flex items-start justify-between gap-[15px]"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Responses by category</h2><p className="m-0 text-[#8b98a6] text-[8px]">Distribution of all submitted responses</p></div><span className="panel-icon w-[27px] h-[27px] flex-none rounded-[7px] grid place-items-center text-[#5a7892] bg-[#f1f6fa]"><UsersRound size={17} /></span></div><div className="donut-wrap h-[188px] relative flex justify-center items-center max-mobile:h-[180px]">{loading ? <ChartSkeleton /> : total ? <><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={counts} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={4} stroke="none">{counts.map((entry) => <Cell key={entry.key} fill={entry.fill} />)}</Pie><Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e6ebf0', fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="donut-center absolute top-1/2 left-1/2 flex flex-col items-center transform-[translate(-50%,-50%)] pointer-events-none"><strong className="text-[#203d59] font-display text-xl">{total}</strong><span className="mt-0.5 text-[#8a97a6] text-[8px]">responses</span></div></> : <div className="chart-empty h-full flex flex-col items-center justify-center text-center"><span className="empty-chart-icon w-9 h-9 mb-2 rounded-full grid place-items-center text-[#89a0b3] bg-[#f1f5f8]"><UsersRound size={20} /></span><strong className="text-[#50667c] text-[9px]">No responses yet</strong><small className="mt-1 text-[#9aa7b4] text-[8px]">Category distribution will appear here.</small></div>}</div><div className="legend-list grid grid-cols-2 gap-y-2.5 gap-x-[13px] pt-0 px-0.75 pb-px">{counts.map((item) => <div key={item.key} className="flex items-center gap-1.5 text-[#708196] text-[8px]"><span className="legend-color w-[7px] h-[7px] rounded-sm" style={{ backgroundColor: item.fill }} /><span>{item.name}</span><strong className="ml-auto text-[#3c526a] text-[9px]">{loading ? '—' : item.value}</strong></div>)}</div></section>
      </div>
      <section className="panel recent-panel border border-[#e6ebf0] rounded-[9px] bg-white shadow-[0_3px_11px_rgba(24,49,75,.025)] mt-3.5 pt-3.5 px-[17px] pb-0 max-mobile:pr-0 max-mobile:pl-0"><div className="panel-heading flex items-start justify-between gap-[15px] mb-3 items-center max-mobile:pr-[13px] max-mobile:pl-[13px]"><div><h2 className="mt-0 mx-0 mb-1 text-[#263f59] font-display text-xs tracking-[-.2px]">Recent submissions</h2><p className="m-0 text-[#8b98a6] text-[8px]">The latest activity across all stakeholder categories.</p></div><Link className="panel-link inline-flex items-center gap-[5px] text-[#287451] text-[9px] font-semibold hover:text-green" to="/admin/respondents">View all <ArrowRight size={15} /></Link></div>{submissionsQuery.isLoading ? <div className="table-loading py-8 px-2.5 text-[#8291a0] text-center text-[10px]">Loading recent submissions…</div> : responses.length ? <div className="table-scroll w-full overflow-auto max-mobile:min-h-[160px]"><table className="data-table w-full border-collapse whitespace-nowrap text-left max-mobile:min-w-[670px]"><thead><tr><th className="h-[33px] py-0 px-2.5 border-t border-[#edf1f4] border-b border-[#edf1f4] text-[#8e9ba8] bg-[#fbfcfd] text-[7px] font-bold tracking-[.55px]">BUSINESS</th><th className="h-[33px] py-0 px-2.5 border-t border-[#edf1f4] border-b border-[#edf1f4] text-[#8e9ba8] bg-[#fbfcfd] text-[7px] font-bold tracking-[.55px]">CONTACT PERSON</th><th className="h-[33px] py-0 px-2.5 border-t border-[#edf1f4] border-b border-[#edf1f4] text-[#8e9ba8] bg-[#fbfcfd] text-[7px] font-bold tracking-[.55px]">CATEGORY</th><th className="h-[33px] py-0 px-2.5 border-t border-[#edf1f4] border-b border-[#edf1f4] text-[#8e9ba8] bg-[#fbfcfd] text-[7px] font-bold tracking-[.55px]">SUBMITTED</th><th className="h-[33px] py-0 px-2.5 border-t border-[#edf1f4] border-b border-[#edf1f4] text-[#8e9ba8] bg-[#fbfcfd] text-[7px] font-bold tracking-[.55px]" /></tr></thead><tbody>{responses.slice(0, 5).map((response) => <ResponseRow key={response.id} response={response} />)}</tbody></table></div> : <div className="empty-table min-h-[167px] flex flex-col items-center justify-center"><div className="empty-icon w-[37px] h-[37px] mb-[9px] rounded-[10px] grid place-items-center text-[#7d95a8] bg-[#f0f5f8]"><ClipboardList size={19} /></div><strong className="text-[#435b72] text-[10px]">No responses yet</strong><span className="mt-1 text-[#8b99a7] text-[8px]">Submitted questionnaires will show up here.</span></div>}</section>
      <div className="dashboard-bottom-note pt-[13px] px-0.5 pb-0 flex justify-between gap-[15px] text-[#95a1ae] text-[8px] max-mobile:items-start max-mobile:flex-col max-mobile:leading-normal"><span>Research data is confidential and accessible to authorised administrators only.</span><Link to="/admin/analytics" className="flex items-center gap-1 text-[#5b816e] font-semibold">Explore research analytics <ArrowUpRight size={14} /></Link></div>
    </div>
  )
}

function ResponseRow({ response }) {
  const respondent = response.isAnonymous ? 'Anonymous' : response.respondentName || '—'
  const business = response.isAnonymous ? 'Anonymous' : response.businessName || '—'
  return <tr><td><Link className="business-cell inline-flex items-center gap-2 text-[#344b63] font-semibold hover:text-green" to={`/admin/respondents/${response.id}`}><span className="table-avatar w-[25px] h-[25px] flex-none rounded-[7px] grid place-items-center text-[#377451] bg-[#eaf5ee] text-[9px] font-bold">{business.charAt(0).toUpperCase()}</span>
    <strong className="text-[8px] font-semibold text-[var(--accent)]">{business}
    </strong></Link>
  </td>
    <td className="text-[8px] font-semibold text-[var(--accent)]">{respondent}</td>
    <td><span style={getAccentStyle(categories[response.categorySlug]?.accent)} className="text-[8px] font-semibold text-[var(--accent)]">{response.category}</span>
    </td>
    <td className="text-[8px] font-semibold text-[var(--accent)]">{response.submittedAt ? new Date(response.submittedAt).toLocaleDateString() : '—'}</td>
    <td><Link className="row-action w-[25px] h-[25px] rounded-md grid place-items-center text-[#8293a4] hover:text-green hover:bg-[#eef8f2]" to={`/admin/respondents/${response.id}`} aria-label={`View ${business}`}><ArrowRight size={15} /></Link>
    </td>
  </tr>
}

function ChartSkeleton() {
  return <div className="chart-skeleton h-[150px] mt-[25px] flex items-end justify-around border-b border-[#e8edf1] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_37px,#f1f4f6_38px)]"><span className="w-[7%] h-[36%] rounded-[4px_4px_0_0] bg-[#e8f4ed] animate-pulse h-[63%] h-[47%] h-[78%] h-[55%] h-[87%]" /><span className="w-[7%] h-[36%] rounded-[4px_4px_0_0] bg-[#e8f4ed] animate-pulse h-[63%] h-[47%] h-[78%] h-[55%] h-[87%]" /><span className="w-[7%] h-[36%] rounded-[4px_4px_0_0] bg-[#e8f4ed] animate-pulse h-[63%] h-[47%] h-[78%] h-[55%] h-[87%]" /><span className="w-[7%] h-[36%] rounded-[4px_4px_0_0] bg-[#e8f4ed] animate-pulse h-[63%] h-[47%] h-[78%] h-[55%] h-[87%]" /><span className="w-[7%] h-[36%] rounded-[4px_4px_0_0] bg-[#e8f4ed] animate-pulse h-[63%] h-[47%] h-[78%] h-[55%] h-[87%]" /><span className="w-[7%] h-[36%] rounded-[4px_4px_0_0] bg-[#e8f4ed] animate-pulse h-[63%] h-[47%] h-[78%] h-[55%] h-[87%]" /></div>
}

function kampalaDate(date) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Kampala', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function trendData(rows) {
  const totals = new Map()
  rows.forEach((row) => {
    const key = String(row.day).slice(0, 10)
    totals.set(key, (totals.get(key) || 0) + Number(row.submissions || 0))
  })
  return Array.from({ length: 30 }, (_, offset) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - offset))
    const day = kampalaDate(date)
    return { day, label: day.slice(5), submissions: totals.get(day) || 0 }
  })
}
