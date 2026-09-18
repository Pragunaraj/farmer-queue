import { NavLink, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Sidebar() {
  const { t, user, isOnline } = useApp()
  const navigation = [
    { to: '/book-slot', label: t('book'), detail: 'Step 1 · Produce and slot', icon: '▣', unlocked: true },
    { to: '/queue', label: t('queue'), detail: 'Step 2 · Track your token', icon: '◌', unlocked: true },
    { to: '/status', label: t('status'), detail: 'Step 3 · View payment', icon: '₹', unlocked: true },
  ]
  const initials = user?.name?.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'F'

  return (
    <aside className="border-b border-[#20352f] bg-[#081525] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[272px] lg:shrink-0 lg:flex-col lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-7 lg:py-8">
        <Link to="/book-slot" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#11b981] text-xl font-bold text-white shadow-[0_8px_24px_rgba(17,185,129,0.28)]">◒</span>
          <span><span className="block text-lg font-black tracking-tight">AgriFlow</span><span className="block text-[10px] uppercase tracking-[0.18em] text-[#9cadb1]">Farmer Portal</span></span>
        </Link>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest lg:hidden ${isOnline ? 'border-[#2a403c] text-[#8ba19f]' : 'border-[#8b5c3e] text-[#f0b78f]'}`}>{isOnline ? t('online') : t('offline')}</span>
      </div>
      <div className="hidden h-px bg-[#1d3040] lg:mx-7 lg:block" />
      <div className="px-5 py-4 lg:px-5 lg:py-7">
        <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#718789]">Farmer Services</p>
        <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {navigation.map((item) => item.unlocked ? (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 transition ${isActive ? 'bg-[#0fae7c] text-white shadow-[0_10px_24px_rgba(15,174,124,0.2)]' : 'text-[#c5d0d0] hover:bg-[#102435] hover:text-white'}`}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-base font-bold">{item.icon}</span><span className="min-w-0"><span className="block truncate text-xs font-bold lg:text-sm">{item.label}</span><span className="hidden truncate text-[10px] text-white/60 lg:block">{item.detail}</span></span>
            </NavLink>
          ) : (
            <button key={item.to} type="button" disabled title="Complete the previous step to unlock this service" className="pointer-events-none flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-[#718789] opacity-50">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-base font-bold">{item.icon}</span><span className="min-w-0"><span className="block truncate text-xs font-bold lg:text-sm">{item.label}</span><span className="hidden truncate text-[10px] text-white/60 lg:block">{item.detail}</span></span>
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-auto hidden border-t border-[#1d3040] px-7 py-6 lg:block"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#d7eee7] text-sm font-black text-[#087457]">{initials}</span><div><p className="text-xs font-bold text-white">{user?.name || 'Farmer'}</p><p className="text-[10px] text-[#7f9597]">Farmer</p></div><span className={`ml-auto h-2 w-2 rounded-full ${isOnline ? 'bg-[#13c890]' : 'bg-[#e09b5d]'}`} /></div></div>
    </aside>
  )
}
