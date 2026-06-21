import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiTag } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const INPUT = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#4A2C17] w-full'

const EMPTY = { slug: '', name: '', name_en: '', sort_order: 0 }

const toSlug = str => str.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-').replace(/-+/g, '-').trim()

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)   // null = no edit, 'new' = add form
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    axios.get('/api/admin/categories', api())
      .then(r => setCats(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const startEdit = (cat) => {
    setEditId(cat.id)
    setForm({ slug: cat.slug, name: cat.name, name_en: cat.name_en || '', sort_order: cat.sort_order || 0 })
    setError('')
  }

  const startNew = () => {
    setEditId('new')
    setForm(EMPTY)
    setError('')
  }

  const cancel = () => { setEditId(null); setError('') }

  const set = (field) => (e) => {
    const val = e.target.value
    setForm(f => {
      const next = { ...f, [field]: val }
      if (field === 'name' && editId === 'new') next.slug = toSlug(val)
      return next
    })
  }

  const save = async () => {
    if (!form.name.trim()) return setError('Tên danh mục không được để trống')
    if (!form.slug.trim()) return setError('Slug không được để trống')
    setSaving(true)
    setError('')
    try {
      if (editId === 'new') {
        await axios.post('/api/admin/categories', form, api())
      } else {
        await axios.put(`/api/admin/categories/${editId}`, form, api())
      }
      setEditId(null)
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Lưu thất bại')
    }
    setSaving(false)
  }

  const remove = async (cat) => {
    try {
      await axios.delete(`/api/admin/categories/${cat.id}`, api())
      setDeleteConfirm(null)
      load()
    } catch (err) {
      setDeleteConfirm(null)
      setError(err.response?.data?.error || 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900">Danh Mục Sản Phẩm</h1>
          <p className="text-sm text-gray-500 mt-0.5">{cats.length} danh mục</p>
        </div>
        <button onClick={startNew}
          className="flex items-center gap-2 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] transition-colors">
          <FiPlus size={16} /> Thêm danh mục
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><FiX size={14} /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Add new row */}
        {editId === 'new' && (
          <div className="p-4 bg-orange-50 border-b border-orange-200">
            <p className="text-xs font-semibold text-[#4A2C17] mb-3 uppercase tracking-wide">Thêm danh mục mới</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tên VI *</label>
                <input value={form.name} onChange={set('name')} placeholder="Quế" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tên EN</label>
                <input value={form.name_en} onChange={set('name_en')} placeholder="Cinnamon" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                <input value={form.slug} onChange={set('slug')} placeholder="que" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Thứ tự</label>
                <input type="number" value={form.sort_order} onChange={set('sort_order')} className={INPUT} min={0} />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={save} disabled={saving}
                className="flex items-center gap-1.5 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] disabled:opacity-60">
                <FiCheck size={14} /> {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button onClick={cancel}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50">
                <FiX size={14} /> Hủy
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#4A2C17] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FiTag size={32} className="mx-auto mb-2 opacity-30" />
            <p>Chưa có danh mục nào</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">#</th>
                <th className="text-left px-4 py-3 font-semibold">Tên Tiếng Việt</th>
                <th className="text-left px-4 py-3 font-semibold">Tên Tiếng Anh</th>
                <th className="text-left px-4 py-3 font-semibold">Slug</th>
                <th className="text-left px-4 py-3 font-semibold">Thứ tự</th>
                <th className="text-right px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cats.map((cat) => (
                editId === cat.id ? (
                  <tr key={cat.id} className="bg-orange-50">
                    <td className="px-4 py-3 text-gray-400">{cat.id}</td>
                    <td className="px-4 py-2">
                      <input value={form.name} onChange={set('name')} className={INPUT} placeholder="Quế" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={form.name_en} onChange={set('name_en')} className={INPUT} placeholder="Cinnamon" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={form.slug} onChange={set('slug')} className={INPUT} placeholder="que" />
                    </td>
                    <td className="px-4 py-2 w-24">
                      <input type="number" value={form.sort_order} onChange={set('sort_order')} className={INPUT} min={0} />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={save} disabled={saving}
                          className="flex items-center gap-1 bg-[#4A2C17] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2E1A0D] disabled:opacity-60">
                          <FiCheck size={12} /> {saving ? '...' : 'Lưu'}
                        </button>
                        <button onClick={cancel}
                          className="flex items-center gap-1 border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-xs hover:bg-gray-100">
                          <FiX size={12} /> Hủy
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{cat.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-600">{cat.name_en || <span className="text-gray-300 italic">—</span>}</td>
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{cat.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(cat)}
                          className="p-1.5 text-gray-400 hover:text-[#4A2C17] hover:bg-orange-50 rounded transition-colors">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirm(cat)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        * Không thể xóa danh mục đang có sản phẩm. Slug dùng để lọc sản phẩm trên website — không nên đổi sau khi đã có sản phẩm.
      </p>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-2">Xóa danh mục?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Bạn có chắc muốn xóa danh mục <strong>{deleteConfirm.name}</strong>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={() => remove(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
