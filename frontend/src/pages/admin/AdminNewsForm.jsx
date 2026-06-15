import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const toSlug = str => str.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-').replace(/-+/g, '-').trim()

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A2C17]'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'

export default function AdminNewsForm() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState({
    title: '', title_en: '', slug: '', category: 'tin-cong-ty',
    summary: '', summary_en: '', content: '', image: '', author: 'ARTOCA'
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('vi')

  useEffect(() => {
    if (!isNew) {
      axios.get('/api/admin/news', api())
        .then(r => {
          const item = r.data.find(n => n.id === parseInt(id))
          if (item) setForm({
            title: item.title || '', title_en: item.title_en || '',
            slug: item.slug || '', category: item.category || 'tin-cong-ty',
            summary: item.summary || '', summary_en: item.summary_en || '',
            content: item.content || '', image: item.image || '',
            author: item.author || 'ARTOCA'
          })
        })
        .catch(() => navigate('/admin/login'))
    }
  }, [id])

  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm(f => ({ ...f, title, slug: isNew ? toSlug(title) : f.slug }))
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
        await axios.post('/api/admin/news', form, api())
      } else {
        await axios.put(`/api/admin/news/${id}`, form, api())
      }
      navigate('/admin/news')
    } catch (err) {
      setError(err.response?.data?.error || 'Lưu thất bại')
    }
    setSaving(false)
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/news" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black text-gray-900">{isNew ? 'Thêm bài viết mới' : 'Sửa bài viết'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meta card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 pb-2 border-b border-gray-100">Thông tin cơ bản</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Slug *</label>
              <input type="text" required value={form.slug} onChange={set('slug')}
                className={INPUT} placeholder="ten-bai-viet" />
            </div>
            <div>
              <label className={LABEL}>Danh mục</label>
              <select value={form.category} onChange={set('category')}
                className={`${INPUT} bg-white`}>
                <option value="tin-cong-ty">Tin công ty</option>
                <option value="thi-truong">Thị trường</option>
                <option value="su-kien">Sự kiện</option>
                <option value="tuyen-dung">Tuyển dụng</option>
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL}>Tác giả</label>
            <input type="text" value={form.author} onChange={set('author')}
              className={INPUT} placeholder="ARTOCA" />
          </div>

          <div>
            <label className={LABEL}>Ảnh đại diện</label>
            <div className="flex items-start gap-3">
              <input type="text" value={form.image} onChange={set('image')}
                className={`${INPUT} flex-1`} placeholder="URL ảnh hoặc upload" />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-60 whitespace-nowrap">
                <FiUpload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {form.image && (
              <img src={form.image} alt="" className="mt-2 h-28 w-auto rounded-lg object-cover border border-gray-200" />
            )}
          </div>
        </div>

        {/* Bilingual content card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                  <label className={LABEL}>Tiêu đề *</label>
                  <input type="text" required value={form.title} onChange={handleTitleChange}
                    className={INPUT} placeholder="Nhập tiêu đề bài viết" />
                </div>
                <div>
                  <label className={LABEL}>Tóm tắt</label>
                  <textarea rows={2} value={form.summary} onChange={set('summary')}
                    className={`${INPUT} resize-none`}
                    placeholder="Mô tả ngắn hiển thị trên danh sách tin..." />
                </div>
                <div>
                  <label className={LABEL}>Nội dung bài viết</label>
                  <textarea rows={14} value={form.content} onChange={set('content')}
                    className={`${INPUT} resize-y text-sm leading-relaxed`}
                    placeholder={'Nhập nội dung bài viết...\n\nNhấn Enter để xuống dòng hoặc tạo đoạn văn mới.\n\nTrang web sẽ hiển thị đúng như bạn nhập ở đây.'} />
                  <p className="text-xs text-gray-400 mt-1">Nhập văn bản thường – nhấn Enter để xuống dòng. Nội dung dùng chung cho cả VI và EN.</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={LABEL}>Title (EN)</label>
                  <input type="text" value={form.title_en} onChange={set('title_en')}
                    className={INPUT} placeholder="Article title in English" />
                </div>
                <div>
                  <label className={LABEL}>Summary (EN)</label>
                  <textarea rows={2} value={form.summary_en} onChange={set('summary_en')}
                    className={`${INPUT} resize-none`}
                    placeholder="Short description shown on news listing..." />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                  <p>💡 Nội dung bài viết (content) dùng chung cho cả VI và EN. Chỉ tiêu đề và tóm tắt có bản dịch riêng.</p>
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
            {saving ? 'Đang lưu...' : (isNew ? 'Tạo bài viết' : 'Lưu thay đổi')}
          </button>
          <Link to="/admin/news"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}
