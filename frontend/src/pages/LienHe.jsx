import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiClock, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const T = {
  vi: {
    title: 'Liên Hệ Với Chúng Tôi',
    home: 'Trang chủ',
    cards: [
      { icon: 'mappin', title: 'Trụ sở', lines: ['Số 41, ngõ 190 đường Hoàng Mai', 'Hà Nội, Việt Nam'] },
      { icon: 'factory', title: 'Xưởng sản xuất', lines: ['TT Mậu A, Lào Cai', 'Việt Nam'] },
      { icon: 'phone', title: 'Hotline / WhatsApp', lines: ['+84 986 768 378'] },
      { icon: 'mail', title: 'Email', lines: ['Artocavn@gmail.com'] },
      { icon: 'clock', title: 'Giờ làm việc', lines: ['Thứ 2 – Thứ 7', '8:00 – 17:30'] },
    ],
    form_title: 'Gửi Yêu Cầu Hợp Tác',
    name_lbl: 'Họ và tên *', name_ph: 'Nguyễn Văn A',
    email_lbl: 'Email *', email_ph: 'email@company.com',
    phone_lbl: 'Điện thoại / WhatsApp', phone_ph: '+84 900 000 000',
    msg_lbl: 'Nội dung *', msg_ph: 'Cho chúng tôi biết về nhu cầu của bạn...',
    send_btn: 'Gửi yêu cầu',
    sending: 'Đang gửi...',
    success_title: 'Cảm ơn bạn đã liên hệ!',
    success_desc: 'Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
    send_another: 'Gửi yêu cầu khác',
    error_msg: 'Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp.',
    map_title: 'Vị Trí Công Ty',
    contact_info_title: 'Thông tin liên hệ',
    follow: 'Theo dõi chúng tôi',
    cta_title: 'Sẵn sàng hợp tác xuất khẩu?',
    cta_desc: 'Đội ngũ ARTOCA luôn sẵn sàng hỗ trợ quý đối tác',
    cta_wa: 'WhatsApp ngay',
  },
  en: {
    title: 'Contact Us',
    home: 'Home',
    cards: [
      { icon: 'mappin', title: 'Head Office', lines: ['No.41, alley 190, Hoang Mai road', 'Hanoi, Vietnam'] },
      { icon: 'factory', title: 'Factory', lines: ['Mau A town, Lao Cai Province', 'Vietnam'] },
      { icon: 'phone', title: 'Hotline / WhatsApp', lines: ['+84 986 768 378'] },
      { icon: 'mail', title: 'Email', lines: ['Artocavn@gmail.com'] },
      { icon: 'clock', title: 'Working Hours', lines: ['Monday – Saturday', '8:00am – 5:30pm'] },
    ],
    form_title: 'Send Inquiry',
    name_lbl: 'Full Name *', name_ph: 'John Smith',
    email_lbl: 'Email *', email_ph: 'email@company.com',
    phone_lbl: 'Phone / WhatsApp', phone_ph: '+1 000 000 0000',
    msg_lbl: 'Message *', msg_ph: 'Tell us about your needs...',
    send_btn: 'Send Inquiry',
    sending: 'Sending...',
    success_title: 'Thank you for contacting us!',
    success_desc: 'We will respond within 24 business hours.',
    send_another: 'Send Another',
    error_msg: 'An error occurred. Please try again or contact us directly.',
    map_title: 'Our Location',
    contact_info_title: 'Contact Information',
    follow: 'Follow us',
    cta_title: 'Ready to Partner with ARTOCA?',
    cta_desc: 'Our team is always ready to support your export needs',
    cta_wa: 'WhatsApp Now',
  },
}

const iconMap = {
  mappin: <FiMapPin size={22} />,
  factory: <FiMapPin size={22} />,
  phone: <FiPhone size={22} />,
  mail: <FiMail size={22} />,
  clock: <FiClock size={22} />,
}

export default function LienHe() {
  const { lang } = useLanguage()
  const t = T[lang]
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await axios.post('/api/contacts', form)
      setSent(true)
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
    } catch {
      setError(t.error_msg)
    }
    setSending(false)
  }

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

      {/* Info cards */}
      <section className="py-10 bg-[#FBF5EF]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {t.cards.map((card, i) => (
              <div key={i} className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#E07820] hover:shadow-md transition-all text-center">
                <div className="w-10 h-10 bg-[#4A2C17] rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                  {iconMap[card.icon]}
                </div>
                <h3 className="font-bold text-[#4A2C17] text-xs mb-2 uppercase">{card.title}</h3>
                {card.lines.map((line, j) => (
                  <p key={j} className="text-gray-600 text-xs">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="w-12 h-1 bg-[#E07820] mb-4"></div>
              <h2 className="text-2xl font-black text-[#4A2C17] mb-6">{t.form_title}</h2>
              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-green-700 font-bold text-lg mb-2">{t.success_title}</h3>
                  <p className="text-green-600 text-sm mb-4">{t.success_desc}</p>
                  <button onClick={() => setSent(false)} className="bg-[#4A2C17] text-white px-6 py-2 font-semibold text-sm hover:bg-[#2E1A0D] transition-colors rounded">
                    {t.send_another}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t.name_lbl}</label>
                    <input type="text" required placeholder={t.name_ph} value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A2C17] rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t.email_lbl}</label>
                      <input type="email" required placeholder={t.email_ph} value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A2C17] rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{t.phone_lbl}</label>
                      <input type="tel" placeholder={t.phone_ph} value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A2C17] rounded" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t.msg_lbl}</label>
                    <textarea required rows={5} placeholder={t.msg_ph} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A2C17] rounded resize-none" />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={sending}
                    className="bg-[#E07820] hover:bg-[#B85E0A] text-white px-8 py-3 font-bold flex items-center gap-2 disabled:opacity-60 transition-colors rounded">
                    <FiSend size={16} />
                    {sending ? t.sending : t.send_btn}
                  </button>
                </form>
              )}
            </div>

            {/* Map + social */}
            <div>
              <div className="w-12 h-1 bg-[#E07820] mb-4"></div>
              <h2 className="text-2xl font-black text-[#4A2C17] mb-6">{t.map_title}</h2>
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5!2d105.8672!3d20.9742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad21bd41e6e9%3A0x2a96e4fdbda6e1c2!2zSG_DoG5nIE1haSwgSMOgIE7hu5lp!5e0!3m2!1svi!2svn!4v1234567890"
                  width="100%" height="280" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="ARTOCA location"
                ></iframe>
              </div>

              <div className="bg-[#2C1810] rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-4">{t.contact_info_title}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-[#E07820] shrink-0 mt-0.5" size={15} />
                    <div>
                      <p className="font-semibold text-white text-xs">ARTOCA IMPORT EXPORT CO., LTD</p>
                      <p className="text-gray-400 text-xs">{lang === 'vi' ? 'Số 41, ngõ 190 đường Hoàng Mai, Hà Nội' : 'No.41, alley 190, Hoang Mai road, Hanoi, Vietnam'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-[#E07820] shrink-0" size={15} />
                    <a href="https://wa.me/+84986768378" className="text-gray-400 hover:text-white text-xs">+84 986 768 378</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="text-[#E07820] shrink-0" size={15} />
                    <a href="mailto:Artocavn@gmail.com" className="text-gray-400 hover:text-white text-xs">Artocavn@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiClock className="text-[#E07820] shrink-0" size={15} />
                    <span className="text-gray-400 text-xs">{lang === 'vi' ? 'Thứ 2 – Thứ 7: 8:00 – 17:30' : 'Mon–Sat: 8:00am–5:30pm'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-xs mb-3">{t.follow}</p>
                  <div className="flex gap-3">
                    <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-[#25D366] flex items-center justify-center rounded hover:opacity-80">
                      <FaWhatsapp size={16} />
                    </a>
                    <a href="https://www.linkedin.com/company/117713969/" target="_blank" rel="noreferrer"
                      className="w-9 h-9 bg-[#0a66c2] flex items-center justify-center rounded hover:opacity-80">
                      <FaLinkedin size={16} />
                    </a>
                    <a href="mailto:Artocavn@gmail.com"
                      className="w-9 h-9 bg-[#E07820] flex items-center justify-center rounded hover:opacity-80">
                      <FiMail size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-[#4A2C17]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <p className="font-black text-xl">{t.cta_title}</p>
            <p className="text-gray-300 text-sm">{t.cta_desc}</p>
          </div>
          <a href="https://wa.me/+84986768378" target="_blank" rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#1da857] text-white px-8 py-3 font-bold flex items-center gap-2 whitespace-nowrap transition-colors">
            <FaWhatsapp size={18} /> {t.cta_wa}: +84 986 768 378
          </a>
        </div>
      </section>
    </div>
  )
}
