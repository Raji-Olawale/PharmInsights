import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Brand from './Brand'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="public-shell [min-height:100vh] [background:#fff]">
      <header className="site-header [height:78px] [position:relative] [z-index:20] [background:rgba(255,255,255,.94)] [border-bottom:1px_solid_rgba(226,232,240,.72)] max-[620px]:[height:66px]">
        <div className="nav-container [max-width:1240px] [height:100%] [margin:0_auto] [padding:0_34px] [display:flex] [align-items:center] [justify-content:space-between] max-[800px]:[padding:0_22px] max-[620px]:[padding:0_18px]">
          <Brand />
          <button className="icon-button mobile-menu-button [border:0] [background:transparent] [color:var(--navy)] [display:inline-grid] [place-items:center] [display:none] max-[800px]:[width:37px] max-[800px]:[height:37px] max-[800px]:[display:grid]" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={[(`main-nav${menuOpen ? ' nav-open' : ''}`), "[height:100%] [display:flex] [align-items:center] [gap:38px] [color:#53647a] [font-size:13px] [font-weight:600] max-[800px]:[height:auto] max-[800px]:[position:absolute] max-[800px]:[top:67px] max-[800px]:[left:14px] max-[800px]:[right:14px] max-[800px]:[padding:10px] max-[800px]:[border:1px_solid_#e4eaf0] max-[800px]:[border-radius:10px] max-[800px]:[display:none] max-[800px]:[align-items:stretch] max-[800px]:[gap:0] max-[800px]:[background:#fff] max-[800px]:[box-shadow:0_15px_30px_rgba(20,43,68,.12)] max-[800px]:[&.nav-open]:[display:flex] max-[800px]:[&.nav-open]:[flex-direction:column]"].filter(Boolean).join(' ')} aria-label="Main navigation">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className="[transition:color_.18s_ease] hover:[color:var(--navy)] max-[800px]:[padding:12px] max-[800px]:[border-radius:6px]">Home</NavLink>
            <a href="/#purpose" onClick={() => setMenuOpen(false)} className="[transition:color_.18s_ease] hover:[color:var(--navy)] max-[800px]:[padding:12px] max-[800px]:[border-radius:6px]">Our Purpose</a>
            <Link className="admin-nav-link [transition:color_.18s_ease] hover:[color:var(--navy)] [padding:10px_15px] [border:1px_solid_#dfe6ee] [border-radius:8px] [color:var(--navy)] [transition:all_.2s_ease] hover:[border-color:#b6c8d8] hover:[background:#f7fafc] max-[800px]:[padding:12px] max-[800px]:[border-radius:6px] max-[800px]:[margin-top:4px]" to="/admin/login" onClick={() => setMenuOpen(false)}>Admin Login <span aria-hidden="true" className="[padding-left:5px] [font-size:15px]">↗</span></Link>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer [color:#b5c3d3] [background:#09284c]">
        <div className="footer-inner [max-width:1240px] [margin:auto] [padding:42px_34px_20px] [display:grid] [grid-template-columns:1.5fr_1fr_auto] [align-items:center] [gap:28px] max-[800px]:[padding-right:25px] max-[800px]:[padding-left:25px] max-[800px]:[grid-template-columns:1fr_1fr] max-[620px]:[padding:30px_20px_17px] max-[620px]:[grid-template-columns:1fr] max-[620px]:[gap:19px]">
          <div className="footer-brand">
            <Brand light />
            <p className="[max-width:330px] [margin:13px_0_0] [color:#9fb0c2] [font-size:12px] [line-height:1.75]">Research for a stronger, more connected pharmaceutical supply chain in Uganda.</p>
          </div>
          
          <div className="copyright [color:#8297ac] [font-size:11px] [text-align:right] max-[800px]:[grid-column:1/-1] max-[800px]:[text-align:left] max-[620px]:[grid-column:auto]">© {new Date().getFullYear()} PharmaInsight. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
