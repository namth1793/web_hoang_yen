const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'artoca_admin_secret_2025'

module.exports = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa đăng nhập' })
  }
  try {
    req.admin = jwt.verify(auth.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' })
  }
}
