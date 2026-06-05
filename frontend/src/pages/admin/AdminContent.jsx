import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiUpload, FiSave } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const PAGE_SCHEMA = {
  'ca-phe': {
    label: '☕ Cà Phê',
    fields: [
      { key: 'hero_image', type: 'image', label: 'Ảnh hero chính' },
      { key: 'overview_title', type: 'text', label: 'Tiêu đề tổng quan' },
      { key: 'overview_text', type: 'textarea', label: 'Mô tả tổng quan' },
    ]
  },
  'gang-tay-y-te': {
    label: '🧤 Găng Tay Y Tế',
    fields: [
      { key: 'hero_image', type: 'image', label: 'Ảnh hero chính' },
      { key: 'overview_text', type: 'textarea', label: 'Mô tả tổng quan' },
    ]
  },
  'nong-san': {
    label: '🌿 Nông Sản',
    fields: [
      { key: 'hero_image', type: 'image', label: 'Ảnh hero chính' },
      { key: 'overview_text', type: 'textarea', label: 'Mô tả tổng quan' },
    ]
  },
  'than-khong-khoi': {
    label: '🔥 Than Không Khói',
    fields: [
      { key: 'hero_image', type: 'image', label: 'Ảnh hero chính' },
      { key: 'hero_title', type: 'text', label: 'Tiêu đề hero' },
      { key: 'hero_desc', type: 'textarea', label: 'Mô tả hero' },
    ]
  },
  'hoa-hong-say-lanh': {
    label: '🌹 Hoa Hồng Sấy Lạnh',
    fields: [
      { key: 'hero_image', type: 'image', label: 'Ảnh hero chính' },
      { key: 'hero_title', type: 'text', label: 'Tiêu đề hero' },
      { key: 'hero_desc', type: 'textarea', label: 'Mô tả hero' },
    ]
  },
  'home': {
    label: '🏠 Trang Chủ',
    fields: [
      { key: 'intro_text', type: 'textarea', label: 'Đoạn giới thiệu ngắn (thanh nâu)' },
    ]
  },
}

export default function AdminContent() {
  const [activePage, setActivePage] = useState('ca-phe')
  const [values, setValues] = useState({})
  const [uploading, setUploading] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileRefs = useRef({})
  const navigate = useNavigate()

  const schema = PAGE_SCHEMA[activePage]

  useEffect(() => {
    setValues({})
    axios.get(`/api/admin/content/${activePage}`, api())
      .then(r => setValues(r.data))
      .catch(() => navigate('/admin/login'))
  }, [activePage])

  const handleUpload = async (key, file) => {
    if (!file) return
    setUploading(key); setError('')
    try {
      const fd = new FormData(); fd.append('image', file)
      const { data } = await axios.post('/api/admin/upload', fd, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'multipart/form-data' }
      })
      setValues(v => ({ ...v, [key]: data.url }))
    } catch (err) { setError(err.response?.data?.error || 'Upload thất bại') }
    setUploading('')
  }

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      await axios.put(`/api/admin/content/${activePage}`, values, api())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) { setError(err.response?.data?.error || 'Lưu thất bại') }
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Nội Dung Trang</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-[#6B2200] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#4A1800] disabled:opacity-60 transition-colors">
          <FiSave size={15} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        {/* Page selector */}
        <div className="md:w-44 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {Object.entries(PAGE_SCHEMA).map(([key, schema]) => (
              <button key={key} onClick={() => setActivePage(key)}
                className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors ${activePage === key ? 'bg-[#6B2200] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                {schema.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-bold text-gray-900">{schema.label}</h2>

            {schema.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>

                {field.type === 'image' && (
                  <div>
                    <div className="flex gap-2">
                      <input type="text" value={values[field.key] || ''}
                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200]"
                        placeholder="URL ảnh hoặc upload từ máy" />
                      <input ref={el => fileRefs.current[field.key] = el} type="file" accept="image/*" className="hidden"
                        onChange={e => handleUpload(field.key, e.target.files[0])} />
                      <button type="button" onClick={() => fileRefs.current[field.key]?.click()}
                        disabled={uploading === field.key}
                        className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-60 whitespace-nowrap">
                        <FiUpload size={13} /> {uploading === field.key ? 'Uploading...' : 'Upload ảnh'}
                      </button>
                    </div>
                    {values[field.key] && (
                      <img src={values[field.key]} alt="" className="mt-2 h-36 w-auto rounded-lg object-cover border border-gray-200" />
                    )}
                  </div>
                )}

                {field.type === 'text' && (
                  <input type="text" value={values[field.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200]"
                    placeholder={`Nhập ${field.label.toLowerCase()}...`} />
                )}

                {field.type === 'textarea' && (
                  <textarea rows={4} value={values[field.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] resize-y"
                    placeholder={`Nhập ${field.label.toLowerCase()}...`} />
                )}
              </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {saved && <p className="text-green-600 text-sm font-medium">✅ Đã lưu! Trang web sẽ hiển thị nội dung mới ngay.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
