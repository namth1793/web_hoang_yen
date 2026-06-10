import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const GALLERY_DEFAULTS = [
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=700&q=80',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80',
  'https://images.unsplash.com/photo-1542601906897-ecd92d0d52f5?w=700&q=80',
  'https://images.unsplash.com/photo-1543565077-c1c5dcaab1bf?w=700&q=80',
]
const OVERVIEW_DEFAULT = 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=700&q=80'

const T = {
  vi: {
    page_title: 'Giới Thiệu Công Ty',
    breadcrumb: 'Giới thiệu',
    /* Overview */
    overview_title: 'CÔNG TY TNHH XNK ARTOCA',
    overview_body: [
      'Công ty TNHH XNK Artoca là doanh nghiệp xuất khẩu uy tín các sản phẩm gia vị chất lượng cao từ Việt Nam ra thị trường quốc tế, bao gồm quế, hồi, tiêu, điều, gừng, nghệ,…',
      'Với định hướng phát triển dựa trên các giá trị cốt lõi về chất lượng, uy tín và tính bền vững, ARTOCA cam kết trở thành đối tác tin cậy, góp phần đưa những gia vị tinh túy của Việt Nam vươn xa trên thị trường quốc tế.',
    ],
    overview_list: [
      'Xuất khẩu gia vị chất lượng cao từ Việt Nam',
      'Chuỗi cung ứng kiểm soát hoàn toàn và minh bạch',
      'Đạt tiêu chuẩn ISO 22000, HACCP, FDA',
      'Sàng lọc từ hơn 50 nhà máy và nông trại uy tín',
      'Phản hồi trong 24 giờ làm việc',
    ],
    /* Vision & Mission */
    vm_title: 'TẦM NHÌN & SỨ MỆNH',
    vision_title: 'TẦM NHÌN',
    vision_body: 'ARTOCA hướng tới trở thành thương hiệu hàng đầu và đáng tin cậy trong lĩnh vực xuất khẩu nông sản Việt Nam, được các đối tác quốc tế tin tưởng và lựa chọn. Với định hướng phát triển bền vững, chúng tôi mong muốn xây dựng cầu nối vững chắc đưa tinh hoa nông sản Việt vươn ra thế giới, góp phần nâng tầm vị thế nông sản Việt Nam trên thị trường toàn cầu.',
    mission_title: 'SỨ MỆNH',
    mission_body: 'ARTOCA mang sứ mệnh kết nối nông sản Việt Nam với thị trường thế giới thông qua việc cung cấp các sản phẩm chất lượng cao, an toàn, bền vững và đạt tiêu chuẩn quốc tế. Chúng tôi cam kết đồng hành cùng người nông dân, đối tác và khách hàng trong việc tạo dựng giá trị lâu dài, đồng thời lan tỏa hương vị đích thực của Việt Nam đến toàn cầu.',
    /* Core values */
    values_title: 'GIÁ TRỊ CỐT LÕI',
    values: [
      { letter: 'A', title: 'Authenticity', desc: 'Cam kết truy suất nguồn gốc trong từng sản phẩm Việt Nam.' },
      { letter: 'R', title: 'Reliability', desc: 'Xây dựng niềm tin bền vững bằng uy tín, chất lượng và trách nhiệm trong mọi cam kết.' },
      { letter: 'T', title: 'Transparency', desc: 'Minh bạch trong quy trình, nguồn gốc và hợp tác nhằm tạo dựng quan hệ lâu dài với đối tác toàn cầu.' },
      { letter: 'O', title: 'Optimization', desc: 'Không ngừng tối ưu chất lượng, dịch vụ và hiệu quả vận hành để nâng cao giá trị cho khách hàng.' },
      { letter: 'C', title: 'Commitment', desc: 'Cam kết đồng hành cùng khách hàng, đối tác và người nông dân trên hành trình phát triển bền vững.' },
      { letter: 'A', title: 'Adaptability', desc: 'Chủ động đổi mới và linh hoạt thích ứng với nhu cầu không ngừng thay đổi của thị trường quốc tế.' },
    ],
    /* Differentiators */
    diff_title: 'ĐIỀU KHIẾN CHÚNG TÔI KHÁC BIỆT',
    diff: [
      { icon: '🌾', title: 'Với người nông dân', desc: 'Chúng tôi hỗ trợ người nông dân phát triển nghề bền vững, tạo công ăn việc làm và thu nhập ổn định dựa trên nền tảng trung thực.' },
      { icon: '🤝', title: 'Với người mua hàng', desc: 'Chúng tôi không chỉ bán hàng – chúng tôi cung cấp giải pháp và bảo hành sản phẩm đến tận tay người mua hàng.' },
      { icon: '🏛️', title: 'Ba trụ cột', desc: 'Minh bạch – Sáng tạo – Hiệu quả là kim chỉ nam cho mọi hoạt động của ARTOCA.' },
    ],
    /* Certifications */
    cert_title: 'CHỨNG NHẬN VÀ TIÊU CHUẨN',
    certs: [
      { name: 'ISO 22000', desc: 'Hệ thống quản lý an toàn thực phẩm quốc tế' },
      { name: 'HACCP', desc: 'Phân tích mối nguy và kiểm soát điểm tới hạn' },
      { name: 'FDA', desc: 'Đạt tiêu chuẩn Cục Quản lý Thực phẩm và Dược phẩm Mỹ' },
    ],
    /* Supply chain */
    supply_title: 'CHUỖI CUNG ỨNG',
    supply_sub: 'ARTOCA vận hành chuỗi cung ứng được kiểm soát hoàn toàn và minh bạch',
    supply_steps: [
      { num: '01', title: 'Nguồn Nguyên Liệu', desc: 'Sàng lọc từ hơn 50 nhà máy và nông trại tại Việt Nam, chỉ hợp tác với những đơn vị lớn và uy tín nhất – đảm bảo nguồn cung ổn định và minh bạch.' },
      { num: '02', title: 'Làm Sạch', desc: 'Làm sạch nguyên liệu bằng dây chuyền công nghệ hiện đại, máy thổi bụi, hút lông thú – hạn chế tối đa tạp chất, đáp ứng tiêu chuẩn xuất khẩu và an toàn thực phẩm.' },
      { num: '03', title: 'Sản Xuất', desc: 'Sản xuất theo tiêu chuẩn quốc tế, đáp ứng yêu cầu kỹ thuật của từng thị trường nhập khẩu và tuân thủ cam kết với khách hàng.' },
      { num: '04', title: 'Kiểm Tra Chất Lượng', desc: 'Luôn có chuyên gia kiểm tra, kiểm soát chất lượng từ khâu nguyên liệu đầu vào đến suốt quá trình chế biến, bảo quản và ra sản phẩm hoàn chỉnh.' },
      { num: '05', title: 'Đóng Gói', desc: 'Đóng gói đúng quy cách, phù hợp yêu cầu lưu trữ và vận chuyển quốc tế. Tính toán, sắp xếp hàng hóa trong container khoa học để tối ưu chi phí vận chuyển.' },
      { num: '06', title: 'Lưu Kho', desc: 'Bảo quản sản phẩm trong hệ thống kho thông thoáng, tránh mưa, nắng, ẩm mốc và côn trùng để đảm bảo chất lượng và an toàn sản phẩm.' },
      { num: '07', title: 'Xuất Khẩu', desc: 'Xử lý toàn bộ thủ tục hải quan, C/O, kiểm dịch và giao hàng đến cảng đích một cách chuyên nghiệp. Thường xuyên cập nhật tiến độ đến khách hàng.' },
    ],
    cta_title: 'Sẵn sàng hợp tác với ARTOCA?',
    cta_desc: 'Liên hệ ngay để được tư vấn và nhận báo giá sản phẩm',
    cta_btn: 'Liên hệ ngay',
    cta_phone: 'WhatsApp ngay',
  },
  en: {
    page_title: 'About Our Company',
    breadcrumb: 'About Us',
    overview_title: 'ARTOCA IMPORT EXPORT CO., LTD',
    overview_body: [
      'ARTOCA Import Export Co., Ltd is a trusted exporter of Vietnamese spice products. Our diverse portfolio includes premium cassia cinnamon, star anise, pepper, cashew, ginger and turmeric.',
      'Based on the principles of quality, reliability, and sustainability, Artoca is committed to being a trusted partner, bringing Vietnam\'s precious spices closer to the global market.',
    ],
    overview_list: [
      'Premium Vietnamese spice export',
      'Fully controlled and transparent supply chain',
      'Certified ISO 22000, HACCP, FDA',
      'Screened from 50+ reputable factories and farms',
      '24-hour response time',
    ],
    vm_title: 'VISION & MISSION',
    vision_title: 'COMPANY VISION',
    vision_body: 'ARTOCA Company aims to become a leading and trusted brand in Vietnam\'s agricultural export industry, recognized and chosen by international partners. With a sustainable development orientation, we aspire to build a strong bridge that brings the essence of Vietnamese agriculture to the world, contributing to elevating Vietnam\'s agricultural position on the global stage.',
    mission_title: 'COMPANY MISSION',
    mission_body: 'Artoca\'s mission is to connect Vietnamese agricultural products with the world by providing internationally certified, high-quality, safe, and sustainable products. We are committed to accompanying farmers, partners, and customers in creating long-term value and spreading the authentic taste of Vietnam globally.',
    values_title: 'CORE VALUES',
    values: [
      { letter: 'A', title: 'Authenticity', desc: 'We are committed to ensuring traceability and preserving the authentic value of every Vietnamese product we deliver.' },
      { letter: 'R', title: 'Reliability', desc: 'We build long-term trust through credibility, consistent quality, and responsibility in every commitment.' },
      { letter: 'T', title: 'Transparency', desc: 'We maintain transparency in our processes, product origins, and partnerships to foster sustainable relationships with global partners.' },
      { letter: 'O', title: 'Optimization', desc: 'We continuously optimize product quality, services, and operational efficiency to maximize value for our customers.' },
      { letter: 'C', title: 'Commitment', desc: 'We are dedicated to growing alongside our customers, partners, and farmers in pursuit of sustainable development.' },
      { letter: 'A', title: 'Adaptability', desc: 'We proactively innovate and remain flexible in responding to the ever-changing demands of international markets.' },
    ],
    diff_title: 'WHAT MAKES US DIFFERENT',
    diff: [
      { icon: '🌾', title: 'For Farmers', desc: 'We support the development of sustainable livelihoods by creating stable employment and income opportunities, built on a foundation of integrity and honesty.' },
      { icon: '🤝', title: 'For Customers', desc: 'We do more than simply supply products — we provide complete solutions and ensure product assurance right through to the end user.' },
      { icon: '🏛️', title: 'Three Pillars', desc: 'Transparency, Innovation, and Efficiency serve as the guiding principles for all activities at ARTOCA.' },
    ],
    cert_title: 'CERTIFICATIONS AND STANDARDS',
    certs: [
      { name: 'ISO 22000', desc: 'International food safety management system' },
      { name: 'HACCP', desc: 'Hazard Analysis and Critical Control Points' },
      { name: 'FDA', desc: 'U.S. Food and Drug Administration certified' },
    ],
    supply_title: 'SUPPLY CHAIN',
    supply_sub: 'ARTOCA operates a fully controlled and transparent supply chain',
    supply_steps: [
      { num: '01', title: 'Raw Material Sourcing', desc: 'We carefully select from over 50 factories and farms across Vietnam, partnering only with reputable and large-scale suppliers to ensure a stable, transparent, and reliable source of raw materials.' },
      { num: '02', title: 'Cleaning', desc: 'Raw materials and products are thoroughly cleaned using modern processing lines, including dust blowers and lint/pet hair removal systems, effectively minimizing impurities.' },
      { num: '03', title: 'Production', desc: 'Our products are manufactured in compliance with international standards, meeting the technical requirements of each import market while strictly adhering to customer specifications.' },
      { num: '04', title: 'Quality Control', desc: 'A dedicated team of experts supervises and controls quality at every stage — from raw material intake to processing, storage, and final products — ensuring consistent and uniform quality.' },
      { num: '05', title: 'Packaging', desc: 'Products are packaged according to international shipping standards, optimized for storage and transportation. Cargo is systematically arranged in containers to maximize space utilization.' },
      { num: '06', title: 'Storage', desc: 'Products are stored in well-ventilated warehouse systems, protected from rain, direct sunlight, humidity, mold, and insects to ensure product quality throughout the storage period.' },
      { num: '07', title: 'Export & Logistics', desc: 'We handle all export procedures including customs clearance, Certificates of Origin (C/O), phytosanitary certification, and professional delivery to destination ports.' },
    ],
    cta_title: 'Ready to Partner with ARTOCA?',
    cta_desc: 'Contact us now for consultation and product quotation',
    cta_btn: 'Contact Us',
    cta_phone: 'WhatsApp Now',
  },
}

export default function GioiThieu() {
  const { lang } = useLanguage()
  const t = T[lang]
  const [aboutImgs, setAboutImgs] = useState({})

  useEffect(() => {
    axios.get('/api/content/about').then(r => setAboutImgs(r.data)).catch(() => {})
  }, [])

  const galleryImg = (i) => aboutImgs[`gallery_${i}`] || GALLERY_DEFAULTS[i - 1]
  const overviewImg = aboutImgs['overview_img'] || OVERVIEW_DEFAULT

  return (
    <div>
      {/* Page header */}
      <div className="bg-[#4A2C17] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">{t.page_title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">{lang === 'vi' ? 'Trang chủ' : 'Home'}</Link>
            <span>/</span>
            <span className="text-[#E07820]">{t.breadcrumb}</span>
          </div>
        </div>
      </div>

      {/* ===== OVERVIEW ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-1 bg-[#E07820] mb-4"></div>
              <h2 className="text-2xl font-black text-[#4A2C17] mb-5 leading-tight">{t.overview_title}</h2>
              {t.overview_body.map((p, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm">{p}</p>
              ))}
              <ul className="space-y-2.5 mt-6">
                {t.overview_list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <FiCheck className="text-[#E07820] shrink-0" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src={overviewImg}
                alt="ARTOCA Spices"
                className="rounded-lg shadow-xl w-full object-cover"
                style={{ height: '420px' }}
              />
              <div className="absolute -bottom-4 -left-4 bg-[#E07820] text-white p-4 shadow-lg hidden md:block">
                <div className="font-black text-2xl">50+</div>
                <div className="text-xs">{lang === 'vi' ? 'Nhà máy đối tác' : 'Partner factories'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className="py-14 bg-[#FBF5EF]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
            <h2 className="text-2xl font-black text-[#4A2C17] uppercase">
              {lang === 'vi' ? 'HÌNH ẢNH HOẠT ĐỘNG' : 'OUR ACTIVITIES'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { n: 1, span: 'md:col-span-2', h: 'h-56 md:h-72', cap: lang === 'vi' ? 'Bộ sưu tập gia vị xuất khẩu' : 'Premium spice collection' },
              { n: 2, span: '',              h: 'h-56 md:h-72', cap: lang === 'vi' ? 'Nghệ Tây Nguyên' : 'Highland Turmeric' },
              { n: 3, span: '',              h: 'h-56',          cap: lang === 'vi' ? 'Quế Văn Yên' : 'Van Yen Cinnamon' },
              { n: 4, span: '',              h: 'h-56',          cap: lang === 'vi' ? 'Hồi Lạng Sơn' : 'Lang Son Star Anise' },
              { n: 5, span: 'md:col-span-2', h: 'h-56',          cap: lang === 'vi' ? 'Kiểm soát chất lượng' : 'Quality control process' },
            ].map((item, i) => (
              <div key={i} className={`${item.span} relative group overflow-hidden rounded-lg`}>
                <img
                  src={galleryImg(item.n)}
                  alt={item.cap}
                  className={`w-full ${item.h} object-cover group-hover:scale-105 transition-transform duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-semibold">{item.cap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISION & MISSION ===== */}
      <section id="tam-nhin" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
            <h2 className="text-2xl font-black text-[#4A2C17] uppercase">{t.vm_title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border-t-4 border-[#4A2C17] shadow-sm">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="text-xl font-black text-[#4A2C17] mb-4">{t.vision_title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t.vision_body}</p>
            </div>
            <div className="bg-white rounded-lg p-8 border-t-4 border-[#E07820] shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-[#4A2C17] mb-4">{t.mission_title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t.mission_body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section id="gia-tri" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
            <h2 className="text-2xl font-black text-[#4A2C17] uppercase">{t.values_title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {t.values.map((v, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 text-center hover:border-[#E07820] hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-full bg-[#4A2C17] group-hover:bg-[#E07820] flex items-center justify-center mx-auto mb-3 transition-colors">
                  <span className="text-white font-black text-xl">{v.letter}</span>
                </div>
                <h4 className="font-bold text-[#4A2C17] text-sm mb-2">{v.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIFFERENTIATORS ===== */}
      <section className="py-16 bg-[#4A2C17]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
            <h2 className="text-2xl font-black text-white uppercase">{t.diff_title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.diff.map((item, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-lg p-7 text-center hover:bg-white/15 transition-colors">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CERTIFICATIONS ===== */}
      <section className="py-16 bg-[#FBF5EF]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
            <h2 className="text-2xl font-black text-[#4A2C17] uppercase">{t.cert_title}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {t.certs.map((cert, i) => (
              <div key={i} className="bg-white border-2 border-[#E07820] rounded-lg p-8 text-center min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">✅</div>
                <div className="font-black text-[#4A2C17] text-2xl mb-1">{cert.name}</div>
                <div className="text-gray-500 text-xs">{cert.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUPPLY CHAIN ===== */}
      <section id="chuoi-cung-ung" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
            <h2 className="text-2xl font-black text-[#4A2C17] uppercase">{t.supply_title}</h2>
            <p className="text-gray-500 text-sm mt-2">{t.supply_sub}</p>
          </div>
          <div className="space-y-4">
            {t.supply_steps.map((step, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white border border-gray-200 rounded-lg hover:border-[#E07820] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-full bg-[#4A2C17] group-hover:bg-[#E07820] flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-white font-black text-sm">{step.num}</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#4A2C17] mb-1">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 bg-[#E07820]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">{t.cta_title}</h2>
          <p className="text-orange-100 mb-6 text-sm">{t.cta_desc}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/lien-he" className="bg-[#4A2C17] text-white px-8 py-3 font-bold hover:bg-[#2E1A0D] transition-colors inline-flex items-center gap-2">
              {t.cta_btn} <FiArrowRight />
            </Link>
            <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
              className="bg-[#25D366] text-white px-8 py-3 font-bold hover:bg-[#1da857] transition-colors">
              {t.cta_phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
