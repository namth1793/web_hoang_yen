import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft, FiInfo, FiUpload } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const toSlug = str => str.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-').replace(/-+/g, '-').trim()

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A2C17]'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'

export default function AdminProductForm() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: '', name_en: '', slug: '', category: 'que',
    description: '', description_en: '',
    detail: '', detail_en: '',
    image: '', unit: 'Tấn / MT', origin: '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('vi') // vi | en

  useEffect(() => {
    if (!isNew) {
      axios.get(`/api/admin/products/${id}`, api())
        .then(r => {
          const p = r.data
          setForm({
            name: p.name || '', name_en: p.name_en || '', slug: p.slug || '',
            category: p.category || 'que',
            description: p.description || '', description_en: p.description_en || '',
            detail: p.detail || '', detail_en: p.detail_en || '',
            image: p.image || '', unit: p.unit || 'Tấn / MT', origin: p.origin || '',
          })
        })
        .catch(() => navigate('/admin/login'))
    }
  }, [id])

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm(f => ({ ...f, name, slug: isNew ? toSlug(name) : f.slug }))
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await axios.post('/api/admin/upload', fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'multipart/form-data' }
      })
      setForm(f => ({ ...f, image: data.url }))
    } catch (err) {
      setError(err.response?.data?.error || 'Upload thất bại')
    }
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        await axios.post('/api/admin/products', form, api())
      } else {
        await axios.put(`/api/admin/products/${id}`, form, api())
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.response?.data?.error || 'Lưu thất bại')
    }
    setSaving(false)
  }

  const f = (field) => form[field]
  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black text-gray-900">{isNew ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Thông tin cơ bản</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={LABEL}>Tên sản phẩm (VI) *</label>
              <input type="text" required value={f('name')} onChange={handleNameChange}
                className={INPUT} placeholder="Ví dụ: Quế" />
            </div>
            <div>
              <label className={LABEL}>Product Name (EN)</label>
              <input type="text" value={f('name_en')} onChange={set('name_en')}
                className={INPUT} placeholder="e.g. Cinnamon" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={LABEL}>Slug *</label>
              <input type="text" required value={f('slug')} onChange={set('slug')}
                className={`${INPUT} ${!isNew ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="que" readOnly={!isNew} />
              {!isNew && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <FiInfo size={11} /> Không đổi slug sau khi tạo
                </p>
              )}
            </div>
            <div>
              <label className={LABEL}>Danh mục</label>
              <select value={f('category')} onChange={set('category')}
                className={`${INPUT} bg-white`}>
                <option value="que">Quế / Cinnamon</option>
                <option value="hoi">Hồi / Star Anise</option>
                <option value="gung">Gừng / Ginger</option>
                <option value="nghe">Nghệ / Turmeric</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Đơn vị</label>
              <input type="text" value={f('unit')} onChange={set('unit')}
                className={INPUT} placeholder="Tấn / MT" />
            </div>
          </div>

          <div className="mb-4">
            <label className={LABEL}>Xuất xứ / Origin</label>
            <input type="text" value={f('origin')} onChange={set('origin')}
              className={INPUT} placeholder="Văn Yên, Yên Bái – Việt Nam" />
          </div>

          {/* Image */}
          <div>
            <label className={LABEL}>Ảnh sản phẩm</label>
            <div className="flex items-start gap-3">
              <input type="text" value={f('image')} onChange={set('image')}
                className={`${INPUT} flex-1`} placeholder="URL ảnh hoặc upload bên dưới" />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-60 whitespace-nowrap">
                <FiUpload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {f('image') && (
              <img src={f('image')} alt="Preview" className="mt-2 h-28 w-auto rounded-lg object-cover border border-gray-200" />
            )}
          </div>
        </div>

        {/* Bilingual content card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-200">
            <button type="button" onClick={() => setTab('vi')}
              className={`px-5 py-3 text-sm font-semibold transition-colors ${tab === 'vi' ? 'border-b-2 border-[#4A2C17] text-[#4A2C17]' : 'text-gray-500 hover:text-gray-700'}`}>
              🇻🇳 Tiếng Việt
            </button>
            <button type="button" onClick={() => setTab('en')}
              className={`px-5 py-3 text-sm font-semibold transition-colors ${tab === 'en' ? 'border-b-2 border-[#4A2C17] text-[#4A2C17]' : 'text-gray-500 hover:text-gray-700'}`}>
              🇬🇧 English
            </button>
          </div>

          <div className="p-6 space-y-4">
            {tab === 'vi' ? (
              <>
                <div>
                  <label className={LABEL}>Mô tả ngắn (VI)</label>
                  <textarea rows={3} value={f('description')} onChange={set('description')}
                    className={`${INPUT} resize-none`}
                    placeholder="Mô tả ngắn hiển thị trên danh sách sản phẩm..." />
                </div>
                <div>
                  <label className={LABEL}>Nội dung chi tiết (VI) – HTML</label>
                  <textarea rows={14} value={f('detail')} onChange={set('detail')}
                    className={`${INPUT} resize-y font-mono text-xs leading-relaxed`}
                    placeholder={'<h3>Tổng quan</h3>\n<p>Mô tả sản phẩm...</p>\n<h3>Tiêu chuẩn chất lượng</h3>\n<ul>\n<li>Độ ẩm: ≤ 13,5%</li>\n</ul>'} />
                  <p className="text-xs text-gray-400 mt-1">Hỗ trợ thẻ HTML: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={LABEL}>Short Description (EN)</label>
                  <textarea rows={3} value={f('description_en')} onChange={set('description_en')}
                    className={`${INPUT} resize-none`}
                    placeholder="Short description shown on product listing..." />
                </div>
                <div>
                  <label className={LABEL}>Detailed Content (EN) – HTML</label>
                  <textarea rows={14} value={f('detail_en')} onChange={set('detail_en')}
                    className={`${INPUT} resize-y font-mono text-xs leading-relaxed`}
                    placeholder={'<h3>Overview</h3>\n<p>Product description...</p>\n<h3>Quality Standards</h3>\n<ul>\n<li>Moisture: ≤ 13.5%</li>\n</ul>'} />
                  <p className="text-xs text-gray-400 mt-1">Supports HTML tags: &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;</p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-[#4A2C17] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#2E1A0D] transition-colors disabled:opacity-60">
            {saving ? 'Đang lưu...' : (isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi')}
          </button>
          <Link to="/admin/products"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}
