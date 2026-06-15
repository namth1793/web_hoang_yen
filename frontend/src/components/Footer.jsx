import { Link } from 'react-router-dom'
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const T = {
  vi: {
    tagline: 'Công ty TNHH XNK Artoca – xuất khẩu gia vị chất lượng cao từ Việt Nam ra thị trường quốc tế.',
    products: 'SẢN PHẨM',
    company: 'CÔNG TY',
    contact_lbl: 'LIÊN HỆ',
    products_list: [
      ['Quế', '/san-pham?category=que'],
      ['Hồi', '/san-pham?category=hoi'],
      ['Gừng', '/san-pham?category=gung'],
      ['Nghệ', '/san-pham?category=nghe'],
    ],
    company_list: [
      ['Giới Thiệu', '/gioi-thieu'],
      ['Sản Phẩm', '/san-pham'],
      ['Tin Tức', '/tin-tuc'],
      ['Liên Hệ', '/lien-he'],
    ],
    addr_hq: 'Số 41, ngõ 190 đường Hoàng Mai, Hà Nội',
    addr_factory: 'TT Mậu A, Lào Cai, Việt Nam',
    hours: 'T2–T7: 8:00–17:30',
    copyright: 'Copyright © 2024. ARTOCA Import Export Co., Ltd. All Rights Reserved.',
    follow: 'Theo dõi chúng tôi',
  },
  en: {
    tagline: 'ARTOCA Import Export Co., Ltd – exporter of premium Vietnamese spices to international markets.',
    products: 'PRODUCTS',
    company: 'COMPANY',
    contact_lbl: 'CONTACT',
    products_list: [
      ['Cinnamon', '/san-pham?category=que'],
      ['Star Anise', '/san-pham?category=hoi'],
      ['Ginger', '/san-pham?category=gung'],
      ['Turmeric', '/san-pham?category=nghe'],
    ],
    company_list: [
      ['About Us', '/gioi-thieu'],
      ['Products', '/san-pham'],
      ['News', '/tin-tuc'],
      ['Contact', '/lien-he'],
    ],
    addr_hq: 'No.41, alley 190, Hoang Mai road, Hanoi, Vietnam',
    addr_factory: 'Mau A town, Lao Cai Province, Vietnam',
    hours: 'Mon–Sat: 8:00am–5:30pm',
    copyright: 'Copyright © 2024. ARTOCA Import Export Co., Ltd. All Rights Reserved.',
    follow: 'Follow us',
  },
}

export default function Footer() {
  const { lang } = useLanguage()
  const t = T[lang]

  return (
    <footer>
      <div className="bg-[#2C1810] text-gray-300">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Col 1: Logo + info */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-[#E07820] flex items-center justify-center rounded-sm">
                  <span className="text-white font-black text-lg">A</span>
                </div>
                <div>
                  <div className="text-white font-black text-sm leading-tight">ARTOCA</div>
                  <div className="text-[#E07820] text-xs leading-tight">IMPORT EXPORT</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{t.tagline}</p>
              <p className="text-xs text-gray-400 mb-2">{t.follow}</p>
              <div className="flex gap-2">
                <a href="https://wa.me/84986768378" target="_blank" rel="noreferrer"
                  className="w-8 h-8 bg-[#25D366] rounded flex items-center justify-center hover:opacity-80 transition-opacity">
                  <FaWhatsapp size={14} color="white" />
                </a>
                <a href="https://www.linkedin.com/company/117713969/" target="_blank" rel="noreferrer"
                  className="w-8 h-8 bg-[#0a66c2] rounded flex items-center justify-center hover:opacity-80 transition-opacity">
                  <FaLinkedin size={14} color="white" />
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=artocavn@gmail.com" target="_blank" rel="noreferrer"
                  className="w-8 h-8 bg-[#E07820] rounded flex items-center justify-center hover:opacity-80 transition-opacity">
                  <FiMail size={14} color="white" />
                </a>
              </div>
            </div>

            {/* Col 2: Products */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm uppercase">{t.products}</h4>
              <ul className="space-y-1.5 text-xs">
                {t.products_list.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-400 hover:text-[#E07820] transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm uppercase">{t.company}</h4>
              <ul className="space-y-1.5 text-xs">
                {t.company_list.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-400 hover:text-[#E07820] transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className="text-white font-bold mb-3 text-sm uppercase">{t.contact_lbl}</h4>

              {/* Map embed — click to open Google Maps */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=41+ng%C3%B5+190+Ho%C3%A0ng+Mai+H%C3%A0+N%E1%BB%99i+Vi%E1%BB%87t+Nam"
                target="_blank" rel="noreferrer"
                className="block relative rounded overflow-hidden mb-3 group"
                style={{ height: '110px' }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=Ho%C3%A0ng+Mai%2C+H%C3%A0+N%E1%BB%99i%2C+Vi%E1%BB%87t+Nam&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="110" style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                  loading="lazy" title="ARTOCA map"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold bg-[#E07820] px-2 py-1 rounded">
                    {lang === 'vi' ? 'Xem bản đồ' : 'View map'}
                  </span>
                </div>
              </a>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <FiPhone className="text-[#E07820] shrink-0" size={12} />
                  <a href="https://wa.me/84986768378" className="hover:text-white transition-colors">+84 986 768 378</a>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-[#E07820] shrink-0" size={12} />
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=artocavn@gmail.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">artocavn@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-[#E07820] shrink-0" size={12} />
                  <span>{t.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1A0E07] py-3">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">{t.copyright}</p>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E07820] border border-gray-700 hover:border-[#E07820] px-3 py-1 rounded transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
