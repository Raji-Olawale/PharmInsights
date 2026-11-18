import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Brand from './Brand'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-2 h-[78px] border-b border-border/70 bg-white/95 max-mobile:h-[66px]">
        <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between px-[34px] max-tablet:px-[22px] max-mobile:px-[18px]">
          <Brand />
          <button
            type="button"
            className="hidden size-[37px] place-items-center border-0 bg-transparent text-navy max-tablet:grid"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav
            className={`flex h-full items-center gap-9 text-[13px] font-semibold text-[#53647a] max-tablet:absolute max-tablet:left-[14px] max-tablet:right-[14px] max-tablet:top-[67px] max-tablet:h-auto max-tablet:flex-col max-tablet:items-stretch max-tablet:gap-0 max-tablet:rounded-[10px] max-tablet:border max-tablet:border-[#e4eaf0] max-tablet:bg-white max-tablet:p-2.5 max-tablet:shadow-[0_15px_30px_rgba(20,43,68,.12)] ${menuOpen ? 'max-tablet:flex' : 'max-tablet:hidden'}`}
            aria-label="Main navigation"
          >
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className="rounded-md transition-colors hover:text-navy max-tablet:p-3">Home</NavLink>
            <a href="/#purpose" onClick={() => setMenuOpen(false)} className="rounded-md transition-colors hover:text-navy max-tablet:p-3">Our Purpose</a>
            <Link
              className="rounded-lg border border-[#dfe6ee] px-[15px] py-2.5 text-navy transition-colors hover:border-[#b6c8d8] hover:bg-[#f7fafc] max-tablet:mt-1 max-tablet:rounded-md max-tablet:p-3"
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login <span aria-hidden="true" className="pl-1 text-[15px]">↗</span>
            </Link>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="bg-[#09284c] text-[#b5c3d3]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-[1fr_auto] items-center gap-7 px-[34px] pt-[42px] pb-5 max-tablet:grid-cols-2 max-tablet:px-[25px] max-mobile:grid-cols-1 max-mobile:gap-[19px] max-mobile:px-5 max-mobile:pt-[30px] max-mobile:pb-[17px]">
          <div>
            <Brand light />
            <p className="mt-[13px] max-w-[330px] text-xs leading-7 text-[#9fb0c2]">Research for a stronger, more connected pharmaceutical supply chain in Uganda.</p>
          </div>
          
          <div className="text-right text-[11px] text-[#8297ac] max-tablet:col-span-2 max-tablet:text-left max-mobile:col-span-1">© {new Date().getFullYear()} PharmaInsight. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
