import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi'
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

const T = {
  vi: {
    title: 'Tin Tức & Sự Kiện',
    home: 'Trang chủ',
    all: 'Tất cả',
    no_news: 'Chưa có tin tức',
  },
  en: {
    title: 'News & Events',
    home: 'Home',
    all: 'All',
    no_news: 'No news available',
  },
}

export default function TinTuc() {
  const { lang } = useLanguage()
  const t = T[lang]
  const cats = catLabels[lang]
  const [searchParams, setSearchParams] = useSearchParams()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    const url = activeCategory ? `/api/news?category=${activeCategory}` : '/api/news'
    axios.get(url).then(r => { setNews(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [activeCategory])

  const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

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
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 text-sm font-semibold border transition-colors ${!activeCategory ? 'bg-[#4A2C17] text-white border-[#4A2C17]' : 'text-gray-600 border-gray-300 hover:border-[#4A2C17] hover:text-[#4A2C17]'}`}
          >{t.all}</button>
          {Object.entries(cats).map(([key, label]) => (
            <button key={key}
              onClick={() => setSearchParams({ category: key })}
              className={`px-4 py-2 text-sm font-semibold border transition-colors ${activeCategory === key ? 'bg-[#4A2C17] text-white border-[#4A2C17]' : 'text-gray-600 border-gray-300 hover:border-[#4A2C17] hover:text-[#4A2C17]'}`}
            >{label}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-lg animate-pulse h-80"></div>)}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📰</div>
            <p>{t.no_news}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link key={item.id} to={`/tin-tuc/${item.slug}`}
                className="group bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#E07820]/30 transition-all duration-300">
                <div className="overflow-hidden h-48">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    item.category === 'tin-cong-ty' ? 'bg-blue-100 text-blue-700' :
                    item.category === 'thi-truong' ? 'bg-green-100 text-green-700' :
                    item.category === 'tuyen-dung' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {cats[item.category] || item.category}
                  </span>
                  <h3 className="font-bold text-gray-800 mt-2 mb-2 leading-snug group-hover:text-[#4A2C17] transition-colors line-clamp-2 text-sm">
                    {lang === 'en' && item.title_en ? item.title_en : item.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                    {lang === 'en' && item.summary_en ? item.summary_en : item.summary}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiCalendar size={11} />{formatDate(item.created_at)}</span>
                    </div>
                    <FiArrowRight className="text-[#E07820] group-hover:translate-x-1 transition-transform" size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
