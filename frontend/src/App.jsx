import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import GioiThieu from './pages/GioiThieu'
import SanPham from './pages/SanPham'
import SanPhamDetail from './pages/SanPhamDetail'
import TinTuc from './pages/TinTuc'
import TinTucDetail from './pages/TinTucDetail'
import LienHe from './pages/LienHe'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminNews from './pages/admin/AdminNews'
import AdminNewsForm from './pages/admin/AdminNewsForm'
import AdminBanners from './pages/admin/AdminBanners'
import AdminContent from './pages/admin/AdminContent'
import AdminContacts from './pages/admin/AdminContacts'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<><Navbar /><main className="flex-1"><Home /></main><Footer /></>} />
        <Route element={<><Navbar /><main className="flex-1"><Outlet /></main><Footer /></>}>
          <Route path="/gioi-thieu" element={<GioiThieu />} />
          <Route path="/san-pham" element={<SanPham />} />
          <Route path="/san-pham/:slug" element={<SanPhamDetail />} />
          <Route path="/tin-tuc" element={<TinTuc />} />
          <Route path="/tin-tuc/:slug" element={<TinTucDetail />} />
          <Route path="/lien-he" element={<LienHe />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/:id" element={<AdminProductForm />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="news/:id" element={<AdminNewsForm />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
