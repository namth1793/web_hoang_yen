import { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiMenu, FiPhone, FiX } from 'react-icons/fi'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const T = {
  vi: {
    company1: 'CÔNG TY TNHH XNK',
    company2: 'ARTOCA',
    hotline: 'HOTLINE',
    nav: [
      { label: 'TRANG CHỦ', to: '/' },
      {
        label: 'GIỚI THIỆU', to: '/gioi-thieu',
        children: [
          { label: 'Tổng quan công ty', to: '/gioi-thieu' },
          { label: 'Tầm nhìn & Sứ mệnh', to: '/gioi-thieu#tam-nhin' },
          { label: 'Giá trị cốt lõi', to: '/gioi-thieu#gia-tri' },
          { label: 'Chuỗi cung ứng', to: '/gioi-thieu#chuoi-cung-ung' },
        ],
      },
      {
        label: 'SẢN PHẨM', to: '/san-pham',
        mega: [
          {
            cat: 'Quế', to: '/san-pham?category=que',
            items: [
              { label: 'Quế chẻ',             to: '/san-pham/que-che' },
              { label: 'Quế sáo',             to: '/san-pham/que-sao' },
              { label: 'Quế ngón tay',        to: '/san-pham/que-ngon-tay' },
              { label: 'Quế ống loại A',      to: '/san-pham/que-ong-a' },
              { label: 'Quế ống loại B',      to: '/san-pham/que-ong-b' },
              { label: 'Quế cắt vuông',       to: '/san-pham/que-cat-vuong' },
              { label: 'Quế vụn',             to: '/san-pham/que-vun' },
              { label: 'Bột quế',             to: '/san-pham/bot-que' },
            ],
          },
          {
            cat: 'Hồi', to: '/san-pham?category=hoi',
            items: [
              { label: 'Hồi nguyên cành',    to: '/san-pham/hoi-nguyen' },
              { label: 'Hồi vỡ vụn',         to: '/san-pham/hoi-vo' },
            ],
          },
          {
            cat: 'Gừng', to: '/san-pham?category=gung',
            items: [
              { label: 'Gừng tươi',          to: '/san-pham/gung-tuoi' },
              { label: 'Gừng sấy khô',       to: '/san-pham/gung-say' },
              { label: 'Bột gừng',           to: '/san-pham/bot-gung' },
            ],
          },
          {
            cat: 'Nghệ', to: '/san-pham?category=nghe',
            items: [
              { label: 'Nghệ sấy khô',       to: '/san-pham/nghe-say' },
              { label: 'Nghệ thái lát',       to: '/san-pham/nghe-lat' },
              { label: 'Bột nghệ',           to: '/san-pham/bot-nghe' },
            ],
          },
        ],
      },
      {
        label: 'TIN TỨC', to: '/tin-tuc',
        children: [
          { label: 'Tin công ty',      to: '/tin-tuc?category=tin-cong-ty' },
          { label: 'Tin thị trường',   to: '/tin-tuc?category=thi-truong' },
          { label: 'Sự kiện',          to: '/tin-tuc?category=su-kien' },
          { label: 'Tuyển dụng',       to: '/tin-tuc?category=tuyen-dung' },
        ],
      },
      { label: 'LIÊN HỆ', to: '/lien-he' },
    ],
  },
  en: {
    company1: 'ARTOCA IMPORT EXPORT',
    company2: 'CO., LTD',
    hotline: 'HOTLINE',
    nav: [
      { label: 'HOME', to: '/' },
      {
        label: 'ABOUT US', to: '/gioi-thieu',
        children: [
          { label: 'Company Overview',   to: '/gioi-thieu' },
          { label: 'Vision & Mission',   to: '/gioi-thieu#tam-nhin' },
          { label: 'Core Values',        to: '/gioi-thieu#gia-tri' },
          { label: 'Supply Chain',       to: '/gioi-thieu#chuoi-cung-ung' },
        ],
      },
      {
        label: 'PRODUCTS', to: '/san-pham',
        mega: [
          {
            cat: 'Cinnamon', to: '/san-pham?category=que',
            items: [
              { label: 'Split Cassia',        to: '/san-pham/que-che' },
              { label: 'Cigarette Cassia',    to: '/san-pham/que-sao' },
              { label: 'Finger Cassia',       to: '/san-pham/que-ngon-tay' },
              { label: 'Round Cassia Gr. A',  to: '/san-pham/que-ong-a' },
              { label: 'Round Cassia Gr. B',  to: '/san-pham/que-ong-b' },
              { label: 'Square Cut Cassia',   to: '/san-pham/que-cat-vuong' },
              { label: 'Broken Cassia',       to: '/san-pham/que-vun' },
              { label: 'Cassia Powder',       to: '/san-pham/bot-que' },
            ],
          },
          {
            cat: 'Star Anise', to: '/san-pham?category=hoi',
            items: [
              { label: 'Whole Star Anise',    to: '/san-pham/hoi-nguyen' },
              { label: 'Broken Star Anise',   to: '/san-pham/hoi-vo' },
            ],
          },
          {
            cat: 'Ginger', to: '/san-pham?category=gung',
            items: [
              { label: 'Fresh Ginger',        to: '/san-pham/gung-tuoi' },
              { label: 'Dried Ginger',        to: '/san-pham/gung-say' },
              { label: 'Ginger Powder',       to: '/san-pham/bot-gung' },
            ],
          },
          {
            cat: 'Turmeric', to: '/san-pham?category=nghe',
            items: [
              { label: 'Dried Turmeric',      to: '/san-pham/nghe-say' },
              { label: 'Turmeric Slices',     to: '/san-pham/nghe-lat' },
              { label: 'Turmeric Powder',     to: '/san-pham/bot-nghe' },
            ],
          },
        ],
      },
      {
        label: 'NEWS', to: '/tin-tuc',
        children: [
          { label: 'Company News',     to: '/tin-tuc?category=tin-cong-ty' },
          { label: 'Market News',      to: '/tin-tuc?category=thi-truong' },
          { label: 'Events',           to: '/tin-tuc?category=su-kien' },
          { label: 'Job Opportunities',to: '/tin-tuc?category=tuyen-dung' },
        ],
      },
      { label: 'CONTACT', to: '/lien-he' },
    ],
  },
}

export default function Navbar() {
  const { lang, setLang } = useLanguage()
  const t = T[lang]
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState({})
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const dropdownTimer = useRef(null)

  useEffect(() => { setOpen(false); setDropdown(null); setMobileExpanded({}) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleEnter = (label) => { clearTimeout(dropdownTimer.current); setDropdown(label) }
  const handleLeave = () => { dropdownTimer.current = setTimeout(() => setDropdown(null), 150) }
  const toggleMobile = (label) => setMobileExpanded(p => ({ ...p, [label]: !p[label] }))

  return (
    <header>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-[60px] h-[60px] bg-[#4A2C17] flex items-center justify-center rounded-sm shrink-0">
              <span className="text-white font-black text-lg tracking-tight">A</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[#4A2C17] font-black text-base leading-tight uppercase">{t.company1}</div>
              <div className="text-[#E07820] font-bold text-sm leading-tight uppercase">{t.company2}</div>
            </div>
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-2 text-[#4A2C17]">
              <div className="w-8 h-8 rounded-full border-2 border-[#4A2C17] flex items-center justify-center shrink-0">
                <FiPhone size={13} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider leading-none">{t.hotline}</div>
                <a href="https://wa.me/84986768378" className="font-bold text-sm leading-tight hover:text-[#E07820] transition-colors">
                  +84 986 768 378
                </a>
              </div>
            </div>

            {/* Language switcher */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden text-xs font-bold">
              <button
                onClick={() => setLang('vi')}
                className={`px-3 py-1.5 transition-colors ${lang === 'vi' ? 'bg-[#4A2C17] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >VI</button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors border-l border-gray-300 ${lang === 'en' ? 'bg-[#4A2C17] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >EN</button>
            </div>

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-gray-700">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Brown nav bar ────────────────────────────────────── */}
      <nav className={`bg-[#4A2C17] sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.35)]' : 'shadow-md'}`}>
        <div className="max-w-[1200px] mx-auto px-4">

          {/* ── Desktop ─────────────────────────────────── */}
          <div className="hidden lg:flex items-center">
            {t.nav.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => (link.children || link.mega) && handleEnter(link.label)}
                onMouseLeave={(link.children || link.mega) ? handleLeave : undefined}
              >
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `nav-link flex items-center gap-0.5 text-[13px] ${isActive ? 'bg-[#2E1A0D]' : ''}`
                  }
                >
                  {link.label}
                  {(link.children || link.mega) && <FiChevronDown size={12} className="ml-0.5 opacity-80" />}
                </NavLink>

                {/* ─ Regular dropdown ─ */}
                {link.children && dropdown === link.label && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-xl border-t-2 border-[#E07820] min-w-[220px] z-50"
                    onMouseEnter={() => handleEnter(link.label)}
                    onMouseLeave={handleLeave}
                  >
                    {link.children.map(child => (
                      <Link key={child.to} to={child.to}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#4A2C17] hover:text-white transition-colors border-b border-gray-100 last:border-0">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* ─ Mega menu (Products) ─ */}
                {link.mega && dropdown === link.label && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-2xl border-t-2 border-[#E07820] z-50"
                    style={{ minWidth: 680 }}
                    onMouseEnter={() => handleEnter(link.label)}
                    onMouseLeave={handleLeave}
                  >
                    <div className="grid grid-cols-4 divide-x divide-gray-100">
                      {link.mega.map(group => (
                        <div key={group.cat} className="p-4">
                          {/* Category heading → links to category overview */}
                          <Link to={group.to}
                            className="flex items-center gap-1.5 text-[#4A2C17] font-black text-xs uppercase tracking-wider mb-3 pb-2 border-b border-[#E07820]/30 hover:text-[#E07820] transition-colors">
                            {group.cat}
                            <FiChevronDown size={10} className="-rotate-90 opacity-60" />
                          </Link>
                          {/* Product list */}
                          {group.items.map(item => (
                            <Link key={item.to} to={item.to}
                              className="flex items-center gap-1.5 py-1.5 text-[13px] text-gray-600 hover:text-[#E07820] hover:translate-x-0.5 transition-all group">
                              <span className="w-1 h-1 rounded-full bg-[#E07820]/40 group-hover:bg-[#E07820] shrink-0 transition-colors" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    {/* Bottom bar: link to all products */}
                    <div className="bg-[#FBF5EF] px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {lang === 'vi' ? '16 sản phẩm xuất khẩu' : '16 export products'}
                      </span>
                      <Link to="/san-pham"
                        className="text-xs font-bold text-[#E07820] hover:underline flex items-center gap-1">
                        {lang === 'vi' ? 'Xem tất cả →' : 'View all →'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Mobile menu ──────────────────────────────── */}
          {open && (
            <div className="lg:hidden border-t border-[#2E1A0D]">
              {t.nav.map((link) => {
                const hasChildren = link.children || link.mega
                const isExpanded = mobileExpanded[link.label]
                return (
                  <div key={link.label}>
                    <div className="flex items-center justify-between border-b border-[#2E1A0D]">
                      <Link to={link.to}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-white hover:bg-[#2E1A0D]"
                        onClick={() => !hasChildren && setOpen(false)}>
                        {link.label}
                      </Link>
                      {hasChildren && (
                        <button onClick={() => toggleMobile(link.label)}
                          className="px-3 py-3 text-white hover:bg-[#2E1A0D]">
                          <FiChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Mobile regular children */}
                    {link.children && isExpanded && (
                      <div className="bg-[#2E1A0D]">
                        {link.children.map(child => (
                          <Link key={child.to} to={child.to}
                            className="block px-8 py-2.5 text-sm text-amber-100 hover:text-white border-b border-[#4A2C17] last:border-0"
                            onClick={() => setOpen(false)}>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Mobile mega (products) — grouped by category */}
                    {link.mega && isExpanded && (
                      <div className="bg-[#2E1A0D]">
                        {link.mega.map(group => (
                          <div key={group.cat}>
                            {/* Category sub-header */}
                            <Link to={group.to}
                              className="flex items-center gap-1.5 px-6 py-2 text-[#E07820] font-bold text-xs uppercase tracking-wider border-b border-[#3D1E0A] bg-[#251308]"
                              onClick={() => setOpen(false)}>
                              {group.cat}
                            </Link>
                            {/* Products under that category */}
                            {group.items.map(item => (
                              <Link key={item.to} to={item.to}
                                className="block px-10 py-2 text-sm text-amber-100 hover:text-white border-b border-[#3D1E0A] last:border-0"
                                onClick={() => setOpen(false)}>
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
