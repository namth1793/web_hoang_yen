import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowRight, FiSearch } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const catLabels = {
  vi: { que: 'Quế', hoi: 'Hồi', gung: 'Gừng', nghe: 'Nghệ' },
  en: { que: 'Cinnamon', hoi: 'Star Anise', gung: 'Ginger', nghe: 'Turmeric' },
}

const T = {
  vi: {
    title: 'Sản Phẩm Xuất Khẩu',
    home: 'Trang chủ',
    all: 'Tất cả sản phẩm',
    products_lbl: 'Danh mục sản phẩm',
    need_advice: 'Cần tư vấn?',
    need_advice_desc: 'Liên hệ ngay để được báo giá và tư vấn xuất khẩu',
    contact_btn: 'WhatsApp ngay',
    search_ph: 'Tìm sản phẩm...',
    view_detail: 'Xem chi tiết',
    origin: '📍',
    not_found: 'Không tìm thấy sản phẩm phù hợp',
  },
  en: {
    title: 'Export Products',
    home: 'Home',
    all: 'All Products',
    products_lbl: 'Product Categories',
    need_advice: 'Need Advice?',
    need_advice_desc: 'Contact us for pricing and export consultation',
    contact_btn: 'WhatsApp Now',
    search_ph: 'Search products...',
    view_detail: 'View Details',
    origin: '📍',
    not_found: 'No products found',
  },
}

export default function SanPham() {
  const { lang } = useLanguage()
  const t = T[lang]
  const cats = catLabels[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = activeCategory ? `/api/products?category=${activeCategory}` : '/api/products'
    axios.get(url).then(r => { setProducts(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [activeCategory])

  const filtered = products.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || (p.name_en || '').toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="bg-[#4A2C17] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">{t.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">{t.home}</Link>
            <span>/</span>
            <span className="text-[#E07820]">{t.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="bg-[#4A2C17] px-4 py-3">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">{t.products_lbl}</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setSearchParams({})}
                  className={`w-full text-left px-3 py-2.5 text-sm rounded transition-colors flex justify-between items-center ${!activeCategory ? 'bg-[#4A2C17] text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {t.all}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${!activeCategory ? 'bg-white/20 text-white' : 'bg-gray-100'}`}>{products.length || ''}</span>
                </button>
                {categories.map(cat => (
                  <button key={cat.category}
                    onClick={() => setSearchParams({ category: cat.category })}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded transition-colors flex justify-between items-center ${activeCategory === cat.category ? 'bg-[#4A2C17] text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {cats[cat.category] || cat.category}
                    <span className={`text-xs px-1.5 py-0.5 rounded ${activeCategory === cat.category ? 'bg-white/20 text-white' : 'bg-gray-100'}`}>{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#4A2C17] rounded-lg p-5 text-white">
              <h4 className="font-bold mb-2">{t.need_advice}</h4>
              <p className="text-gray-300 text-xs mb-4">{t.need_advice_desc}</p>
              <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
                className="block text-center bg-[#25D366] hover:bg-[#1da857] text-white py-2.5 font-semibold text-sm transition-colors rounded">
                {t.contact_btn}
              </a>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {activeCategory ? `${cats[activeCategory] || activeCategory} – ` : ''}{filtered.length} {lang === 'vi' ? 'sản phẩm' : 'products'}
              </p>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder={t.search_ph} value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border border-gray-300 pl-9 pr-4 py-2 text-sm rounded focus:outline-none focus:border-[#4A2C17] w-48" />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-72"></div>)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📦</div>
                <p>{t.not_found}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {filtered.map(p => (
                  <Link key={p.id} to={`/san-pham/${p.slug}`}
                    className="group bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E07820]/40 transition-all duration-300">
                    <div className="overflow-hidden h-52">
                      <img src={p.image} alt={lang === 'en' && p.name_en ? p.name_en : p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#E07820] uppercase bg-orange-50 px-2 py-0.5 rounded">
                          {cats[p.category] || p.category}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{p.unit}</span>
                      </div>
                      <h3 className="font-black text-gray-800 text-lg mb-1 group-hover:text-[#4A2C17] transition-colors">
                        {lang === 'en' && p.name_en ? p.name_en : p.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                        {lang === 'en' && p.description_en ? p.description_en : p.description}
                      </p>
                      <div className="text-xs text-gray-400 mb-3">{t.origin} {p.origin}</div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-[#4A2C17] text-sm font-semibold">{t.view_detail}</span>
                        <FiArrowRight className="text-[#E07820] group-hover:translate-x-1 transition-transform" size={16} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
