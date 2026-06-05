import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiFileText, FiImage, FiMail, FiPackage } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axios.get('/api/admin/stats', api())
      .then(r => setStats(r.data))
      .catch(() => {})
  }, [])

  const cards = [
    { label: 'Sản phẩm', value: stats?.productCount ?? '...', icon: <FiPackage size={20} />, to: '/admin/products', color: 'bg-[#4A2C17]' },
    { label: 'Tin tức', value: stats?.newsCount ?? '...', icon: <FiFileText size={20} />, to: '/admin/news', color: 'bg-[#E07820]' },
    { label: 'Liên hệ mới', value: stats?.newContacts ?? '...', icon: <FiMail size={20} />, to: '/admin/contacts', color: 'bg-red-500' },
    { label: 'Tổng liên hệ', value: stats?.contactCount ?? '...', icon: <FiMail size={20} />, to: '/admin/contacts', color: 'bg-gray-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <Link key={i} to={c.to} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white mb-3`}>{c.icon}</div>
            <p className="text-2xl font-black text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3">Quản lý nhanh</h2>
          <div className="space-y-1">
            {[
              { to: '/admin/products/new', label: '+ Thêm sản phẩm mới', icon: '📦' },
              { to: '/admin/news/new', label: '+ Thêm tin tức mới', icon: '📝' },
              { to: '/admin/banners', label: '🖼️ Quản lý Banners', icon: '🖼️' },
              { to: '/admin/contacts', label: '📬 Xem hộp thư liên hệ', icon: '📬' },
            ].map((item, i) => (
              <Link key={i} to={item.to}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-orange-50 text-sm text-gray-700 hover:text-[#4A2C17] transition-colors">
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-3">Hướng dẫn</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-[#E07820] shrink-0">•</span> <strong>Sản phẩm:</strong> thêm/sửa/xóa sản phẩm với nội dung song ngữ VI/EN</li>
            <li className="flex items-start gap-2"><span className="text-[#E07820] shrink-0">•</span> <strong>Tin tức:</strong> thêm/sửa/xóa bài viết, tiêu đề EN tùy chọn</li>
            <li className="flex items-start gap-2"><span className="text-[#E07820] shrink-0">•</span> <strong>Banners:</strong> quản lý slider ảnh trên trang chủ</li>
            <li className="flex items-start gap-2"><span className="text-[#E07820] shrink-0">•</span> <strong>Detail sản phẩm:</strong> hỗ trợ HTML (thẻ &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;p&gt;)</li>
            <li className="flex items-start gap-2"><span className="text-[#E07820] shrink-0">•</span> Cấu hình Cloudinary trong <code className="bg-gray-100 px-1 rounded">.env</code> để upload ảnh</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
