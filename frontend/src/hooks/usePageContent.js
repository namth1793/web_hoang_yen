import { useState, useEffect } from 'react'
import axios from 'axios'

export function usePageContent(page) {
  const [content, setContent] = useState({})

  useEffect(() => {
    axios.get(`/api/content/${page}`).then(r => setContent(r.data)).catch(() => {})
  }, [page])

  const get = (key, fallback = '') => content[key] || fallback

  return { content, get }
}
