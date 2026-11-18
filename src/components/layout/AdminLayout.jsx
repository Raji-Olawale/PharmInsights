import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3, ChevronDown, Download, LayoutDashboard,
  LogOut, Menu, UsersRound, X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Brand from './Brand'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/respondents', label: 'All respondents', icon: UsersRound },
  // { to: '/admin/wholesalers', label: 'Wholesalers', icon: Building2 },
  // { to: '/admin/buyers', label: 'Retailers / Buyers', icon: Activity },
  // { to: '/admin/logistics', label: 'Logistics businesses', icon: Truck },
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
    <div className="admin-shell min-h-screen text-[#203751] bg-[#f6f8fb] print:bg-white">
      <aside id="admin-sidebar" className={`admin-sidebar fixed inset-y-0 left-0 z-30 flex w-[241px] flex-col border-r border-[#e8edf2] bg-white px-[13px] pt-[21px] pb-[13px] max-tablet:w-[250px] max-tablet:-translate-x-full max-tablet:transition-transform max-tablet:shadow-[7px_0_24px_rgba(22,43,65,.09)] print:hidden ${open ? 'max-tablet:translate-x-0' : ''}`}>
        <div className="sidebar-brand pt-0 px-[11px] pb-[25px]"><Brand size="sidebar" /><span className="admin-label mt-[5px] mr-0 mb-0 ml-[41px] block text-[#99a5b2] text-[7px] font-bold tracking-[1.1px]">RESEARCH PORTAL</span></div>
        <div className="sidebar-caption pt-0 px-3 pb-[9px] text-[#9aa7b4] text-[8px] font-bold tracking-wide">WORKSPACE</div>
        <nav className="sidebar-nav grid gap-0.75" aria-label="Admin navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={sidebarLinkClass} onClick={() => setOpen(false)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom mt-auto pt-2.5 border-t border-[#edf0f3]">
          {/* <NavLink to="/admin/settings" className={sidebarLinkClass}><Settings size={18} /><span>Settings</span></NavLink> */}
          <button className="sidebar-link logout-link min-h-[38px] py-0 px-[11px] border-0 rounded-[7px] flex items-center gap-[11px] text-[#6a7c90] bg-transparent text-left text-[10px] font-semibold transition-all duration-200 hover:text-[#243e5a] hover:bg-[#f5f8fa] w-full mt-0.75 cursor-pointer" onClick={logout}><LogOut size={18} /><span>Log out</span></button>
          <div className="sidebar-user min-w-0 mt-3 pt-2.5 px-[5px] pb-0.75 border-t border-[#edf0f3] flex items-center gap-2 text-[#8290a0]">
            <div className="avatar w-[27px] h-[27px] flex-none rounded-full grid place-items-center text-[#116d49] bg-[#dff3e8] text-[10px] font-bold">{name.charAt(0).toUpperCase()}</div>
            <span className="user-email overflow-hidden text-[#52657b] text-[8px] text-ellipsis whitespace-nowrap">{name}</span><ChevronDown size={15} />
          </div>
        </div>
      </aside>
      <div className="admin-main min-h-screen ml-[241px] max-tablet:ml-0 print:m-0">
        <header className="admin-topbar h-[59px] py-0 px-[29px] border-b border-[#e7ecf1] flex items-center justify-between bg-white max-tablet:py-0 max-tablet:px-4 max-mobile:h-[54px] max-mobile:py-0 max-mobile:px-3.5 max-mobile:justify-between max-mobile:gap-[11px] print:hidden">
          <button className="icon-button admin-menu-button hidden size-9 place-items-center border-0 bg-transparent text-navy max-tablet:grid" onClick={() => setOpen(!open)} aria-label={open ? 'Close admin menu' : 'Open admin menu'} aria-expanded={open} aria-controls="admin-sidebar">{open ? <X size={20} /> : <Menu size={20} />}</button>
          {/* <div className="admin-top-title flex items-center gap-[9px] text-[#65788d] text-[9px] max-mobile:flex-1 max-mobile:gap-1.5 max-mobile:text-[8px] max-mobile:whitespace-nowrap"><span className="status-dot w-[7px] h-[7px] rounded-full inline-block bg-[#12a269] shadow-[0_0_0_3px_rgba(18,162,105,.1)]" />Research workspace <span className="top-divider text-[#b6c0ca] max-mobile:whitespace-nowrap">/</span> Uganda supply chain study</div> */}
          <div className="admin-top-right"><span className="secure-pill py-1.5 px-[9px] border border-[#e1ece6] rounded-3xl flex items-center gap-1.5 text-[#698275] bg-[#f7fbf8] text-[8px] font-semibold max-mobile:py-[5px] max-mobile:px-[7px] max-mobile:text-[0]"><span className="w-[5px] h-[5px] rounded-full bg-green max-mobile:w-1.5 max-mobile:h-1.5" /> Admin</span></div>
        </header>
        <main className="admin-content w-[min(100%,_1450px)] m-auto pt-[26px] px-[29px] pb-[35px] max-laptop:pr-[21px] max-laptop:pl-[21px] max-tablet:pt-[23px] max-tablet:px-4 max-tablet:pb-[30px] max-mobile:pt-5 max-mobile:px-[13px] max-mobile:pb-[27px] print:max-w-full print:p-0"><Outlet /></main>
      </div>
      {open && <button className="sidebar-backdrop hidden max-tablet:fixed max-tablet:inset-0 max-tablet:z-[25] max-tablet:block max-tablet:border-0 max-tablet:bg-[rgba(13,31,49,.25)]" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    </div>
  )
}
