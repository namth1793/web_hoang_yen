import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck, FiSend } from 'react-icons/fi'
import axios from 'axios'
import { usePageContent } from '../hooks/usePageContent'

const products = [
  {
    name: 'Hoa Nguyên Bông',
    emoji: '🌹',
    image: 'https://images.unsplash.com/photo-1607500105153-2da3f8c83050?w=500&q=80',
    desc: 'Giữ nguyên hình dáng và màu sắc hoàn hảo sau sấy lạnh. Lựa chọn hàng đầu cho quà tặng cao cấp.',
    features: ['Giữ nguyên hình dáng', 'Màu sắc tự nhiên', 'Phù hợp quà tặng', 'Bảo quản lâu dài'],
    uses: ['Quà tặng cao cấp', 'Hộp hoa lưu niệm'],
  },
  {
    name: 'Nụ Hoa',
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1572890323975-5f4d74b7d6cb?w=500&q=80',
    desc: 'Kích thước nhỏ gọn, phù hợp pha trà hoa và trang trí sản phẩm mỹ phẩm tự nhiên.',
    features: ['Nhỏ gọn, tiện dùng', 'Phù hợp pha trà', 'Hương thơm giữ nguyên', 'Không hóa chất'],
    uses: ['Trà hoa hồng', 'Mỹ phẩm tự nhiên'],
  },
  {
    name: 'Cánh Hoa',
    emoji: '🌺',
    image: 'https://images.unsplash.com/photo-1731625342747-e16747098b60?w=500&q=80',
    desc: 'Cánh hoa rời dùng để trang trí và làm nguyên liệu sản xuất mỹ phẩm, bánh kẹo cao cấp.',
    features: ['Trang trí linh hoạt', 'Nguyên liệu mỹ phẩm', 'Kết cấu mềm tự nhiên', 'Màu đa dạng'],
    uses: ['Trang trí', 'Mỹ phẩm & bánh kẹo'],
  },
]

const applications = [
  { icon: '🎁', label: 'Quà tặng cao cấp' },
  { icon: '🏠', label: 'Trang trí nội thất' },
  { icon: '☕', label: 'Trà hoa hồng' },
  { icon: '💄', label: 'Mỹ phẩm tự nhiên' },
]

const whyUs = [
  'Sản phẩm đẹp, chất lượng cao',
  'Nguồn hàng ổn định quanh năm',
  'Hỗ trợ OEM / thương hiệu riêng',
  'Giá cạnh tranh trực tiếp từ nhà vườn',
]

const oemFeatures = [
  { icon: '🏷️', label: 'In logo thương hiệu', desc: 'Hộp, túi, nhãn dán theo yêu cầu' },
  { icon: '📦', label: 'Thiết kế bao bì', desc: 'Hộp quà, túi zip, hộp luxury' },
  { icon: '🏭', label: 'Sản xuất theo yêu cầu', desc: 'MOQ linh hoạt, giao hàng đúng hạn' },
]

export default function HoaHongSayLanh() {
  const { get } = usePageContent('hoa-hong-say-lanh')
  const [form, setForm] = useState({ name: '', company: '', country: '', product_type: '', quantity: '', email: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await axios.post('/api/contacts', {
        name: form.name,
        company: form.company,
        email: form.email,
        subject: `Hoa hồng sấy lạnh – ${form.product_type}`,
        message: `Quốc gia: ${form.country}\nLoại sản phẩm: ${form.product_type}\nSố lượng: ${form.quantity}`,
      })
      setSent(true)
      setForm({ name: '', company: '', country: '', product_type: '', quantity: '', email: '' })
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    }
    setSending(false)
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">🌹 Hoa Hồng Sấy Lạnh</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <Link to="/san-pham" className="hover:text-white">Sản phẩm</Link>
            <span>/</span>
            <span className="text-amber-200">Hoa hồng sấy lạnh</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4">
                {get('hero_title', 'Hoa hồng sấy lạnh cao cấp –')}
                <br />
                <span className="text-[#6B2200]">Giữ nguyên vẻ đẹp tự nhiên, xuất khẩu toàn cầu</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {get('hero_desc', 'Sản phẩm hoa hồng sấy bằng công nghệ hiện đại, giữ nguyên màu sắc và hình dáng, phù hợp quà tặng, decor và OEM. Xuất xứ Việt Nam, chất lượng quốc tế.')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#lead-form" className="bg-[#c41e3a] text-white px-6 py-3 font-bold hover:bg-red-700 transition-colors inline-flex items-center gap-2">
                  Nhận báo giá <FiArrowRight />
                </a>
                <Link to="/lien-he" className="border-2 border-[#6B2200] text-[#6B2200] px-6 py-3 font-bold hover:bg-[#6B2200] hover:text-white transition-colors">
                  Xem catalog
                </Link>
              </div>
            </div>
            <div>
              <img
                src={get('hero_image', 'https://images.unsplash.com/photo-1567515175297-ae6359e5b187?w=700&q=80')}
                alt="Hoa hồng sấy lạnh"
                className="rounded-lg shadow-xl w-full object-cover"
                style={{ height: '360px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#3a1a00] py-5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-around gap-4">
            {['Giữ màu tự nhiên', 'Không hóa chất', 'Bảo quản lâu dài', 'OEM thương hiệu riêng'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-white text-sm font-semibold">
                <FiCheck className="text-amber-400 shrink-0" size={16} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sản phẩm */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-10">SẢN PHẨM</h2>
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

      {/* Technology */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading mb-4">CÔNG NGHỆ SẤY LẠNH</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sử dụng công nghệ sấy lạnh (freeze-drying) giúp loại bỏ nước trong điều kiện nhiệt độ thấp và chân không, không làm biến dạng cấu trúc hoa, <strong>giữ nguyên màu sắc, hương thơm và độ tươi</strong> trong thời gian dài.
              </p>
              <div className="space-y-3">
                {[
                  { step: '01', label: 'Chọn hoa tươi', desc: 'Hoa hồng chất lượng cao, thu hoạch đúng độ' },
                  { step: '02', label: 'Đông lạnh nhanh', desc: 'Hạ nhiệt độ xuống dưới -40°C' },
                  { step: '03', label: 'Sấy chân không', desc: 'Loại bỏ nước, giữ nguyên cấu trúc' },
                  { step: '04', label: 'Đóng gói', desc: 'Đóng gói trong điều kiện sạch, xuất khẩu' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-[#6B2200] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs">{s.step}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{s.label}</p>
                      <p className="text-gray-500 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1607500105153-2da3f8c83050?w=700&q=80"
                alt="Công nghệ sấy lạnh hoa hồng"
                className="rounded-lg shadow-xl w-full object-cover"
                style={{ height: '360px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Applications + Why us */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-heading mb-6">ỨNG DỤNG</h2>
              <div className="grid grid-cols-2 gap-4">
                {applications.map((a, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
                    <span className="text-3xl">{a.icon}</span>
                    <span className="font-semibold text-gray-800">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="section-heading mb-6">TẠI SAO CHỌN CHÚNG TÔI</h2>
              <ul className="space-y-3">
                {whyUs.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="w-7 h-7 bg-[#6B2200] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheck className="text-white" size={13} />
                    </div>
                    <span className="text-gray-700 font-medium">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging + OEM */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-heading mb-6">ĐÓNG GÓI</h2>
              <div className="space-y-3">
                {[
                  { icon: '🎀', label: 'Hộp quà cao cấp', desc: 'Phù hợp quà tặng doanh nghiệp' },
                  { icon: '🔒', label: 'Túi zip dày', desc: 'Bảo quản lâu dài, chống ẩm' },
                  { icon: '📦', label: 'Bao bì thương hiệu riêng', desc: 'In logo, thiết kế theo yêu cầu' },
                ].map((pkg, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <span className="text-3xl">{pkg.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{pkg.label}</p>
                      <p className="text-gray-500 text-sm">{pkg.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="section-heading mb-6">OEM / PRIVATE LABEL</h2>
              <div className="space-y-4">
                {oemFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <span className="text-3xl shrink-0">{f.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 mb-0.5">{f.label}</p>
                      <p className="text-gray-600 text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead-form" className="py-14 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8">
            <h2 className="text-2xl font-black text-[#6B2200] mb-2 text-center">Nhận báo giá hoa hồng sấy trong 24 giờ</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Điền thông tin bên dưới, chúng tôi sẽ phản hồi và gửi catalog ngay</p>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-green-700 font-bold text-lg mb-2">Cảm ơn bạn đã liên hệ!</h3>
                <p className="text-green-600 text-sm mb-4">Chúng tôi sẽ gửi báo giá và catalog trong vòng 24 giờ làm việc.</p>
                <button onClick={() => setSent(false)} className="btn-primary text-sm">Gửi yêu cầu khác</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tên *</label>
                    <input type="text" required placeholder="Nguyễn Văn A" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Công ty</label>
                    <input type="text" placeholder="Tên công ty" value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quốc gia *</label>
                    <input type="text" required placeholder="Ví dụ: Japan, Korea..." value={form.country}
                      onChange={e => setForm({ ...form, country: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Loại sản phẩm</label>
                    <select value={form.product_type} onChange={e => setForm({ ...form, product_type: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded bg-white">
                      <option value="">-- Chọn loại --</option>
                      <option>Hoa nguyên bông</option>
                      <option>Nụ hoa</option>
                      <option>Cánh hoa</option>
                      <option>Combo / Hỗn hợp</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng dự kiến</label>
                  <input type="text" placeholder="Ví dụ: 100kg/tháng, 500 hộp..." value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" required placeholder="email@company.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={sending}
                  className="w-full bg-[#c41e3a] text-white py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-60 rounded">
                  <FiSend size={16} />
                  {sending ? 'Đang gửi...' : 'NHẬN BÁO GIÁ NGAY'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA cuối */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Tìm nguồn hoa hồng sấy chất lượng cao?</h2>
          <p className="text-red-200 mb-6">Liên hệ ngay – nhận báo giá và catalog trong 24 giờ làm việc</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#lead-form" className="bg-white text-[#6B2200] px-8 py-3 font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              Nhận báo giá <FiArrowRight />
            </a>
            <a href="tel:+84961393370" className="border-2 border-white text-white px-8 py-3 font-bold hover:bg-white/10 transition-colors">
              📞 +84 961 393 370
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
