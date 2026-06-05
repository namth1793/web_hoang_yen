import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft, FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi'
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const catLabels = {
  vi: {
    'tin-cong-ty': 'Tin Công Ty',
    'thi-truong': 'Thị Trường',
    'su-kien': 'Sự Kiện',
    'tuyen-dung': 'Tuyển Dụng',
  },
  en: {
    'tin-cong-ty': 'Company News',
    'thi-truong': 'Market News',
    'su-kien': 'Events',
    'tuyen-dung': 'Job Opportunities',
  },
}

export default function TinTucDetail() {
  const { lang } = useLanguage()
  const cats = catLabels[lang]
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/news/${slug}`).then(r => {
      setArticle(r.data)
      axios.get('/api/news?limit=4').then(res => {
        setRelated(res.data.filter(n => n.slug !== slug).slice(0, 3))
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-[#4A2C17] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  if (!article) return <div className="text-center py-20 text-gray-400">{lang === 'vi' ? 'Không tìm thấy bài viết' : 'Article not found'}</div>

  const displayTitle = lang === 'en' && article.title_en ? article.title_en : article.title
  const displaySummary = lang === 'en' && article.summary_en ? article.summary_en : article.summary

  return (
    <div>
      <div className="bg-[#4A2C17] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Link to="/" className="hover:text-white">{lang === 'vi' ? 'Trang chủ' : 'Home'}</Link>
            <span>/</span>
            <Link to="/tin-tuc" className="hover:text-white">{lang === 'vi' ? 'Tin tức' : 'News'}</Link>
            <span>/</span>
            <span className="text-[#E07820] line-clamp-1">{displayTitle}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            article.category === 'tin-cong-ty' ? 'bg-blue-500/20 text-blue-200' :
            article.category === 'thi-truong' ? 'bg-green-500/20 text-green-200' :
            article.category === 'tuyen-dung' ? 'bg-purple-500/20 text-purple-200' :
            'bg-orange-500/20 text-orange-200'
          }`}>
            {cats[article.category] || article.category}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <article className="bg-white border border-gray-200 overflow-hidden rounded-lg">
              <img src={article.image} alt={displayTitle} className="w-full h-64 md:h-96 object-cover" />
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-black text-[#4A2C17] leading-tight mb-4">{displayTitle}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                  <span className="flex items-center gap-1.5"><FiCalendar size={13} />{formatDate(article.created_at)}</span>
                  <span className="flex items-center gap-1.5"><FiUser size={13} />{article.author}</span>
                </div>

                {displaySummary && (
                  <p className="text-gray-600 italic text-base mb-6 p-4 bg-orange-50 border-l-4 border-[#E07820] rounded-r">{displaySummary}</p>
                )}

                <div
                  className="text-gray-700 leading-relaxed text-[15px]"
                  style={{ lineHeight: '1.9' }}
                  dangerouslySetInnerHTML={{
                    __html: (article.content || '')
                      .replace(/<h3>/g, '<h3 style="color:#4A2C17;font-weight:700;font-size:1.1rem;margin-top:1.5rem;margin-bottom:0.5rem;">')
                      .replace(/<ul>/g, '<ul style="list-style-type:disc;padding-left:1.5rem;margin-bottom:1rem;">')
                      .replace(/<li>/g, '<li style="margin-bottom:0.5rem;">')
                      .replace(/<strong>/g, '<strong style="color:#1a1a1a;">')
                  }}
                />

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-semibold">{lang === 'vi' ? 'Chia sẻ:' : 'Share:'}</span>
                  <a href="#" className="w-8 h-8 bg-[#1877f2] flex items-center justify-center rounded text-white hover:opacity-80"><FaFacebook size={14} /></a>
                  <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
                    className="w-8 h-8 bg-[#25D366] flex items-center justify-center rounded text-white hover:opacity-80"><FaWhatsapp size={14} /></a>
                  <a href="https://www.linkedin.com/company/117713969/" target="_blank" rel="noreferrer"
                    className="w-8 h-8 bg-[#0a66c2] flex items-center justify-center rounded text-white hover:opacity-80"><FaLinkedin size={14} /></a>
                </div>
              </div>
            </article>

            <div className="mt-4">
              <Link to="/tin-tuc" className="flex items-center gap-2 text-[#4A2C17] font-semibold text-sm hover:gap-3 transition-all">
                <FiArrowLeft /> {lang === 'vi' ? 'Quay lại tin tức' : 'Back to News'}
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {related.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#4A2C17] px-4 py-3">
                  <h3 className="text-white font-bold text-sm">{lang === 'vi' ? 'Tin tức liên quan' : 'Related News'}</h3>
                </div>
                <div className="p-4 space-y-4">
                  {related.map(item => (
                    <Link key={item.id} to={`/tin-tuc/${item.slug}`}
                      className="flex gap-3 group hover:bg-gray-50 p-2 rounded -mx-2 transition-colors">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-[#4A2C17] transition-colors line-clamp-2 leading-snug">
                          {lang === 'en' && item.title_en ? item.title_en : item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(item.created_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#4A2C17] rounded-lg p-5 text-white">
              <h4 className="font-bold mb-2">{lang === 'vi' ? 'Liên hệ tư vấn' : 'Contact Us'}</h4>
              <p className="text-gray-300 text-sm mb-4">
                {lang === 'vi' ? 'Có câu hỏi về sản phẩm? Liên hệ ngay với ARTOCA.' : 'Questions about our products? Contact ARTOCA now.'}
              </p>
              <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
                className="block text-center bg-[#25D366] hover:bg-[#1da857] text-white py-2.5 font-semibold text-sm transition-colors rounded">
                WhatsApp: +84 986 768 378
              </a>
              <Link to="/san-pham" className="block text-center mt-2 border border-white/30 text-white py-2.5 text-sm hover:bg-white/10 transition-colors rounded">
                {lang === 'vi' ? 'Xem sản phẩm' : 'View Products'} <FiArrowRight className="inline ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
