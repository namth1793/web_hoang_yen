import { Link } from 'react-router-dom'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { usePageContent } from '../hooks/usePageContent'

const driedProducts = [
  {
    name: 'Chuối Sấy',
    features: ['Giòn', 'Ngọt tự nhiên', 'Không chất bảo quản'],
    image: 'https://images.unsplash.com/photo-1762884601729-0eeeafbdfb8a?w=400&q=80',
  },
  {
    name: 'Mít Sấy',
    features: ['Hương thơm đặc trưng', 'Giữ nguyên vị', 'Giòn dai'],
    image: 'https://images.unsplash.com/photo-1624711078028-19ed36a91f02?w=400&q=80',
  },
  {
    name: 'Xoài Sấy',
    features: ['Dẻo', 'Vị chua ngọt', 'Màu sắc hấp dẫn'],
    image: 'https://images.unsplash.com/photo-1776188590471-db74f543cf52?w=400&q=80',
  },
]

const advantages = ['Nguồn trực tiếp từ vùng trồng', 'Kiểm soát chất lượng nghiêm ngặt', 'Giá cạnh tranh', 'Đóng gói phù hợp xuất khẩu']

export default function NongSan() {
  const { get } = usePageContent('nong-san')
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#6B2200] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">🌿 Nông Sản Xuất Khẩu</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>/</span>
            <span className="text-amber-200">Nông sản</span>
          </div>
        </div>
      </div>

      {/* Tổng quan */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading">Nông Sản Việt Nam Đạt Chuẩn Xuất Khẩu</h2>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                {get('overview_text', 'Chúng tôi cung cấp nông sản Việt Nam đạt tiêu chuẩn xuất khẩu, bao gồm trái cây sấy và trái cây tươi theo mùa.\n\nNguồn hàng kết nối trực tiếp với vùng trồng, đảm bảo nguyên liệu tươi ngon, quy trình chế biến hiện đại và đóng gói phù hợp tiêu chuẩn quốc tế.')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/lien-he" className="btn-primary inline-flex items-center gap-2">
                  Nhận báo giá <FiArrowRight />
                </Link>
                <a href="tel:+84961393370" className="border border-[#6B2200] text-[#6B2200] px-5 py-2 font-semibold hover:bg-[#6B2200] hover:text-white transition-colors">
                  📞 Gọi ngay
                </a>
              </div>
            </div>
            <div>
              <img
                src={get('hero_image', 'https://images.unsplash.com/photo-1770124129809-fe1fe6b7c23e?w=700&q=80')}
                alt="Nông sản xuất khẩu"
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: '320px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trái cây sấy */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">TRÁI CÂY SẤY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {driedProducts.map((p, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="overflow-hidden" style={{ height: '200px' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-[#6B2200] text-lg mb-3">{p.name}</h3>
                  <ul className="space-y-1.5">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
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

      {/* Trái cây tươi */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="section-heading">TRÁI CÂY TƯƠI XUẤT KHẨU</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bên cạnh trái cây sấy, chúng tôi cung cấp trái cây tươi theo mùa vụ, đáp ứng tiêu chuẩn kiểm dịch thực vật quốc tế và yêu cầu nhập khẩu của từng thị trường.
              </p>
              <ul className="space-y-2">
                {['Theo mùa vụ – nguồn cung ổn định', 'Xuất khẩu trực tiếp', 'Kiểm dịch đầy đủ', 'Đóng gói bảo quản chuyên dụng'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <FiCheck className="text-[#6B2200] shrink-0" size={14} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1775377262418-24c4d1c89574?w=600&q=80"
                alt="Trái cây tươi"
                className="rounded-lg shadow-lg w-full object-cover"
                style={{ height: '280px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ưu điểm */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading center text-center mb-8">ƯU ĐIỂM CỦA CHÚNG TÔI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {advantages.map((a, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 text-center hover:border-[#6B2200] hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{'🌿☀️✅💰'[i]}</div>
                <p className="font-semibold text-gray-800 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#6B2200]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Quan tâm đến nông sản Việt Nam?</h2>
          <p className="text-red-200 mb-6">Liên hệ để nhận catalogue và báo giá theo mùa vụ</p>
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
