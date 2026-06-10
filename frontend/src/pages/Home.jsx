import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { FiArrowRight, FiCalendar, FiClock, FiGlobe, FiPackage, FiShield } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useLanguage } from '../context/LanguageContext'

const WA = 'https://wa.me/84986768378'

const CAT_DEFAULTS = {
  que:  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
  hoi:  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
  gung: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80',
  nghe: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80',
}
const WHY_DEFAULT = 'https://images.unsplash.com/photo-1542601098-8fc114e148e2?w=700&q=80'

const T = {
  vi: {
    hero_badge: 'XUẤT KHẨU GIA VỊ VIỆT NAM',
    hero_title: 'Chất Lượng Từ\nVùng Nguyên Liệu',
    hero_desc: 'ARTOCA chuyên xuất khẩu quế, hồi, gừng, nghệ chất lượng cao từ Việt Nam – đạt tiêu chuẩn ISO 22000, HACCP & FDA.',
    hero_cta1: 'Xem sản phẩm',
    hero_cta2: 'Liên hệ ngay',
    stats: [
      { val: 50, suffix: '+', label: 'Nhà máy đối tác' },
      { val: 20, suffix: '+', label: 'Quốc gia nhập khẩu' },
      { val: 4,  suffix: '',  label: 'Dòng gia vị' },
      { val: 24, suffix: 'h', label: 'Phản hồi báo giá' },
    ],
    prod_tag: 'SẢN PHẨM XUẤT KHẨU',
    prod_title: 'Bộ Sưu Tập Gia Vị',
    prod_sub: 'Bốn dòng gia vị chủ lực – nguồn gốc rõ ràng, chất lượng ổn định cho mọi thị trường',
    products: [
      { name: 'Quế',  en: 'Cinnamon',   slug: 'que',  img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80', desc: 'Quế Văn Yên nổi tiếng với tinh dầu cinnamaldehyde cao, hương nồng nàn' },
      { name: 'Hồi',  en: 'Star Anise', slug: 'hoi',  img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', desc: 'Hoa hồi Lạng Sơn hình ngôi sao hoàn chỉnh, tinh dầu anethole cao' },
      { name: 'Gừng', en: 'Ginger',     slug: 'gung', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80', desc: 'Gừng tươi và sấy khô chất lượng cao, gingerol đậm đặc' },
      { name: 'Nghệ', en: 'Turmeric',   slug: 'nghe', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', desc: 'Nghệ giàu curcumin, màu sắc tươi sáng, ưa chuộng trong dược phẩm' },
    ],
    explore: 'Khám phá',
    why_tag: 'CAM KẾT CHẤT LƯỢNG',
    why_title: 'Tại Sao Chọn ARTOCA?',
    why_quote: '"Mỗi lô hàng là một cam kết – từ nguyên liệu đến cảng đích."',
    why: [
      { icon: FiShield,  title: 'Truy xuất nguồn gốc 100%', desc: 'Hồ sơ đầy đủ từng lô hàng: nông trại, chế biến, kiểm nghiệm, xuất khẩu.' },
      { icon: FiPackage, title: 'Kiểm soát chất lượng nghiêm ngặt', desc: 'QC trực tiếp tại nhà máy – loại bỏ tạp chất, kiểm tra độ ẩm và tinh dầu.' },
      { icon: FiGlobe,   title: 'Mạng lưới 50+ nhà máy', desc: 'Chỉ làm việc với đối tác đã được kiểm tra, đảm bảo nguồn cung ổn định.' },
      { icon: FiShield,  title: 'Chứng nhận quốc tế', desc: 'ISO 22000, HACCP, FDA – đáp ứng mọi yêu cầu của thị trường nhập khẩu.' },
      { icon: FiClock,   title: 'Phản hồi trong 24 giờ', desc: 'Báo giá nhanh, hỗ trợ kỹ thuật và tư vấn xuất nhập khẩu tận tình.' },
    ],
    supply_tag: 'QUY TRÌNH',
    supply_title: 'Chuỗi Cung Ứng Minh Bạch',
    supply_sub: 'Kiểm soát toàn bộ 7 giai đoạn từ vùng trồng đến cảng đích',
    supply_steps: [
      { n: '01', name: 'Nguồn Nguyên Liệu', detail: 'Vùng trồng được chứng nhận' },
      { n: '02', name: 'Thu Hoạch', detail: 'Đúng thời điểm, đúng tiêu chuẩn' },
      { n: '03', name: 'Chế Biến', detail: 'Sấy, sàng, phân loại' },
      { n: '04', name: 'Kiểm Tra CL', detail: 'Lab kiểm nghiệm độc lập' },
      { n: '05', name: 'Đóng Gói', detail: 'Bao bì xuất khẩu chuyên dụng' },
      { n: '06', name: 'Lưu Kho', detail: 'Kho đạt chuẩn khí hậu' },
      { n: '07', name: 'Xuất Khẩu', detail: 'Cảng đích toàn cầu' },
    ],
    learn_more: 'Tìm hiểu thêm',
    news_tag: 'CẬP NHẬT',
    news_title: 'Tin Tức & Thị Trường',
    view_all: 'Xem tất cả',
    cert_tag: 'ĐỐI TÁC TIN CẬY',
    cert_title: 'Chứng Nhận & Tiêu Chuẩn',
    cert_sub: 'Sản phẩm ARTOCA đáp ứng các tiêu chuẩn chất lượng quốc tế',
    certs: [
      { name: 'ISO 22000', desc: 'Hệ thống quản lý an toàn thực phẩm quốc tế' },
      { name: 'HACCP',     desc: 'Phân tích mối nguy và kiểm soát điểm tới hạn' },
      { name: 'FDA',       desc: 'Đạt chuẩn Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ' },
    ],
    cta_title: 'Sẵn Sàng Hợp Tác?',
    cta_desc: 'Liên hệ ngay để nhận báo giá chi tiết và tư vấn từ đội ngũ ARTOCA',
    cta_btn: 'Gửi yêu cầu hợp tác',
    cta_wa: 'Chat qua WhatsApp',
  },
  en: {
    hero_badge: 'VIETNAMESE SPICE EXPORTER',
    hero_title: 'Quality From\nThe Source',
    hero_desc: 'ARTOCA exports premium Vietnamese cinnamon, star anise, ginger & turmeric – certified ISO 22000, HACCP & FDA.',
    hero_cta1: 'View Products',
    hero_cta2: 'Contact Us',
    stats: [
      { val: 50, suffix: '+', label: 'Partner Factories' },
      { val: 20, suffix: '+', label: 'Import Countries' },
      { val: 4,  suffix: '',  label: 'Spice Lines' },
      { val: 24, suffix: 'h', label: 'Quote Response' },
    ],
    prod_tag: 'EXPORT PRODUCTS',
    prod_title: 'Our Spice Portfolio',
    prod_sub: 'Four core spice lines – traceable origin, consistent quality for every market',
    products: [
      { name: 'Cinnamon',   en: 'Quế',  slug: 'que',  img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80', desc: 'Van Yen cinnamon famous for high cinnamaldehyde oil content and rich aroma' },
      { name: 'Star Anise', en: 'Hồi',  slug: 'hoi',  img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80', desc: 'Lang Son star anise with complete star shape and high anethole oil content' },
      { name: 'Ginger',     en: 'Gừng', slug: 'gung', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&q=80', desc: 'Premium fresh and dried ginger with concentrated gingerol' },
      { name: 'Turmeric',   en: 'Nghệ', slug: 'nghe', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80', desc: 'High curcumin turmeric with vibrant color, valued in pharma & food' },
    ],
    explore: 'Explore',
    why_tag: 'OUR COMMITMENT',
    why_title: 'Why Choose ARTOCA?',
    why_quote: '"Every shipment is a commitment – from the farm to the destination port."',
    why: [
      { icon: FiShield,  title: '100% Traceability', desc: 'Full documentation per batch: farm, processing, lab testing, export.' },
      { icon: FiPackage, title: 'Rigorous Quality Control', desc: 'On-site QC at factories – eliminating impurities, checking moisture and oil levels.' },
      { icon: FiGlobe,   title: '50+ Factory Network', desc: 'Only vetted partners, ensuring consistent supply and quality standards.' },
      { icon: FiShield,  title: 'International Certifications', desc: 'ISO 22000, HACCP, FDA – meeting all requirements of demanding markets.' },
      { icon: FiClock,   title: '24-Hour Response', desc: 'Fast quotes, technical support and trade consultation on demand.' },
    ],
    supply_tag: 'PROCESS',
    supply_title: 'Transparent Supply Chain',
    supply_sub: 'Full control across 7 stages from growing region to destination port',
    supply_steps: [
      { n: '01', name: 'Raw Material', detail: 'Certified growing regions' },
      { n: '02', name: 'Harvest', detail: 'Right timing, right standards' },
      { n: '03', name: 'Processing', detail: 'Drying, sieving, grading' },
      { n: '04', name: 'QC Testing', detail: 'Independent lab analysis' },
      { n: '05', name: 'Packaging', detail: 'Export-grade packaging' },
      { n: '06', name: 'Storage', detail: 'Climate-controlled warehouse' },
      { n: '07', name: 'Export', detail: 'Global destination ports' },
    ],
    learn_more: 'Learn More',
    news_tag: 'LATEST UPDATES',
    news_title: 'News & Market Updates',
    view_all: 'View All',
    cert_tag: 'TRUSTED PARTNER',
    cert_title: 'Certifications & Standards',
    cert_sub: 'ARTOCA products meet leading international quality standards',
    certs: [
      { name: 'ISO 22000', desc: 'International Food Safety Management System' },
      { name: 'HACCP',     desc: 'Hazard Analysis and Critical Control Points' },
      { name: 'FDA',       desc: 'US Food and Drug Administration compliant' },
    ],
    cta_title: 'Ready to Partner?',
    cta_desc: 'Contact us now for a detailed quote and consultation from the ARTOCA team',
    cta_btn: 'Send Inquiry',
    cta_wa: 'Chat on WhatsApp',
  },
}

const BANNERS = [
  { image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1600&q=80' },
  { image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80' },
  { image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&q=80' },
]

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })
}

function Counter({ target, suffix }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.unobserve(el)
      let cur = 0
      const steps = 48
      const inc = target / steps
      const id = setInterval(() => {
        cur = Math.min(cur + inc, target)
        setVal(Math.round(cur))
        if (cur >= target) clearInterval(id)
      }, 1300 / steps)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

export default function Home() {
  const { lang } = useLanguage()
  const t = T[lang]
  const [banners, setBanners] = useState(BANNERS)
  const [news, setNews] = useState([])
  const [siteImgs, setSiteImgs] = useState({})

  useReveal()

  useEffect(() => {
    axios.get('/api/banners').then(r => r.data?.length && setBanners(r.data)).catch(() => {})
    axios.get('/api/news?limit=3').then(r => setNews(r.data)).catch(() => {})
    axios.get('/api/content/home').then(r => setSiteImgs(r.data)).catch(() => {})
  }, [])

  const catImg = (slug) => siteImgs[`cat_${slug}_img`] || CAT_DEFAULTS[slug]
  const whyImg = siteImgs['why_img'] || WHY_DEFAULT

  const fmtDate = d => new Date(d).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative" style={{ height: '92vh', minHeight: 480 }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation loop
          className="w-full h-full"
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <img src={b.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Overlay text (outside Swiper slides so it animates once) */}
        <div className="absolute inset-0 z-10 flex items-center pointer-events-none">
          <div className="max-w-[1200px] w-full mx-auto px-6 md:px-10">
            <div className="max-w-[640px] pointer-events-auto">
              <span className="hero-badge inline-block bg-[#E07820] text-white text-[11px] font-bold px-3 py-1 mb-5 uppercase tracking-[0.15em]">
                {t.hero_badge}
              </span>
              <h1 className="hero-title text-white text-4xl md:text-6xl mb-5 whitespace-pre-line leading-tight">
                {t.hero_title}
              </h1>
              <p className="hero-desc text-gray-200 text-base md:text-lg max-w-[520px] mb-8">
                {t.hero_desc}
              </p>
              <div className="hero-cta flex flex-wrap gap-3">
                <Link to="/san-pham" className="bg-[#E07820] hover:bg-[#B85E0A] text-white font-bold px-7 py-3.5 transition-colors inline-flex items-center gap-2 text-sm rounded-sm">
                  {t.hero_cta1} <FiArrowRight />
                </Link>
                <Link to="/lien-he" className="border-2 border-white hover:bg-white/15 text-white font-bold px-7 py-3.5 transition-colors text-sm rounded-sm">
                  {t.hero_cta2}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-60">
          <div className="w-[1px] h-9 bg-white animate-pulse" />
          <span className="text-white text-[10px] uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <section className="bg-[#3D1E0A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {t.stats.map((s, i) => (
              <div
                key={i}
                className={`fade-up d${i + 1} text-center px-6 py-8 ${i < 3 ? 'border-r border-white/10' : ''}`}
              >
                <div className="text-4xl font-black text-[#E07820] leading-none mb-1 tabular-nums">
                  <Counter target={s.val} suffix={s.suffix} />
                </div>
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRODUCTS ══════════════ */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-tag fade-up">{t.prod_tag}</span>
            <h2 className="fade-up d1 text-[#3D1E0A] text-3xl md:text-4xl font-black mb-3">{t.prod_title}</h2>
            <p className="fade-up d2 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{t.prod_sub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.products.map((p, i) => (
              <Link
                key={p.slug}
                to={`/san-pham?category=${p.slug}`}
                className={`fade-up d${i + 1} group relative overflow-hidden block`}
                style={{ height: 340 }}
              >
                <img src={catImg(p.slug)} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-[#E07820] text-[11px] font-bold uppercase tracking-widest mb-1">{p.en}</span>
                  <h3 className="text-white text-2xl font-black mb-2">{p.name}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-white text-xs font-bold border border-white/40 px-3 py-1.5 rounded-sm group-hover:bg-[#E07820] group-hover:border-[#E07820] transition-all w-fit">
                    {t.explore} <FiArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHY ARTOCA ══════════════ */}
      <section className="py-20 bg-[#FBF5EF]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left: heading + quote + image */}
            <div className="fade-left">
              <span className="section-tag">{t.why_tag}</span>
              <h2 className="text-[#3D1E0A] text-3xl md:text-4xl font-black mb-6 leading-tight">{t.why_title}</h2>
              <blockquote className="border-l-4 border-[#E07820] pl-5 mb-8 italic text-[#4A2C17] text-base leading-relaxed font-medium">
                {t.why_quote}
              </blockquote>
              <div className="relative overflow-hidden rounded" style={{ height: 220 }}>
                <img
                  src={whyImg}
                  alt="Spice quality control"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#4A2C17]/20" />
              </div>
            </div>

            {/* Right: features */}
            <div className="space-y-5">
              {t.why.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className={`fade-right d${i + 1} flex gap-4 bg-white p-5 rounded border border-gray-100 hover:border-[#E07820]/40 hover:shadow-md transition-all`}>
                    <div className="shrink-0 w-11 h-11 rounded-full bg-[#E07820]/10 flex items-center justify-center">
                      <Icon size={18} className="text-[#E07820]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3D1E0A] text-sm mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SUPPLY CHAIN ══════════════ */}
      <section className="py-20 bg-[#3D1E0A]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-14">
            <span className="fade-up section-tag text-[#E07820]/80">{t.supply_tag}</span>
            <h2 className="fade-up d1 text-white text-3xl md:text-4xl font-black mb-3">{t.supply_title}</h2>
            <p className="fade-up d2 text-gray-400 text-sm">{t.supply_sub}</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[38px] left-0 right-0 h-[2px] bg-[#E07820]/25 mx-12" />

            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {t.supply_steps.map((step, i) => (
                <div key={i} className={`fade-up d${Math.min(i + 1, 5)} flex flex-col items-center text-center`}>
                  <div className="relative z-10 w-[52px] h-[52px] rounded-full border-2 border-[#E07820] bg-[#3D1E0A] flex items-center justify-center mb-3 text-[#E07820] font-black text-sm">
                    {step.n}
                  </div>
                  <p className="text-white text-xs font-bold mb-1 leading-snug">{step.name}</p>
                  <p className="text-gray-500 text-[11px] leading-snug">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/gioi-thieu#chuoi-cung-ung"
              className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-7 py-2.5 text-sm font-semibold transition-colors rounded-sm">
              {t.learn_more} <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ NEWS ══════════════ */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div className="fade-left">
              <span className="section-tag">{t.news_tag}</span>
              <h2 className="text-[#3D1E0A] text-3xl font-black leading-tight">{t.news_title}</h2>
            </div>
            <Link to="/tin-tuc" className="fade-right text-[#E07820] text-sm font-bold hover:underline inline-flex items-center gap-1 pb-1">
              {t.view_all} <FiArrowRight size={13} />
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded" style={{ height: 280 }} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <Link key={item.id} to={`/tin-tuc/${item.slug}`}
                  className={`fade-up d${i + 1} group block bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E07820]/30 transition-all duration-300`}>
                  <div className="overflow-hidden" style={{ height: 188 }}>
                    <img src={item.image} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#FBF5EF] text-[#E07820] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {lang === 'vi' ? 'Tin tức' : 'News'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <FiCalendar size={10} />{fmtDate(item.created_at)}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#3D1E0A] text-sm leading-snug line-clamp-2 group-hover:text-[#E07820] transition-colors mb-2">
                      {lang === 'en' && item.title_en ? item.title_en : item.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                      {lang === 'en' && item.summary_en ? item.summary_en : item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ CERTIFICATIONS ══════════════ */}
      <section className="py-16 bg-[#FBF5EF]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <span className="fade-up section-tag">{t.cert_tag}</span>
            <h2 className="fade-up d1 text-[#3D1E0A] text-2xl font-black mb-2">{t.cert_title}</h2>
            <p className="fade-up d2 text-gray-500 text-sm">{t.cert_sub}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {t.certs.map((c, i) => (
              <div key={c.name} className={`fade-up d${i + 1} bg-white border border-gray-200 hover:border-[#E07820] hover:shadow-md transition-all p-8 text-center min-w-[200px] flex-1 max-w-[260px]`}>
                <div className="w-14 h-14 rounded-full bg-[#E07820]/10 flex items-center justify-center mx-auto mb-4">
                  <FiShield size={24} className="text-[#E07820]" />
                </div>
                <h4 className="font-black text-[#3D1E0A] text-xl mb-2">{c.name}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #4A2C17 0%, #2E1A0D 60%, #1A0E07 100%)' }}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E07820 0, #E07820 1px, transparent 0, transparent 50%)', backgroundSize: '16px 16px' }} />

        <div className="relative max-w-[1200px] mx-auto px-4 text-center">
          <span className="fade-up section-tag text-[#E07820]/80 block">{lang === 'vi' ? 'HỢP TÁC KINH DOANH' : 'BUSINESS PARTNERSHIP'}</span>
          <h2 className="fade-up d1 text-white font-black text-3xl md:text-5xl mb-4 leading-tight">{t.cta_title}</h2>
          <p className="fade-up d2 text-gray-300 mb-9 text-base max-w-lg mx-auto">{t.cta_desc}</p>
          <div className="fade-up d3 flex flex-wrap justify-center gap-4">
            <Link to="/lien-he"
              className="bg-[#E07820] hover:bg-[#B85E0A] text-white font-bold px-8 py-4 transition-colors inline-flex items-center gap-2 text-sm rounded-sm">
              {t.cta_btn} <FiArrowRight />
            </Link>
            <a href={WA} target="_blank" rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#1da857] text-white font-bold px-8 py-4 transition-colors inline-flex items-center gap-2 text-sm rounded-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.549 4.107 1.51 5.845L.057 23.704l5.999-1.572A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.644-.518-5.148-1.418l-.369-.219-3.821 1.001.981-3.776-.24-.388A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              {t.cta_wa}
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
