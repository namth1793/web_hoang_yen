import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiSave } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

const PAGE_SCHEMA = {
  'home': {
    label: '🏠 Trang Chủ',
    fields: [
      { key: 'hero_title_vi', type: 'text',     label: 'Tiêu đề hero (VI)',      ph: 'Chất Lượng Từ Vùng Nguyên Liệu' },
      { key: 'hero_title_en', type: 'text',     label: 'Hero title (EN)',         ph: 'Quality From The Source' },
      { key: 'hero_desc_vi',  type: 'textarea', label: 'Mô tả hero (VI)',         ph: 'ARTOCA chuyên xuất khẩu quế, hồi, gừng, nghệ chất lượng cao...' },
      { key: 'hero_desc_en',  type: 'textarea', label: 'Hero description (EN)',   ph: 'ARTOCA exports premium Vietnamese cinnamon, star anise...' },
    ]
  },
  'about': {
    label: '📖 Giới Thiệu',
    fields: [
      { key: 'overview_title_vi', type: 'text',     label: 'Tiêu đề tổng quan (VI)',  ph: 'CÔNG TY TNHH XNK ARTOCA' },
      { key: 'overview_title_en', type: 'text',     label: 'Overview title (EN)',      ph: 'ARTOCA IMPORT EXPORT CO., LTD' },
      { key: 'overview_body_vi',  type: 'textarea', label: 'Nội dung tổng quan (VI)', ph: 'Công ty TNHH XNK Artoca là doanh nghiệp xuất khẩu uy tín...\n\nNhập Enter để xuống dòng.' },
      { key: 'overview_body_en',  type: 'textarea', label: 'Overview body (EN)',       ph: 'ARTOCA Import Export Co., Ltd is a trusted exporter...\n\nPress Enter for new paragraph.' },
      { key: 'vision_vi',         type: 'textarea', label: 'Tầm nhìn (VI)',            ph: 'ARTOCA hướng tới trở thành thương hiệu hàng đầu...' },
      { key: 'vision_en',         type: 'textarea', label: 'Vision (EN)',               ph: 'ARTOCA aims to become a leading and trusted brand...' },
      { key: 'mission_vi',        type: 'textarea', label: 'Sứ mệnh (VI)',              ph: 'ARTOCA mang sứ mệnh kết nối nông sản Việt Nam...' },
      { key: 'mission_en',        type: 'textarea', label: 'Mission (EN)',               ph: "ARTOCA's mission is to connect Vietnamese agricultural products..." },
    ]
  },
  'contact': {
    label: '📞 Liên Hệ',
    fields: [
      { key: 'intro_vi',       type: 'textarea', label: 'Lời giới thiệu trang Liên Hệ (VI)', ph: 'Liên hệ với chúng tôi để nhận báo giá và tư vấn...' },
      { key: 'intro_en',       type: 'textarea', label: 'Contact page intro (EN)',             ph: 'Contact us to receive a quote and consultation...' },
      { key: 'address_hq_vi',  type: 'text',     label: 'Địa chỉ trụ sở (VI)',               ph: 'Số 41, ngõ 190 đường Hoàng Mai, Hà Nội' },
      { key: 'address_hq_en',  type: 'text',     label: 'HQ Address (EN)',                    ph: 'No.41, alley 190, Hoang Mai road, Hanoi, Vietnam' },
      { key: 'address_factory_vi', type: 'text', label: 'Địa chỉ nhà máy (VI)',              ph: 'TT Mậu A, Lào Cai, Việt Nam' },
      { key: 'address_factory_en', type: 'text', label: 'Factory Address (EN)',               ph: 'Mau A town, Lao Cai Province, Vietnam' },
    ]
  },
}

export default function AdminContent() {
  const [activePage, setActivePage] = useState('home')
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const schema = PAGE_SCHEMA[activePage]

  useEffect(() => {
    setValues({})
    axios.get(`/api/admin/content/${activePage}`, api())
      .then(r => setValues(r.data))
      .catch(() => navigate('/admin/login'))
  }, [activePage])

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

                {field.type === 'text' && (
                  <input type="text" value={values[field.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200]"
                    placeholder={field.ph || `Nhập ${field.label.toLowerCase()}...`} />
                )}

                {field.type === 'textarea' && (
                  <textarea rows={4} value={values[field.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200] resize-y"
                    placeholder={field.ph || `Nhập ${field.label.toLowerCase()}...`} />
                )}
                {field.type === 'textarea' && (
                  <p className="text-xs text-gray-400 mt-1">Nhấn Enter để xuống dòng – trang web sẽ hiển thị đúng như bạn nhập.</p>
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
