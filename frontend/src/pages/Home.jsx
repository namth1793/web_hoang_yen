import axios from 'axios'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiCalendar, FiCheck } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useLanguage } from '../context/LanguageContext'

const T = {
  vi: {
    hero_title: 'Gia Vị Việt Nam – Hương Vị Toàn Cầu',
    hero_desc: 'ARTOCA chuyên xuất khẩu các loại gia vị chất lượng cao từ Việt Nam: quế, hồi, gừng, nghệ – đáp ứng tiêu chuẩn quốc tế ISO 22000, HACCP & FDA.',
    cta_products: 'Xem sản phẩm',
    cta_contact: 'Liên hệ ngay',
    intro: 'Công ty TNHH XNK Artoca – đối tác tin cậy trong xuất khẩu gia vị Việt Nam ra thị trường quốc tế. Chất lượng đồng đều, chuỗi cung ứng minh bạch, phản hồi trong 24 giờ.',
    products_title: 'SẢN PHẨM CỦA CHÚNG TÔI',
    products_sub: 'Gia vị Việt Nam chất lượng cao, đạt tiêu chuẩn xuất khẩu quốc tế',
    products: [
      { name: 'Quế', en: 'Cinnamon', desc: 'Quế Việt Nam nổi tiếng với hàm lượng tinh dầu cao, hương thơm nồng nàn từ vùng Văn Yên', img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80', to: '/san-pham/que' },
      { name: 'Hồi', en: 'Star Anise', desc: 'Hoa hồi hình ngôi sao đẹp, hương thơm đặc trưng, hàm lượng tinh dầu cao từ Lạng Sơn', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', to: '/san-pham/hoi' },
      { name: 'Gừng', en: 'Ginger', desc: 'Gừng tươi và gừng sấy Việt Nam, chất lượng cao, nguồn gốc rõ ràng phù hợp xuất khẩu', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80', to: '/san-pham/gung' },
      { name: 'Nghệ', en: 'Turmeric', desc: 'Nghệ Việt Nam giàu curcumin, màu sắc tươi tắn, được ưa chuộng trong dược phẩm và thực phẩm', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80', to: '/san-pham/nghe' },
    ],
    why_title: 'TẠI SAO CHỌN ARTOCA',
    why: [
      { icon: '🔍', title: 'Truy xuất nguồn gốc', desc: 'Mỗi lô hàng đều có đầy đủ hồ sơ truy xuất từ nông trại đến cảng xuất khẩu.' },
      { icon: '🏭', title: 'Kiểm soát chất lượng', desc: 'Chuyên gia QC giám sát từ nguyên liệu đầu vào đến thành phẩm, đảm bảo chất lượng đồng đều.' },
      { icon: '📦', title: 'Chuỗi cung ứng minh bạch', desc: 'Sàng lọc từ hơn 50 nhà máy, chỉ làm việc với đối tác uy tín và được kiểm chứng.' },
      { icon: '🌍', title: 'Tiêu chuẩn quốc tế', desc: 'Sản phẩm đạt ISO 22000, HACCP, FDA – sẵn sàng cho mọi thị trường nhập khẩu khó tính.' },
      { icon: '⚡', title: 'Phản hồi trong 24 giờ', desc: 'Đội ngũ tư vấn xuất khẩu luôn sẵn sàng hỗ trợ báo giá và giải đáp thắc mắc nhanh chóng.' },
    ],
    supply_title: 'CHUỖI CUNG ỨNG',
    supply_sub: '7 bước kiểm soát hoàn toàn từ nông trại đến cảng đích',
    supply_steps: ['Nguồn Nguyên Liệu', 'Làm Sạch', 'Sản Xuất', 'Kiểm Tra CL', 'Đóng Gói', 'Lưu Kho', 'Xuất Khẩu'],
    news_title: 'TIN TỨC',
    cert_title: 'CHỨNG NHẬN & TIÊU CHUẨN',
    cert_sub: 'Sản phẩm ARTOCA đạt các chứng nhận quốc tế hàng đầu',
    cta_title: 'Sẵn sàng hợp tác xuất khẩu?',
    cta_desc: 'Liên hệ ngay để nhận báo giá và tư vấn từ đội ngũ ARTOCA',
    cta_btn: 'Gửi yêu cầu hợp tác',
    cta_wa: 'WhatsApp ngay',
    view_detail: 'Xem chi tiết',
    view_all_news: 'Xem tất cả tin tức',
  },
  en: {
    hero_title: 'Vietnamese Spices – A World of Flavor',
    hero_desc: 'ARTOCA specializes in exporting premium Vietnamese spices: cinnamon, star anise, ginger, turmeric – meeting international standards ISO 22000, HACCP & FDA.',
    cta_products: 'View Products',
    cta_contact: 'Contact Us',
    intro: 'ARTOCA Import Export Co., Ltd – your trusted partner for exporting Vietnamese spices to global markets. Consistent quality, transparent supply chain, 24-hour response.',
    products_title: 'OUR PRODUCTS',
    products_sub: 'Premium Vietnamese spices meeting international export standards',
    products: [
      { name: 'Cinnamon', en: 'Quế', desc: 'Vietnamese cinnamon renowned for high essential oil content and rich aroma from Van Yen region', img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80', to: '/san-pham/que' },
      { name: 'Star Anise', en: 'Hồi', desc: 'Beautiful star-shaped anise with distinctive aroma and high essential oil content from Lang Son', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', to: '/san-pham/hoi' },
      { name: 'Ginger', en: 'Gừng', desc: 'Fresh and dried Vietnamese ginger, premium quality with clear traceability for export', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80', to: '/san-pham/gung' },
      { name: 'Turmeric', en: 'Nghệ', desc: 'Vietnamese turmeric rich in curcumin, vibrant color, highly valued in pharmaceutical and food industries', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80', to: '/san-pham/nghe' },
    ],
    why_title: 'WHY CHOOSE ARTOCA',
    why: [
      { icon: '🔍', title: 'Full Traceability', desc: 'Every shipment has complete documentation tracing from farm to port of export.' },
      { icon: '🏭', title: 'Quality Control', desc: 'QC experts supervise from raw material intake to finished products, ensuring consistent quality.' },
      { icon: '📦', title: 'Transparent Supply Chain', desc: 'Screened from 50+ factories, working only with vetted and reputable partners.' },
      { icon: '🌍', title: 'International Standards', desc: 'Products certified ISO 22000, HACCP, FDA – ready for the most demanding import markets.' },
      { icon: '⚡', title: '24-Hour Response', desc: 'Our export team is always ready to provide quotes and answer inquiries quickly.' },
    ],
    supply_title: 'SUPPLY CHAIN',
    supply_sub: '7-step fully controlled process from farm to destination port',
    supply_steps: ['Raw Material', 'Cleaning', 'Production', 'QC Check', 'Packaging', 'Storage', 'Export'],
    news_title: 'NEWS',
    cert_title: 'CERTIFICATIONS & STANDARDS',
    cert_sub: 'ARTOCA products meet leading international certifications',
    cta_title: 'Ready to Partner with ARTOCA?',
    cta_desc: 'Contact us now for a quote and consultation from the ARTOCA team',
    cta_btn: 'Send Inquiry',
    cta_wa: 'WhatsApp Now',
    view_detail: 'View Details',
    view_all_news: 'View All News',
  },
}

const bannersFallback = [
  { image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1600&q=80', link: '/san-pham' },
  { image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80', link: '/san-pham/que' },
  { image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&q=80', link: '/san-pham/hoi' },
]

export default function Home() {
  const { lang } = useLanguage()
  const t = T[lang]
  const [banners, setBanners] = useState(bannersFallback)
  const [news, setNews] = useState([])

  useEffect(() => {
    axios.get('/api/banners').then(r => r.data.length && setBanners(r.data)).catch(() => {})
    axios.get('/api/news?limit=3').then(r => setNews(r.data)).catch(() => {})
  }, [])

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="bg-white">
      {/* ===== HERO SLIDER ===== */}
      <section className="w-full relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full"
          style={{ height: '520px' }}
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <img src={b.image} alt={`Banner ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/55"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="inline-block bg-[#E07820]/90 text-white text-xs font-bold px-3 py-1 mb-4 uppercase tracking-wider">ARTOCA IMPORT EXPORT</div>
                  <h1 className="hero-title text-white text-3xl md:text-5xl mb-4 max-w-4xl">{t.hero_title}</h1>
                  <p className="hero-desc text-gray-200 text-sm md:text-base max-w-2xl mb-8">{t.hero_desc}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/san-pham" className="bg-[#E07820] hover:bg-[#B85E0A] text-white font-bold px-8 py-3 transition-colors inline-flex items-center gap-2">
                      {t.cta_products} <FiArrowRight />
                    </Link>
                    <Link to="/lien-he" className="bg-white/15 border-2 border-white hover:bg-white/25 text-white font-bold px-8 py-3 transition-colors">
                      {t.cta_contact}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ===== INTRO STRIP ===== */}
      <section className="bg-[#4A2C17] py-6">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">{t.intro}</p>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-[#4A2C17] font-black text-2xl uppercase mb-2">{t.products_title}</h2>
          <p className="text-gray-500 text-sm">{t.products_sub}</p>
          <div className="w-16 h-1 bg-[#E07820] mx-auto mt-3"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.products.map((p) => (
            <Link key={p.to} to={p.to}
              className="group block overflow-hidden border border-gray-200 hover:border-[#E07820] hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden" style={{ height: '210px' }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#E07820] text-white text-xs font-bold px-2 py-0.5 uppercase">{p.en}</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-black text-[#4A2C17] text-lg mb-1">{p.name}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{p.desc}</p>
                <span className="text-[#E07820] text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t.view_detail} <FiArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== WHY ARTOCA ===== */}
      <section className="bg-[#FBF5EF] py-14">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-[#4A2C17] font-black text-2xl uppercase mb-2">{t.why_title}</h2>
            <div className="w-16 h-1 bg-[#E07820] mx-auto mt-3"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {t.why.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 p-5 text-center hover:border-[#E07820] hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-[#4A2C17] text-sm mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUPPLY CHAIN ===== */}
      <section className="py-14 bg-[#4A2C17]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-white font-black text-2xl uppercase mb-2">{t.supply_title}</h2>
            <p className="text-gray-300 text-sm">{t.supply_sub}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-0">
            {t.supply_steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#E07820] flex items-center justify-center text-white font-black text-lg mb-2">{i + 1}</div>
                  <span className="text-white text-xs font-semibold text-center w-20">{step}</span>
                </div>
                {i < t.supply_steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-[#E07820]/50 mb-7 mx-1"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/gioi-thieu#chuoi-cung-ung" className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors">
              {lang === 'vi' ? 'Tìm hiểu thêm' : 'Learn More'} <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section className="max-w-[1200px] mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[#4A2C17] font-black text-2xl uppercase mb-1">{t.news_title}</h2>
            <div className="w-12 h-1 bg-[#E07820]"></div>
          </div>
          <Link to="/tin-tuc" className="text-[#E07820] text-sm font-semibold hover:underline inline-flex items-center gap-1">
            {t.view_all_news} <FiArrowRight size={13} />
          </Link>
        </div>
        {news.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 animate-pulse h-72 rounded"></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map(item => (
              <Link key={item.id} to={`/tin-tuc/${item.slug}`}
                className="group bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E07820]/30 transition-all duration-300">
                <div className="overflow-hidden h-44">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <FiCalendar size={11} />{formatDate(item.created_at)}
                  </div>
                  <h3 className="font-bold text-gray-800 leading-snug group-hover:text-[#4A2C17] transition-colors line-clamp-2 text-sm mb-2">
                    {lang === 'en' && item.title_en ? item.title_en : item.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2">
                    {lang === 'en' && item.summary_en ? item.summary_en : item.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== CERTIFICATIONS ===== */}
      <section className="bg-[#FBF5EF] py-12">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-[#4A2C17] font-black text-2xl uppercase mb-2">{t.cert_title}</h2>
          <p className="text-gray-500 text-sm mb-8">{t.cert_sub}</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['ISO 22000', 'HACCP', 'FDA'].map(cert => (
              <div key={cert} className="bg-white border-2 border-[#E07820] px-8 py-5 text-center min-w-[140px] hover:bg-[#E07820] hover:text-white transition-all group">
                <div className="text-2xl mb-1 group-hover:grayscale-0">✅</div>
                <div className="font-black text-[#4A2C17] group-hover:text-white text-lg tracking-tight">{cert}</div>
                <div className="text-xs text-gray-500 group-hover:text-white/80 mt-0.5">Certified</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#E07820] py-12">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="text-white font-black text-2xl mb-3">{t.cta_title}</h2>
          <p className="text-orange-100 mb-7 text-sm">{t.cta_desc}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/lien-he" className="bg-[#4A2C17] hover:bg-[#2E1A0D] text-white font-bold px-8 py-3 transition-colors inline-flex items-center gap-2">
              {t.cta_btn} <FiArrowRight />
            </Link>
            <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#1da857] text-white font-bold px-8 py-3 transition-colors inline-flex items-center gap-2">
              {t.cta_wa}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
