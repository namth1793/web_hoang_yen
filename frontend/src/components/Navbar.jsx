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
        ]
      },
      {
        label: 'SẢN PHẨM', to: '/san-pham',
        children: [
          { label: 'Quế', to: '/san-pham?category=que' },
          { label: 'Hồi', to: '/san-pham?category=hoi' },
          { label: 'Gừng', to: '/san-pham?category=gung' },
          { label: 'Nghệ', to: '/san-pham?category=nghe' },
        ]
      },
      {
        label: 'TIN TỨC', to: '/tin-tuc',
        children: [
          { label: 'Tin công ty', to: '/tin-tuc?category=tin-cong-ty' },
          { label: 'Tin thị trường', to: '/tin-tuc?category=thi-truong' },
          { label: 'Sự kiện', to: '/tin-tuc?category=su-kien' },
          { label: 'Tuyển dụng', to: '/tin-tuc?category=tuyen-dung' },
        ]
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
          { label: 'Company Overview', to: '/gioi-thieu' },
          { label: 'Vision & Mission', to: '/gioi-thieu#tam-nhin' },
          { label: 'Core Values', to: '/gioi-thieu#gia-tri' },
          { label: 'Supply Chain', to: '/gioi-thieu#chuoi-cung-ung' },
        ]
      },
      {
        label: 'PRODUCTS', to: '/san-pham',
        children: [
          { label: 'Cinnamon', to: '/san-pham?category=que' },
          { label: 'Star Anise', to: '/san-pham?category=hoi' },
          { label: 'Ginger', to: '/san-pham?category=gung' },
          { label: 'Turmeric', to: '/san-pham?category=nghe' },
        ]
      },
      {
        label: 'NEWS', to: '/tin-tuc',
        children: [
          { label: 'Company News', to: '/tin-tuc?category=tin-cong-ty' },
          { label: 'Market News', to: '/tin-tuc?category=thi-truong' },
          { label: 'Events', to: '/tin-tuc?category=su-kien' },
          { label: 'Job Opportunities', to: '/tin-tuc?category=tuyen-dung' },
        ]
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
  const [mobileDropdown, setMobileDropdown] = useState(null)
  const location = useLocation()
  const dropdownTimer = useRef(null)

  useEffect(() => { setOpen(false); setDropdown(null); setMobileDropdown(null) }, [location])

  const handleMouseEnter = (label) => {
    clearTimeout(dropdownTimer.current)
    setDropdown(label)
  }
  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => setDropdown(null), 150)
  }

  return (
    <header>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Logo + name */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-[60px] h-[60px] bg-[#4A2C17] flex items-center justify-center rounded-sm shrink-0">
              <span className="text-white font-black text-lg tracking-tight">A</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-[#4A2C17] font-black text-base leading-tight uppercase">{t.company1}</div>
              <div className="text-[#E07820] font-bold text-sm leading-tight uppercase">{t.company2}</div>
            </div>
          </Link>

          {/* Right: hotline + lang switcher */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-2 text-[#4A2C17]">
              <div className="w-8 h-8 rounded-full border-2 border-[#4A2C17] flex items-center justify-center shrink-0">
                <FiPhone size={13} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider leading-none">{t.hotline}</div>
                <a href="https://wa.me/84986768378" className="font-bold text-sm leading-tight hover:text-[#E07820] transition-colors">+84 986 768 378</a>
              </div>
            </div>

            {/* Language switcher */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden text-xs font-bold">
              <button
                onClick={() => setLang('vi')}
                className={`px-3 py-1.5 transition-colors ${lang === 'vi' ? 'bg-[#4A2C17] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors border-l border-gray-300 ${lang === 'en' ? 'bg-[#4A2C17] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                EN
              </button>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-gray-700">
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Brown navigation bar */}
      <nav className="bg-[#4A2C17] sticky top-0 z-50 shadow-md">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Desktop */}
          <div className="hidden lg:flex items-center">
            {t.nav.map((link) => (
              <div
                key={link.to + link.label}
                className="relative"
                onMouseEnter={() => link.children && handleMouseEnter(link.label)}
                onMouseLeave={link.children ? handleMouseLeave : undefined}
              >
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `nav-link flex items-center gap-0.5 text-[13px] ${isActive ? 'bg-[#2E1A0D]' : ''}`
                  }
                >
                  {link.label}
                  {link.children && <FiChevronDown size={12} className="ml-0.5 opacity-80" />}
                </NavLink>

                {link.children && dropdown === link.label && (
                  <div
                    className="absolute top-full left-0 bg-white shadow-xl border-t-2 border-[#E07820] min-w-[220px] z-50"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {link.children.map(child => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#4A2C17] hover:text-white transition-colors border-b border-gray-100 last:border-0"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu */}
          {open && (
            <div className="lg:hidden border-t border-[#2E1A0D]">
              {t.nav.map((link) => (
                <div key={link.to + link.label}>
                  <div className="flex items-center justify-between border-b border-[#2E1A0D]">
                    <Link
                      to={link.to}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white hover:bg-[#2E1A0D]"
                      onClick={() => !link.children && setOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <button
                        onClick={() => setMobileDropdown(mobileDropdown === link.label ? null : link.label)}
                        className="px-3 py-3 text-white hover:bg-[#2E1A0D]"
                      >
                        <FiChevronDown size={14} className={`transition-transform ${mobileDropdown === link.label ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {link.children && mobileDropdown === link.label && (
                    <div className="bg-[#2E1A0D]">
                      {link.children.map(child => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-8 py-2.5 text-sm text-amber-100 hover:text-white border-b border-[#4A2C17] last:border-0"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
