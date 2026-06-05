import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const catLabel = { que: 'Quế', hoi: 'Hồi', gung: 'Gừng', nghe: 'Nghệ' }
const catColor = {
  que: 'bg-amber-100 text-amber-700',
  hoi: 'bg-green-100 text-green-700',
  gung: 'bg-yellow-100 text-yellow-700',
  nghe: 'bg-orange-100 text-orange-700',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  const load = () =>
    axios.get('/api/admin/products', api())
      .then(r => setProducts(r.data))
      .catch(() => navigate('/admin/login'))

  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    setDeleting(id)
    await axios.delete(`/api/admin/products/${id}`, api())
    load()
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Sản Phẩm</h1>
        <Link to="/admin/products/new"
          className="bg-[#4A2C17] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#2E1A0D] transition-colors">
          <FiPlus size={16} /> Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Danh mục</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Xuất xứ</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Đơn vị</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Chưa có sản phẩm nào</td></tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded shrink-0 border border-gray-100" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      {p.name_en && <p className="text-gray-400 text-xs">{p.name_en}</p>}
                      <p className="text-gray-400 text-xs mt-0.5">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${catColor[p.category] || 'bg-gray-100 text-gray-600'}`}>
                    {catLabel[p.category] || p.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[160px] truncate">{p.origin}</td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{p.unit}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/san-pham/${p.slug}`} target="_blank" rel="noreferrer"
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Xem ngoài web">
                      <FiExternalLink size={14} />
                    </a>
                    <Link to={`/admin/products/${p.id}`}
                      className="p-1.5 text-gray-500 hover:text-[#4A2C17] hover:bg-orange-50 rounded transition-colors">
                      <FiEdit2 size={15} />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id}
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

      <p className="text-xs text-gray-400 mt-3">
        * Slug sản phẩm không thể thay đổi sau khi tạo vì ảnh hưởng đến URL.
      </p>
    </div>
  )
}
