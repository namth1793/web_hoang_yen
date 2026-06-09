import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft, FiArrowRight, FiChevronLeft, FiChevronRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const catMeta = {
  vi: { que: 'Quế', hoi: 'Hồi', gung: 'Gừng', nghe: 'Nghệ' },
  en: { que: 'Cinnamon', hoi: 'Star Anise', gung: 'Ginger', nghe: 'Turmeric' },
}

const oilLabel = {
  que:  { vi: 'Độ dầu',   en: 'Oil content' },
  hoi:  { vi: 'Tinh dầu', en: 'Essential oil' },
  gung: { vi: 'Gingerol', en: 'Gingerol' },
  nghe: { vi: 'Curcumin', en: 'Curcumin' },
}

const T = {
  vi: {
    home: 'Trang chủ',
    products: 'Sản phẩm',
    origin_lbl: 'Xuất xứ',
    unit_lbl: 'Đơn vị',
    moisture: 'Độ ẩm',
    admixture: 'Tạp chất',
    specs_title: 'Thông số kỹ thuật',
    wa_btn: 'WhatsApp',
    email_btn: 'Gửi email',
    detail_title: 'Thông Tin Chi Tiết',
    quote_title: 'Yêu cầu báo giá',
    sent_title: 'Đã gửi yêu cầu!',
    sent_desc: 'Chúng tôi sẽ liên hệ sớm',
    name_ph: 'Họ tên *',
    email_ph: 'Email *',
    phone_ph: 'Điện thoại',
    msg_ph: 'Số lượng, yêu cầu cụ thể...',
    send_btn: 'Gửi yêu cầu',
    contact_title: 'Thông tin liên hệ',
    related_title: 'Sản phẩm cùng loại',
    not_found: 'Không tìm thấy sản phẩm',
    img_prev: 'Ảnh trước',
    img_next: 'Ảnh tiếp',
  },
  en: {
    home: 'Home',
    products: 'Products',
    origin_lbl: 'Origin',
    unit_lbl: 'Unit',
    moisture: 'Moisture',
    admixture: 'Admixture',
    specs_title: 'Technical Specifications',
    wa_btn: 'WhatsApp',
    email_btn: 'Send Email',
    detail_title: 'Product Details',
    quote_title: 'Request a Quote',
    sent_title: 'Request Sent!',
    sent_desc: 'We will contact you shortly',
    name_ph: 'Full name *',
    email_ph: 'Email *',
    phone_ph: 'Phone / WhatsApp',
    msg_ph: 'Quantity, specific requirements...',
    send_btn: 'Send Request',
    contact_title: 'Contact Information',
    related_title: 'Similar Products',
    not_found: 'Product not found',
    img_prev: 'Previous',
    img_next: 'Next',
  },
}

export default function SanPhamDetail() {
  const { lang } = useLanguage()
  const t = T[lang]
  const cats = catMeta[lang]
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    setLoading(true)
    setImgIdx(0)
    axios.get(`/api/products/${slug}`).then(r => {
      setProduct(r.data)
      axios.get(`/api/products?category=${r.data.category}`).then(res => {
        setRelated(res.data.filter(p => p.slug !== slug).slice(0, 4))
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  const handleContact = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/contacts', {
        ...contact,
        subject: `${lang === 'en' ? 'Product inquiry' : 'Hỏi về sản phẩm'}: ${product?.name}`,
      })
      setSent(true)
    } catch {}
  }

  const renderDetail = (html) => {
    if (!html) return null
    return html
      .replace(/<h3>/g, '<h3 style="color:#4A2C17;font-weight:700;font-size:0.95rem;margin-top:1.25rem;margin-bottom:0.5rem;border-left:3px solid #E07820;padding-left:8px;">')
      .replace(/<ul>/g, '<ul style="list-style-type:disc;padding-left:1.5rem;margin-bottom:1rem;">')
      .replace(/<li>/g, '<li style="margin-bottom:0.35rem;font-size:0.82rem;color:#374151;">')
      .replace(/<p>/g, '<p style="font-size:0.82rem;color:#6b7280;margin-bottom:0.5rem;">')
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-[#4A2C17] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  if (!product) return <div className="text-center py-20 text-gray-400">{t.not_found}</div>

  const displayName = lang === 'en' && product.name_en ? product.name_en : product.name
  const displayDesc = lang === 'en' && product.description_en ? product.description_en : product.description
  const displayDetail = lang === 'en' && product.detail_en ? product.detail_en : product.detail
  const olLabel = oilLabel[product.category]?.[lang] || (lang === 'vi' ? 'Độ dầu' : 'Oil')

  // Parse images array
  let imgs = []
  try { imgs = JSON.parse(product.images || '[]') } catch {}
  if (!imgs.length && product.image) imgs = [product.image]

  return (
    <div>
      <div className="bg-[#4A2C17] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-2">{displayName}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
            <Link to="/" className="hover:text-white">{t.home}</Link>
            <span>/</span>
            <Link to="/san-pham" className="hover:text-white">{t.products}</Link>
            <span>/</span>
            <Link to={`/san-pham?category=${product.category}`} className="hover:text-white">
              {cats[product.category] || product.category}
            </Link>
            <span>/</span>
            <span className="text-[#E07820]">{displayName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Image carousel */}
              <div>
                <div className="relative rounded-lg overflow-hidden shadow-md" style={{ height: '280px' }}>
                  <img
                    src={imgs[imgIdx]}
                    alt={displayName}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    key={imgIdx}
                  />
                  {imgs.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
                        aria-label={t.img_prev}
                      >
                        <FiChevronLeft size={16} className="text-[#4A2C17]" />
                      </button>
                      <button
                        onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
                        aria-label={t.img_next}
                      >
                        <FiChevronRight size={16} className="text-[#4A2C17]" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {imgs.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIdx(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-[#E07820]' : 'bg-white/70'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Thumbnail strip */}
                {imgs.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                    {imgs.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#E07820]' : 'border-transparent hover:border-gray-300'}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div>
                <span className="text-xs font-bold text-[#E07820] uppercase tracking-wider bg-orange-50 px-2 py-1 rounded">
                  {cats[product.category] || product.category}
                </span>
                <h2 className="text-2xl font-black text-[#4A2C17] mt-3 mb-3 leading-tight">{displayName}</h2>
                <p className="text-gray-600 leading-relaxed mb-5 text-sm">{displayDesc}</p>

                {/* Specs box */}
                {(product.moisture || product.admixture || product.oil) && (
                  <div className="bg-[#FBF5EF] border border-orange-100 rounded-lg p-4 mb-5">
                    <h4 className="font-bold text-[#4A2C17] text-xs uppercase tracking-wider mb-3">{t.specs_title}</h4>
                    <div className="space-y-2">
                      {product.moisture && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 w-24 shrink-0 text-xs">{t.moisture}:</span>
                          <span className="font-bold text-[#4A2C17]">{product.moisture}</span>
                        </div>
                      )}
                      {product.admixture && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 w-24 shrink-0 text-xs">{t.admixture}:</span>
                          <span className="font-bold text-[#4A2C17]">{product.admixture}</span>
                        </div>
                      )}
                      {product.oil && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500 w-24 shrink-0 text-xs">{olLabel}:</span>
                          <span className="font-bold text-[#E07820]">{product.oil}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-20 shrink-0">{t.origin_lbl}:</span>
                    <span className="text-gray-600">{product.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-20 shrink-0">{t.unit_lbl}:</span>
                    <span className="text-gray-600">{product.unit}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href="https://wa.me/84986768378" target="_blank" rel="noreferrer"
                    className="bg-[#25D366] hover:bg-[#1da857] text-white px-5 py-2.5 font-semibold flex items-center gap-2 text-sm transition-colors rounded">
                    <FaWhatsapp size={15} /> {t.wa_btn}
                  </a>
                  <a href="mailto:artocavn@gmail.com"
                    className="border-2 border-[#4A2C17] text-[#4A2C17] px-5 py-2.5 font-semibold hover:bg-[#4A2C17] hover:text-white transition-colors flex items-center gap-2 text-sm rounded">
                    <FiMail size={14} /> {t.email_btn}
                  </a>
                </div>
              </div>
            </div>

            {/* Detail HTML */}
            {displayDetail && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="font-black text-[#4A2C17] text-lg mb-5 pb-3 border-b-2 border-[#E07820]">{t.detail_title}</h3>
                <div style={{ lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{ __html: renderDetail(displayDetail) }}
                />
              </div>
            )}

            {/* Related products */}
            {related.length > 0 && (
              <div>
                <h3 className="font-black text-[#4A2C17] text-lg mb-4">{t.related_title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {related.map(p => {
                    const relName = lang === 'en' && p.name_en ? p.name_en : p.name
                    return (
                      <Link key={p.id} to={`/san-pham/${p.slug}`}
                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#E07820] hover:shadow-md transition-all">
                        <div className="h-28 overflow-hidden">
                          <img src={p.image} alt={relName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-gray-700 group-hover:text-[#4A2C17] transition-colors line-clamp-2 leading-tight">{relName}</p>
                          <div className="flex items-center gap-0.5 text-[#E07820] mt-1.5">
                            <span className="text-xs">{lang === 'vi' ? 'Chi tiết' : 'Details'}</span>
                            <FiArrowRight size={10} />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quote form */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#4A2C17] px-4 py-3">
                <h3 className="text-white font-bold text-sm">{t.quote_title}</h3>
              </div>
              <div className="p-4">
                {sent ? (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-green-600 font-semibold text-sm">{t.sent_title}</p>
                    <p className="text-gray-400 text-xs mt-1">{t.sent_desc}</p>
                  </div>
                ) : (
                  <form onSubmit={handleContact} className="space-y-3">
                    <input type="text" placeholder={t.name_ph} required value={contact.name}
                      onChange={e => setContact({ ...contact, name: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#4A2C17]" />
                    <input type="email" placeholder={t.email_ph} required value={contact.email}
                      onChange={e => setContact({ ...contact, email: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#4A2C17]" />
                    <input type="tel" placeholder={t.phone_ph} value={contact.phone}
                      onChange={e => setContact({ ...contact, phone: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#4A2C17]" />
                    <textarea placeholder={t.msg_ph} rows={3} value={contact.message}
                      onChange={e => setContact({ ...contact, message: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#4A2C17] resize-none" />
                    <button type="submit" className="w-full bg-[#E07820] hover:bg-[#B85E0A] text-white py-2.5 font-semibold text-sm transition-colors rounded">
                      {t.send_btn}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-[#4A2C17] rounded-lg p-5 text-white space-y-3">
              <h4 className="font-bold mb-3">{t.contact_title}</h4>
              <div className="flex items-start gap-2.5">
                <FiMapPin className="text-[#E07820] shrink-0 mt-0.5" size={14} />
                <span className="text-gray-300 text-xs">Số 41, ngõ 190 đường Hoàng Mai, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-[#E07820] shrink-0" size={14} />
                <a href="https://wa.me/84986768378" className="text-gray-300 text-xs hover:text-white">+84 986 768 378</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="text-[#E07820] shrink-0" size={14} />
                <a href="mailto:artocavn@gmail.com" className="text-gray-300 text-xs hover:text-white">artocavn@gmail.com</a>
              </div>
            </div>

            {/* Back to category */}
            <Link
              to={`/san-pham?category=${product.category}`}
              className="flex items-center gap-2 text-sm text-[#4A2C17] font-semibold hover:text-[#E07820] transition-colors"
            >
              <FiArrowLeft size={14} />
              {lang === 'vi' ? `Tất cả sản phẩm ${cats[product.category]}` : `All ${cats[product.category]} products`}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
