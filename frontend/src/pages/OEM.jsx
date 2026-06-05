import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'

const services = [
  { icon: '🏷️', title: 'In Logo', desc: 'In logo và thương hiệu của bạn lên sản phẩm và bao bì' },
  { icon: '📦', title: 'Thiết Kế Bao Bì', desc: 'Hỗ trợ thiết kế bao bì phù hợp thị trường mục tiêu' },
  { icon: '⚙️', title: 'Sản Xuất Theo Yêu Cầu', desc: 'Điều chỉnh thông số kỹ thuật, kích cỡ, chất liệu theo đặt hàng' },
]

const benefits = [
  { icon: '📈', title: 'Tăng giá trị thương hiệu', desc: 'Sản phẩm mang thương hiệu riêng tạo sự khác biệt trên thị trường' },
  { icon: '💰', title: 'Tối ưu chi phí', desc: 'Sản xuất tại Việt Nam với chi phí cạnh tranh, chất lượng ổn định' },
  { icon: '🌍', title: 'Phù hợp thị trường quốc tế', desc: 'Đáp ứng tiêu chuẩn và quy định nhập khẩu của từng thị trường' },
]

const steps = [
  { num: '01', title: 'Tư vấn', desc: 'Trao đổi yêu cầu sản phẩm, thị trường mục tiêu và số lượng' },
  { num: '02', title: 'Mẫu thử', desc: 'Sản xuất mẫu theo thông số kỹ thuật và thiết kế bao bì' },
  { num: '03', title: 'Xác nhận', desc: 'Khách hàng xem xét và phê duyệt mẫu trước khi sản xuất đại trà' },
  { num: '04', title: 'Sản xuất & Giao hàng', desc: 'Sản xuất theo đơn hàng, kiểm tra chất lượng và xuất khẩu' },
]

export default function OEM() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">🏷️ OEM / Thương Hiệu Riêng</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <span className="text-amber-200">OEM</span>
          </div>
        </div>
      </div>

      {/* Tổng quan */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading">Xây Dựng Thương Hiệu Riêng Cùng Trosie</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chúng tôi hỗ trợ khách hàng xây dựng <strong>thương hiệu riêng</strong> trên các sản phẩm găng tay y tế, cà phê và nông sản Việt Nam – từ thiết kế bao bì đến sản xuất theo yêu cầu.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Với năng lực sản xuất linh hoạt và mạng lưới nhà máy tại Việt Nam, chúng tôi có thể đáp ứng đơn hàng OEM từ quy mô nhỏ đến lớn.
              </p>
              <Link to="/lien-he" className="btn-primary inline-flex items-center gap-2">
                Thảo luận dự án OEM <FiArrowRight />
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1588317303094-d859b315ce70?w=700&q=80"
                alt="OEM sản xuất theo yêu cầu"
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: '320px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dịch vụ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">DỊCH VỤ OEM</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-lg border border-gray-200 text-center hover:border-[#6B2200] hover:shadow-md transition-all">
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-[#6B2200] text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lợi ích */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">LỢI ÍCH KHI HỢP TÁC OEM</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-4xl shrink-0">{b.icon}</div>
                <div>
                  <h3 className="font-bold text-[#6B2200] mb-1">{b.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">QUY TRÌNH HỢP TÁC</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#6B2200] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-black text-lg">{s.num}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sẵn sàng xây dựng thương hiệu riêng?</h2>
          <p className="text-red-200 mb-6">Liên hệ ngay để được tư vấn miễn phí về giải pháp OEM</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/lien-he" className="bg-white text-[#6B2200] px-8 py-3 font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              Tư vấn miễn phí <FiArrowRight />
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
