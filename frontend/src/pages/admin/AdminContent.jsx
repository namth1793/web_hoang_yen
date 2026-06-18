import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiSave } from 'react-icons/fi'

const api = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })

// Current website text — pre-populated so admin sees existing content immediately
const PAGE_DEFAULTS = {
  home: {
    hero_title_vi: 'Chất Lượng Từ\nVùng Nguyên Liệu',
    hero_title_en: 'Quality From\nThe Source',
    hero_desc_vi:  'ARTOCA chuyên xuất khẩu quế, hồi, gừng, nghệ chất lượng cao từ Việt Nam – đạt tiêu chuẩn ISO 22000, HACCP & FDA.',
    hero_desc_en:  'ARTOCA exports premium Vietnamese cinnamon, star anise, ginger & turmeric – certified ISO 22000, HACCP & FDA.',
  },
  about: {
    overview_title_vi: 'CÔNG TY TNHH XNK ARTOCA',
    overview_title_en: 'ARTOCA IMPORT EXPORT CO., LTD',
    overview_body_vi:
      'Công ty TNHH XNK Artoca là doanh nghiệp xuất khẩu uy tín các sản phẩm gia vị chất lượng cao từ Việt Nam ra thị trường quốc tế, bao gồm quế, hồi, tiêu, điều, gừng, nghệ,…\n\nVới định hướng phát triển dựa trên các giá trị cốt lõi về chất lượng, uy tín và tính bền vững, ARTOCA cam kết trở thành đối tác tin cậy, góp phần đưa những gia vị tinh túy của Việt Nam vươn xa trên thị trường quốc tế.',
    overview_body_en:
      'ARTOCA Import Export Co., Ltd is a trusted exporter of Vietnamese spice products. Our diverse portfolio includes premium cassia cinnamon, star anise, pepper, cashew, ginger and turmeric.\n\nBased on the principles of quality, reliability, and sustainability, Artoca is committed to being a trusted partner, bringing Vietnam\'s precious spices closer to the global market.',
    vision_vi:
      'ARTOCA hướng tới trở thành thương hiệu hàng đầu và đáng tin cậy trong lĩnh vực xuất khẩu nông sản Việt Nam, được các đối tác quốc tế tin tưởng và lựa chọn. Với định hướng phát triển bền vững, chúng tôi mong muốn xây dựng cầu nối vững chắc đưa tinh hoa nông sản Việt vươn ra thế giới, góp phần nâng tầm vị thế nông sản Việt Nam trên thị trường toàn cầu.',
    vision_en:
      "ARTOCA Company aims to become a leading and trusted brand in Vietnam's agricultural export industry, recognized and chosen by international partners. With a sustainable development orientation, we aspire to build a strong bridge that brings the essence of Vietnamese agriculture to the world.",
    mission_vi:
      'ARTOCA mang sứ mệnh kết nối nông sản Việt Nam với thị trường thế giới thông qua việc cung cấp các sản phẩm chất lượng cao, an toàn, bền vững và đạt tiêu chuẩn quốc tế. Chúng tôi cam kết đồng hành cùng người nông dân, đối tác và khách hàng trong việc tạo dựng giá trị lâu dài, đồng thời lan tỏa hương vị đích thực của Việt Nam đến toàn cầu.',
    mission_en:
      "ARTOCA's mission is to connect Vietnamese agricultural products with the world by providing internationally certified, high-quality, safe, and sustainable products. We are committed to accompanying farmers, partners, and customers in creating long-term value and spreading the authentic taste of Vietnam globally.",
  },
  contact: {
    intro_vi:            'Liên hệ với chúng tôi để nhận báo giá chi tiết và tư vấn về sản phẩm xuất khẩu.',
    intro_en:            'Contact us to receive a detailed quote and consultation about our export products.',
    address_hq_vi:       'Số 41, ngõ 190 đường Hoàng Mai, Hà Nội',
    address_hq_en:       'No.41, alley 190, Hoang Mai road, Hanoi, Vietnam',
    address_factory_vi:  'TT Mậu A, Lào Cai, Việt Nam',
    address_factory_en:  'Mau A town, Lao Cai Province, Vietnam',
  },
}

// Schema: each page has pairs of bilingual fields rendered side by side
const PAGE_SCHEMA = {
  home: {
    label: '🏠 Trang Chủ',
    pairs: [
      {
        sectionLabel: 'Tiêu đề Hero',
        vi: { key: 'hero_title_vi', type: 'text' },
        en: { key: 'hero_title_en', type: 'text' },
      },
      {
        sectionLabel: 'Mô tả Hero',
        vi: { key: 'hero_desc_vi', type: 'textarea', rows: 4 },
        en: { key: 'hero_desc_en', type: 'textarea', rows: 4 },
      },
    ],
  },
  about: {
    label: '📖 Giới Thiệu',
    pairs: [
      {
        sectionLabel: 'Tiêu đề Tổng Quan Công Ty',
        vi: { key: 'overview_title_vi', type: 'text' },
        en: { key: 'overview_title_en', type: 'text' },
      },
      {
        sectionLabel: 'Nội Dung Tổng Quan',
        vi: { key: 'overview_body_vi', type: 'textarea', rows: 6 },
        en: { key: 'overview_body_en', type: 'textarea', rows: 6 },
      },
      {
        sectionLabel: 'Tầm Nhìn (Vision)',
        vi: { key: 'vision_vi', type: 'textarea', rows: 5 },
        en: { key: 'vision_en', type: 'textarea', rows: 5 },
      },
      {
        sectionLabel: 'Sứ Mệnh (Mission)',
        vi: { key: 'mission_vi', type: 'textarea', rows: 5 },
        en: { key: 'mission_en', type: 'textarea', rows: 5 },
      },
    ],
  },
  contact: {
    label: '📞 Liên Hệ',
    pairs: [
      {
        sectionLabel: 'Lời Giới Thiệu Trang Liên Hệ',
        vi: { key: 'intro_vi', type: 'textarea', rows: 3 },
        en: { key: 'intro_en', type: 'textarea', rows: 3 },
      },
      {
        sectionLabel: 'Địa Chỉ Trụ Sở',
        vi: { key: 'address_hq_vi', type: 'text' },
        en: { key: 'address_hq_en', type: 'text' },
      },
      {
        sectionLabel: 'Địa Chỉ Nhà Máy',
        vi: { key: 'address_factory_vi', type: 'text' },
        en: { key: 'address_factory_en', type: 'text' },
      },
    ],
  },
}

const INPUT = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200]'

export default function AdminContent() {
  const [activePage, setActivePage] = useState('home')
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const schema = PAGE_SCHEMA[activePage]

  useEffect(() => {
    const defaults = PAGE_DEFAULTS[activePage] || {}
    setValues({ ...defaults })
    axios.get(`/api/admin/content/${activePage}`, api())
      .then(r => {
        // Merge: CMS non-empty values override defaults, empty values keep defaults
        setValues(prev => {
          const merged = { ...prev }
          Object.entries(r.data).forEach(([k, v]) => { if (v !== '') merged[k] = v })
          return merged
        })
      })
      .catch(() => navigate('/admin/login'))
  }, [activePage])

  const set = (key) => (e) => setValues(v => ({ ...v, [key]: e.target.value }))

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
        <div>
          <h1 className="text-2xl font-black text-gray-900">Nội Dung Trang</h1>
          <p className="text-sm text-gray-400 mt-1">Nhập văn bản thường – nhấn Enter để xuống dòng, trang web đồng bộ ngay.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-[#6B2200] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#4A1800] disabled:opacity-60 transition-colors">
          <FiSave size={15} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        {/* Page selector */}
        <div className="md:w-44 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {Object.entries(PAGE_SCHEMA).map(([key, s]) => (
              <button key={key} onClick={() => setActivePage(key)}
                className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-100 last:border-0 transition-colors ${activePage === key ? 'bg-[#6B2200] text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 px-1 leading-relaxed">
            Nội dung hiển thị sẵn là nội dung đang dùng trên web. Chỉnh sửa rồi bấm "Lưu thay đổi".
          </p>
        </div>

        {/* 2-column bilingual fields */}
        <div className="flex-1 space-y-5">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-4 px-0.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇻🇳</span>
              <span className="font-bold text-gray-700 text-sm">Tiếng Việt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🇬🇧</span>
              <span className="font-bold text-gray-700 text-sm">English</span>
            </div>
          </div>

          {schema.pairs.map(pair => (
            <div key={pair.vi.key} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-bold text-[#6B2200] uppercase tracking-wide mb-3">{pair.sectionLabel}</p>
              <div className="grid grid-cols-2 gap-4">
                {/* VI */}
                <div>
                  {pair.vi.type === 'text' ? (
                    <input
                      type="text"
                      value={values[pair.vi.key] || ''}
                      onChange={set(pair.vi.key)}
                      className={INPUT}
                    />
                  ) : (
                    <textarea
                      rows={pair.vi.rows || 4}
                      value={values[pair.vi.key] || ''}
                      onChange={set(pair.vi.key)}
                      className={`${INPUT} resize-y`}
                    />
                  )}
                </div>
                {/* EN */}
                <div>
                  {pair.en.type === 'text' ? (
                    <input
                      type="text"
                      value={values[pair.en.key] || ''}
                      onChange={set(pair.en.key)}
                      className={INPUT}
                    />
                  ) : (
                    <textarea
                      rows={pair.en.rows || 4}
                      value={values[pair.en.key] || ''}
                      onChange={set(pair.en.key)}
                      className={`${INPUT} resize-y`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {saved && <p className="text-green-600 text-sm font-medium">✅ Đã lưu! Trang web hiển thị nội dung mới ngay.</p>}
        </div>
      </div>
    </div>
  )
}
