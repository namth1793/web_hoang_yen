import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const steps = [
  {
    icon: '🌱',
    num: '01',
    title: 'Nguồn Nguyên Liệu',
    desc: 'Kết nối trực tiếp với nhà máy và nông trại tại Việt Nam – đảm bảo nguồn cung ổn định và minh bạch.',
  },
  {
    icon: '🏭',
    num: '02',
    title: 'Sản Xuất',
    desc: 'Sản xuất theo tiêu chuẩn quốc tế, đáp ứng yêu cầu kỹ thuật của từng thị trường nhập khẩu.',
  },
  {
    icon: '🔍',
    num: '03',
    title: 'Kiểm Tra Chất Lượng',
    desc: 'Kiểm tra chất lượng tại nhiều giai đoạn – từ nguyên liệu đầu vào đến sản phẩm hoàn chỉnh.',
  },
  {
    icon: '📦',
    num: '04',
    title: 'Đóng Gói',
    desc: 'Đóng gói đúng quy cách, phù hợp yêu cầu lưu trữ và vận chuyển quốc tế.',
  },
  {
    icon: '🚢',
    num: '05',
    title: 'Xuất Khẩu',
    desc: 'Xử lý toàn bộ thủ tục hải quan, C/O, kiểm dịch và giao hàng đến cảng đích.',
  },
]

const features = [
  { icon: '📋', title: 'Minh bạch thông tin', desc: 'Theo dõi trạng thái đơn hàng từ sản xuất đến giao hàng' },
  { icon: '⚡', title: 'Linh hoạt số lượng', desc: 'Đáp ứng cả đơn hàng nhỏ thử nghiệm và hợp đồng dài hạn' },
  { icon: '🤝', title: 'Hỗ trợ thủ tục', desc: 'Hỗ trợ C/O, phytosanitary certificate và các giấy tờ xuất khẩu' },
  { icon: '🔒', title: 'Đảm bảo chất lượng', desc: 'Cam kết chất lượng sản phẩm đúng theo mẫu đã duyệt' },
]

export default function ChuoiCungUng() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">📦 Chuỗi Cung Ứng</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <span className="text-amber-200">Chuỗi cung ứng</span>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="section-heading center inline-block mb-4">Quy Trình Xuất Khẩu Chuẩn</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Trosie Global quản lý toàn bộ chuỗi cung ứng từ nguồn nguyên liệu đến giao hàng tại cảng đích, đảm bảo chất lượng và tiến độ tại từng khâu.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-8 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#6B2200]/20 hidden md:block"></div>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-[#6B2200] rounded-full flex items-center justify-center shrink-0 relative z-10">
                    <span className="text-2xl">{s.icon}</span>
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-5 hover:border-[#6B2200] hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black text-[#6B2200] bg-[#6B2200]/10 px-2 py-0.5 rounded">{s.num}</span>
                      <h3 className="font-black text-gray-800 text-lg">{s.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">CAM KẾT CỦA CHÚNG TÔI</h2>
          <div className="grid md:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:border-[#6B2200] hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-[#6B2200] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Muốn biết thêm về quy trình xuất khẩu?</h2>
          <p className="text-red-200 mb-6">Liên hệ để được tư vấn chi tiết về chuỗi cung ứng phù hợp</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/lien-he" className="bg-white text-[#6B2200] px-8 py-3 font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              Liên hệ ngay <FiArrowRight />
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
