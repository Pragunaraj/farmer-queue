import { NavLink, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function FarmerShell({ children, title, subtitle }) {
  const { t, language, setLanguage, isOnline, retryConnection, farmer, lastSync } = useApp()
  const { booking, paymentUnlocked, produce } = useApp()
  const navigation = [
    { to: '/register', label: t('register'), detail: 'Step 1 · Farmer profile', icon: '＋', unlocked: true },
    { to: '/book-slot', label: t('book'), detail: 'Step 2 · Choose a slot', icon: '▣', unlocked: Boolean(farmer && produce) },
    { to: '/queue', label: t('queue'), detail: 'Step 3 · Track your token', icon: '◌', unlocked: Boolean(farmer && booking) },
    { to: '/status', label: t('status'), detail: 'Step 4 · View payment', icon: '₹', unlocked: Boolean(farmer && booking && paymentUnlocked) },
  ]
  const profile = farmer || { name: 'Farmer' }
  const profileInitials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'F'

  return (
    <div className="min-h-screen bg-[#f5f8f7] text-[#14231f] lg:flex">
      <aside className="border-b border-[#20352f] bg-[#081525] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[272px] lg:shrink-0 lg:flex-col lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-7 lg:py-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#11b981] text-xl font-bold text-white shadow-[0_8px_24px_rgba(17,185,129,0.28)]">◒</span>
            <span>
              <span className="block text-lg font-black tracking-tight">AgriFlow</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#9cadb1]">Farmer Portal</span>
            </span>
          </Link>
          <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest lg:hidden ${isOnline ? 'border-[#2a403c] text-[#8ba19f]' : 'border-[#8b5c3e] text-[#f0b78f]'}`}>{isOnline ? t('online') : t('offline')}</span>
        </div>

        <div className="hidden h-px bg-[#1d3040] lg:mx-7 lg:block" />
        <div className="px-5 py-4 lg:px-5 lg:py-7">
          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#718789]">Farmer Services</p>
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {navigation.map((item) => (
              item.unlocked ? <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 transition ${isActive ? 'bg-[#0fae7c] text-white shadow-[0_10px_24px_rgba(15,174,124,0.2)]' : 'text-[#c5d0d0] hover:bg-[#102435] hover:text-white'}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-base font-bold">{item.icon}</span>
                <span className="min-w-0"><span className="block truncate text-xs font-bold lg:text-sm">{item.label}</span><span className="hidden truncate text-[10px] text-white/60 lg:block">{item.detail}</span></span>
              </NavLink> : <button
                key={item.to}
                type="button"
                disabled
                title="Complete the previous step to unlock this service"
                className="group flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-[#718789] opacity-50"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-base font-bold">{item.icon}</span>
                <span className="min-w-0"><span className="block truncate text-xs font-bold lg:text-sm">{item.label}</span><span className="hidden truncate text-[10px] text-white/60 lg:block">{item.detail}</span></span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto hidden border-t border-[#1d3040] px-7 py-6 lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d7eee7] text-sm font-black text-[#087457]">{profileInitials}</span>
            <div>
              <p className="text-xs font-bold text-white">{profile.name}</p>
              <p className="text-[10px] text-[#7f9597]">Farmer</p>
            </div>
            <span className={`ml-auto h-2 w-2 rounded-full ${isOnline ? 'bg-[#13c890]' : 'bg-[#e09b5d]'}`} />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {!isOnline && <div className="flex items-center justify-between gap-4 border-b border-[#805333] bg-[#3b2419] px-5 py-3 text-xs text-[#ffd8bb] sm:px-8 lg:px-10"><span>You're offline. Showing saved data from {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</span><button onClick={retryConnection} className="rounded-md border border-[#b8784a] px-3 py-1.5 font-bold text-[#ffd8bb] hover:bg-[#593421]">{t('retry')}</button></div>}
        <header className="flex flex-col gap-4 border-b border-[#dfe8e5] bg-white/75 px-5 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 lg:py-7">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#10221e] sm:text-[28px]">{title}</h1>
            <p className="mt-1 text-sm text-[#7d918f]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/login"
              aria-label="Sign in"
              title="Sign in"
              className="grid h-10 w-10 place-items-center rounded-lg border border-[#dfe8e5] bg-white text-[#31524a] transition hover:border-[#12ae80] hover:text-[#078e67]"
            >
              <span aria-hidden="true" className="text-lg">♙</span>
            </Link>
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="rounded-lg border border-[#dfe8e5] bg-white px-3 py-2.5 text-xs font-bold text-[#31524a] hover:border-[#12ae80]">{t('language')}</button>
            <Link to="/book-slot" className="rounded-lg bg-[#08a979] px-4 py-2.5 text-xs font-bold text-white shadow-[0_7px_18px_rgba(8,169,121,0.22)] transition hover:bg-[#078e67]">{t('issueToken')}</Link>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  )
}

export function StatCard({ label, value, note, icon, tone = 'green' }) {
  const tones = {
    green: 'bg-[#e8f8f2] text-[#0c9c73]',
    blue: 'bg-[#edf4ff] text-[#3476d5]',
    purple: 'bg-[#f3edff] text-[#8857d5]',
    amber: 'bg-[#fff7e6] text-[#cd9028]',
  }

  return (
    <article className="rounded-xl border border-[#dfe8e5] bg-white p-5 shadow-[0_5px_18px_rgba(25,55,48,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#778b89]">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-bold ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-black tracking-tight text-[#11251f]">{value}</p>
      <p className="mt-2 text-xs font-semibold text-[#39967b]">{note}</p>
    </article>
  )
}

export function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs font-bold text-[#405955]">
      {label}
      {children}
    </label>
  )
}

export const inputClass = 'w-full rounded-lg border border-[#d6e2df] bg-[#fbfdfc] px-3.5 py-3 text-sm text-[#1c302b] outline-none transition placeholder:text-[#9badab] focus:border-[#12ae80] focus:ring-4 focus:ring-[#12ae80]/10'
