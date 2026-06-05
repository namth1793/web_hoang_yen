import { Link } from 'react-router-dom'

const banks = [
  {
    name: 'TP Bank',
    fullName: 'Ngân hàng TMCP Tiên Phong (TPBank)',
    role: 'Ngân hàng tài trợ xuất khẩu',
    color: '#9e1b32',
    services: ['Tài trợ xuất khẩu (Export Finance)', 'L/C (Letter of Credit)', 'Thanh toán quốc tế', 'Bảo lãnh ngân hàng'],
  },
  {
    name: 'Techcombank',
    fullName: 'Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)',
    role: 'Ngân hàng thanh toán quốc tế',
    color: '#e31837',
    services: ['Tài khoản ngoại tệ', 'Chuyển tiền quốc tế SWIFT', 'Tín dụng chứng từ (L/C)', 'Chiết khấu bộ chứng từ'],
  },
  {
    name: 'Vietcombank',
    fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    role: 'Ngân hàng đối ngoại chủ lực',
    color: '#007a3d',
    services: ['Thanh toán xuất nhập khẩu', 'Mua bán ngoại tệ', 'Bảo lãnh thực hiện hợp đồng', 'Vay vốn lưu động xuất khẩu'],
  },
  {
    name: 'Ocean Bank',
    fullName: 'Ngân hàng Thương mại TNHH MTV Đại Dương (OceanBank)',
    role: 'Ngân hàng tài trợ vốn',
    color: '#003087',
    services: ['Tín dụng tài trợ xuất khẩu', 'Cho vay thu mua hàng hóa', 'Tài khoản giao dịch'],
  },
  {
    name: 'BIDV',
    fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
    role: 'Ngân hàng đầu tư phát triển',
    color: '#005bac',
    services: ['Tín dụng đầu tư', 'Tài trợ thương mại quốc tế', 'Swift payment', 'Bảo lãnh dự thầu'],
  },
  {
    name: 'Agribank',
    fullName: 'Ngân hàng Nông nghiệp và PTNT Việt Nam (Agribank)',
    role: 'Ngân hàng tài trợ nông sản',
    color: '#e31837',
    services: ['Cho vay thu mua nông sản', 'Hỗ trợ vùng nguyên liệu', 'Tín dụng xuất khẩu nông sản'],
  },
  {
    name: 'Viettin Bank',
    fullName: 'Ngân hàng TMCP Công thương Việt Nam (VietinBank)',
    role: 'Ngân hàng công thương',
    color: '#005bac',
    services: ['Thanh toán trong nước & quốc tế', 'Tài trợ xuất khẩu', 'Bảo lãnh hợp đồng'],
  },
  {
    name: 'inBank',
    fullName: 'inBank – Đối tác tài chính quốc tế',
    role: 'Đối tác tài chính',
    color: '#333',
    services: ['Tư vấn tài chính quốc tế', 'Fintech solutions', 'Thanh toán xuyên biên giới'],
  },
]

export default function CacToChucTaiChinh() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-[#6B2200] py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-1">Các Tổ Chức Tài Chính</h1>
          <div className="flex items-center gap-2 text-sm text-amber-200">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span>»</span>
            <span className="text-white">Các Tổ Chức Tài Chính</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Trosie Garden duy trì quan hệ hợp tác chiến lược với các tổ chức tài chính hàng đầu Việt Nam,
          đảm bảo nguồn vốn và các dịch vụ thanh toán quốc tế phục vụ hoạt động xuất nhập khẩu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banks.map((bank) => (
            <div key={bank.name} className="border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded flex items-center justify-center shrink-0 text-white font-bold text-xs text-center leading-tight"
                  style={{ backgroundColor: bank.color }}
                >
                  {bank.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{bank.name}</h3>
                  <p className="text-xs text-gray-500">{bank.fullName}</p>
                  <p className="text-xs text-[#6B2200] font-semibold mt-0.5">{bank.role}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold">Dịch vụ cung cấp:</p>
                <ul className="space-y-0.5">
                  {bank.services.map((s) => (
                    <li key={s} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-[#6B2200]">›</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
