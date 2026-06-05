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

// Detect schema version – if name_en column is missing, rebuild
let needsReseed = false
if (fs.existsSync(dbPath)) {
  try {
    const _check = new Database(dbPath)
    const cols = _check.prepare("PRAGMA table_info(products)").all()
    if (!cols.find(c => c.name === 'name_en')) needsReseed = true
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
  `)
  const adminExists = _db.prepare('SELECT id FROM admins WHERE username = ?').get('admin')
  if (!adminExists) {
    const bcrypt = require('bcryptjs')
    _db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', bcrypt.hashSync('admin123', 10))
  }
  _db.close()
}

const db = new Database(dbPath)

// ─── PUBLIC ROUTES ────────────────────────────────────────

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
  query += ' ORDER BY created_at DESC'
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

app.post('/api/contacts', (req, res) => {
  const { name, email, phone, company, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin bắt buộc' })
  }
  const result = db.prepare(
    'INSERT INTO contacts (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, email, phone || '', company || '', subject || '', message)
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
