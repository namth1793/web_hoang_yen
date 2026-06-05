import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck, FiSend } from 'react-icons/fi'
import axios from 'axios'
import { usePageContent } from '../hooks/usePageContent'

const products = [
  {
    name: 'Than Lục Giác (Hexagon)',
    badge: 'BEST SELLER',
    emoji: '🔥',
    image: 'https://images.unsplash.com/photo-1602945072881-75915b0f641f?w=500&q=80',
    desc: 'Thiết kế lỗ thông khí giúp cháy đều, nhiệt ổn định, phù hợp BBQ & shisha chuyên nghiệp.',
    features: ['Lỗ thông khí', 'Cháy đều nhiệt ổn định', 'Phù hợp BBQ & shisha', 'Tro rất ít'],
  },
  {
    name: 'Than Viên Tròn',
    badge: '',
    emoji: '⚫',
    image: 'https://images.unsplash.com/photo-1665791566407-22044ee904f3?w=500&q=80',
    desc: 'Dễ sử dụng, không cần dụng cụ đặc biệt, phù hợp nhu cầu gia đình và tiệc nhỏ.',
    features: ['Dễ sử dụng', 'Phù hợp gia đình', 'Kích thước đồng đều', 'Dễ bảo quản'],
  },
  {
    name: 'Than Que',
    badge: '',
    emoji: '🪵',
    image: 'https://images.unsplash.com/photo-1559152620-1e10b5bf3c98?w=500&q=80',
    desc: 'Giải pháp kinh tế cho nhà hàng và quán nướng, số lượng lớn, tiết kiệm chi phí vận hành.',
    features: ['Dùng cho nhà hàng', 'Tiết kiệm chi phí', 'Cháy lâu bền', 'Số lượng lớn'],
  },
]

const specs = [
  { label: 'Độ ẩm', value: '< 5%' },
  { label: 'Hàm lượng tro', value: '< 3%' },
  { label: 'Thời gian cháy', value: '2–4 giờ' },
  { label: 'Nhiệt lượng', value: 'Cao' },
  { label: 'Khói', value: 'Không khói – không mùi' },
  { label: 'Xuất xứ', value: 'Việt Nam' },
]

const applications = [
  { icon: '🍖', label: 'Nhà hàng BBQ' },
  { icon: '🔥', label: 'Quán nướng' },
  { icon: '💨', label: 'Shisha / Hookah' },
  { icon: '🏠', label: 'Gia đình' },
]

const whyUs = [
  'Giá trực tiếp từ nhà máy',
  'Nguồn hàng ổn định số lượng lớn',
  'Giao hàng quốc tế nhanh',
  'Hỗ trợ OEM / thương hiệu riêng',
]

const supplyChain = [
  { step: '01', label: 'Nguyên liệu', desc: 'Mùn cưa / gỗ tự nhiên chọn lọc' },
  { step: '02', label: 'Ép than', desc: 'Công nghệ ép định hình hiện đại' },
  { step: '03', label: 'Kiểm tra', desc: 'Kiểm tra chất lượng từng lô hàng' },
  { step: '04', label: 'Xuất khẩu', desc: 'Đóng container, giao hàng quốc tế' },
]

export default function ThanKhongKhoi() {
  const { get } = usePageContent('than-khong-khoi')
  const [form, setForm] = useState({ name: '', company: '', country: '', product_type: '', quantity: '', contact: '' })
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
        email: form.contact,
        subject: `Than không khói – ${form.product_type}`,
        message: `Quốc gia: ${form.country}\nLoại than: ${form.product_type}\nSố lượng: ${form.quantity}\nEmail/WhatsApp: ${form.contact}`,
      })
      setSent(true)
      setForm({ name: '', company: '', country: '', product_type: '', quantity: '', contact: '' })
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
          <h1 className="text-3xl font-black text-white mb-2">🔥 Than Không Khói Xuất Khẩu</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <Link to="/san-pham" className="hover:text-white">Sản phẩm</Link>
            <span>/</span>
            <span className="text-amber-200">Than không khói</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4">
                {get('hero_title', 'Than không khói cao cấp –')}
                <br />
                <span className="text-[#6B2200]">Cháy lâu, nhiệt cao, xuất khẩu toàn cầu</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {get('hero_desc', 'Cung cấp than sạch, không khói, phù hợp BBQ, nhà hàng và shisha. Nguồn hàng ổn định, giá cạnh tranh trực tiếp từ Việt Nam.')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#lead-form" className="bg-[#c41e3a] text-white px-6 py-3 font-bold hover:bg-red-700 transition-colors inline-flex items-center gap-2">
                  Nhận báo giá ngay <FiArrowRight />
                </a>
                <Link to="/lien-he" className="border-2 border-[#6B2200] text-[#6B2200] px-6 py-3 font-bold hover:bg-[#6B2200] hover:text-white transition-colors">
                  Yêu cầu mẫu thử
                </Link>
              </div>
            </div>
            <div>
              <img
                src={get('hero_image', 'https://images.unsplash.com/photo-1648090228825-e8fabeb09750?w=700&q=80')}
                alt="Than không khói xuất khẩu"
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
            {['Không khói – không mùi', 'Cháy lâu 2–4 giờ', 'Tro ít, nhiệt ổn định', 'Hỗ trợ OEM'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-white text-sm font-semibold">
                <FiCheck className="text-amber-400 shrink-0" size={16} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sản phẩm chính */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-10">SẢN PHẨM CHÍNH</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 text-3xl">{p.emoji}</div>
                  {p.badge && (
                    <div className="absolute top-3 right-3 bg-[#c41e3a] text-white text-xs font-bold px-2 py-1 rounded">
                      {p.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[#6B2200] text-lg mb-2">{p.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{p.desc}</p>
                  <ul className="space-y-1">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FiCheck className="text-[#6B2200] shrink-0" size={13} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs + Applications */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-heading mb-6">THÔNG SỐ KỸ THUẬT</h2>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((s, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">{s.label}</p>
                    <p className="font-bold text-[#6B2200]">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="section-heading mb-6">ỨNG DỤNG</h2>
              <div className="grid grid-cols-2 gap-4">
                {applications.map((a, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-center gap-3">
                    <span className="text-3xl">{a.icon}</span>
                    <span className="font-semibold text-gray-800">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why us + Packaging */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
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
            <div>
              <h2 className="section-heading mb-6">ĐÓNG GÓI</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                {[
                  { size: '2 kg', desc: 'Gói nhỏ – phù hợp dùng thử' },
                  { size: '5 kg', desc: 'Gói trung – dùng gia đình' },
                  { size: '10 kg', desc: 'Gói lớn – nhà hàng & xuất khẩu' },
                ].map((pkg, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-[#6B2200]/10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="font-black text-[#6B2200] text-sm">{pkg.size}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{pkg.desc}</p>
                      <p className="text-sm text-gray-500">Bao bì theo yêu cầu / OEM</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supply chain */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-10">CHUỖI CUNG ỨNG</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supplyChain.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#6B2200] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-black text-lg">{s.step}</span>
                </div>
                <h3 className="font-black text-gray-900 mb-1">{s.label}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead-form" className="py-14 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8">
            <h2 className="text-2xl font-black text-[#6B2200] mb-2 text-center">Nhận báo giá than không khói trong 24 giờ</h2>
            <p className="text-gray-500 text-sm text-center mb-8">Điền thông tin bên dưới, chúng tôi sẽ phản hồi ngay trong ngày làm việc</p>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-green-700 font-bold text-lg mb-2">Cảm ơn bạn đã liên hệ!</h3>
                <p className="text-green-600 text-sm mb-4">Chúng tôi sẽ gửi báo giá trong vòng 24 giờ làm việc.</p>
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
                    <input type="text" required placeholder="Ví dụ: UAE, Japan..." value={form.country}
                      onChange={e => setForm({ ...form, country: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Loại than</label>
                    <select value={form.product_type} onChange={e => setForm({ ...form, product_type: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded bg-white">
                      <option value="">-- Chọn loại --</option>
                      <option>Than lục giác (Hexagon)</option>
                      <option>Than viên tròn</option>
                      <option>Than que</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng dự kiến</label>
                  <input type="text" placeholder="Ví dụ: 5 tấn/tháng, 1 container..." value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email / WhatsApp *</label>
                  <input type="text" required placeholder="email@company.com hoặc số WhatsApp" value={form.contact}
                    onChange={e => setForm({ ...form, contact: e.target.value })}
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
          <h2 className="text-2xl font-black text-white mb-3">Tìm nhà cung cấp than ổn định?</h2>
          <p className="text-red-200 mb-6">Liên hệ ngay hôm nay – báo giá trong 24 giờ làm việc</p>
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
