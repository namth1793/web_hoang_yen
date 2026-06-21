require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const Database = require('better-sqlite3')

const app = express()
const PORT = process.env.PORT || 5031

app.use(cors())
app.use(express.json())

const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const dbPath = path.join(dataDir, 'xnk.db')

// Detect schema version – if moisture column is missing, rebuild
let needsReseed = false
if (fs.existsSync(dbPath)) {
  try {
    const _check = new Database(dbPath)
    const cols = _check.prepare("PRAGMA table_info(products)").all()
    if (!cols.find(c => c.name === 'moisture')) needsReseed = true
    _check.close()
    if (needsReseed) fs.unlinkSync(dbPath)
  } catch (e) {
    needsReseed = true
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath)
  }
}

if (!fs.existsSync(dbPath)) {
  require('./db/seed.js')
} else {
  const _db = new Database(dbPath)
  _db.exec(`
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
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      name_en TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
  // Seed default categories if table is empty
  const catCount = _db.prepare('SELECT COUNT(*) as c FROM categories').get().c
  if (catCount === 0) {
    const insertCat = _db.prepare('INSERT OR IGNORE INTO categories (slug, name, name_en, sort_order) VALUES (?,?,?,?)')
    insertCat.run('que', 'Quế', 'Cinnamon', 1)
    insertCat.run('hoi', 'Hồi', 'Star Anise', 2)
    insertCat.run('gung', 'Gừng', 'Ginger', 3)
    insertCat.run('nghe', 'Nghệ', 'Turmeric', 4)
  }
  // Migrate: add _en columns to news if missing
  const newsCols = _db.prepare('PRAGMA table_info(news)').all().map(c => c.name)
  if (newsCols.length && !newsCols.includes('title_en')) {
    _db.exec("ALTER TABLE news ADD COLUMN title_en TEXT DEFAULT ''")
  }
  if (newsCols.length && !newsCols.includes('summary_en')) {
    _db.exec("ALTER TABLE news ADD COLUMN summary_en TEXT DEFAULT ''")
  }
  if (newsCols.length && !newsCols.includes('content_en')) {
    _db.exec("ALTER TABLE news ADD COLUMN content_en TEXT DEFAULT ''")
  }
  const adminExists = _db.prepare('SELECT id FROM admins WHERE username = ?').get('admin')
  if (!adminExists) {
    const bcrypt = require('bcryptjs')
    _db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', bcrypt.hashSync('admin123', 10))
  }
  _db.close()
}

const db = new Database(dbPath)

// Resend setup
let resendClient = null
if (process.env.RESEND_API_KEY) {
  try {
    const { Resend } = require('resend')
    resendClient = new Resend(process.env.RESEND_API_KEY)
  } catch (e) {
    console.warn('Resend not available:', e.message)
  }
}

// ─── PUBLIC ROUTES ────────────────────────────────────────

app.get('/api/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC').all())
})

app.get('/api/content/:page', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM page_content WHERE page = ?').all(req.params.page)
  const obj = {}
  rows.forEach(r => { obj[r.key] = r.value })
  res.json(obj)
})

app.get('/api/products', (req, res) => {
  const { category, limit } = req.query
  let query = 'SELECT * FROM products'
  const params = []
  if (category) {
    query += ' WHERE category = ?'
    params.push(category)
  }
  query += ' ORDER BY created_at ASC'
  if (limit) {
    query += ' LIMIT ?'
    params.push(parseInt(limit))
  }
  res.json(db.prepare(query).all(...params))
})

app.get('/api/products/:slug', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug)
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(product)
})

app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category, COUNT(*) as count FROM products GROUP BY category').all()
  res.json(categories)
})

app.get('/api/news', (req, res) => {
  const { category, limit } = req.query
  let query = 'SELECT id, title, title_en, slug, category, summary, summary_en, image, author, created_at FROM news'
  const params = []
  if (category) {
    query += ' WHERE category = ?'
    params.push(category)
  }
  query += ' ORDER BY created_at DESC'
  if (limit) {
    query += ' LIMIT ?'
    params.push(parseInt(limit))
  }
  res.json(db.prepare(query).all(...params))
})

app.get('/api/news/:slug', (req, res) => {
  const article = db.prepare('SELECT * FROM news WHERE slug = ?').get(req.params.slug)
  if (!article) return res.status(404).json({ error: 'Not found' })
  res.json(article)
})

app.get('/api/banners', (req, res) => {
  res.json(db.prepare('SELECT * FROM banners ORDER BY sort_order').all())
})

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone, company, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc' })
  }
  const result = db.prepare(
    'INSERT INTO contacts (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, email, phone || '', company || '', subject || '', message)

  // Send email notification via Resend
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: 'ARTOCA Website <onboarding@resend.dev>',
        to: ['artocavn@gmail.com'],
        subject: `[ARTOCA] Liên hệ mới từ ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#4A2C17;padding:20px;text-align:center;">
              <h2 style="color:#fff;margin:0;">ARTOCA Import Export</h2>
              <p style="color:#E07820;margin:5px 0 0;">Liên hệ mới từ website</p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Họ tên:</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Email:</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Điện thoại:</td><td style="padding:8px 0;">${phone || 'N/A'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Công ty:</td><td style="padding:8px 0;">${company || 'N/A'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Chủ đề:</td><td style="padding:8px 0;">${subject || 'N/A'}</td></tr>
              </table>
              <div style="margin-top:16px;padding:16px;background:#FBF5EF;border-left:4px solid #E07820;border-radius:4px;">
                <p style="color:#6b7280;margin:0 0 8px;font-size:13px;">Nội dung:</p>
                <p style="margin:0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div style="padding:12px;text-align:center;background:#f9fafb;color:#9ca3af;font-size:12px;">
              ARTOCA Import Export Co., Ltd | artocavn@gmail.com
            </div>
          </div>
        `
      })
    } catch (e) {
      console.error('Resend error:', e.message)
    }
  }

  res.json({ success: true, id: result.lastInsertRowid })
})

app.get('/api/contacts', (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all())
})

// ─── ADMIN ROUTES ─────────────────────────────────────────
const adminRoutes = require('./routes/adminRoutes')(db)
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`✅ ARTOCA Backend running on http://localhost:${PORT}`)
})
