const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const auth = require('../middleware/adminAuth')

const JWT_SECRET = process.env.JWT_SECRET || 'artoca_admin_secret_2025'
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = (db) => {
  // ─── AUTH ─────────────────────────────────────────────
  router.post('/login', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' })
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username)
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' })
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: admin.username })
  })

  // ─── STATS ────────────────────────────────────────────
  router.get('/stats', auth, (req, res) => {
    const newsCount = db.prepare('SELECT COUNT(*) as c FROM news').get().c
    const contactCount = db.prepare('SELECT COUNT(*) as c FROM contacts').get().c
    const newContacts = db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status = 'new'").get().c
    const bannerCount = db.prepare('SELECT COUNT(*) as c FROM banners').get().c
    const productCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c
    res.json({ newsCount, contactCount, newContacts, bannerCount, productCount })
  })

  // ─── UPLOAD ───────────────────────────────────────────
  router.post('/upload', auth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có file' })
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ error: 'Chưa cấu hình Cloudinary trong file .env' })
    }
    try {
      const b64 = req.file.buffer.toString('base64')
      const dataUri = `data:${req.file.mimetype};base64,${b64}`
      const result = await cloudinary.uploader.upload(dataUri, { folder: 'artoca_xnk' })
      res.json({ url: result.secure_url, public_id: result.public_id })
    } catch (err) {
      res.status(500).json({ error: 'Upload thất bại: ' + err.message })
    }
  })

  // ─── PRODUCTS ─────────────────────────────────────────
  router.get('/products', auth, (req, res) => {
    res.json(db.prepare('SELECT * FROM products ORDER BY created_at DESC').all())
  })

  router.get('/products/:id', auth, (req, res) => {
    const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!p) return res.status(404).json({ error: 'Không tìm thấy' })
    res.json(p)
  })

  router.post('/products', auth, (req, res) => {
    const { name, name_en, slug, category, description, description_en, detail, detail_en, image, images, moisture, admixture, oil, unit, origin } = req.body
    if (!name || !slug) return res.status(400).json({ error: 'Thiếu tên hoặc slug' })
    try {
      const r = db.prepare(
        `INSERT INTO products (name, name_en, slug, category, description, description_en, detail, detail_en, image, images, moisture, admixture, oil, unit, origin)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).run(name, name_en || '', slug, category || 'que', description || '', description_en || '', detail || '', detail_en || '', image || '', images || '[]', moisture || '', admixture || '', oil || '', unit || 'Tấn', origin || '')
      res.json({ success: true, id: r.lastInsertRowid })
    } catch {
      res.status(400).json({ error: 'Slug đã tồn tại' })
    }
  })

  router.put('/products/:id', auth, (req, res) => {
    const { name, name_en, slug, category, description, description_en, detail, detail_en, image, images, moisture, admixture, oil, unit, origin } = req.body
    if (!name || !slug) return res.status(400).json({ error: 'Thiếu tên hoặc slug' })
    try {
      db.prepare(
        `UPDATE products SET name=?, name_en=?, slug=?, category=?, description=?, description_en=?,
         detail=?, detail_en=?, image=?, images=?, moisture=?, admixture=?, oil=?, unit=?, origin=? WHERE id=?`
      ).run(name, name_en || '', slug, category || 'que', description || '', description_en || '', detail || '', detail_en || '', image || '', images || '[]', moisture || '', admixture || '', oil || '', unit || 'Tấn', origin || '', req.params.id)
      res.json({ success: true })
    } catch {
      res.status(400).json({ error: 'Slug đã tồn tại' })
    }
  })

  router.delete('/products/:id', auth, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  })

  // ─── NEWS ─────────────────────────────────────────────
  router.get('/news', auth, (req, res) => {
    res.json(db.prepare('SELECT * FROM news ORDER BY created_at DESC').all())
  })

  router.post('/news', auth, (req, res) => {
    const { title, title_en, slug, category, summary, summary_en, content, content_en, image, author } = req.body
    if (!title || !slug) return res.status(400).json({ error: 'Thiếu tiêu đề hoặc slug' })
    try {
      const r = db.prepare(
        `INSERT INTO news (title, title_en, slug, category, summary, summary_en, content, content_en, image, author)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      ).run(title, title_en || '', slug, category || 'tin-cong-ty', summary || '', summary_en || '', content || '', content_en || '', image || '', author || 'ARTOCA')
      res.json({ success: true, id: r.lastInsertRowid })
    } catch {
      res.status(400).json({ error: 'Slug đã tồn tại' })
    }
  })

  router.put('/news/:id', auth, (req, res) => {
    const { title, title_en, slug, category, summary, summary_en, content, content_en, image, author } = req.body
    try {
      db.prepare(
        `UPDATE news SET title=?, title_en=?, slug=?, category=?, summary=?, summary_en=?, content=?, content_en=?, image=?, author=? WHERE id=?`
      ).run(title, title_en || '', slug, category, summary || '', summary_en || '', content || '', content_en || '', image || '', author || 'ARTOCA', req.params.id)
      res.json({ success: true })
    } catch {
      res.status(400).json({ error: 'Slug đã tồn tại' })
    }
  })

  router.delete('/news/:id', auth, (req, res) => {
    db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  })

  // ─── BANNERS ──────────────────────────────────────────
  router.get('/banners', auth, (req, res) => {
    res.json(db.prepare('SELECT * FROM banners ORDER BY sort_order').all())
  })

  router.post('/banners', auth, (req, res) => {
    const { title, subtitle, image, link, sort_order } = req.body
    const r = db.prepare(
      'INSERT INTO banners (title, subtitle, image, link, sort_order) VALUES (?,?,?,?,?)'
    ).run(title || '', subtitle || '', image || '', link || '/', sort_order || 0)
    res.json({ success: true, id: r.lastInsertRowid })
  })

  router.put('/banners/:id', auth, (req, res) => {
    const { title, subtitle, image, link, sort_order } = req.body
    db.prepare(
      'UPDATE banners SET title=?, subtitle=?, image=?, link=?, sort_order=? WHERE id=?'
    ).run(title || '', subtitle || '', image || '', link || '/', sort_order || 0, req.params.id)
    res.json({ success: true })
  })

  router.delete('/banners/:id', auth, (req, res) => {
    db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  })

  // ─── CONTACTS ─────────────────────────────────────────
  router.get('/contacts', auth, (req, res) => {
    res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all())
  })

  router.put('/contacts/:id', auth, (req, res) => {
    const { status } = req.body
    db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, req.params.id)
    res.json({ success: true })
  })

  router.delete('/contacts/:id', auth, (req, res) => {
    db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id)
    res.json({ success: true })
  })

  // ─── PAGE CONTENT ──────────────────────────────────────
  router.get('/content/:page', auth, (req, res) => {
    const rows = db.prepare('SELECT key, value FROM page_content WHERE page = ?').all(req.params.page)
    const obj = {}
    rows.forEach(r => { obj[r.key] = r.value })
    res.json(obj)
  })

  router.put('/content/:page', auth, (req, res) => {
    const upsert = db.prepare(
      'INSERT INTO page_content (page, key, value, updated_at) VALUES (?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(page,key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP'
    )
    const run = db.transaction(() => {
      for (const [key, value] of Object.entries(req.body)) {
        upsert.run(req.params.page, key, value)
      }
    })
    run()
    res.json({ success: true })
  })

  // ─── CHANGE PASSWORD ──────────────────────────────────
  router.put('/change-password', auth, (req, res) => {
    const { old_password, new_password } = req.body
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id)
    if (!bcrypt.compareSync(old_password, admin.password)) {
      return res.status(400).json({ error: 'Mật khẩu cũ không đúng' })
    }
    const hash = bcrypt.hashSync(new_password, 10)
    db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hash, req.admin.id)
    res.json({ success: true })
  })

  return router
}
