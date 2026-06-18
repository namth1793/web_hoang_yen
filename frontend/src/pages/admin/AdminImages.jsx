import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { FiCheck, FiExternalLink, FiLoader, FiPlus, FiUpload, FiX } from 'react-icons/fi'
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

// ─── Single image slot (click to replace, X to clear) ────────────────────────
function ImageSlot({ src, label, pageKey, contentKey, onSaved, fallback }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [current, setCurrent] = useState(src || '')

  useEffect(() => { setCurrent(src || '') }, [src])

  const persist = async (url) => {
    await axios.put(`/api/admin/content/${pageKey}`, { [contentKey]: url }, authH())
    setCurrent(url)
    setSaved(true)
    onSaved && onSaved(contentKey, url)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await axios.post('/api/admin/upload', fd, uploadH())
      await persist(data.url)
    } catch (err) {
      alert(err.response?.data?.error || 'Upload thất bại')
    }
    setUploading(false)
  }

  const handleClear = async (e) => {
    e.stopPropagation()
    if (!current) return
    try {
      await axios.put(`/api/admin/content/${pageKey}`, { [contentKey]: '' }, authH())
      setCurrent('')
      onSaved && onSaved(contentKey, '')
    } catch (err) {
      alert(err.response?.data?.error || 'Xóa thất bại')
    }
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
        {current && (
          <button
            type="button"
            onClick={handleClear}
            title="Xóa ảnh (về mặc định)"
            className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <FiX size={10} className="text-white" />
          </button>
        )}
        {saved && (
          <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
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

// ─── Dynamic gallery (add/delete any number of images) ───────────────────────
function GalleryManager({ rawJson, pageKey, contentKey, onChanged, fallbacks }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [list, setList] = useState(() => {
    try { return JSON.parse(rawJson || '[]') } catch { return [] }
  })

  useEffect(() => {
    try { setList(JSON.parse(rawJson || '[]')) } catch { setList([]) }
  }, [rawJson])

  const saveToDB = async (newList) => {
    await axios.put(
      `/api/admin/content/${pageKey}`,
      { [contentKey]: JSON.stringify(newList) },
      authH()
    )
    onChanged && onChanged(contentKey, newList)
  }

  const handleAdd = async (files) => {
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await Promise.all(
        Array.from(files).map(async f => {
          const fd = new FormData()
          fd.append('image', f)
          const { data } = await axios.post('/api/admin/upload', fd, uploadH())
          return data.url
        })
      )
      const newList = [...list, ...urls]
      await saveToDB(newList)
      setList(newList)
    } catch (err) {
      alert(err.response?.data?.error || 'Upload thất bại')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleRemove = async (idx) => {
    const newList = list.filter((_, i) => i !== idx)
    try {
      await saveToDB(newList)
      setList(newList)
    } catch (err) {
      alert(err.response?.data?.error || 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {list.map((url, idx) => (
          <div
            key={idx}
            className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
            style={{ height: 90 }}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { if (fallbacks?.[idx]) e.target.src = fallbacks[idx] }}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={9} className="text-white" />
            </button>
          </div>
        ))}

        {/* Add slot */}
        <div
          className="rounded-lg border-2 border-dashed border-gray-300 hover:border-[#E07820] flex flex-col items-center justify-center cursor-pointer bg-gray-50 transition-colors"
          style={{ height: 90 }}
          onClick={() => !uploading && fileRef.current.click()}
        >
          {uploading
            ? <FiLoader size={18} className="text-gray-400 animate-spin" />
            : <><FiPlus size={18} className="text-gray-400" /><span className="text-[10px] text-gray-400 mt-1">Thêm ảnh</span></>
          }
          <input
            ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => handleAdd(e.target.files)}
          />
        </div>
      </div>
      {list.length === 0 && (
        <p className="text-xs text-gray-400 mt-3">
          Chưa có ảnh nào – bấm "Thêm ảnh" để tải lên (có thể chọn nhiều ảnh cùng lúc)
        </p>
      )}
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

  const handleHomeSaved = (key, val) => setHome(p => ({ ...p, [key]: val }))
  const handleAboutSaved = (key, val) => {
    setAbout(p => ({ ...p, [key]: Array.isArray(val) ? JSON.stringify(val) : val }))
  }

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
        <p className="text-sm text-gray-500 mt-1">Upload ảnh từ máy tính – tự động lưu lên Cloudinary. Hover vào ảnh để thấy nút xóa.</p>
      </div>

      {/* ─── BANNERS ───────────────────────────────────────── */}
      <Section icon="🎞️" title="Banners Trang Chủ" sub="Slider ảnh lớn ở đầu trang chủ – thêm, xóa, sắp xếp thứ tự tại trang Banners">
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
        sub="4 ảnh trong phần 'Bộ sưu tập gia vị' – click để đổi, hover → X để xóa về mặc định"
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

      {/* ─── HOME – why image ───────────────────────────────── */}
      <Section
        icon="📸"
        title="Trang Chủ – Ảnh 'Tại Sao Chọn ARTOCA'"
        sub="Ảnh minh hoạ bên trái phần lý do chọn ARTOCA – click để đổi, X để xóa"
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
        sub="Ảnh bên phải phần Giới Thiệu Công Ty – click để đổi, X để xóa"
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
        sub="Thêm hoặc xóa ảnh tùy ý – chọn nhiều ảnh cùng lúc khi upload"
      >
        <GalleryManager
          rawJson={about['gallery_images']}
          pageKey="about"
          contentKey="gallery_images"
          onChanged={handleAboutSaved}
          fallbacks={GALLERY_FALLBACKS}
        />
      </Section>

      {/* ─── PRODUCTS (link-out) ────────────────────────────── */}
      <Section
        icon="📦"
        title="Ảnh Sản Phẩm (Đa Ảnh)"
        sub="Mỗi sản phẩm có ảnh chính + gallery – thêm/xóa tại trang chỉnh sửa sản phẩm"
      >
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-600">Quản lý trong phần Sản Phẩm – mỗi sản phẩm có bộ ảnh riêng</p>
          <Link to="/admin/products"
            className="inline-flex items-center gap-1.5 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] transition-colors">
            Đến trang Sản Phẩm <FiExternalLink size={13} />
          </Link>
        </div>
      </Section>

      {/* ─── NEWS (link-out) ────────────────────────────────── */}
      <Section icon="📰" title="Ảnh Bài Viết Tin Tức" sub="Mỗi bài viết có 1 ảnh thumbnail – quản lý khi tạo/sửa bài viết">
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-gray-600">Quản lý trong phần Tin Tức khi tạo hoặc chỉnh sửa bài viết</p>
          <Link to="/admin/news"
            className="inline-flex items-center gap-1.5 bg-[#4A2C17] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E1A0D] transition-colors">
            Đến trang Tin Tức <FiExternalLink size={13} />
          </Link>
        </div>
      </Section>

      <p className="text-xs text-gray-400 text-center pb-4">
        Ảnh upload lên Cloudinary – không giới hạn số lượng, max 10MB/ảnh
      </p>
    </div>
  )
}
