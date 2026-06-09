import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowRight, FiChevronRight } from 'react-icons/fi'
import { useLanguage } from '../context/LanguageContext'

const catMeta = {
  que: {
    vi: { name: 'Quế', desc: 'Quế Việt Nam từ vùng Văn Yên, Yên Bái – thơm nồng, hàm lượng tinh dầu cao, đa dạng chủng loại phục vụ xuất khẩu.' },
    en: { name: 'Cinnamon', desc: 'Vietnamese Cassia Cinnamon from Van Yen, Yen Bai – rich aroma, high oil content, diverse product forms for export.' },
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&q=80',
    color: '#8B4513',
  },
  hoi: {
    vi: { name: 'Hồi', desc: 'Hoa hồi Lạng Sơn – hình ngôi sao đẹp 8 cánh, hương thơm đặc trưng, tinh dầu cao. Xuất khẩu sang EU, Mỹ, châu Á.' },
    en: { name: 'Star Anise', desc: 'Star Anise from Lang Son – beautiful 8-petal star, distinctive aroma, high essential oil. Exported to EU, US, Asia.' },
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=700&q=80',
    color: '#6B3A2A',
  },
  gung: {
    vi: { name: 'Gừng', desc: 'Gừng Việt Nam từ Hưng Yên, Lào Cai – vị cay nồng đặc trưng, hàm lượng gingerol cao. Xuất khẩu tươi và chế biến.' },
    en: { name: 'Ginger', desc: 'Vietnamese Ginger from Hung Yen, Lao Cai – distinctive pungent flavor, high gingerol. Exported fresh and processed.' },
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=700&q=80',
    color: '#7A5C1E',
  },
  nghe: {
    vi: { name: 'Nghệ', desc: 'Nghệ Việt Nam giàu curcumin (2–5%) từ Bình Định, Tây Nguyên. Phục vụ dược phẩm, mỹ phẩm và thực phẩm chức năng.' },
    en: { name: 'Turmeric', desc: 'Vietnamese Turmeric rich in curcumin (2–5%) from Binh Dinh. For pharmaceuticals, cosmetics and functional foods.' },
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&q=80',
    color: '#C17F24',
  },
}

const oilLabel = {
  que:  { vi: 'Độ dầu',   en: 'Oil content' },
  hoi:  { vi: 'Tinh dầu', en: 'Essential oil' },
  gung: { vi: 'Gingerol', en: 'Gingerol' },
  nghe: { vi: 'Curcumin', en: 'Curcumin' },
}

const T = {
  vi: {
    title: 'Sản Phẩm Xuất Khẩu',
    home: 'Trang chủ',
    choose_category: 'Chọn danh mục sản phẩm',
    choose_desc: 'ARTOCA cung cấp 4 dòng gia vị xuất khẩu chất lượng cao từ Việt Nam',
    view_products: 'Xem sản phẩm',
    products_lbl: 'Danh mục',
    need_advice: 'Cần tư vấn?',
    need_advice_desc: 'Liên hệ ngay để được báo giá và tư vấn xuất khẩu',
    contact_btn: 'WhatsApp ngay',
    view_detail: 'Xem chi tiết',
    moisture: 'Độ ẩm',
    admixture: 'Tạp chất',
    variants: 'loại sản phẩm',
    back: '← Tất cả danh mục',
  },
  en: {
    title: 'Export Products',
    home: 'Home',
    choose_category: 'Choose Product Category',
    choose_desc: 'ARTOCA supplies 4 lines of premium Vietnamese export spices',
    view_products: 'View Products',
    products_lbl: 'Categories',
    need_advice: 'Need Advice?',
    need_advice_desc: 'Contact us for pricing and export consultation',
    contact_btn: 'WhatsApp Now',
    view_detail: 'View Details',
    moisture: 'Moisture',
    admixture: 'Admixture',
    variants: 'products',
    back: '← All Categories',
  },
}

export default function SanPham() {
  const { lang } = useLanguage()
  const t = T[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!activeCategory) { setProducts([]); setLoading(false); return }
    setLoading(true)
    axios.get(`/api/products?category=${activeCategory}`)
      .then(r => { setProducts(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeCategory])

  const activeMeta = activeCategory ? catMeta[activeCategory] : null
  const activeName = activeMeta ? activeMeta[lang].name : ''

  return (
    <div>
      <div className="bg-[#4A2C17] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">{t.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">{t.home}</Link>
            <span>/</span>
            {activeCategory ? (
              <>
                <button onClick={() => setSearchParams({})} className="hover:text-white">{t.title}</button>
                <span>/</span>
                <span className="text-[#E07820]">{activeName}</span>
              </>
            ) : (
              <span className="text-[#E07820]">{t.title}</span>
            )}
          </div>
        </div>
      </div>

      {!activeCategory ? (
        /* ── CATEGORY OVERVIEW ───────────────────────────────────────────── */
        <section className="py-14 bg-[#FBF5EF]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="w-12 h-1 bg-[#E07820] mx-auto mb-4"></div>
              <h2 className="text-2xl font-black text-[#4A2C17]">{t.choose_category}</h2>
              <p className="text-gray-500 text-sm mt-2">{t.choose_desc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['que', 'hoi', 'gung', 'nghe'].map(key => {
                const meta = catMeta[key]
                const count = categories.find(c => c.category === key)?.count || 0
                return (
                  <button
                    key={key}
                    onClick={() => setSearchParams({ category: key })}
                    className="group text-left overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 hover:border-[#E07820]"
                  >
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={meta.image}
                        alt={meta[lang].name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-4">
                        <span className="text-white font-black text-2xl">{meta[lang].name}</span>
                        <div className="text-white/80 text-xs mt-0.5">
                          {count} {t.variants}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                        {meta[lang].desc}
                      </p>
                      <div className="flex items-center gap-1 text-[#E07820] font-semibold text-sm group-hover:gap-2 transition-all">
                        {t.view_products}
                        <FiChevronRight size={14} />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        /* ── PRODUCT SUBCATEGORY GRID ────────────────────────────────────── */
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-60 shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                <div className="bg-[#4A2C17] px-4 py-3">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">{t.products_lbl}</h3>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setSearchParams({})}
                    className="w-full text-left px-3 py-2 text-sm rounded transition-colors text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 mb-1"
                  >
                    <FiArrowRight size={12} className="rotate-180" />
                    {t.back}
                  </button>
                  {categories.map(cat => (
                    <button key={cat.category}
                      onClick={() => setSearchParams({ category: cat.category })}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded transition-colors flex justify-between items-center ${activeCategory === cat.category ? 'bg-[#4A2C17] text-white font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {catMeta[cat.category]?.[lang]?.name || cat.category}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${activeCategory === cat.category ? 'bg-white/20 text-white' : 'bg-gray-100'}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#4A2C17] rounded-lg p-5 text-white">
                <h4 className="font-bold mb-2">{t.need_advice}</h4>
                <p className="text-gray-300 text-xs mb-4">{t.need_advice_desc}</p>
                <a href="https://wa.me/84986768378" target="_blank" rel="noreferrer"
                  className="block text-center bg-[#25D366] hover:bg-[#1da857] text-white py-2.5 font-semibold text-sm transition-colors rounded">
                  {t.contact_btn}
                </a>
              </div>
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {activeMeta && (
                <div className="mb-6 p-5 bg-[#FBF5EF] rounded-lg border border-orange-100 flex items-center gap-4">
                  <img src={activeMeta.image} alt={activeName} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                  <div>
                    <h2 className="font-black text-[#4A2C17] text-xl">{activeName}</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{activeMeta[lang].desc}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-64"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map(p => {
                    const displayName = lang === 'en' && p.name_en ? p.name_en : p.name
                    const olLabel = oilLabel[p.category]?.[lang] || (lang === 'vi' ? 'Độ dầu' : 'Oil')
                    return (
                      <Link key={p.id} to={`/san-pham/${p.slug}`}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#E07820]/50 transition-all duration-300">
                        <div className="overflow-hidden h-44">
                          <img src={p.image} alt={displayName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-black text-gray-800 text-base mb-2 group-hover:text-[#4A2C17] transition-colors leading-tight">
                            {displayName}
                          </h3>
                          {/* Key specs on separate lines */}
                          <div className="space-y-1 mb-3">
                            {p.moisture && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400 w-20 shrink-0">{t.moisture}:</span>
                                <span className="font-semibold text-[#4A2C17]">{p.moisture}</span>
                              </div>
                            )}
                            {p.admixture && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400 w-20 shrink-0">{t.admixture}:</span>
                                <span className="font-semibold text-[#4A2C17]">{p.admixture}</span>
                              </div>
                            )}
                            {p.oil && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-400 w-20 shrink-0">{olLabel}:</span>
                                <span className="font-semibold text-[#E07820]">{p.oil}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="text-[#4A2C17] text-xs font-semibold">{t.view_detail}</span>
                            <FiArrowRight className="text-[#E07820] group-hover:translate-x-1 transition-transform" size={14} />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
