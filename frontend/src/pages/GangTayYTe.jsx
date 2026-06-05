import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { usePageContent } from '../hooks/usePageContent'

const products = [
  {
    name: 'Găng Tay Nitrile',
    emoji: '🔵',
    desc: 'Sản phẩm bán chạy nhất nhờ độ bền cao và không gây dị ứng.',
    image: 'https://images.unsplash.com/photo-1599412227383-b7d4751c8765?w=500&q=80',
    features: ['Không bột', 'Không latex', 'Chống hóa chất nhẹ', 'Độ bền cao'],
    uses: ['Bệnh viện', 'Nhà máy', 'Chế biến thực phẩm'],
  },
  {
    name: 'Găng Tay Latex',
    emoji: '🟡',
    desc: 'Độ co giãn cao, phù hợp công việc cần cảm giác tay thật.',
    image: 'https://images.unsplash.com/photo-1672258070318-0205bd2915de?w=500&q=80',
    features: ['Co giãn tốt', 'Ôm tay', 'Có bột / không bột', 'Cảm giác chân thực'],
    uses: ['Phẫu thuật', 'Nha khoa', 'Phòng thí nghiệm'],
  },
  {
    name: 'Găng Tay Vinyl',
    emoji: '🟢',
    desc: 'Giải pháp tiết kiệm chi phí cho nhu cầu sử dụng ngắn hạn.',
    image: 'https://images.unsplash.com/photo-1584819762556-68601d7f3a86?w=500&q=80',
    features: ['Giá rẻ', 'Dùng 1 lần', 'Phù hợp thực phẩm', 'Không gây kích ứng'],
    uses: ['Chế biến thực phẩm', 'Vệ sinh', 'Dịch vụ'],
  },
]

const specs = [
  { label: 'Size', value: 'S / M / L / XL' },
  { label: 'Đóng gói', value: '100 cái / hộp' },
  { label: 'MOQ', value: 'Linh hoạt theo yêu cầu' },
  { label: 'OEM', value: 'Có – in logo, bao bì riêng' },
  { label: 'Xuất xứ', value: 'Việt Nam' },
  { label: 'Chứng nhận', value: 'FDA, CE, ISO (cập nhật)' },
]

export default function GangTayYTe() {
  const { get } = usePageContent('gang-tay-y-te')
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">🧤 Găng Tay Y Tế</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <span className="text-amber-200">Găng tay y tế</span>
          </div>
        </div>
      </div>

      {/* Tổng quan */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading">Tổng Quan</h2>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {get('overview_text', 'Chúng tôi cung cấp các loại găng tay dùng trong y tế, thực phẩm và công nghiệp với chất lượng ổn định, phù hợp xuất khẩu sang thị trường EU, Mỹ, Trung Đông và châu Á.\n\nNguồn hàng kết nối trực tiếp nhà máy tại Việt Nam – đảm bảo giá cạnh tranh, số lượng ổn định và hỗ trợ OEM theo yêu cầu.')}
              </p>
              <Link to="/lien-he" className="btn-primary inline-flex items-center gap-2">
                Nhận báo giá ngay <FiArrowRight />
              </Link>
            </div>
            <div>
              <img
                src={get('hero_image', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=700&q=80')}
                alt="Găng tay y tế"
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: '320px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 loại găng tay */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">CÁC LOẠI GĂNG TAY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 text-3xl">{p.emoji}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[#6B2200] text-lg mb-2">{p.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                  <div className="mb-3">
                    <p className="font-semibold text-gray-800 text-xs uppercase mb-1">Đặc điểm</p>
                    <ul className="space-y-1">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FiCheck className="text-[#6B2200] shrink-0" size={13} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-xs uppercase mb-1">Ứng dụng</p>
                    <div className="flex flex-wrap gap-1">
                      {p.uses.map((u, j) => (
                        <span key={j} className="bg-[#6B2200]/10 text-[#6B2200] text-xs px-2 py-0.5 rounded">{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thông số kỹ thuật */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">THÔNG SỐ KỸ THUẬT</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specs.map((s, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">{s.label}</p>
                <p className="font-bold text-[#6B2200]">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Quan tâm đến găng tay y tế?</h2>
          <p className="text-red-200 mb-6">Liên hệ ngay để nhận báo giá và mẫu thử miễn phí</p>
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
