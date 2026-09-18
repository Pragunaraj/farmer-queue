import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Header({ title, subtitle }) {
  const { language, setLanguage, t } = useApp()

  return (
    <header className="flex flex-col gap-4 border-b border-[#dfe8e5] bg-white/75 px-5 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 lg:py-7">
      <div><h1 className="text-2xl font-black tracking-tight text-[#10221e] sm:text-[28px]">{title}</h1><p className="mt-1 text-sm text-[#7d918f]">{subtitle}</p></div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Link to="/login" aria-label="Sign in" title="Sign in" className="grid h-10 w-10 place-items-center rounded-lg border border-[#dfe8e5] bg-white text-[#31524a] transition hover:border-[#12ae80] hover:text-[#078e67]"><span aria-hidden="true" className="text-lg">♙</span></Link>
        <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="rounded-lg border border-[#dfe8e5] bg-white px-3 py-2.5 text-xs font-bold text-[#31524a] hover:border-[#12ae80]">{t('language')}</button>
      </div>
    </header>
  )
}
