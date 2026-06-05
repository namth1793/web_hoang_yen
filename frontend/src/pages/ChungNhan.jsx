import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const certs = [
  {
    icon: '🏅',
    name: 'ISO',
    fullName: 'ISO 9001 / ISO 13485',
    desc: 'Tiêu chuẩn quản lý chất lượng quốc tế. ISO 13485 áp dụng riêng cho thiết bị y tế và găng tay y tế.',
    status: 'Cập nhật',
    color: '#005bac',
  },
  {
    icon: '🔬',
    name: 'HACCP',
    fullName: 'HACCP',
    desc: 'Hệ thống phân tích mối nguy và kiểm soát điểm tới hạn – áp dụng cho sản phẩm nông sản và thực phẩm xuất khẩu.',
    status: 'Cập nhật',
    color: '#007a3d',
  },
  {
    icon: '🇺🇸',
    name: 'FDA',
    fullName: 'FDA Registration',
    desc: 'Đăng ký với Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ – yêu cầu bắt buộc để xuất khẩu vào thị trường Mỹ.',
    status: 'Cập nhật',
    color: '#c41e3a',
  },
  {
    icon: '🇪🇺',
    name: 'CE',
    fullName: 'CE Marking',
    desc: 'Dấu chứng nhận châu Âu – yêu cầu bắt buộc cho găng tay y tế xuất khẩu vào thị trường EU.',
    status: 'Cập nhật',
    color: '#003087',
  },
]

const markets = [
  { flag: '🇺🇸', name: 'Hoa Kỳ', req: 'FDA Registration, ASTM standards' },
  { flag: '🇪🇺', name: 'Liên minh Châu Âu', req: 'CE Marking, MDR compliance' },
  { flag: '🇯🇵', name: 'Nhật Bản', req: 'PMDA, JIS standards' },
  { flag: '🇰🇷', name: 'Hàn Quốc', req: 'MFDS approval' },
  { flag: '🇦🇺', name: 'Úc', req: 'TGA registration' },
  { flag: '🌏', name: 'Đông Nam Á', req: 'Theo quy định từng nước' },
]

export default function ChungNhan() {
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">📜 Chứng Nhận</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <span className="text-amber-200">Chứng nhận</span>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="section-heading center inline-block mb-4">Chứng Nhận & Tiêu Chuẩn</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trosie Global cam kết đáp ứng các tiêu chuẩn chứng nhận quốc tế để sản phẩm được chấp nhận tại các thị trường khó tính nhất trên thế giới.
          </p>
        </div>
      </section>

      {/* Chứng nhận */}
      <section className="py-4 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {certs.map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow flex gap-5 items-start">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-3xl"
                  style={{ backgroundColor: c.color + '18' }}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-xl" style={{ color: c.color }}>{c.name}</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2 font-semibold">{c.fullName}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-5 text-center">
            <p className="text-amber-800 text-sm">
              <strong>Lưu ý:</strong> Thông tin chứng nhận sẽ được cập nhật khi có giấy chứng nhận chính thức. Liên hệ để biết trạng thái cụ thể của từng chứng nhận.
            </p>
          </div>
        </div>
      </section>

      {/* Yêu cầu theo thị trường */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">YÊU CẦU CHỨNG NHẬN THEO THỊ TRƯỜNG</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {markets.map((m, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 hover:border-[#6B2200] hover:shadow-md transition-all">
                <span className="text-3xl">{m.flag}</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{m.name}</h3>
                  <p className="text-gray-500 text-xs">{m.req}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Cần tư vấn về chứng nhận xuất khẩu?</h2>
          <p className="text-red-200 mb-6">Đội ngũ Trosie Global sẽ hỗ trợ bạn đáp ứng đúng yêu cầu thị trường</p>
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
