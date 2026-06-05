import { Link } from 'react-router-dom'

const technologies = [
  {
    id: 'che-bien-uot',
    title: 'Công nghệ chế biến ướt (Washed Process)',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=700&q=80',
    content: `Chế biến ướt (Washed/Wet Process) là phương pháp phổ biến cho Arabica cao cấp, giúp tạo nên hương vị sạch, chua thanh, thể chất nhẹ.

Quy trình thực hiện:
- Thu hoạch quả cà phê chín đỏ đồng đều (cherry picking)
- Xát vỏ tươi: loại bỏ vỏ ngoài (pulping)
- Lên men: ngâm trong nước sạch 24–48 giờ để loại bỏ nhớt
- Rửa sạch bằng nước chảy
- Phơi trên giàn nâng cao (raised bed) hoặc máy sấy
- Đạt độ ẩm ≤ 11.5%, đóng bao GrainPro 60kg

Ưu điểm: hương vị clean, bright acidity, nhất quán cao
Tiêu chuẩn: SCA, ICO Grade 1, Rainforest Alliance`
  },
  {
    id: 'che-bien-kho',
    title: 'Công nghệ chế biến khô (Natural/Dry Process)',
    image: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?w=700&q=80',
    content: `Chế biến khô (Natural/Dry Process) là phương pháp truyền thống, phơi nguyên quả cà phê trên giàn nâng cao. Phương pháp này tạo ra cà phê có vị ngọt tự nhiên, body dày, hương trái cây nổi bật.

Quy trình thực hiện:
- Thu hoạch quả chín đỏ, phân loại bỏ quả xanh/bệnh
- Trải đều trên giàn phơi nâng cao (Raised Bed), dày 3–5cm
- Đảo đều 3–4 lần/ngày tránh nấm mốc
- Phơi 3–6 tuần đến khi độ ẩm ≤ 11.5%
- Xay tách vỏ khô (dry milling), làm sạch, phân loại
- Đóng bao jute 60kg, bảo quản kho mát ≤ 20°C

Ưu điểm: chi phí thấp, hương vị complex, fruity
Phù hợp: Robusta Tây Nguyên, Arabica Sơn La Natural`
  },
  {
    id: 'rang-xay',
    title: 'Công nghệ rang xay cà phê',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700&q=80',
    content: `Trosie Garden đầu tư dây chuyền rang xay hiện đại, đảm bảo tính nhất quán và giữ nguyên hồ sơ hương vị của từng nguồn gốc.

Thiết bị và quy trình:
- Máy rang trống (drum roaster) công suất 30–60kg/mẻ
- Kiểm soát nhiệt độ theo profile riêng từng loại cà phê
- Rang nhạt (Light): 195–205°C – giữ hương floral, acidity
- Rang vừa (Medium): 205–215°C – cân bằng body và acidity
- Rang đậm (Dark): 215–225°C – body dày, đắng nhẹ, vị chocolate

Kiểm soát chất lượng:
- Agtron color meter đo độ rang chính xác
- Cuppingtheo tiêu chuẩn SCA sau mỗi mẻ rang
- Đóng gói túi valve one-way, hút chân không hoặc khí N2
- Xuất xưởng sau 24–48 giờ degassing (off-gassing)`
  },
]

export default function CongNghe() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-[#6B2200] py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">Công Nghệ Chế Biến</h1>
          <div className="flex items-center gap-2 text-sm text-amber-200">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>»</span>
            <span className="text-white">Công Nghệ</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-10">
            {technologies.map((tech) => (
              <div key={tech.id} id={tech.id} className="border-b border-gray-200 pb-8 last:border-0">
                <h2 className="text-[#6B2200] font-bold text-lg mb-3">{tech.title}</h2>
                <img
                  src={tech.image}
                  alt={tech.title}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {tech.content}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div>
            <div className="border border-gray-200 p-4 mb-4">
              <h3 className="section-heading text-base">DANH MỤC</h3>
              <ul className="space-y-2 text-sm">
                {technologies.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="text-gray-600 hover:text-[#6B2200] transition-colors news-link"
                    >
                      {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 p-4">
              <h3 className="section-heading text-base">SẢN PHẨM</h3>
              <ul className="space-y-2 text-sm">
                {[
                  ['Arabica', '/san-pham/ca-phe-arabica'],
                  ['Robusta', '/san-pham/ca-phe-robusta'],
                  ['Cà Phê Đặc Sản', '/san-pham/ca-phe-dac-san'],
                  ['Nhân Xanh', '/san-pham/ca-phe-nhan-xanh'],
                  ['Cascara', '/san-pham/cascara'],
                  ['Cà Phê Chồn', '/san-pham/ca-phe-chon'],
                ].map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-gray-600 hover:text-[#6B2200] transition-colors news-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
