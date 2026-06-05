import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiTrash2, FiPlus, FiUpload, FiChevronUp, FiChevronDown } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const emptyBanner = { title: '', subtitle: '', image: '', link: '/' }

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(emptyBanner)
  const [editId, setEditId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()
  const navigate = useNavigate()

  const load = () => axios.get('/api/admin/banners', api()).then(r => setBanners(r.data)).catch(() => navigate('/admin/login'))
  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true); setError('')
    try {
      const fd = new FormData(); fd.append('image', file)
      const { data } = await axios.post('/api/admin/upload', fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'multipart/form-data' }
      })
      setForm(f => ({ ...f, image: data.url }))
    } catch (err) { setError(err.response?.data?.error || 'Upload thất bại') }
    setUploading(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.image) { setError('Vui lòng chọn ảnh'); return }
    setSaving(true); setError('')
    try {
      if (editId) {
        await axios.put(`/api/admin/banners/${editId}`, { ...form, sort_order: banners.find(b => b.id === editId)?.sort_order || 0 }, api())
      } else {
        await axios.post('/api/admin/banners', { ...form, sort_order: banners.length + 1 }, api())
      }
      setForm(emptyBanner); setEditId(null); load()
    } catch (err) { setError(err.response?.data?.error || 'Lưu thất bại') }
    setSaving(false)
  }

  const handleEdit = (b) => { setEditId(b.id); setForm({ title: b.title, subtitle: b.subtitle, image: b.image, link: b.link }) }

  const handleDelete = async (id) => {
    if (!confirm('Xóa banner này?')) return
    await axios.delete(`/api/admin/banners/${id}`, api()); load()
  }

  const handleOrder = async (id, dir) => {
    const idx = banners.findIndex(b => b.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= banners.length) return
    const a = banners[idx], b = banners[swapIdx]
    await axios.put(`/api/admin/banners/${a.id}`, { ...a, sort_order: b.sort_order }, api())
    await axios.put(`/api/admin/banners/${b.id}`, { ...b, sort_order: a.sort_order }, api())
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Banners Trang Chủ</h1>

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">{editId ? 'Sửa banner' : 'Thêm banner mới'}</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tiêu đề (tuỳ chọn)</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2200]" placeholder="Tiêu đề banner" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Link khi click</label>
              <input type="text" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2200]" placeholder="/gang-tay-y-te" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Ảnh banner *</label>
            <div className="flex gap-2">
              <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6B2200]" placeholder="URL ảnh hoặc upload" />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                className="flex items-center gap-1 bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-60">
                <FiUpload size={13} /> {uploading ? '...' : 'Upload'}
              </button>
            </div>
            {form.image && <img src={form.image} alt="" className="mt-2 h-24 w-auto rounded-lg object-cover border" />}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="bg-[#6B2200] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#4A1800] disabled:opacity-60">
              {saving ? 'Đang lưu...' : (editId ? 'Lưu thay đổi' : '+ Thêm banner')}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm(emptyBanner) }}
              className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Hủy</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {banners.length === 0 && <p className="text-center py-10 text-gray-400">Chưa có banner nào</p>}
        <div className="divide-y divide-gray-100">
          {banners.map((b, i) => (
            <div key={b.id} className="flex items-center gap-3 p-3">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleOrder(b.id, -1)} disabled={i === 0} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"><FiChevronUp size={14} /></button>
                <button onClick={() => handleOrder(b.id, 1)} disabled={i === banners.length - 1} className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"><FiChevronDown size={14} /></button>
              </div>
              <img src={b.image} alt="" className="w-24 h-14 object-cover rounded-lg shrink-0 bg-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{b.title || <span className="text-gray-400 italic">Không có tiêu đề</span>}</p>
                <p className="text-xs text-gray-400 truncate">{b.link}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(b)} className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">Sửa</button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
