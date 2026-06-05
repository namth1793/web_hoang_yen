import { createContext, useContext, useState } from 'react'

const LangCtx = createContext()
export const useLanguage = () => useContext(LangCtx)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('vi')
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}
