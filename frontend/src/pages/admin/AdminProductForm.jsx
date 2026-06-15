import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft, FiInfo, FiPlus, FiTrash2, FiUpload, FiLoader } from 'react-icons/fi'

const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
const uploadH = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    'Content-Type': 'multipart/form-data',
  }
})

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

  const [form, setForm] = useState({
    name: '', name_en: '', slug: '', category: 'que',
    description: '', description_en: '',
    detail: '', detail_en: '',
    image: '',
    moisture: '', admixture: '', oil: '',
    unit: 'Tấn / MT', origin: '',
  })
  const [gallery, setGallery] = useState([])   // string[]
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('vi')
  const mainFileRef = useRef()
  const galleryFileRef = useRef()

  useEffect(() => {
    if (!isNew) {
      axios.get(`/api/admin/products/${id}`, authH())
        .then(r => {
          const p = r.data
          setForm({
            name: p.name || '', name_en: p.name_en || '', slug: p.slug || '',
            category: p.category || 'que',
            description: p.description || '', description_en: p.description_en || '',
            detail: p.detail || '', detail_en: p.detail_en || '',
            image: p.image || '',
            moisture: p.moisture || '', admixture: p.admixture || '', oil: p.oil || '',
            unit: p.unit || 'Tấn / MT', origin: p.origin || '',
          })
          try { setGallery(JSON.parse(p.images || '[]')) } catch { setGallery([]) }
        })
        .catch(() => navigate('/admin/login'))
    }
  }, [id])

  const uploadFile = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await axios.post('/api/admin/upload', fd, uploadH())
    return data.url
  }

  const handleMainUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingMain(true); setError('')
    try {
      const url = await uploadFile(file)
      setForm(f => ({ ...f, image: url }))
      // Auto-add as first gallery image if gallery is empty
      setGallery(prev => prev.length === 0 ? [url] : prev)
    } catch (err) { setError(err.response?.data?.error || 'Upload thất bại') }
    setUploadingMain(false)
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploadingGallery(true); setError('')
    try {
      const urls = await Promise.all(files.map(uploadFile))
      setGallery(prev => {
        const combined = [...prev, ...urls]
        // If no main image yet, use first uploaded as main
        if (!form.image && combined.length > 0) {
          setForm(f => ({ ...f, image: combined[0] }))
        }
        return combined
      })
    } catch (err) { setError(err.response?.data?.error || 'Upload thất bại') }
    setUploadingGallery(false)
    e.target.value = ''
  }

  const removeGalleryImg = (idx) => {
    setGallery(prev => {
      const next = prev.filter((_, i) => i !== idx)
      // If removed image was the main image, update main to first remaining
      if (prev[idx] === form.image) {
        setForm(f => ({ ...f, image: next[0] || '' }))
      }
      return next
    })
  }

  const setAsMain = (url) => setForm(f => ({ ...f, image: url }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { ...form, images: JSON.stringify(gallery) }
    try {
      if (isNew) {
        await axios.post('/api/admin/products', payload, authH())
      } else {
        await axios.put(`/api/admin/products/${id}`, payload, authH())
      }
      navigate('/admin/products')
    } catch (err) { setError(err.response?.data?.error || 'Lưu thất bại') }
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
        {/* ── Basic info ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Thông tin cơ bản</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={LABEL}>Tên sản phẩm (VI) *</label>
              <input type="text" required value={f('name')}
                onChange={e => {
                  const name = e.target.value
                  setForm(prev => ({ ...prev, name, slug: isNew ? toSlug(name) : prev.slug }))
                }}
                className={INPUT} placeholder="Ví dụ: Quế chẻ" />
            </div>
            <div>
              <label className={LABEL}>Product Name (EN)</label>
              <input type="text" value={f('name_en')} onChange={set('name_en')}
                className={INPUT} placeholder="e.g. Split Cassia" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={LABEL}>Slug *</label>
              <input type="text" required value={f('slug')} onChange={set('slug')}
                className={`${INPUT} ${!isNew ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                readOnly={!isNew} />
              {!isNew && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <FiInfo size={11} /> Không đổi slug sau khi tạo
                </p>
              )}
            </div>
            <div>
              <label className={LABEL}>Danh mục</label>
              <select value={f('category')} onChange={set('category')} className={`${INPUT} bg-white`}>
                <option value="que">Quế / Cinnamon</option>
                <option value="hoi">Hồi / Star Anise</option>
                <option value="gung">Gừng / Ginger</option>
                <option value="nghe">Nghệ / Turmeric</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Đơn vị</label>
              <input type="text" value={f('unit')} onChange={set('unit')} className={INPUT} placeholder="Tấn / MT" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={LABEL}>Độ ẩm (Moisture)</label>
              <input type="text" value={f('moisture')} onChange={set('moisture')} className={INPUT} placeholder="≤ 13,5%" />
            </div>
            <div>
              <label className={LABEL}>Tạp chất (Admixture)</label>
              <input type="text" value={f('admixture')} onChange={set('admixture')} className={INPUT} placeholder="≤ 1%" />
            </div>
            <div>
              <label className={LABEL}>Độ dầu / Tinh dầu</label>
              <input type="text" value={f('oil')} onChange={set('oil')} className={INPUT} placeholder="2–3%" />
            </div>
          </div>

          <div>
            <label className={LABEL}>Xuất xứ / Origin</label>
            <input type="text" value={f('origin')} onChange={set('origin')}
              className={INPUT} placeholder="Văn Yên, Yên Bái, Việt Nam" />
          </div>
        </div>

        {/* ── Images ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-1 pb-2 border-b border-gray-100">Hình Ảnh Sản Phẩm</h2>
          <p className="text-xs text-gray-400 mb-4">
            Ảnh đầu tiên trong bộ ảnh sẽ là ảnh đại diện. Bấm vào ảnh bất kỳ để đặt làm ảnh chính.
          </p>

          {/* Gallery grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {gallery.map((url, idx) => (
              <div key={idx}
                className={`relative group rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${url === form.image ? 'border-[#E07820]' : 'border-gray-200 hover:border-[#4A2C17]'}`}
                style={{ height: 90 }}
                onClick={() => setAsMain(url)}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                {url === form.image && (
                  <div className="absolute top-1 left-1 bg-[#E07820] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Chính
                  </div>
                )}
                <button type="button"
                  onClick={e => { e.stopPropagation(); removeGalleryImg(idx) }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiTrash2 size={9} className="text-white" />
                </button>
              </div>
            ))}

            {/* Upload slot */}
            <div
              className="relative rounded-lg border-2 border-dashed border-gray-300 hover:border-[#4A2C17] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-gray-50"
              style={{ height: 90 }}
              onClick={() => galleryFileRef.current.click()}
            >
              {uploadingGallery
                ? <FiLoader size={18} className="text-gray-400 animate-spin" />
                : <><FiPlus size={18} className="text-gray-400" /><span className="text-[10px] text-gray-400 font-medium">Thêm ảnh</span></>
              }
              <input
                ref={galleryFileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={handleGalleryUpload}
              />
            </div>
          </div>

          {/* Main image fallback field */}
          <div>
            <label className={LABEL}>Ảnh chính (URL)</label>
            <div className="flex gap-2">
              <input type="text" value={f('image')} onChange={set('image')}
                className={`${INPUT} flex-1`} placeholder="URL hoặc upload qua gallery bên trên" />
              <input ref={mainFileRef} type="file" accept="image/*" className="hidden" onChange={handleMainUpload} />
              <button type="button" onClick={() => mainFileRef.current.click()} disabled={uploadingMain}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-60 whitespace-nowrap shrink-0">
                {uploadingMain ? <FiLoader size={14} className="animate-spin" /> : <FiUpload size={14} />}
                Upload
              </button>
            </div>
            {f('image') && (
              <img src={f('image')} alt="Preview" className="mt-2 h-20 w-auto rounded-lg object-cover border border-gray-200" />
            )}
          </div>
        </div>

        {/* ── Bilingual content ─────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['vi', 'en'].map(l => (
              <button key={l} type="button" onClick={() => setTab(l)}
                className={`px-5 py-3 text-sm font-semibold transition-colors ${tab === l ? 'border-b-2 border-[#4A2C17] text-[#4A2C17]' : 'text-gray-500 hover:text-gray-700'}`}>
                {l === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
              </button>
            ))}
          </div>
          <div className="p-6 space-y-4">
            {tab === 'vi' ? (
              <>
                <div>
                  <label className={LABEL}>Mô tả ngắn (VI)</label>
                  <textarea rows={3} value={f('description')} onChange={set('description')}
                    className={`${INPUT} resize-none`} placeholder="Mô tả ngắn hiển thị trên danh sách..." />
                </div>
                <div>
                  <label className={LABEL}>Nội dung chi tiết (VI)</label>
                  <textarea rows={12} value={f('detail')} onChange={set('detail')}
                    className={`${INPUT} resize-y text-sm leading-relaxed`}
                    placeholder={'Đặc điểm kỹ thuật:\n- Độ ẩm: ≤ 13,5%\n- Tạp chất: ≤ 1%\n\nNhấn Enter để xuống dòng.'} />
                  <p className="text-xs text-gray-400 mt-1">Nhập văn bản thường – nhấn Enter để xuống dòng, trang web sẽ hiển thị đúng như vậy.</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={LABEL}>Short Description (EN)</label>
                  <textarea rows={3} value={f('description_en')} onChange={set('description_en')}
                    className={`${INPUT} resize-none`} placeholder="Short description shown on listing..." />
                </div>
                <div>
                  <label className={LABEL}>Detailed Content (EN)</label>
                  <textarea rows={12} value={f('detail_en')} onChange={set('detail_en')}
                    className={`${INPUT} resize-y text-sm leading-relaxed`}
                    placeholder={'Technical Specifications:\n- Moisture: ≤ 13.5%\n- Admixture: ≤ 1%\n\nPress Enter for new line.'} />
                  <p className="text-xs text-gray-400 mt-1">Plain text – press Enter for new line, website will display exactly as typed.</p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pb-4">
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
