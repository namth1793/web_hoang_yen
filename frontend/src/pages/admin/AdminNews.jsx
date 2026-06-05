import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

export default function AdminNews() {
  const [news, setNews] = useState([])
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  const load = () => axios.get('/api/admin/news', api()).then(r => setNews(r.data)).catch(() => navigate('/admin/login'))

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return
    setDeleting(id)
    await axios.delete(`/api/admin/news/${id}`, api())
    load()
    setDeleting(null)
  }

  const formatDate = d => new Date(d).toLocaleDateString('vi-VN')

  const catLabel = { 'tin-cong-ty': 'Công ty', 'thi-truong': 'Thị trường', 'su-kien': 'Sự kiện', 'tuyen-dung': 'Tuyển dụng' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Tin Tức</h1>
        <Link to="/admin/news/new" className="bg-[#6B2200] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#4A1800] transition-colors">
          <FiPlus size={16} /> Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Tiêu đề</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Danh mục</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Ngày</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {news.length === 0 && (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">Chưa có bài viết nào</td></tr>
            )}
            {news.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded shrink-0" />}
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-gray-400 text-xs line-clamp-1">{item.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{catLabel[item.category] || item.category}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{formatDate(item.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/news/${item.id}`}
                      className="p-1.5 text-gray-500 hover:text-[#6B2200] hover:bg-gray-100 rounded transition-colors">
                      <FiEdit2 size={15} />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
