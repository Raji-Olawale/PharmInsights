import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Activity, BarChart3, Building2, ChevronDown, Download, LayoutDashboard,
  LogOut, Menu, Settings, Truck, UsersRound,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Brand from './Brand'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/respondents', label: 'All respondents', icon: UsersRound },
  { to: '/admin/wholesalers', label: 'Wholesalers', icon: Building2 },
  { to: '/admin/buyers', label: 'Retailers / Buyers', icon: Activity },
  { to: '/admin/logistics', label: 'Logistics businesses', icon: Truck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/export', label: 'Export data', icon: Download },
]

const sidebarLinkClass = ({ isActive }) => `sidebar-link flex min-h-[38px] items-center gap-[11px] rounded-[7px] border-0 px-[11px] text-left text-[10px] font-semibold transition-colors ${isActive ? 'bg-[#eaf7f0] text-[#087c4b]' : 'bg-transparent text-[#6a7c90] hover:bg-[#f5f8fa] hover:text-[#243e5a]'}`

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const logout = async () => {
    await signOut()
    navigate('/admin/login')
  }
  const name = session?.user?.email || 'Research administrator'

  return (
    <div className="admin-shell [min-height:100vh] [color:#203751] [background:#f6f8fb] print:[background:#fff]">
      <aside className={[(`admin-sidebar${open ? ' sidebar-open' : ''}`), "[width:241px] [position:fixed] [z-index:30] [inset:0_auto_0_0] [padding:21px_13px_13px] [border-right:1px_solid_#e8edf2] [display:flex] [flex-direction:column] [background:#fff] max-[800px]:[width:215px] max-[620px]:[width:250px] max-[620px]:[transform:translateX(-100%)] max-[620px]:[transition:transform_.22s_ease] max-[620px]:[box-shadow:7px_0_24px_rgba(22,43,65,.09)] max-[620px]:[&.sidebar-open]:[transform:translateX(0)] print:[display:none]"].filter(Boolean).join(' ')}>
        <div className="sidebar-brand [padding:0_11px_25px]"><Brand size="sidebar" /><span className="admin-label [margin:5px_0_0_41px] [display:block] [color:#99a5b2] [font-size:7px] [font-weight:700] [letter-spacing:1.1px]">RESEARCH PORTAL</span></div>
        <div className="sidebar-caption [padding:0_12px_9px] [color:#9aa7b4] [font-size:8px] [font-weight:700] [letter-spacing:1px]">WORKSPACE</div>
        <nav className="sidebar-nav [display:grid] [gap:3px]" aria-label="Admin navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={sidebarLinkClass} onClick={() => setOpen(false)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom [margin-top:auto] [padding-top:10px] [border-top:1px_solid_#edf0f3]">
          <NavLink to="/admin/settings" className={sidebarLinkClass}><Settings size={18} /><span>Settings</span></NavLink>
          <button className="sidebar-link logout-link [min-height:38px] [padding:0_11px] [border:0] [border-radius:7px] [display:flex] [align-items:center] [gap:11px] [color:#6a7c90] [background:transparent] [text-align:left] [font-size:10px] [font-weight:600] [transition:background_.16s,_color_.16s] hover:[color:#243e5a] hover:[background:#f5f8fa] [width:100%] [margin-top:3px] [cursor:pointer]" onClick={logout}><LogOut size={18} /><span>Log out</span></button>
          <div className="sidebar-user [min-width:0] [margin-top:12px] [padding:10px_5px_3px] [border-top:1px_solid_#edf0f3] [display:flex] [align-items:center] [gap:8px] [color:#8290a0]">
            <div className="avatar [width:27px] [height:27px] [flex:0_0_auto] [border-radius:50%] [display:grid] [place-items:center] [color:#116d49] [background:#dff3e8] [font-size:10px] [font-weight:700]">{name.charAt(0).toUpperCase()}</div>
            <span className="user-email [overflow:hidden] [color:#52657b] [font-size:8px] [text-overflow:ellipsis] [white-space:nowrap]">{name}</span><ChevronDown size={15} />
          </div>
        </div>
      </aside>
      <div className="admin-main [min-height:100vh] [margin-left:241px] max-[800px]:[margin-left:215px] max-[620px]:[margin-left:0] print:[margin:0]">
        <header className="admin-topbar [height:59px] [padding:0_29px] [border-bottom:1px_solid_#e7ecf1] [display:flex] [align-items:center] [justify-content:space-between] [background:#fff] max-[800px]:[padding:0_16px] max-[620px]:[height:54px] max-[620px]:[padding:0_14px] max-[620px]:[justify-content:flex-start] max-[620px]:[gap:11px] print:[display:none]">
          <button className="icon-button admin-menu-button [border:0] [background:transparent] [color:var(--navy)] [display:inline-grid] [place-items:center] [display:none] max-[620px]:[display:grid]" onClick={() => setOpen(!open)} aria-label="Toggle admin menu"><Menu size={20} /></button>
          <div className="admin-top-title [display:flex] [align-items:center] [gap:9px] [color:#65788d] [font-size:9px] max-[620px]:[flex:1] max-[620px]:[gap:6px] max-[620px]:[font-size:8px] max-[620px]:[white-space:nowrap]"><span className="status-dot [width:7px] [height:7px] [border-radius:50%] [display:inline-block] [background:#12a269] [box-shadow:0_0_0_3px_rgba(18,162,105,.1)]" />Research workspace <span className="top-divider [color:#b6c0ca] max-[620px]:[white-space:nowrap]">/</span> Uganda supply chain study</div>
          <div className="admin-top-right"><span className="secure-pill [padding:6px_9px] [border:1px_solid_#e1ece6] [border-radius:20px] [display:flex] [align-items:center] [gap:6px] [color:#698275] [background:#f7fbf8] [font-size:8px] [font-weight:600] max-[620px]:[padding:5px_7px] max-[620px]:[font-size:0]"><span className="[width:5px] [height:5px] [border-radius:50%] [background:var(--green)] max-[620px]:[width:6px] max-[620px]:[height:6px]" /> Secure admin</span></div>
        </header>
        <main className="admin-content [width:min(100%,_1450px)] [margin:auto] [padding:26px_29px_35px] max-[1050px]:[padding-right:21px] max-[1050px]:[padding-left:21px] max-[800px]:[padding:23px_16px_30px] max-[620px]:[padding:20px_13px_27px] print:[max-width:100%] print:[padding:0]"><Outlet /></main>
      </div>
      {open && <button className="sidebar-backdrop max-[620px]:[position:fixed] max-[620px]:[z-index:25] max-[620px]:[inset:0] max-[620px]:[border:0] max-[620px]:[background:rgba(13,31,49,.25)]" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    </div>
  )
}
