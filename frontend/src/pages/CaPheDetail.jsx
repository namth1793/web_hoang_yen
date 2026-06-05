import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { usePageContent } from '../hooks/usePageContent'

const products = [
  {
    name: 'Arabica',
    features: ['Hương thơm nhẹ', 'Vị chua thanh', 'Độ axit cao', 'Hàm lượng caffeine thấp hơn'],
    image: '/assets/coffee/z7769410562922_2870511915b461fbdff95a3f53198518.jpg',
  },
  {
    name: 'Robusta',
    features: ['Vị đậm', 'Hàm lượng caffeine cao', 'Độ đắng đặc trưng', 'Phù hợp espresso'],
    image: '/assets/coffee/z7769410670337_e1a6143ef9f8b7a9697e97e19e778089.jpg',
  },
]

const galleryImages = [
  '/assets/coffee/z7769410508842_d4d78016b2b4c0c1b457ead632b8a36f.jpg',
  '/assets/coffee/z7769410722314_152b90ff1f2aac6ebabb8d309ade9524.jpg',
  '/assets/coffee/z7769410829082_ae876ef6ce19e5cae48e7845ab0b7ddd.jpg',
  '/assets/coffee/z7769411546478_b6e85efa4db4abafc21c0f0d4eb5e94a.jpg',
  '/assets/coffee/z7769411621636_422c6bda540278f7da8b5a1cf104a553.jpg',
  '/assets/coffee/z7769411726182_75ee18e54c67657f3833f93afc0e8209.jpg',
  '/assets/coffee/z7769411808261_52226e8383f4cc88c5c63c3efac79adb.jpg',
  '/assets/coffee/z7769412505076_9a24551813e5d1efdf2e5f6f79406624.jpg',
  '/assets/coffee/z7769412588051_c3a2cfe3432b344b0800b7860c015d8f.jpg',
  '/assets/coffee/z7769412668626_9942cab7cc08443d78ebb0d8f098dc25.jpg',
  '/assets/coffee/z7769412717262_694280ca5f2a45afd44839b105a7e1bb.jpg',
  '/assets/coffee/z7769412827878_67cace81cc6c244bd90f15b16b189a7e.jpg',
]

const forms = ['Cà phê nhân xanh', 'Cà phê rang']
const processing = ['Natural (chế biến khô)', 'Washed (chế biến ướt)', 'Honey (chế biến mật ong)']
const advantages = ['Nguồn nguyên liệu ổn định', 'Chất lượng đồng đều', 'Phù hợp xuất khẩu', 'Trồng tại Khe Sanh – vùng khí hậu lý tưởng']

export default function CaPheDetail() {
  const { get } = usePageContent('ca-phe')
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">☕ Cà Phê Xuất Khẩu</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <span className="text-amber-200">Cà phê</span>
          </div>
        </div>
      </div>

      {/* Tổng quan */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading">{get('overview_title', 'Cà Phê Từ Khe Sanh')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {get('overview_text', 'Cà phê Trosie được trồng tại Khe Sanh – vùng có khí hậu lý tưởng cho chất lượng hạt cao cấp. Chúng tôi cung cấp cà phê nhân xanh và cà phê rang với các phương pháp chế biến đa dạng, phù hợp cho thị trường châu Á, châu Âu và Bắc Mỹ.')}
              </p>
              <Link to="/lien-he" className="btn-primary inline-flex items-center gap-2">
                Nhận báo giá ngay <FiArrowRight />
              </Link>
            </div>
            <div>
              <img
                src={get('hero_image', '/assets/coffee/z7769410508842_d4d78016b2b4c0c1b457ead632b8a36f.jpg')}
                alt="Cà phê Khe Sanh"
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: '320px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Arabica & Robusta */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">CHỦNG LOẠI CÀ PHÊ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex">
                <div className="w-48 shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[#6B2200] text-xl mb-3">{p.name}</h3>
                  <ul className="space-y-1.5">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCheck className="text-[#6B2200] shrink-0" size={14} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dạng sản phẩm + Phương pháp + Ưu điểm */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-black text-[#6B2200] text-lg mb-4 border-b-2 border-[#6B2200] pb-2">Dạng Sản Phẩm</h3>
              <ul className="space-y-2">
                {forms.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="w-2 h-2 bg-[#6B2200] rounded-full shrink-0"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-black text-[#6B2200] text-lg mb-4 border-b-2 border-[#6B2200] pb-2">Phương Pháp Chế Biến</h3>
              <ul className="space-y-2">
                {processing.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <span className="w-2 h-2 bg-[#6B2200] rounded-full shrink-0"></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-black text-[#6B2200] text-lg mb-4 border-b-2 border-[#6B2200] pb-2">Ưu Điểm</h3>
              <ul className="space-y-2">
                {advantages.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <FiCheck className="text-[#6B2200] shrink-0" size={14} /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">HÌNH ẢNH SẢN PHẨM</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryImages.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-lg shadow-sm">
                <img
                  src={src}
                  alt={`Cà phê Khe Sanh ${i + 1}`}
                  className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Quan tâm đến cà phê Khe Sanh?</h2>
          <p className="text-red-200 mb-6">Liên hệ để nhận mẫu và báo giá xuất khẩu</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/lien-he" className="bg-white text-[#6B2200] px-8 py-3 font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              Nhận báo giá <FiArrowRight />
            </Link>
            <a href="tel:+84961393370" className="border-2 border-white text-white px-8 py-3 font-bold hover:bg-white/10 transition-colors">
              📞 +84 961 393 370
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
