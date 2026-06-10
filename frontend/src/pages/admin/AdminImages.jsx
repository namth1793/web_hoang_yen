import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { FiCheck, FiExternalLink, FiImage, FiLoader, FiUpload } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

const authH = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
})
const uploadH = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    'Content-Type': 'multipart/form-data',
  }
})

// ─── Reusable image slot ─────────────────────────────────────────────────────
function ImageSlot({ src, label, pageKey, contentKey, onSaved, fallback }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [current, setCurrent] = useState(src || '')

  useEffect(() => { setCurrent(src || '') }, [src])

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await axios.post('/api/admin/upload', fd, uploadH())
      const url = data.url
      await axios.put(`/api/admin/content/${pageKey}`, { [contentKey]: url }, authH())
      setCurrent(url)
      setSaved(true)
      onSaved && onSaved(contentKey, url)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      alert(err.response?.data?.error || 'Upload thất bại')
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="relative group overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-[#E07820] transition-colors"
        style={{ height: 130 }}
        onClick={() => ref.current.click()}
      >
        <img
          src={current || fallback}
          alt={label}
          className="w-full h-full object-cover"
          onError={e => { if (fallback) e.target.src = fallback }}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
          {uploading
            ? <FiLoader size={20} className="text-white animate-spin" />
            : <><FiUpload size={18} className="text-white" /><span className="text-white text-xs font-semibold">Đổi ảnh</span></>
          }
        </div>
        {saved && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <FiCheck size={12} className="text-white" />
          </div>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
      </div>
      <p className="text-[11px] text-gray-600 text-center font-medium leading-tight">{label}</p>
    </div>
  )
}

// ─── Section card wrapper ────────────────────────────────────────────────────
function Section({ icon, title, sub, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
        <div className="text-xl">{icon}</div>
        <div>
          <h2 className="font-bold text-gray-900 text-base leading-tight">{title}</h2>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminImages() {
  const navigate = useNavigate()
  const [home, setHome] = useState({})
  const [about, setAbout] = useState({})

  useEffect(() => {
    axios.get('/api/admin/content/home', authH())
      .then(r => setHome(r.data))
      .catch(() => navigate('/admin/login'))
    axios.get('/api/admin/content/about', authH())
      .then(r => setAbout(r.data))
      .catch(() => {})
  }, [])

  const handleHomeSaved = (key, url) => setHome(p => ({ ...p, [key]: url }))
  const handleAboutSaved = (key, url) => setAbout(p => ({ ...p, [key]: url }))

  const CAT_FALLBACKS = {
    cat_que_img:  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=70',
    cat_hoi_img:  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=70',
    cat_gung_img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=70',
    cat_nghe_img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=70',
    why_img:      'https://images.unsplash.com/photo-1542601098-8fc114e148e2?w=400&q=70',
  }

  const GALLERY_FALLBACKS = [
    'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=70',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=70',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=70',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=70',
    'https://images.unsplash.com/photo-1542601906897-ecd92d0d52f5?w=400&q=70',
    'https://images.unsplash.com/photo-1543565077-c1c5dcaab1bf?w=400&q=70',
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Quản Lý Hình Ảnh</h1>
        <p className="text-sm text-gray-500 mt-1">Upload ảnh từ máy tính – tự động lưu lên Cloudinary</p>
      </div>

      {/* ─── BANNERS (link-out) ─────────────────────────────── */}
      <Section icon="🎞️" title="Banners Trang Chủ" sub="Slider ảnh lớn ở đầu trang chủ">
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-600">Quản lý tại trang Banners – thêm, xóa, sắp xếp thứ tự slider</p>
          <Link to="/admin/banners"
            className="inline-flex items-center gap-1.5 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] transition-colors">
            Đến trang Banners <FiExternalLink size={13} />
          </Link>
        </div>
      </Section>

      {/* ─── HOME – category images ─────────────────────────── */}
      <Section
        icon="🏠"
        title="Trang Chủ – Ảnh Danh Mục Sản Phẩm"
        sub="4 ảnh hiển thị trong phần 'Bộ sưu tập gia vị' trang chủ"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'cat_que_img',  label: 'Quế (Cinnamon)' },
            { key: 'cat_hoi_img',  label: 'Hồi (Star Anise)' },
            { key: 'cat_gung_img', label: 'Gừng (Ginger)' },
            { key: 'cat_nghe_img', label: 'Nghệ (Turmeric)' },
          ].map(({ key, label }) => (
            <ImageSlot
              key={key}
              src={home[key]}
              fallback={CAT_FALLBACKS[key]}
              label={label}
              pageKey="home"
              contentKey={key}
              onSaved={handleHomeSaved}
            />
          ))}
        </div>
      </Section>

      {/* ─── HOME – why section image ───────────────────────── */}
      <Section
        icon="📸"
        title="Trang Chủ – Ảnh Section 'Tại Sao Chọn ARTOCA'"
        sub="Ảnh minh hoạ hiển thị bên trái phần lý do chọn ARTOCA"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ImageSlot
            src={home['why_img']}
            fallback={CAT_FALLBACKS['why_img']}
            label="Ảnh kiểm soát chất lượng"
            pageKey="home"
            contentKey="why_img"
            onSaved={handleHomeSaved}
          />
        </div>
      </Section>

      {/* ─── ABOUT – overview image ─────────────────────────── */}
      <Section
        icon="🏢"
        title="Trang Giới Thiệu – Ảnh Tổng Quan Công Ty"
        sub="Ảnh hiển thị bên phải phần Giới Thiệu Công Ty"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ImageSlot
            src={about['overview_img']}
            fallback="https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=70"
            label="Ảnh tổng quan"
            pageKey="about"
            contentKey="overview_img"
            onSaved={handleAboutSaved}
          />
        </div>
      </Section>

      {/* ─── ABOUT – gallery ────────────────────────────────── */}
      <Section
        icon="🖼️"
        title="Trang Giới Thiệu – Bộ Ảnh Hoạt Động"
        sub="6 ảnh trong gallery trang Giới Thiệu (click ảnh để đổi)"
      >
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ImageSlot
              key={i}
              src={about[`gallery_${i}`]}
              fallback={GALLERY_FALLBACKS[i - 1]}
              label={`Ảnh ${i}`}
              pageKey="about"
              contentKey={`gallery_${i}`}
              onSaved={handleAboutSaved}
            />
          ))}
        </div>
      </Section>

      {/* ─── PRODUCTS (link-out) ────────────────────────────── */}
      <Section
        icon="📦"
        title="Ảnh Sản Phẩm (Đa Ảnh)"
        sub="Mỗi sản phẩm có ảnh chính + bộ ảnh gallery (carousel)"
      >
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-600">Quản lý trong phần Sản Phẩm – mỗi sản phẩm có riêng bộ ảnh riêng</p>
          <Link to="/admin/products"
            className="inline-flex items-center gap-1.5 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] transition-colors">
            Đến trang Sản Phẩm <FiExternalLink size={13} />
          </Link>
        </div>
      </Section>

      {/* ─── NEWS (link-out) ────────────────────────────────── */}
      <Section icon="📰" title="Ảnh Bài Viết Tin Tức" sub="Mỗi bài viết có 1 ảnh thumbnail">
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-600">Quản lý trong phần Tin Tức khi tạo hoặc chỉnh sửa bài viết</p>
          <Link to="/admin/news"
            className="inline-flex items-center gap-1.5 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] transition-colors">
            Đến trang Tin Tức <FiExternalLink size={13} />
          </Link>
        </div>
      </Section>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center pb-4">
        Ảnh upload lên Cloudinary – không giới hạn dung lượng tổng, max 10MB/ảnh
      </p>
    </div>
  )
}
