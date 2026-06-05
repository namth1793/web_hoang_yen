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
  INSERT INTO products (name, name_en, slug, category, description, description_en, detail, detail_en, image, unit, origin)
  VALUES (@name, @name_en, @slug, @category, @description, @description_en, @detail, @detail_en, @image, @unit, @origin)
`);

const queDetailVI = `<h3>Tổng quan</h3>
<p>ARTOCA cung cấp đầy đủ các loại quế Việt Nam chất lượng cao từ vùng Văn Yên, Yên Bái – vùng trồng quế lớn nhất và nổi tiếng nhất Việt Nam. Tất cả sản phẩm được kiểm soát nghiêm ngặt từ khâu thu hoạch đến đóng gói xuất khẩu.</p>

<h3>1. Quế chẻ / Quế ép ống (Split Cassia)</h3>
<p>Thu hoạch từ cây quế 8–10 năm tuổi tại Văn Yên. Ống quế độ dày đồng đều (1–2mm), không nấm mốc, ít tạp chất.</p>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 2–3%</li>
<li>Chiều dài: 25–45cm | Độ dày: 0.8–2mm</li>
<li>Đóng gói: Thùng carton (10kg hoặc 25kg tịnh)</li>
<li>Container: 8.5 T/20FT; 17 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>2. Quế sáo (Cigarette Cassia / Cassia Verra)</h3>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 2–3%</li>
<li>Chiều dài: 20–47cm | Màu nâu tự nhiên, bề mặt mịn</li>
<li>Đóng gói: Thùng carton 10kg tịnh</li>
<li>Container: 5.5 T/20FT; 12.5 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>3. Quế điếu thuốc / Quế ngón tay (Finger Cassia)</h3>
<p>Thu hoạch từ cây quế 10–12 năm tuổi. Cuộn đều tỷ lệ 80–90%, không dập vỡ, rất ít mắt.</p>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 2–3%</li>
<li>Chiều dài: 6/8/10/12cm (theo yêu cầu)</li>
<li>Đóng gói: Túi 1kg (10 túi/thùng = 10kg tịnh)</li>
<li>Container: 5.5 T/20FT; 12.5 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>4. Quế ống điếu loại A, B (Round Cassia)</h3>
<p>Thu hoạch từ cây quế 15–25 năm tuổi, màu nâu đỏ tự nhiên. Được bào vỏ bằng tay bởi thợ lành nghề để giữ lớp tinh dầu tốt nhất.</p>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 3–5%</li>
<li>Chiều dài: 35–45cm (≥80%) | Độ dày: 3–6mm</li>
<li>Đóng gói: Túi PP/PE</li>
<li>Container: 6 T/20FT; 13 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>5. Quế loại A cắt vuông / cắt khoanh tròn (Square / Round Cut)</h3>
<p>Cắt từ quế ống điếu loại A,B.</p>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 3–5%</li>
<li>Chiều dài: 3–5cm (theo yêu cầu) | Độ dày: 3–5mm</li>
<li>Đóng gói: Túi PP/PE</li>
<li>Container: 6 T/20FT; 13 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>6. Quế loại A cắt khúc đã bào vỏ (Scroll Cut Cassia)</h3>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 3–5%</li>
<li>Chiều dài: 5–6cm (theo yêu cầu) | Độ dày: ≥ 3mm</li>
<li>Đóng gói: Thùng carton 10–20kg</li>
<li>Container: 6 T/20FT; 13 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>7. Quế vụn (Broken Cassia)</h3>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 2–3%</li>
<li>Chiều dài: 1–10cm | Độ dày: 0.8–2mm</li>
<li>Đóng gói: Thùng carton 20–25kg</li>
<li>Container: 8.5 T/20FT; 17 T/40FT | Cảng: Hải Phòng</li>
</ul>

<h3>8. Bột quế (Powder Cassia)</h3>
<ul>
<li>Độ ẩm: ≤ 13,5% | Tạp chất: ≤ 1% | Độ dầu: 2–4%</li>
<li>Màu nâu đỏ tự nhiên, không nấm mốc</li>
<li>Đóng gói: Bao PP/PE 20–30kg</li>
<li>Container: 15 T/20FT; 25 T/40FT | Cảng: Hải Phòng</li>
</ul>`;

const queDetailEN = `<h3>Overview</h3>
<p>ARTOCA offers a full range of premium Vietnamese Cassia Cinnamon sourced from the Van Yen region of Yen Bai Province — Vietnam's most renowned cinnamon growing area. All products undergo strict quality control from harvest to export packaging.</p>

<h3>1. Split Cassia</h3>
<p>Harvested from 8–10-year-old trees in Van Yen. Uniform thickness (1–2mm), mold-free, low impurities.</p>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 2–3%</li>
<li>Length: 25–45cm (80% min) | Thickness: 0.8–2mm</li>
<li>Packing: Cartons (net 10kg or 25kg)</li>
<li>Container: 8.5MT/20FT; 17MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>2. Cigarette Cassia (Cassia Verra)</h3>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 2–3%</li>
<li>Length: 20–47cm | Natural color, smooth touch</li>
<li>Packing: Carton box (net weight: 10kg)</li>
<li>Container: 5.5MT/20FT; 12.5MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>3. Finger Cassia</h3>
<p>Harvested from 10–12-year-old trees in Van Yen. Evenly rolled (80–90% roll rate), free from breakage, very few knots.</p>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 2–3%</li>
<li>Length: 6/8/10/12cm (as required)</li>
<li>Packing: 1kg/bag (10 bags per carton = 10kg net)</li>
<li>Container: 5.5MT/20FT; 12.5MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>4. Round Cassia (Grade A & B)</h3>
<p>Harvested from 15–25-year-old trees. Natural reddish-brown color, hand-scraped by skilled craftsmen to preserve the oil-rich layer.</p>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 4–6%</li>
<li>Length: 35–45cm (≥80%) | Thickness: 3–6mm</li>
<li>Packing: PP/PE bags</li>
<li>Container: 6MT/20FT; 13MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>5. Square / Round Cut Cassia</h3>
<p>Cut from Round Cassia (Grade A, B).</p>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 4–6%</li>
<li>Length: 3–5cm (or as required) | Thickness: 3–5mm</li>
<li>Packing: PP/PE bags</li>
<li>Container: 6MT/20FT; 13MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>6. Scroll Cut Cassia</h3>
<p>Cut from Round Cassia (Grade A, B).</p>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 4–6%</li>
<li>Length: 3–5cm up | Thickness: 3–6mm</li>
<li>Packing: Cartons (net 10–20kg)</li>
<li>Container: 6MT/20FT; 13MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>7. Broken Cassia</h3>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 2–3%</li>
<li>Length: 1–10cm | Thickness: 0.8–2mm</li>
<li>Packing: Cartons (net 20–25kg)</li>
<li>Container: 8.5MT/20FT; 18MT/40FT | Port: Hai Phong, VN</li>
</ul>

<h3>8. Powder Cassia</h3>
<ul>
<li>Moisture: ≤ 13.5% | Admixture: ≤ 1% | Oil content: 2–4%</li>
<li>Natural reddish color, no mold</li>
<li>Packing: PP/PE bags (net 20–30kg)</li>
<li>Container: 15MT/20FT; 25MT/40FT | Port: Hai Phong, VN</li>
</ul>`;

const hoiDetailVI = `<h3>Tổng quan</h3>
<p>Hoa hồi Việt Nam được thu hoạch từ các vùng núi màu mỡ phía Bắc, đặc biệt là Lạng Sơn và Cao Bằng. ARTOCA cung cấp hoa hồi chất lượng cao dưới sự kiểm soát chất lượng nghiêm ngặt, đảm bảo tính nhất quán và an toàn thực phẩm.</p>

<h3>Đặc điểm sản phẩm</h3>
<ul>
<li>Hình dạng ngôi sao đẹp, cánh dày và đồng đều</li>
<li>Hương thơm nồng nàn, hàm lượng tinh dầu cao (trans-anethole ≥ 80%)</li>
<li>Màu nâu đỏ đặc trưng, khô đều</li>
<li>Được sử dụng rộng rãi trong thực phẩm, đồ uống, dược phẩm và mỹ phẩm</li>
</ul>

<h3>Tiêu chuẩn chất lượng</h3>
<ul>
<li>Độ ẩm: ≤ 13%</li>
<li>Tạp chất: ≤ 1%</li>
<li>Tinh dầu: ≥ 8ml/100g</li>
<li>Không nấm mốc, không côn trùng</li>
<li>Đạt tiêu chuẩn EU, US FDA</li>
</ul>

<h3>Đóng gói và vận chuyển</h3>
<ul>
<li>Túi PE bên trong, thùng carton bên ngoài (10–25kg)</li>
<li>Hoặc theo yêu cầu của khách hàng</li>
<li>Container: 8–10 T/20FT | Cảng: Hải Phòng</li>
</ul>`;

const hoiDetailEN = `<h3>Overview</h3>
<p>Vietnamese Star Anise is sourced from the fertile mountainous regions of Northern Vietnam, particularly Lang Son and Cao Bang provinces. ARTOCA provides premium Star Anise under strict quality control to ensure consistency and food safety for importers worldwide.</p>

<h3>Product Characteristics</h3>
<ul>
<li>Beautiful star shape with thick, uniform petals</li>
<li>Strong fragrance, high essential oil content (trans-anethole ≥ 80%)</li>
<li>Characteristic reddish-brown color, uniformly dried</li>
<li>Widely used in food, beverage, pharmaceutical and cosmetic industries</li>
</ul>

<h3>Quality Standards</h3>
<ul>
<li>Moisture: ≤ 13%</li>
<li>Admixture: ≤ 1%</li>
<li>Essential oil: ≥ 8ml/100g</li>
<li>No mold, no insects</li>
<li>Meets EU and US FDA standards</li>
</ul>

<h3>Packaging & Shipping</h3>
<ul>
<li>PE inner bag, carton outer box (10–25kg)</li>
<li>Or as per customer requirements</li>
<li>Container: 8–10MT/20FT | Port: Hai Phong, VN</li>
</ul>`;

const products = [
  {
    name: 'Quế',
    name_en: 'Cinnamon (Cassia)',
    slug: 'que',
    category: 'que',
    description: 'Việt Nam là một trong những nước sản xuất và xuất khẩu quế hàng đầu thế giới, nổi tiếng với hương thơm nồng nàn, vị đậm đà và hàm lượng tinh dầu cao. Quế ARTOCA được trồng chủ yếu tại vùng Văn Yên, Yên Bái, thu hoạch và chế biến cẩn thận đáp ứng tiêu chuẩn chất lượng quốc tế.',
    description_en: 'Vietnam is one of the world\'s leading producers and exporters of Cassia Cinnamon, known for its strong aroma, rich flavor, and high essential oil content. ARTOCA\'s cinnamon is grown mainly in Van Yen, Yen Bai, carefully harvested and processed to meet international quality standards.',
    detail: queDetailVI,
    detail_en: queDetailEN,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
    unit: 'Tấn / MT',
    origin: 'Văn Yên, Yên Bái – Lào Cai, Việt Nam'
  },
  {
    name: 'Hồi',
    name_en: 'Star Anise',
    slug: 'hoi',
    category: 'hoi',
    description: 'Hoa hồi Việt Nam được đánh giá cao trên thị trường toàn cầu nhờ hương thơm nồng nàn, hình dáng ngôi sao đẹp mắt và hàm lượng tinh dầu cao. ARTOCA cung cấp nguồn cung hoa hồi cao cấp ổn định cho các nhà nhập khẩu, bán buôn và nhà sản xuất trên toàn thế giới.',
    description_en: 'Vietnamese Star Anise is highly appreciated in the global market for its strong fragrance, beautiful star shape, and high oil content. ARTOCA offers a reliable supply of premium Star Anise for importers, wholesalers, and manufacturers worldwide.',
    detail: hoiDetailVI,
    detail_en: hoiDetailEN,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
    unit: 'Tấn / MT',
    origin: 'Lạng Sơn – Cao Bằng, Việt Nam'
  },
  {
    name: 'Gừng',
    name_en: 'Ginger',
    slug: 'gung',
    category: 'gung',
    description: 'Gừng Việt Nam nổi tiếng với vị cay nồng đặc trưng và hàm lượng gingerol cao. ARTOCA cung cấp gừng tươi và gừng sấy khô chất lượng cao, đáp ứng các tiêu chuẩn xuất khẩu quốc tế cho thị trường EU, Mỹ, Nhật Bản và Hàn Quốc.',
    description_en: 'Vietnamese ginger is renowned for its distinctive pungent flavor and high gingerol content. ARTOCA supplies fresh and dried ginger of premium quality, meeting international export standards for EU, US, Japanese, and Korean markets.',
    detail: `<h3>Tổng quan</h3>
<p>Gừng Việt Nam được trồng tại các vùng núi phía Bắc và miền Trung, nổi tiếng với chất lượng cao và hương vị đặc trưng. ARTOCA cung cấp cả gừng tươi và gừng chế biến (sấy khô, thái lát, bột gừng).</p>
<h3>Các dạng sản phẩm</h3>
<ul>
<li>Gừng tươi nguyên củ (Fresh Ginger)</li>
<li>Gừng sấy khô nguyên củ (Dried Whole Ginger)</li>
<li>Gừng thái lát sấy (Dried Ginger Slices)</li>
<li>Bột gừng (Ginger Powder)</li>
</ul>
<h3>Tiêu chuẩn chất lượng</h3>
<ul>
<li>Độ ẩm: ≤ 12% (gừng khô)</li>
<li>Tạp chất: ≤ 1%</li>
<li>Không nấm mốc, không côn trùng</li>
<li>Đạt tiêu chuẩn EU, US FDA, JAS</li>
</ul>
<h3>Đóng gói</h3>
<ul>
<li>Thùng carton 10–25kg hoặc theo yêu cầu</li>
<li>Cảng bốc hàng: Hải Phòng, TP. Hồ Chí Minh</li>
</ul>`,
    detail_en: `<h3>Overview</h3>
<p>Vietnamese ginger is cultivated in the northern and central highland regions, known for premium quality and distinctive flavor. ARTOCA supplies both fresh and processed ginger (dried, sliced, powder).</p>
<h3>Product Forms</h3>
<ul>
<li>Fresh Whole Ginger</li>
<li>Dried Whole Ginger</li>
<li>Dried Ginger Slices</li>
<li>Ginger Powder</li>
</ul>
<h3>Quality Standards</h3>
<ul>
<li>Moisture: ≤ 12% (dried)</li>
<li>Admixture: ≤ 1%</li>
<li>No mold, no insects</li>
<li>Meets EU, US FDA, JAS standards</li>
</ul>
<h3>Packaging</h3>
<ul>
<li>Cartons 10–25kg or as per customer requirements</li>
<li>Port of loading: Hai Phong, Ho Chi Minh City</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80',
    unit: 'Tấn / MT',
    origin: 'Hưng Yên – Lào Cai – Gia Lai, Việt Nam'
  },
  {
    name: 'Nghệ',
    name_en: 'Turmeric',
    slug: 'nghe',
    category: 'nghe',
    description: 'Nghệ Việt Nam giàu curcumin – hoạt chất quý với nhiều tác dụng tốt cho sức khỏe. ARTOCA cung cấp nghệ tươi và nghệ chế biến (bột nghệ, lát nghệ sấy) đáp ứng tiêu chuẩn xuất khẩu quốc tế, được ưa chuộng trong dược phẩm, mỹ phẩm và thực phẩm.',
    description_en: 'Vietnamese turmeric is rich in curcumin — a precious bioactive compound with numerous health benefits. ARTOCA supplies fresh and processed turmeric (powder, dried slices) meeting international export standards, highly valued in pharmaceutical, cosmetic, and food industries.',
    detail: `<h3>Tổng quan</h3>
<p>Nghệ Việt Nam được trồng chủ yếu tại các tỉnh miền Trung và Tây Nguyên như Bình Định, Quảng Ngãi. Hàm lượng curcumin cao (2–5%) là điểm nổi bật của nghệ Việt Nam so với các nguồn khác.</p>
<h3>Các dạng sản phẩm</h3>
<ul>
<li>Nghệ tươi nguyên củ (Fresh Turmeric)</li>
<li>Nghệ sấy nguyên củ (Dried Whole Turmeric)</li>
<li>Nghệ thái lát sấy (Dried Turmeric Slices)</li>
<li>Bột nghệ (Turmeric Powder)</li>
</ul>
<h3>Tiêu chuẩn chất lượng</h3>
<ul>
<li>Hàm lượng curcumin: 2–5%</li>
<li>Độ ẩm: ≤ 10% (bột nghệ)</li>
<li>Màu vàng cam đặc trưng, tự nhiên</li>
<li>Không nấm mốc, không phụ gia màu</li>
<li>Đạt tiêu chuẩn EU, US FDA</li>
</ul>
<h3>Đóng gói</h3>
<ul>
<li>Bao PP/PE 20–25kg hoặc theo yêu cầu</li>
<li>Cảng bốc hàng: Hải Phòng, TP. Hồ Chí Minh, Đà Nẵng</li>
</ul>`,
    detail_en: `<h3>Overview</h3>
<p>Vietnamese turmeric is cultivated mainly in the central and central highland provinces such as Binh Dinh and Quang Ngai. High curcumin content (2–5%) is the hallmark of Vietnamese turmeric compared to other sources.</p>
<h3>Product Forms</h3>
<ul>
<li>Fresh Whole Turmeric</li>
<li>Dried Whole Turmeric</li>
<li>Dried Turmeric Slices</li>
<li>Turmeric Powder</li>
</ul>
<h3>Quality Standards</h3>
<ul>
<li>Curcumin content: 2–5%</li>
<li>Moisture: ≤ 10% (powder)</li>
<li>Characteristic natural orange-yellow color</li>
<li>No mold, no artificial colorants</li>
<li>Meets EU, US FDA standards</li>
</ul>
<h3>Packaging</h3>
<ul>
<li>PP/PE bags 20–25kg or as per customer requirements</li>
<li>Port of loading: Hai Phong, Ho Chi Minh City, Da Nang</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
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
    content: `<p>Ngày 15/01/2025, Công ty TNHH XNK Artoca chính thức ký kết hợp đồng cung cấp 150 tấn quế Việt Nam xuất xứ Văn Yên, Yên Bái với hai đối tác tại Đức và Hà Lan.</p>
<p>Đây là hợp đồng có giá trị lớn, khẳng định chất lượng quế Việt Nam ngày càng được công nhận tại thị trường EU. Lô hàng đầu tiên dự kiến xuất khẩu vào tháng 3/2025.</p>
<h3>Thông tin hợp đồng</h3>
<ul>
<li>Khối lượng: 150 tấn/năm</li>
<li>Chủng loại: Quế chẻ, quế vụn, bột quế</li>
<li>Tiêu chuẩn: EU organic certified, Rainforest Alliance</li>
<li>Giao hàng: Hải Phòng → Rotterdam</li>
</ul>`,
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
    content: `<p>Theo báo cáo mới nhất từ các tổ chức nghiên cứu thị trường quốc tế, thị trường gia vị toàn cầu đang tăng trưởng mạnh mẽ với tốc độ CAGR khoảng 5.5%/năm.</p>
<p>Việt Nam hiện là nước xuất khẩu quế lớn thứ 2 thế giới (sau Indonesia) và xuất khẩu hồi lớn nhất thế giới. Đây là cơ hội vàng cho các doanh nghiệp như ARTOCA đẩy mạnh mở rộng thị trường.</p>
<h3>Các thị trường tiềm năng</h3>
<ul>
<li>EU: Yêu cầu ngày càng cao về chứng nhận hữu cơ và truy xuất nguồn gốc</li>
<li>Mỹ: Nhu cầu gia vị tăng mạnh trong ngành thực phẩm chế biến</li>
<li>Trung Đông: Thị trường truyền thống cho quế và hồi</li>
<li>Nhật Bản, Hàn Quốc: Ưa chuộng gia vị chất lượng cao</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80',
    author: 'Phòng Nghiên Cứu Thị Trường ARTOCA'
  },
  {
    title: 'ARTOCA tham dự Hội chợ Nông sản Quốc tế SIAL Paris 2024',
    title_en: 'ARTOCA Participates in SIAL Paris 2024 International Food Exhibition',
    slug: 'artoca-tham-du-sial-paris-2024',
    category: 'su-kien',
    summary: 'ARTOCA tham dự Hội chợ Thực phẩm Quốc tế SIAL Paris 2024, trưng bày bộ sưu tập gia vị Việt Nam cao cấp, kết nối với hơn 200 đối tác nhập khẩu từ 26 quốc gia.',
    summary_en: 'ARTOCA participated in the SIAL Paris 2024 International Food Exhibition, showcasing a premium Vietnamese spice collection and connecting with 200+ importers from 26 countries.',
    content: `<p>Từ ngày 19–23/10/2024, ARTOCA tham dự Hội chợ Thực phẩm Quốc tế SIAL Paris 2024 tại Paris Nord Villepinte, Pháp – một trong những hội chợ thực phẩm lớn nhất thế giới.</p>
<p>Tại gian hàng, ARTOCA trưng bày đầy đủ dòng sản phẩm gia vị cao cấp gồm: quế các loại, hoa hồi, gừng sấy, bột nghệ. Chương trình thử nghiệm sản phẩm thu hút sự quan tâm của nhiều đối tác EU.</p>
<h3>Kết quả đạt được</h3>
<ul>
<li>Tiếp xúc với hơn 200 đối tác nhập khẩu từ 26 quốc gia</li>
<li>Ký kết 3 biên bản ghi nhớ (MOU) với đối tác EU</li>
<li>Nhận được phản hồi tích cực về chất lượng và giá cạnh tranh</li>
<li>Mở rộng thêm 2 thị trường mới: Bỉ và Tây Ban Nha</li>
</ul>`,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    author: 'Ban Truyền Thông ARTOCA'
  },
  {
    title: 'Tuyển dụng: Nhân viên Kinh doanh Xuất khẩu',
    title_en: 'Job Opening: Export Sales Executive',
    slug: 'tuyen-dung-nhan-vien-kinh-doanh-xuat-khau',
    category: 'tuyen-dung',
    summary: 'ARTOCA đang tuyển dụng Nhân viên Kinh doanh Xuất khẩu với kinh nghiệm trong lĩnh vực nông sản, gia vị. Ứng viên thành thạo tiếng Anh và có tinh thần làm việc chuyên nghiệp.',
    summary_en: 'ARTOCA is looking for Export Sales Executive with experience in agricultural products and spices. Candidates must be fluent in English and have a professional work ethic.',
    content: `<p>Công ty TNHH XNK ARTOCA đang tuyển dụng vị trí <strong>Nhân viên Kinh doanh Xuất khẩu</strong> để đáp ứng nhu cầu mở rộng thị trường quốc tế.</p>
<h3>Mô tả công việc</h3>
<ul>
<li>Tìm kiếm và phát triển khách hàng quốc tế trong lĩnh vực gia vị, nông sản</li>
<li>Đàm phán và thực hiện hợp đồng xuất khẩu</li>
<li>Theo dõi tiến độ đơn hàng và hỗ trợ khách hàng sau bán hàng</li>
<li>Nghiên cứu thị trường và xu hướng tiêu dùng quốc tế</li>
</ul>
<h3>Yêu cầu</h3>
<ul>
<li>Tốt nghiệp Đại học ngành Kinh tế Đối ngoại, Thương mại Quốc tế hoặc tương đương</li>
<li>Tiếng Anh thành thạo (viết và nói)</li>
<li>Ưu tiên có kinh nghiệm xuất nhập khẩu nông sản</li>
<li>Kỹ năng giao tiếp tốt, năng động, chủ động trong công việc</li>
</ul>
<h3>Quyền lợi</h3>
<ul>
<li>Lương cạnh tranh + hoa hồng hấp dẫn</li>
<li>Môi trường làm việc chuyên nghiệp, được đào tạo bài bản</li>
<li>Cơ hội đi công tác nước ngoài và tham dự hội chợ quốc tế</li>
</ul>
<p>Liên hệ: <strong>Artocavn@gmail.com</strong> | WhatsApp: <strong>+84 986 768 378</strong></p>`,
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
    content: `<p>Công ty TNHH XNK ARTOCA chính thức được cấp chứng nhận <strong>ISO 22000:2018</strong> (Hệ thống quản lý an toàn thực phẩm) và <strong>HACCP</strong> (Phân tích mối nguy và kiểm soát điểm tới hạn).</p>
<p>Đây là kết quả của quá trình xây dựng và cải tiến hệ thống quản lý chất lượng liên tục trong 2 năm qua, nhằm đáp ứng các yêu cầu ngày càng khắt khe của thị trường nhập khẩu quốc tế.</p>
<h3>Ý nghĩa của chứng nhận</h3>
<ul>
<li>Mở rộng khả năng tiếp cận các thị trường khó tính như EU, Mỹ, Nhật Bản</li>
<li>Tăng cường niềm tin của đối tác và khách hàng quốc tế</li>
<li>Đảm bảo quy trình sản xuất đáp ứng tiêu chuẩn an toàn thực phẩm quốc tế</li>
<li>Nâng cao năng lực cạnh tranh trên thị trường xuất khẩu gia vị toàn cầu</li>
</ul>`,
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
  { title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80', link: '/san-pham/que', sort_order: 2 },
  { title: '', subtitle: '', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&q=80', link: '/san-pham/hoi', sort_order: 3 },
];

const insertBannersMany = db.transaction((items) => {
  for (const item of items) insertBanner.run(item);
});
insertBannersMany(banners);

console.log('✅ ARTOCA database seeded successfully!');
console.log(`   - ${products.length} products (Quế, Hồi, Gừng, Nghệ)`);
console.log(`   - ${newsItems.length} news articles`);
console.log(`   - ${banners.length} banners`);

db.close();
