import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/api/admin/login', form)
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', data.username)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#6B2200] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl">🔐</span>
          </div>
          <h1 className="text-xl font-black text-[#6B2200]">Trosie Admin</h1>
          <p className="text-gray-400 text-sm">Đăng nhập để quản lý</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text" required autoFocus
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200]"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#6B2200]"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#6B2200] text-white py-2.5 rounded-lg font-bold hover:bg-[#4A1800] transition-colors disabled:opacity-60">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-[#6B2200] transition-colors">
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
