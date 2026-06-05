import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiTrash2, FiCheck } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const load = () => axios.get('/api/admin/contacts', api()).then(r => setContacts(r.data)).catch(() => navigate('/admin/login'))
  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    await axios.put(`/api/admin/contacts/${id}`, { status: 'read' }, api())
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa liên hệ này?')) return
    await axios.delete(`/api/admin/contacts/${id}`, api())
    load()
  }

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)
  const newCount = contacts.filter(c => c.status === 'new').length
  const formatDate = d => new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Hộp Thư Liên Hệ {newCount > 0 && <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">{newCount} mới</span>}</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[['all', 'Tất cả', contacts.length], ['new', 'Chưa đọc', newCount], ['read', 'Đã đọc', contacts.filter(c => c.status === 'read').length]].map(([val, label, count]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === val ? 'bg-[#6B2200] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">Không có liên hệ nào</div>}
        {filtered.map(c => (
          <div key={c.id} className={`bg-white rounded-xl border p-4 ${c.status === 'new' ? 'border-[#6B2200]/30 bg-amber-50/30' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-gray-900">{c.name}</span>
                  {c.company && <span className="text-gray-500 text-sm">– {c.company}</span>}
                  {c.status === 'new' && <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded font-semibold">MỚI</span>}
                  <span className="text-gray-400 text-xs ml-auto">{formatDate(c.created_at)}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                  <a href={`mailto:${c.email}`} className="hover:text-[#6B2200]">📧 {c.email}</a>
                  {c.phone && <a href={`tel:${c.phone}`} className="hover:text-[#6B2200]">📞 {c.phone}</a>}
                  {c.subject && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{c.subject}</span>}
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-line">{c.message}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {c.status === 'new' && (
                  <button onClick={() => markRead(c.id)} title="Đánh dấu đã đọc"
                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <FiCheck size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(c.id)} title="Xóa"
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
