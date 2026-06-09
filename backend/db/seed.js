const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'xnk.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    description_en TEXT DEFAULT '',
    detail TEXT,
    detail_en TEXT DEFAULT '',
    image TEXT,
    images TEXT DEFAULT '[]',
    moisture TEXT DEFAULT '',
    admixture TEXT DEFAULT '',
    oil TEXT DEFAULT '',
    unit TEXT,
    origin TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_en TEXT DEFAULT '',
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT,
    summary_en TEXT DEFAULT '',
    content TEXT,
    image TEXT,
    author TEXT DEFAULT 'ARTOCA',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    image TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS page_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page, key)
  );
`);

const adminExists = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash);
}

db.exec(`DELETE FROM products; DELETE FROM news; DELETE FROM banners;`);

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

const insertProduct = db.prepare(`
  INSERT INTO products (name, name_en, slug, category, description, description_en, detail, detail_en, image, images, moisture, admixture, oil, unit, origin)
  VALUES (@name, @name_en, @slug, @category, @description, @description_en, @detail, @detail_en, @image, @images, @moisture, @admixture, @oil, @unit, @origin)
`);

const cinnamonImgs = [
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
  'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=600&q=80',
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80',
];
const cinnamonPowderImgs = [
  'https://images.unsplash.com/photo-1506368083636-6defb67639f0?w=600&q=80',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
];
const aniseImgs = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80',
];
const gingerImgs = [
  'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
  'https://images.unsplash.com/photo-1610056494052-6a4f83a8368c?w=600&q=80',
];
const turmericImgs = [
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
  'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80',
];

const products = [
  // ── QUẾ (8 variants) ──────────────────────────────────────────────────────
  {
    name: 'Quế chẻ',
    name_en: 'Split Cassia',
    slug: 'que-che',
    category: 'que',
    description: 'Quế chẻ được thu hoạch từ cây quế 8–10 năm tuổi tại Văn Yên, Yên Bái. Ống quế độ dày đồng đều, không nấm mốc, ít tạp chất, màu nâu tự nhiên.',
    description_en: 'Split Cassia harvested from 8–10-year-old trees in Van Yen, Yen Bai. Uniform thickness, mold-free, low impurities, natural brown color.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 25–45cm (min 80%)</li><li>Độ dày: 0.8–2mm</li><li>Màu nâu tự nhiên, bề mặt phẳng, không bị mọt</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 10kg hoặc 25kg tịnh</li><li>Container: 8.5 T/20FT | 17 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 25–45cm (min 80%)</li><li>Thickness: 0.8–2mm</li><li>Natural brown color, flat surface, no pest damage</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 10kg or 25kg</li><li>Container: 8.5MT/20FT | 17MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[0],
    images: JSON.stringify(cinnamonImgs),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '2–3%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Quế sáo',
    name_en: 'Cigarette Cassia (Cassia Verra)',
    slug: 'que-sao',
    category: 'que',
    description: 'Quế sáo (Cassia Verra) có hình dáng ống dài, bề mặt mịn, màu nâu tự nhiên. Phù hợp cho thị trường Trung Đông, châu Á và các nhà chế biến thực phẩm.',
    description_en: 'Cigarette Cassia (Cassia Verra) in long cylindrical form, smooth surface, natural brown color. Suited for Middle East, Asian markets and food processors.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 20–47cm</li><li>Màu nâu tự nhiên, bề mặt mịn</li><li>Ống đều, không dập vỡ</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 10kg tịnh</li><li>Container: 5.5 T/20FT | 12.5 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 20–47cm</li><li>Natural brown color, smooth surface</li><li>Even rolls, no breakage</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 10kg</li><li>Container: 5.5MT/20FT | 12.5MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[1],
    images: JSON.stringify([cinnamonImgs[1], cinnamonImgs[0]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '2–3%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Quế ngón tay',
    name_en: 'Finger Cassia',
    slug: 'que-ngon-tay',
    category: 'que',
    description: 'Quế ngón tay thu hoạch từ cây 10–12 năm tuổi. Cuộn đều tỷ lệ 80–90%, không dập vỡ, rất ít mắt, phù hợp bán lẻ và đóng gói thương mại.',
    description_en: 'Finger Cassia harvested from 10–12-year-old trees. Even rolling rate 80–90%, no breakage, very few knots. Ideal for retail and commercial packaging.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 6cm | 8cm | 10cm | 12cm (theo yêu cầu)</li><li>Tỷ lệ cuộn: ≥ 80%</li><li>Không dập vỡ, rất ít mắt</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Túi 1kg × 10 túi/thùng = 10kg tịnh</li><li>Container: 5.5 T/20FT | 12.5 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 6cm | 8cm | 10cm | 12cm (as required)</li><li>Rolling rate: ≥ 80%</li><li>No breakage, very few knots</li></ul><h3>Packaging & Shipping</h3><ul><li>1kg/bag × 10 bags/carton = 10kg net</li><li>Container: 5.5MT/20FT | 12.5MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[0],
    images: JSON.stringify([cinnamonImgs[0], cinnamonImgs[2]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '2–3%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Quế ống điếu loại A',
    name_en: 'Round Cassia Grade A',
    slug: 'que-ong-a',
    category: 'que',
    description: 'Quế ống điếu loại A thu hoạch từ cây 15–25 năm tuổi. Màu nâu đỏ tự nhiên, bào vỏ bằng tay bởi thợ lành nghề, hàm lượng tinh dầu cao nhất.',
    description_en: 'Round Cassia Grade A from 15–25-year-old trees. Natural reddish-brown color, hand-scraped by skilled craftsmen for maximum oil content.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 35–45cm (min 80%)</li><li>Độ dày: 3–6mm</li><li>Màu nâu đỏ tự nhiên, bào vỏ bằng tay</li><li>Hàm lượng tinh dầu cao nhất trong các loại quế</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Bao PP/PE hoặc theo yêu cầu</li><li>Container: 6 T/20FT | 13 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 35–45cm (min 80%)</li><li>Thickness: 3–6mm</li><li>Natural reddish-brown, hand-scraped</li><li>Highest oil content among cassia types</li></ul><h3>Packaging & Shipping</h3><ul><li>PP/PE bags or as required</li><li>Container: 6MT/20FT | 13MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[1],
    images: JSON.stringify([cinnamonImgs[1], cinnamonImgs[0], cinnamonImgs[2]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '3–5%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Quế ống điếu loại B',
    name_en: 'Round Cassia Grade B',
    slug: 'que-ong-b',
    category: 'que',
    description: 'Quế ống điếu loại B từ cây 10–15 năm tuổi. Chất lượng tốt, giá cạnh tranh, phù hợp cho ngành chế biến thực phẩm và dược phẩm.',
    description_en: 'Round Cassia Grade B from 10–15-year-old trees. Good quality, competitive pricing, suitable for food processing and pharmaceutical industries.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 35–45cm (min 70%)</li><li>Độ dày: 2–3mm</li><li>Màu nâu tự nhiên</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Bao PP/PE hoặc theo yêu cầu</li><li>Container: 6 T/20FT | 13 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 35–45cm (min 70%)</li><li>Thickness: 2–3mm</li><li>Natural brown color</li></ul><h3>Packaging & Shipping</h3><ul><li>PP/PE bags or as required</li><li>Container: 6MT/20FT | 13MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[2],
    images: JSON.stringify([cinnamonImgs[2], cinnamonImgs[0]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '2–4%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Quế cắt vuông',
    name_en: 'Square Cut Cassia',
    slug: 'que-cat-vuong',
    category: 'que',
    description: 'Quế cắt vuông được cắt từ quế ống điếu loại A, B. Kích thước đồng đều, tiện dụng cho các nhà chế biến thực phẩm và bán lẻ đóng gói.',
    description_en: 'Square Cut Cassia cut from Round Cassia Grade A/B. Uniform size, convenient for food processors and retail packaging.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 3–5cm (hoặc theo yêu cầu)</li><li>Độ dày: 3–5mm</li><li>Cắt đều, không vụn</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Bao PP/PE hoặc theo yêu cầu</li><li>Container: 6 T/20FT | 13 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 3–5cm (or as required)</li><li>Thickness: 3–5mm</li><li>Even cut, no debris</li></ul><h3>Packaging & Shipping</h3><ul><li>PP/PE bags or as required</li><li>Container: 6MT/20FT | 13MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[0],
    images: JSON.stringify([cinnamonImgs[0], cinnamonImgs[1]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '3–5%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Quế vụn',
    name_en: 'Broken Cassia',
    slug: 'que-vun',
    category: 'que',
    description: 'Quế vụn chất lượng cao từ cây quế Văn Yên. Phù hợp cho sản xuất tinh dầu quế, bột quế và chế biến công nghiệp thực phẩm.',
    description_en: 'Premium Broken Cassia from Van Yen trees. Ideal for cinnamon essential oil extraction, powder production and industrial food processing.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Chiều dài: 1–10cm</li><li>Độ dày: 0.8–2mm</li><li>Không mốc, không côn trùng</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 20–25kg tịnh</li><li>Container: 8.5 T/20FT | 17 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Length: 1–10cm</li><li>Thickness: 0.8–2mm</li><li>No mold, no insects</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 20–25kg</li><li>Container: 8.5MT/20FT | 17MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonImgs[2],
    images: JSON.stringify([cinnamonImgs[2], cinnamonImgs[0]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '2–3%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },
  {
    name: 'Bột quế',
    name_en: 'Cassia Powder',
    slug: 'bot-que',
    category: 'que',
    description: 'Bột quế nguyên chất từ quế Văn Yên, màu nâu đỏ tự nhiên, hương thơm nồng nàn. Không nấm mốc, không phụ gia, đạt tiêu chuẩn xuất khẩu EU/Mỹ.',
    description_en: 'Pure Cassia Powder from Van Yen, natural reddish-brown color, rich aroma. No mold, no additives, meets EU/US export standards.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Màu nâu đỏ tự nhiên, bột mịn</li><li>Không nấm mốc, không phụ gia màu</li><li>Hương thơm đặc trưng của quế Việt Nam</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Bao PP/PE: 20–30kg tịnh</li><li>Container: 15 T/20FT | 25 T/40FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Natural reddish-brown, fine powder</li><li>No mold, no artificial colorants</li><li>Characteristic Vietnamese cinnamon aroma</li></ul><h3>Packaging & Shipping</h3><ul><li>PP/PE bags: net 20–30kg</li><li>Container: 15MT/20FT | 25MT/40FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: cinnamonPowderImgs[0],
    images: JSON.stringify([cinnamonPowderImgs[0], cinnamonImgs[0]]),
    moisture: '≤ 13,5%',
    admixture: '≤ 1%',
    oil: '2–4%',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái, Việt Nam'
  },

  // ── HỒI (2 variants) ──────────────────────────────────────────────────────
  {
    name: 'Hồi nguyên cành',
    name_en: 'Whole Star Anise',
    slug: 'hoi-nguyen',
    category: 'hoi',
    description: 'Hoa hồi Việt Nam nguyên cành từ Lạng Sơn – Cao Bằng. Hình ngôi sao đẹp 8 cánh, màu nâu đỏ đặc trưng, hương thơm nồng, hàm lượng tinh dầu cao.',
    description_en: 'Whole Vietnamese Star Anise from Lang Son – Cao Bang. Beautiful 8-petal star shape, characteristic reddish-brown, strong fragrance, high essential oil content.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Hình ngôi sao 8 cánh đều, cánh dày</li><li>Màu nâu đỏ đặc trưng, khô đều</li><li>Hương thơm nồng nàn, trans-anethole ≥ 80%</li><li>Không nấm mốc, không côn trùng</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Túi PE trong, thùng carton ngoài: 10–25kg</li><li>Container: 8–10 T/20FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Even 8-petal star shape, thick petals</li><li>Characteristic reddish-brown, uniformly dried</li><li>Strong fragrance, trans-anethole ≥ 80%</li><li>No mold, no insects</li></ul><h3>Packaging & Shipping</h3><ul><li>PE inner bag, carton outer: 10–25kg</li><li>Container: 8–10MT/20FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: aniseImgs[0],
    images: JSON.stringify([aniseImgs[0], aniseImgs[1]]),
    moisture: '≤ 13%',
    admixture: '≤ 1%',
    oil: '≥ 8ml/100g',
    unit: 'Tấn / MT',
    origin: 'Lạng Sơn – Cao Bằng, Việt Nam'
  },
  {
    name: 'Hồi vỡ vụn',
    name_en: 'Broken Star Anise',
    slug: 'hoi-vo',
    category: 'hoi',
    description: 'Hồi vỡ vụn chất lượng cao cùng nguồn gốc với hồi nguyên cành. Giá cạnh tranh, phù hợp cho sản xuất tinh dầu hồi và chế biến công nghiệp.',
    description_en: 'Broken Star Anise of the same premium quality as whole. Competitive pricing, suitable for star anise essential oil production and industrial processing.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Mảnh vỡ tự nhiên, cùng chất lượng hồi nguyên cành</li><li>Màu nâu đỏ, hương thơm đặc trưng</li><li>Không nấm mốc, không côn trùng</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 10–25kg tịnh</li><li>Container: 10 T/20FT</li><li>Cảng xuất: Hải Phòng, Việt Nam</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Natural broken pieces, same quality as whole</li><li>Reddish-brown, characteristic aroma</li><li>No mold, no insects</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 10–25kg</li><li>Container: 10MT/20FT</li><li>Port of loading: Hai Phong, Vietnam</li></ul>`,
    image: aniseImgs[1],
    images: JSON.stringify([aniseImgs[1], aniseImgs[0]]),
    moisture: '≤ 13%',
    admixture: '≤ 1%',
    oil: '≥ 8ml/100g',
    unit: 'Tấn / MT',
    origin: 'Lạng Sơn – Cao Bằng, Việt Nam'
  },

  // ── GỪNG (3 variants) ──────────────────────────────────────────────────────
  {
    name: 'Gừng tươi',
    name_en: 'Fresh Ginger',
    slug: 'gung-tuoi',
    category: 'gung',
    description: 'Gừng tươi Việt Nam trồng tại Hưng Yên, Lào Cai. Vị cay nồng đặc trưng, hàm lượng gingerol cao, không thuốc bảo vệ thực vật. Xuất khẩu sang Nhật, Hàn, EU.',
    description_en: 'Fresh Vietnamese Ginger grown in Hung Yen, Lao Cai. Distinctive pungent flavor, high gingerol content, no pesticide residue. Exported to Japan, Korea, EU.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Khối lượng củ: tối thiểu 100g/củ</li><li>Không thối, không hà, không nảy mầm</li><li>Rửa sạch đất, không có mùi lạ</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton lỗ thoáng: 10–20kg</li><li>Container lạnh (reefer): 5°C – 10°C</li><li>Cảng xuất: Hải Phòng, TP. Hồ Chí Minh</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Piece weight: minimum 100g/piece</li><li>No rot, no hollowing, no sprouting</li><li>Cleaned, no off-odor</li></ul><h3>Packaging & Shipping</h3><ul><li>Ventilated carton box: 10–20kg</li><li>Reefer container: 5°C – 10°C</li><li>Port of loading: Hai Phong, Ho Chi Minh City</li></ul>`,
    image: gingerImgs[0],
    images: JSON.stringify([gingerImgs[0], gingerImgs[1]]),
    moisture: '',
    admixture: '≤ 1%',
    oil: '',
    unit: 'Tấn / MT',
    origin: 'Hưng Yên – Lào Cai, Việt Nam'
  },
  {
    name: 'Gừng sấy khô',
    name_en: 'Dried Ginger (Whole)',
    slug: 'gung-say',
    category: 'gung',
    description: 'Gừng sấy khô nguyên củ hoặc thái lát từ gừng tươi chất lượng cao. Hương vị đặc trưng được bảo toàn nhờ công nghệ sấy hiện đại, không phụ gia.',
    description_en: 'Dried whole or sliced ginger from premium fresh ginger. Characteristic flavor preserved through modern drying technology, no additives.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Sấy đều, màu vàng nâu tự nhiên</li><li>Hương thơm cay nồng đặc trưng</li><li>Không phụ gia, không chất bảo quản</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 10–25kg tịnh</li><li>Container: 10 T/20FT</li><li>Cảng xuất: Hải Phòng, TP. Hồ Chí Minh</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Uniformly dried, natural yellowish-brown</li><li>Characteristic spicy aroma</li><li>No additives, no preservatives</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 10–25kg</li><li>Container: 10MT/20FT</li><li>Port of loading: Hai Phong, Ho Chi Minh City</li></ul>`,
    image: gingerImgs[1],
    images: JSON.stringify([gingerImgs[1], gingerImgs[0], gingerImgs[2]]),
    moisture: '≤ 12%',
    admixture: '≤ 1%',
    oil: '',
    unit: 'Tấn / MT',
    origin: 'Hưng Yên – Lào Cai – Gia Lai, Việt Nam'
  },
  {
    name: 'Bột gừng',
    name_en: 'Ginger Powder',
    slug: 'bot-gung',
    category: 'gung',
    description: 'Bột gừng nguyên chất từ gừng Việt Nam. Bột mịn, màu vàng kem tự nhiên, hương thơm cay đặc trưng. Đạt tiêu chuẩn EU, US FDA, JAS của Nhật Bản.',
    description_en: 'Pure Ginger Powder from Vietnamese ginger. Fine powder, natural creamy-yellow color, characteristic spicy aroma. Meets EU, US FDA, JAS (Japan) standards.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Bột mịn, màu vàng kem tự nhiên</li><li>Không phụ gia màu, không chất bảo quản</li><li>Hương thơm cay đặc trưng</li><li>Đạt tiêu chuẩn EU, US FDA, JAS</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Bao PP/PE: 20–25kg tịnh</li><li>Container: 15 T/20FT</li><li>Cảng xuất: Hải Phòng, TP. Hồ Chí Minh</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Fine powder, natural creamy-yellow color</li><li>No artificial colorants, no preservatives</li><li>Characteristic spicy aroma</li><li>Meets EU, US FDA, JAS standards</li></ul><h3>Packaging & Shipping</h3><ul><li>PP/PE bags: net 20–25kg</li><li>Container: 15MT/20FT</li><li>Port of loading: Hai Phong, Ho Chi Minh City</li></ul>`,
    image: gingerImgs[2],
    images: JSON.stringify([gingerImgs[2], gingerImgs[0]]),
    moisture: '≤ 10%',
    admixture: '≤ 0,5%',
    oil: '',
    unit: 'Tấn / MT',
    origin: 'Hưng Yên – Gia Lai, Việt Nam'
  },

  // ── NGHỆ (3 variants) ──────────────────────────────────────────────────────
  {
    name: 'Nghệ sấy khô',
    name_en: 'Dried Turmeric (Whole)',
    slug: 'nghe-say',
    category: 'nghe',
    description: 'Nghệ sấy khô nguyên củ từ Bình Định, Quảng Ngãi. Hàm lượng curcumin 2–5%, màu vàng cam rực rỡ tự nhiên. Không nấm mốc, không phụ gia.',
    description_en: 'Dried Whole Turmeric from Binh Dinh, Quang Ngai. Curcumin content 2–5%, vivid natural orange-yellow. No mold, no additives.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Sấy đều, màu vàng cam rực rỡ</li><li>Không nấm mốc, không chất bảo quản</li><li>Vỏ ngoài sạch, không sâu bệnh</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 10–25kg tịnh</li><li>Container: 10 T/20FT</li><li>Cảng xuất: Hải Phòng, Đà Nẵng, TP. Hồ Chí Minh</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Uniformly dried, vivid orange-yellow color</li><li>No mold, no preservatives</li><li>Clean outer surface, no pest damage</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 10–25kg</li><li>Container: 10MT/20FT</li><li>Port of loading: Hai Phong, Da Nang, Ho Chi Minh City</li></ul>`,
    image: turmericImgs[0],
    images: JSON.stringify([turmericImgs[0], turmericImgs[1]]),
    moisture: '≤ 12%',
    admixture: '≤ 1%',
    oil: '2–5%',
    unit: 'Tấn / MT',
    origin: 'Bình Định – Quảng Ngãi, Việt Nam'
  },
  {
    name: 'Nghệ thái lát',
    name_en: 'Turmeric Slices',
    slug: 'nghe-lat',
    category: 'nghe',
    description: 'Nghệ thái lát sấy khô đều, màu vàng cam rực rỡ, giữ trọn hàm lượng curcumin. Phù hợp cho dược phẩm, thực phẩm chức năng và mỹ phẩm thiên nhiên.',
    description_en: 'Uniformly dried turmeric slices, vivid orange-yellow, full curcumin content retained. Suitable for pharmaceuticals, functional foods and natural cosmetics.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Độ dày lát: 3–5mm đều</li><li>Màu vàng cam rực rỡ, không xỉn màu</li><li>Không nấm mốc, không phụ gia màu</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Thùng carton: 10–20kg tịnh</li><li>Container: 10 T/20FT</li><li>Cảng xuất: Hải Phòng, Đà Nẵng, TP. Hồ Chí Minh</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Slice thickness: 3–5mm uniform</li><li>Vivid orange-yellow, no discoloration</li><li>No mold, no artificial colorants</li></ul><h3>Packaging & Shipping</h3><ul><li>Carton box: net 10–20kg</li><li>Container: 10MT/20FT</li><li>Port of loading: Hai Phong, Da Nang, Ho Chi Minh City</li></ul>`,
    image: turmericImgs[1],
    images: JSON.stringify([turmericImgs[1], turmericImgs[0]]),
    moisture: '≤ 12%',
    admixture: '≤ 1%',
    oil: '2–5%',
    unit: 'Tấn / MT',
    origin: 'Bình Định – Quảng Ngãi, Việt Nam'
  },
  {
    name: 'Bột nghệ',
    name_en: 'Turmeric Powder',
    slug: 'bot-nghe',
    category: 'nghe',
    description: 'Bột nghệ nguyên chất từ nghệ Việt Nam, màu vàng cam tươi sáng, không phụ gia. Hàm lượng curcumin cao 3–5%, đạt tiêu chuẩn EU và US FDA.',
    description_en: 'Pure Vietnamese Turmeric Powder, vivid orange-yellow, no additives. High curcumin content 3–5%, meets EU and US FDA standards.',
    detail: `<h3>Đặc điểm kỹ thuật</h3><ul><li>Bột mịn, màu vàng cam tươi sáng tự nhiên</li><li>Không nấm mốc, không phụ gia màu</li><li>Không chất bảo quản, an toàn thực phẩm</li><li>Đạt tiêu chuẩn EU, US FDA</li></ul><h3>Đóng gói & Vận chuyển</h3><ul><li>Bao PP/PE: 20–25kg tịnh</li><li>Container: 15 T/20FT</li><li>Cảng xuất: Hải Phòng, Đà Nẵng, TP. Hồ Chí Minh</li></ul>`,
    detail_en: `<h3>Technical Specifications</h3><ul><li>Fine powder, vivid natural orange-yellow</li><li>No mold, no artificial colorants</li><li>No preservatives, food-safe</li><li>Meets EU, US FDA standards</li></ul><h3>Packaging & Shipping</h3><ul><li>PP/PE bags: net 20–25kg</li><li>Container: 15MT/20FT</li><li>Port of loading: Hai Phong, Da Nang, Ho Chi Minh City</li></ul>`,
    image: turmericImgs[0],
    images: JSON.stringify([turmericImgs[0], turmericImgs[1]]),
    moisture: '≤ 10%',
    admixture: '≤ 0,5%',
    oil: '3–5%',
    unit: 'Tấn / MT',
    origin: 'Bình Định – Quảng Ngãi – Tây Nguyên, Việt Nam'
  },
];

const insertMany = db.transaction((items) => {
  for (const item of items) insertProduct.run(item);
});
insertMany(products);

// ─── NEWS ─────────────────────────────────────────────────────────────────────

const insertNews = db.prepare(`
  INSERT INTO news (title, title_en, slug, category, summary, summary_en, content, image, author)
  VALUES (@title, @title_en, @slug, @category, @summary, @summary_en, @content, @image, @author)
`);

const newsItems = [
  {
    title: 'ARTOCA ký kết hợp đồng xuất khẩu quế sang thị trường EU',
    title_en: 'ARTOCA Signs Cinnamon Export Contract with EU Market',
    slug: 'artoca-ky-ket-hop-dong-xuat-khau-que-sang-eu',
    category: 'tin-cong-ty',
    summary: 'Công ty TNHH XNK Artoca vừa ký kết hợp đồng cung cấp 150 tấn quế Việt Nam sang thị trường Đức và Hà Lan, đánh dấu bước phát triển quan trọng trên thị trường EU.',
    summary_en: 'ARTOCA Import Export Co., Ltd has signed a contract to supply 150 tons of Vietnamese cinnamon to German and Dutch markets, marking an important milestone in the EU market.',
    content: `<p>Ngày 15/01/2025, Công ty TNHH XNK Artoca chính thức ký kết hợp đồng cung cấp 150 tấn quế Việt Nam xuất xứ Văn Yên, Yên Bái với hai đối tác tại Đức và Hà Lan.</p><p>Đây là hợp đồng có giá trị lớn, khẳng định chất lượng quế Việt Nam ngày càng được công nhận tại thị trường EU.</p><h3>Thông tin hợp đồng</h3><ul><li>Khối lượng: 150 tấn/năm</li><li>Chủng loại: Quế chẻ, quế vụn, bột quế</li><li>Tiêu chuẩn: EU organic certified</li><li>Giao hàng: Hải Phòng → Rotterdam</li></ul>`,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    author: 'Ban Truyền Thông ARTOCA'
  },
  {
    title: 'Thị trường gia vị toàn cầu 2025: Cơ hội vàng cho xuất khẩu Việt Nam',
    title_en: 'Global Spice Market 2025: Golden Opportunity for Vietnamese Exports',
    slug: 'thi-truong-gia-vi-toan-cau-2025-co-hoi-cho-xuat-khau-viet-nam',
    category: 'thi-truong',
    summary: 'Thị trường gia vị toàn cầu dự kiến đạt 21 tỷ USD vào năm 2027, với Việt Nam nắm giữ vị trí xuất khẩu quế và hồi hàng đầu thế giới.',
    summary_en: 'The global spice market is projected to reach USD 21 billion by 2027, with Vietnam holding a leading position in cinnamon and star anise exports.',
    content: `<p>Theo báo cáo mới nhất, thị trường gia vị toàn cầu đang tăng trưởng mạnh mẽ với tốc độ CAGR khoảng 5.5%/năm.</p><p>Việt Nam hiện là nước xuất khẩu quế lớn thứ 2 thế giới và xuất khẩu hồi lớn nhất thế giới.</p><h3>Các thị trường tiềm năng</h3><ul><li>EU: Yêu cầu ngày càng cao về chứng nhận hữu cơ</li><li>Mỹ: Nhu cầu gia vị tăng mạnh trong ngành thực phẩm</li><li>Trung Đông: Thị trường truyền thống cho quế và hồi</li><li>Nhật Bản, Hàn Quốc: Ưa chuộng gia vị chất lượng cao</li></ul>`,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80',
    author: 'Phòng Nghiên Cứu Thị Trường ARTOCA'
  },
  {
    title: 'ARTOCA tham dự Hội chợ Nông sản Quốc tế SIAL Paris 2024',
    title_en: 'ARTOCA Participates in SIAL Paris 2024 International Food Exhibition',
    slug: 'artoca-tham-du-sial-paris-2024',
    category: 'su-kien',
    summary: 'ARTOCA tham dự Hội chợ Thực phẩm Quốc tế SIAL Paris 2024, trưng bày bộ sưu tập gia vị Việt Nam cao cấp, kết nối với hơn 200 đối tác nhập khẩu từ 26 quốc gia.',
    summary_en: 'ARTOCA participated in the SIAL Paris 2024 International Food Exhibition, showcasing premium Vietnamese spices and connecting with 200+ importers from 26 countries.',
    content: `<p>Từ ngày 19–23/10/2024, ARTOCA tham dự SIAL Paris 2024 tại Paris Nord Villepinte, Pháp – một trong những hội chợ thực phẩm lớn nhất thế giới.</p><h3>Kết quả đạt được</h3><ul><li>Tiếp xúc với hơn 200 đối tác từ 26 quốc gia</li><li>Ký kết 3 MOU với đối tác EU</li><li>Mở rộng thêm 2 thị trường mới: Bỉ và Tây Ban Nha</li></ul>`,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    author: 'Ban Truyền Thông ARTOCA'
  },
  {
    title: 'Tuyển dụng: Nhân viên Kinh doanh Xuất khẩu',
    title_en: 'Job Opening: Export Sales Executive',
    slug: 'tuyen-dung-nhan-vien-kinh-doanh-xuat-khau',
    category: 'tuyen-dung',
    summary: 'ARTOCA đang tuyển dụng Nhân viên Kinh doanh Xuất khẩu với kinh nghiệm trong lĩnh vực nông sản, gia vị. Ứng viên thành thạo tiếng Anh và có tinh thần làm việc chuyên nghiệp.',
    summary_en: 'ARTOCA is looking for an Export Sales Executive with experience in agricultural products and spices. Candidates must be fluent in English.',
    content: `<p>Công ty TNHH XNK ARTOCA đang tuyển dụng vị trí <strong>Nhân viên Kinh doanh Xuất khẩu</strong>.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Đại học ngành Kinh tế Đối ngoại</li><li>Tiếng Anh thành thạo</li><li>Ưu tiên có kinh nghiệm xuất nhập khẩu nông sản</li></ul><h3>Quyền lợi</h3><ul><li>Lương cạnh tranh + hoa hồng</li><li>Cơ hội đi công tác nước ngoài</li></ul><p>Liên hệ: <strong>artocavn@gmail.com</strong></p>`,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    author: 'Phòng Nhân Sự ARTOCA'
  },
  {
    title: 'Artoca đạt chứng nhận ISO 22000:2018 và HACCP',
    title_en: 'Artoca Achieves ISO 22000:2018 and HACCP Certification',
    slug: 'artoca-dat-chung-nhan-iso-22000-haccp',
    category: 'tin-cong-ty',
    summary: 'ARTOCA chính thức được cấp chứng nhận ISO 22000:2018 và HACCP, khẳng định cam kết về an toàn thực phẩm và chất lượng sản phẩm xuất khẩu.',
    summary_en: 'ARTOCA has officially received ISO 22000:2018 and HACCP certifications, affirming its commitment to food safety and export product quality.',
    content: `<p>Công ty TNHH XNK ARTOCA chính thức được cấp chứng nhận <strong>ISO 22000:2018</strong> và <strong>HACCP</strong>.</p><h3>Ý nghĩa của chứng nhận</h3><ul><li>Mở rộng khả năng tiếp cận thị trường EU, Mỹ, Nhật Bản</li><li>Tăng cường niềm tin của đối tác quốc tế</li><li>Đảm bảo quy trình sản xuất đáp ứng tiêu chuẩn quốc tế</li></ul>`,
    image: 'https://images.unsplash.com/photo-1542601906897-ecd92d0d52f5?w=800&q=80',
    author: 'Phòng Kiểm Soát Chất Lượng ARTOCA'
  },
];

const insertNewsMany = db.transaction((items) => {
  for (const item of items) insertNews.run(item);
});
insertNewsMany(newsItems);

// ─── BANNERS ──────────────────────────────────────────────────────────────────

const insertBanner = db.prepare(`
  INSERT INTO banners (title, subtitle, image, link, sort_order)
  VALUES (@title, @subtitle, @image, @link, @sort_order)
`);

const banners = [
  { title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1600&q=80', link: '/san-pham', sort_order: 1 },
  { title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80', link: '/san-pham?category=que', sort_order: 2 },
  { title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&q=80', link: '/san-pham?category=hoi', sort_order: 3 },
];

const insertBannersMany = db.transaction((items) => {
  for (const item of items) insertBanner.run(item);
});
insertBannersMany(banners);

console.log('✅ ARTOCA database seeded successfully!');
console.log(`   - ${products.length} products (8 Quế + 2 Hồi + 3 Gừng + 3 Nghệ)`);
console.log(`   - ${newsItems.length} news articles`);
console.log(`   - ${banners.length} banners`);

db.close();
