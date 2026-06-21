import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiLogOut, FiGrid, FiFileText, FiImage, FiMail, FiEdit3, FiExternalLink, FiPackage, FiTag } from 'react-icons/fi'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid size={16} />, end: true },
  { to: '/admin/products', label: 'Sản Phẩm', icon: <FiPackage size={16} /> },
  { to: '/admin/categories', label: 'Danh Mục', icon: <FiTag size={16} /> },
  { to: '/admin/news', label: 'Tin Tức', icon: <FiFileText size={16} /> },
  { to: '/admin/images', label: 'Hình Ảnh', icon: <FiImage size={16} /> },
  { to: '/admin/banners', label: 'Banners', icon: <FiImage size={16} /> },
  { to: '/admin/content', label: 'Nội Dung Trang', icon: <FiEdit3 size={16} /> },
  { to: '/admin/contacts', label: 'Hộp Thư', icon: <FiMail size={16} /> },
]

const PRIMARY = '#4A2C17'
const HOVER = '#2E1A0D'

export default function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) navigate('/admin/login')
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    navigate('/admin/login')
  }

  const username = localStorage.getItem('admin_user') || 'Admin'

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#1A0E07] flex flex-col transition-transform duration-200 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2" target="_blank">
            <div className="w-7 h-7 bg-[#E07820] flex items-center justify-center rounded-sm shrink-0">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <span className="text-sm font-black text-white">ARTOCA</span>
              <FiExternalLink size={10} className="text-white/40 inline ml-1" />
            </div>
          </Link>
          <p className="text-white/40 text-xs mt-0.5 pl-9">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#4A2C17] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`
              }
              onClick={() => setSideOpen(false)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-7 h-7 bg-[#E07820] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{username[0].toUpperCase()}</span>
            </div>
            <span className="text-white/70 text-sm truncate">{username}</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-2 w-full text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-colors">
            <FiLogOut size={15} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <button onClick={() => setSideOpen(true)} className="p-1 text-gray-600">
            <FiMenu size={22} />
          </button>
          <span className="font-black text-[#4A2C17]">ARTOCA Admin</span>
          <button onClick={logout} className="p-1 text-gray-500"><FiLogOut size={18} /></button>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
