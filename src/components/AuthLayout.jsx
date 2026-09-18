import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#f5f8f7] px-4 py-8 text-[#14231f] sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <Link to="/login" className="mb-6 flex items-center gap-3" aria-label="AgriFlow Farmer Portal home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#11b981] text-xl font-bold text-white shadow-[0_8px_24px_rgba(17,185,129,0.28)]">◒</span>
          <span>
            <span className="block text-lg font-black tracking-tight text-[#10221e]">AgriFlow</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-[#7d918f]">Farmer Portal</span>
          </span>
        </Link>
        <section className="w-full rounded-2xl border border-[#dfe8e5] bg-white p-6 shadow-[0_14px_40px_rgba(25,55,48,0.08)] sm:p-8">
          {children}
        </section>
      </div>
    </main>
  )
}
