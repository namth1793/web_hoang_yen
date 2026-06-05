import { Link } from 'react-router-dom'

const thongBao = [
  { date: '15/03/2024', title: 'Thông báo về ngày đăng ký cuối cùng để tham dự ĐHĐCĐ thường niên năm 2024', file: '#' },
  { date: '20/02/2024', title: 'Thông báo tổ chức Đại hội đồng cổ đông thường niên năm 2024', file: '#' },
  { date: '10/01/2024', title: 'Công bố thông tin: Báo cáo quản trị năm 2023', file: '#' },
  { date: '05/12/2023', title: 'Thông báo chi trả cổ tức năm 2022 bằng tiền mặt', file: '#' },
]

const baoCaoTaiChinh = [
  { period: 'Q3/2024', title: 'Báo cáo tài chính quý 3 năm 2024', file: '#' },
  { period: 'H1/2024', title: 'Báo cáo tài chính 6 tháng đầu năm 2024 (đã soát xét)', file: '#' },
  { period: 'Q1/2024', title: 'Báo cáo tài chính quý 1 năm 2024', file: '#' },
  { period: 'Năm 2023', title: 'Báo cáo tài chính năm 2023 (đã kiểm toán)', file: '#' },
  { period: 'Năm 2022', title: 'Báo cáo tài chính năm 2022 (đã kiểm toán)', file: '#' },
]

const daiHoi = [
  { year: '2024', title: 'Nghị quyết ĐHĐCĐ thường niên năm 2024', file: '#' },
  { year: '2024', title: 'Tài liệu họp ĐHĐCĐ thường niên năm 2024', file: '#' },
  { year: '2023', title: 'Nghị quyết ĐHĐCĐ thường niên năm 2023', file: '#' },
  { year: '2023', title: 'Tài liệu họp ĐHĐCĐ thường niên năm 2023', file: '#' },
]

export default function QuanHeCoDong() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-[#6B2200] py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">Quan Hệ Cổ Đông</h1>
          <div className="flex items-center gap-2 text-sm text-amber-200">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>»</span>
            <span className="text-white">Quan Hệ Cổ Đông</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Company stock info bar */}
        <div className="bg-[#6B2200]/5 border border-[#6B2200]/30 rounded p-4 mb-8 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-500">Mã cổ phiếu: </span>
            <span className="font-bold text-[#6B2200] text-lg">HFX</span>
          </div>
          <div>
            <span className="text-gray-500">Sàn giao dịch: </span>
            <span className="font-semibold">UPCoM</span>
          </div>
          <div>
            <span className="text-gray-500">Ngày niêm yết: </span>
            <span className="font-semibold">10/11/2011</span>
          </div>
          <div>
            <span className="text-gray-500">Vốn điều lệ: </span>
            <span className="font-semibold">12.7 tỷ VND</span>
          </div>
          <div>
            <span className="text-gray-500">KL cổ phiếu: </span>
            <span className="font-semibold">1.270.000 cp</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-10">

            {/* Thông báo */}
            <div id="thong-bao">
              <h2 className="section-heading">THÔNG BÁO</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#6B2200] text-white">
                    <th className="text-left px-3 py-2 font-semibold w-28">Ngày</th>
                    <th className="text-left px-3 py-2 font-semibold">Nội dung</th>
                    <th className="text-center px-3 py-2 font-semibold w-20">Tải về</th>
                  </tr>
                </thead>
                <tbody>
                  {thongBao.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2.5 text-gray-500 text-xs">{item.date}</td>
                      <td className="px-3 py-2.5">
                        <a href={item.file} className="text-gray-700 hover:text-[#6B2200] transition-colors">
                          {item.title}
                        </a>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <a href={item.file} className="text-[#6B2200] hover:underline text-xs font-semibold">
                          📄 PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Báo cáo tài chính */}
            <div id="bao-cao">
              <h2 className="section-heading">BÁO CÁO TÀI CHÍNH</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#6B2200] text-white">
                    <th className="text-left px-3 py-2 font-semibold w-24">Kỳ</th>
                    <th className="text-left px-3 py-2 font-semibold">Tên tài liệu</th>
                    <th className="text-center px-3 py-2 font-semibold w-20">Tải về</th>
                  </tr>
                </thead>
                <tbody>
                  {baoCaoTaiChinh.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2.5 text-gray-500 text-xs font-semibold">{item.period}</td>
                      <td className="px-3 py-2.5">
                        <a href={item.file} className="text-gray-700 hover:text-[#6B2200] transition-colors">
                          {item.title}
                        </a>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <a href={item.file} className="text-[#6B2200] hover:underline text-xs font-semibold">
                          📄 PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Đại hội cổ đông */}
            <div id="dai-hoi">
              <h2 className="section-heading">ĐẠI HỘI CỔ ĐÔNG</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#6B2200] text-white">
                    <th className="text-left px-3 py-2 font-semibold w-20">Năm</th>
                    <th className="text-left px-3 py-2 font-semibold">Tên tài liệu</th>
                    <th className="text-center px-3 py-2 font-semibold w-20">Tải về</th>
                  </tr>
                </thead>
                <tbody>
                  {daiHoi.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2.5 text-gray-500 text-xs font-semibold">{item.year}</td>
                      <td className="px-3 py-2.5">
                        <a href={item.file} className="text-gray-700 hover:text-[#6B2200] transition-colors">
                          {item.title}
                        </a>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <a href={item.file} className="text-[#6B2200] hover:underline text-xs font-semibold">
                          📄 PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="border border-gray-200 p-4 mb-4">
              <h3 className="section-heading text-base">THÔNG TIN CÔNG TY</h3>
              <dl className="text-xs space-y-2">
                {[
                  ['Tên công ty', 'CTCP SX-XNK Trosie Global'],
                  ['Tên quốc tế', 'Trosie Garden'],
                  ['Mã cổ phiếu', 'HFX (UPCoM)'],
                  ['Vốn điều lệ', '12.7 tỷ đồng'],
                  ['Chủ tịch HĐQT', 'Nguyễn Văn Hợp'],
                  ['Tổng Giám Đốc', 'Trần Thị Minh'],
                  ['Kế toán trưởng', 'Đào Ngọc Bình'],
                  ['MST', '0100101876'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <dt className="text-gray-500 shrink-0 w-28">{label}:</dt>
                    <dd className="text-gray-700 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border border-gray-200 p-4">
              <h3 className="section-heading text-base">LIÊN HỆ IR</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Tel: (024) 3835 9937</p>
                <p>Fax: (024) 3835 9935</p>
                <p>Email: trosieglobal@hn.vnn.vn</p>
                <p className="mt-2 text-gray-500">Địa chỉ: 122-123 M2 Láng Trung, Láng Hạ, Đống Đa, Hà Nội</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
