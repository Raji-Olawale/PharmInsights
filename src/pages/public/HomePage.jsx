import { Activity, ArrowDown, ArrowRight, ArrowUpRight, Clock3, HeartHandshake, PackageCheck, ShieldCheck, Truck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/questionnaires'
import { useCategories } from '../../hooks/useResearch'
import { getAccentStyle } from '../../utils/categoryStyles'

const categoryCards = [
  { id: 'wholesaler', icon: PackageCheck, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=720&q=85' },
  { id: 'buyer', icon: HeartHandshake, image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=720&q=85' },
  { id: 'logistics', icon: Truck, image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=720&q=85' },
]

export default function HomePage() {
  const { data = [], isLoading, error } = useCategories()

  return (
    <>
      <section className="hero-section min-h-[603px] relative overflow-hidden bg-page">
        <div className="hero-glow absolute w-[620px] h-[620px] right-[-200px] top-[-210px] rounded-full bg-[radial-gradient(circle,_rgba(220,241,230,.58),_rgba(245,248,252,0)_69%)] pointer-events-none" />
        <div className="hero-container relative z-1 max-w-[1240px] min-h-[550px] m-auto pt-[66px] px-[34px] pb-[46px] grid grid-cols-[1.06fr_.94fr] items-center gap-[45px] max-laptop:gap-6 max-tablet:min-h-0 max-tablet:pt-[58px] max-tablet:px-[25px] max-tablet:pb-10 max-tablet:grid-cols-2 max-mobile:pt-[43px] max-mobile:px-5 max-mobile:pb-[30px] max-mobile:flex max-mobile:flex-col max-mobile:items-stretch max-mobile:gap-[31px]">
          <div className="hero-copy max-w-[570px] pt-0 pr-0 pb-3 pl-1 max-mobile:p-0">
            <div className="eyebrow inline-flex items-center gap-[9px] text-[#708197] text-[10px] font-bold tracking-widest"><span className="eyebrow-dot w-[7px] h-[7px] inline-block rounded-full bg-green shadow-[0_0_0_4px_rgba(7,155,89,.1)]" />UGANDA SUPPLY CHAIN RESEARCH</div>
            <h1 className="mt-5 mx-0 mb-[17px] max-w-[580px] text-[#0c2e55] font-display text-[clamp(42px,_5vw,_61px)] font-extrabold leading-[1.13] tracking-[-2.9px] max-laptop:text-[51px] max-tablet:text-[clamp(39px,_6vw,_50px)] max-tablet:tracking-[-2px] max-mobile:max-w-[520px] max-mobile:mt-[17px] max-mobile:text-[clamp(39px,_11vw,_52px)]">Help us understand the <span className="text-green">pharmaceutical</span> supply chain.</h1>
            <p className="hero-description max-w-[485px] m-0 text-[#607087] text-[15px] leading-[1.8] max-mobile:text-[13px]">We are conducting research to understand the challenges faced by pharmaceutical wholesalers, buyers and logistics businesses.</p>
            <div className="hero-actions flex items-center gap-6 mt-[29px] max-mobile:mt-[23px] max-mobile:gap-[19px]">
              <Link className="button button-green button-lg min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px min-h-[49px] py-0 px-5 text-[13px] text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)]" to="/select-category">Get started <ArrowRight size={18} /></Link>
              <a className="text-link inline-flex items-center gap-2 text-[#39516b] text-xs font-bold hover:text-green" href="#purpose">Our purpose <ArrowDown size={16} /></a>
            </div>
            <div className="hero-reassurance mt-[31px] flex flex-wrap gap-[21px] text-[#61738a] text-[11px] max-mobile:mt-[21px] max-mobile:gap-y-2.5 gap-x-[17px] max-mobile:text-[9px]">
              <span className="inline-flex items-center gap-[7px]"><Clock3 size={16} />10 questions <i className="w-0.75 h-0.75 my-0 mx-px rounded-full bg-[#9aa8b8]" />5–10 minutes</span>
              <span className="inline-flex items-center gap-[7px]"><ShieldCheck size={17} />Your responses are confidential</span>
            </div>
          </div>
          <div className="hero-visual relative w-[min(100%,_530px)] h-[418px] ml-auto pt-2 pr-[11px] pb-5 pl-2 max-laptop:h-[365px] max-tablet:h-[340px] max-mobile:w-[calc(100%_-_9px)] max-mobile:h-[275px] max-mobile:my-0 max-mobile:mx-auto">
            <div className="hero-image-frame w-full h-full overflow-hidden relative rounded-[18px_18px_75px_18px] bg-[#cbd9dc] shadow-[0_21px_55px_rgba(22,52,80,.16)] max-mobile:rounded-[15px_15px_55px_15px]">
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1250&q=90" alt="Healthcare professionals working together in a modern pharmacy" className="w-full h-full object-cover object-center" />
              <div className="hero-image-shade absolute inset-[30%_0_0] bg-[linear-gradient(180deg,transparent,rgba(8,38,64,.55))]" />
              <div className="hero-image-label absolute left-[23px] bottom-[23px] flex items-center gap-[11px] text-white max-mobile:left-[15px] max-mobile:bottom-[15px]"><span className="label-icon w-[38px] h-[38px] border border-[rgba(255,255,255,.4)] rounded-[11px] grid place-items-center bg-[rgba(255,255,255,.14)] backdrop-blur-sm"><Activity size={20} /></span><span><b className="block text-[13px]">Better insight.</b><small className="block mt-0.75 text-[rgba(255,255,255,.78)] text-[10px]">Stronger healthcare systems.</small></span></div>
            </div>
            {/* <div className="hero-float-card absolute z-2 right-[-16px] bottom-[51px] min-w-[226px] py-[13px] px-3.5 border border-[rgba(226,232,240,.8)] rounded-xl flex items-center gap-2.5 bg-white shadow-[0_10px_24px_rgba(20,43,68,.12)] max-tablet:right-[-5px] max-tablet:bottom-[28px] max-tablet:min-w-[205px] max-mobile:right-[-7px] max-mobile:bottom-[18px] max-mobile:min-w-auto max-mobile:p-[9px]"><span className="float-icon w-[33px] h-[33px] rounded-[10px] text-green grid place-items-center bg-soft-green max-mobile:w-[29px] max-mobile:h-[29px]"><LockKeyhole size={17} /></span><span><strong className="block text-[#1c344f] text-[10px] max-mobile:text-[9px]">Confidential by design</strong><small className="block mt-0.75 text-[#8391a2] text-[9px] max-mobile:text-[8px]">Your voice, protected</small></span><Check className="float-check ml-auto text-green" size={17} /></div> */}
            <div className="hero-decor decor-one absolute z-[-1] w-[74px] h-[74px] border border-[rgba(7,155,89,.16)] rounded-3xl rotate-25 top-[-23px] left-[43px]" /><div className="hero-decor decor-two absolute z-[-1] w-[74px] h-[74px] border border-[rgba(7,155,89,.16)] rounded-3xl rotate-25 w-[42px] h-[42px] right-[-18px] top-[26px] border-[rgba(23,105,170,.19)] rounded-[14px]" />
          </div>
        </div>
        <div className="hero-bottom-line max-w-[1240px] my-0 mx-auto pt-0 px-[34px] pb-5 flex items-center gap-3 text-[#91a0b1] text-[9px] font-bold tracking-widest uppercase max-tablet:pr-[25px] max-tablet:pl-[25px] max-mobile:pt-0 max-mobile:px-5 max-mobile:pb-[17px] max-mobile:text-[7px] max-mobile:tracking-[.8px]"><span className="w-[25px] h-px bg-[#cfd9e2] max-mobile:w-[17px]" />Listening across the pharmaceutical supply chain<span className="w-[25px] h-px bg-[#cfd9e2] max-mobile:w-[17px]" /></div>
      </section>

      <section className="category-section section-pad py-[82px] px-[34px] max-w-[1240px] m-auto max-tablet:py-16 max-tablet:px-[25px] max-mobile:py-[54px] max-mobile:px-5" id="categories">
        <div className="section-heading centered mt-0 mx-auto mb-[37px] text-center max-mobile:mb-[26px]">
          <div className="eyebrow inline-flex items-center gap-[9px] text-[#708197] text-[10px] font-bold tracking-widest justify-center"><span className="eyebrow-dot w-[7px] h-[7px] inline-block rounded-full bg-green shadow-[0_0_0_4px_rgba(7,155,89,.1)]" />YOUR EXPERIENCE MATTERS</div>
          <h2 className="mt-3 mx-0 mb-[9px] text-navy font-display text-[34px] tracking-[-1.2px] max-mobile:text-[28px]">Select your category</h2>
          <p className="m-0 text-[#758398] text-[13px] max-mobile:text-[11px]">Choose the option that best describes your role.</p>
        </div>
        <div className="category-grid grid grid-cols-3 gap-5 max-tablet:gap-[13px] max-mobile:grid-cols-1 max-mobile:gap-3">
          {error ? <div className="admin-error p-[34px] border border-[#f0d7d1] rounded-[9px] bg-white"><h2 className="mt-0 mx-0 mb-2 text-[#934c43] text-sm">Stakeholder categories are unavailable</h2><p className="mt-0 mx-0 mb-[17px] text-[#8c7671] text-[10px]">{error.message}</p><Link className="button button-outline min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-[#455970] border-[#dce5ed] bg-white enabled:hover:border-[#b7c8d8] enabled:hover:bg-[#f8fafc] min-h-[34px]" to="/select-category">Try selecting a category</Link></div> : isLoading ? <div className="admin-loading py-8 px-2.5 text-[#8291a0] text-center text-[10px]">Loading stakeholder categories…</div> : data.map((category, index) => {
            const metadata = categories[category.slug]
            const imageInfo = categoryCards.find((card) => card.id === category.slug)
            if (!metadata || !imageInfo) return null
            const Icon = metadata.icon
            return (
              <article style={getAccentStyle(metadata.accent)} className={[(`category-card accent-${metadata.accent}`), "group overflow-hidden border border-[#e4eaf0] rounded-[13px] bg-white shadow-[0_4px_14px_rgba(18,43,70,.035)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(18,43,70,.1)] max-mobile:grid max-mobile:grid-cols-[118px_1fr]"].filter(Boolean).join(' ')} key={category.id}>
                <div className="category-image h-[173px] relative overflow-hidden bg-[#e9eff3] after:absolute after:inset-[25%_0_0] after:content-[''] after:bg-[linear-gradient(180deg,_transparent,_rgba(4,28,49,.38))] max-tablet:h-[135px] max-mobile:h-full max-mobile:min-h-[160px]"><img src={imageInfo.image} alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.035]" /><span className="category-image-count absolute z-1 right-[15px] top-[14px] text-[rgba(255,255,255,.86)] font-display text-xs font-bold tracking-[.5px] max-mobile:right-[9px] max-mobile:top-[9px] max-mobile:text-[9px]">0{index + 1}</span><span className="category-icon absolute z-2 bottom-[15px] left-[17px] w-[38px] h-[38px] border border-[rgba(255,255,255,.46)] rounded-[11px] grid place-items-center text-white bg-[rgba(255,255,255,.18)] backdrop-blur-sm max-mobile:left-[10px] max-mobile:bottom-[10px] max-mobile:w-8 max-mobile:h-8"><Icon size={20} /></span></div>
                <div className="category-card-content pt-[18px] px-5 pb-[18px] max-tablet:p-[15px] max-mobile:pt-[13px] max-mobile:px-3 max-mobile:pb-[11px]">
                  <span className="category-kicker text-[#8a98a8] text-[9px] font-bold tracking-[1.05px]">STAKEHOLDER</span>
                  <h3 className="mt-1.5 mx-0 mb-2 text-navy font-display text-[19px] tracking-[-.3px] max-tablet:text-base max-mobile:mt-[5px] max-mobile:text-sm">{category.name}</h3>
                  <p className="min-h-[43px] m-0 text-[#6d7d90] text-[11px] leading-[1.65] max-tablet:min-h-[55px] max-mobile:min-h-0 max-mobile:text-[9px] max-mobile:leading-[1.55]">{category.description}</p>
                  <Link className="category-start mt-[17px] pt-[13px] border-t border-[#edf1f4] flex justify-between items-center text-navy text-[11px] font-bold max-mobile:mt-2.5 max-mobile:pt-[9px] max-mobile:text-[9px]" to={`/questionnaire/${category.slug}/information`}>Start questionnaire <ArrowUpRight size={16} /></Link>
                </div>
              </article>
            )
          })}
          {!isLoading && !error && data.length === 0 && <div className="admin-error p-[34px] border border-[#f0d7d1] rounded-[9px] bg-white"><h2 className="mt-0 mx-0 mb-2 text-[#934c43] text-sm">No categories are configured</h2><p className="mt-0 mx-0 mb-[17px] text-[#8c7671] text-[10px]">The research database returned no stakeholder categories.</p></div>}
        </div>
        <div className="category-footnote mt-[25px] flex justify-center items-center gap-2 text-[#7e8da0] text-[10px] max-mobile:items-start max-mobile:justify-start max-mobile:text-[9px] max-mobile:leading-normal"><ShieldCheck size={16} />Takes about 5–10 minutes. Your responses will be kept confidential.</div>
      </section>

      <section className="purpose-section section-pad py-[82px] px-[34px] relative overflow-hidden pl-[max(34px,_calc((100%_-_1172px)/2))] pr-[max(34px,_calc((100%_-_1172px)/2))] grid grid-cols-[.8fr_1.2fr] items-center gap-[90px] text-white bg-navy max-laptop:gap-[50px] max-tablet:py-16 max-tablet:px-[25px] max-tablet:pr-[25px] max-tablet:pl-[25px] max-tablet:grid-cols-[.78fr_1.22fr] max-tablet:gap-[30px] max-mobile:py-[54px] max-mobile:px-5 max-mobile:py-[49px] max-mobile:px-5 max-mobile:block" id="purpose">
        <div className="purpose-copy relative z-1 max-w-[390px] max-mobile:mb-[27px]">
          <div className="eyebrow eyebrow-light inline-flex items-center gap-[9px] text-[#708197] text-[10px] font-bold tracking-widest text-[#a7bdcf]"><span className="eyebrow-dot w-[7px] h-[7px] inline-block rounded-full bg-green shadow-[0_0_0_4px_rgba(7,155,89,.1)]" />WHY YOUR VOICE MATTERS</div>
          <h2 className="mt-[17px] mx-0 mb-3.5 font-display text-[35px] tracking-[-1.25px] leading-[1.22] max-tablet:text-3xl max-mobile:max-w-[370px] max-mobile:text-3xl">Small insights can shape a healthier future.</h2>
          <p className="m-0 text-[#b6c7d7] text-xs leading-[1.85] max-mobile:text-[11px]">By sharing your experience, you can help identify what works, where the gaps are, and how the pharmaceutical supply chain can better serve people across Uganda.</p>
          <Link className="purpose-link mt-[23px] inline-flex items-center gap-2 text-[#7ce0ae] text-[11px] font-bold hover:text-white" to="/select-category">Be part of the research <ArrowRight size={17} /></Link>
        </div>
        <div className="benefit-list relative z-1 border-t border-[rgba(215,230,242,.16)]">
          <Benefit icon={UsersRound} number="01" title="Support better decision making" text="Ground future decisions in the real experience of the people doing the work." />
          <Benefit icon={PackageCheck} number="02" title="Build a stronger ecosystem" text="Help us understand how every part of the supply chain can work better together." />
          <Benefit icon={HeartHandshake} number="03" title="Contribute to a healthier Uganda" text="A more reliable supply chain can help essential products reach the people who need them." />
        </div>
        <div className="purpose-orbit orbit-a absolute border border-[rgba(120,196,220,.1)] rounded-full w-[415px] h-[415px] right-[-185px] top-[-238px]" /><div className="purpose-orbit orbit-b absolute border border-[rgba(120,196,220,.1)] rounded-full w-[510px] h-[510px] right-[-235px] top-[-286px]" />
      </section>

      <section className="closing-cta max-w-[1172px] my-0 mx-auto pt-14 px-[34px] pb-[65px] flex items-center justify-between gap-6 max-mobile:py-[42px] max-mobile:px-5 max-mobile:items-start max-mobile:flex-col">
        <div><span className="cta-kicker text-green text-[9px] font-bold tracking-[1.25px]">UNDERSTAND. IMPROVE. INNOVATE.</span><h2 className="mt-[9px] mx-0 mb-1.5 text-navy font-display text-[23px] tracking-[-.7px] max-mobile:text-xl">Your experience is part of the answer.</h2><p className="m-0 text-[#738297] text-[11px]">Share your perspective in a short, confidential questionnaire.</p></div>
        <Link className="button button-green button-lg min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px min-h-[49px] py-0 px-5 text-[13px] text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)]" to="/select-category">Get started <ArrowRight size={18} /></Link>
      </section>
    </>
  )
}

function Benefit({ icon: Icon, number, title, text }) {
  return <article className="benefit-item min-h-[107px] py-5 px-0 border-b border-[rgba(215,230,242,.16)] grid grid-cols-[39px_1fr_20px] items-start gap-[15px] max-mobile:min-h-24 max-mobile:py-4 max-mobile:px-0 max-mobile:gap-[11px]"><span className="benefit-icon w-[38px] h-[38px] border border-[rgba(123,221,174,.22)] rounded-[11px] grid place-items-center text-[#69d6a1] bg-[rgba(20,141,94,.12)]"><Icon size={20} /></span><div><span className="benefit-number text-[#9cb1c4] text-[8px] font-bold tracking-wide">{number} / IMPACT</span><h3 className="mt-[5px] mx-0 mb-1 text-white font-display text-sm max-mobile:text-xs">{title}</h3><p className="max-w-[450px] m-0 text-[#a8bcd0] text-[10px] leading-[1.7] max-mobile:text-[9px]">{text}</p></div><ArrowUpRight className="benefit-arrow mt-1 text-[#75d7a6]" size={18} /></article>
}
