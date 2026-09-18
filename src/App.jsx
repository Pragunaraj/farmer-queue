import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useApp } from './context/AppContext'
import AuthLayout from './components/AuthLayout'

// Page Component Imports
import Register from "./pages/farmer/Register";
import SlotBooking from "./pages/farmer/SlotBooking";
import Queue from "./pages/farmer/Queue";
import Status from "./pages/farmer/Status";
import Login from './pages/farmer/Login'

// Landing & Home Component
function Home() {
  return (
    <AuthLayout>
      <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">Farmer procurement</p><h1 className="mt-2 text-2xl font-black text-[#142a24]">Welcome to AgriFlow</h1><p className="mt-2 text-sm text-[#829490]">Sign in or register to manage your produce journey.</p><div className="mt-6 grid gap-3"><a href="/login" className="rounded-lg bg-[#08a979] px-4 py-3 text-sm font-bold text-white">Sign in</a><a href="/register" className="rounded-lg border border-[#d6e2df] px-4 py-3 text-sm font-bold text-[#31524a]">Register</a></div></div>
      {/* Dashboard metrics are intentionally available only inside protected workflow routes. */}
      <section className="hidden">
        <div className="rounded-xl border border-[#dfe8e5] bg-white p-5 shadow-[0_5px_18px_rgba(25,55,48,0.04)] sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-black text-[#142a24]">Hourly procurement throughput</h2><p className="mt-1 text-xs text-[#8b9d9a]">Quintals processed per hour</p></div><span className="rounded-full bg-[#e8f8f2] px-3 py-1.5 text-[11px] font-bold text-[#139973]">● Quintals</span></div><div className="mt-8 flex h-52 items-end gap-2 border-b border-dashed border-[#dce8e4] px-1 sm:gap-3">{[42, 80, 136, 174, 100, 68, 200, 152, 92].map((height, index) => <div key={index} className={`flex-1 rounded-t-md ${index === 6 ? 'bg-[#145b4b]' : 'bg-[#13b985]'}`} style={{ height: `${height / 2}px` }} />)}</div><div className="mt-2 flex justify-between text-[10px] font-semibold text-[#9aaba8]"><span>9 AM</span><span>11 AM</span><span>1 PM</span><span>3 PM</span><span>5 PM</span></div><div className="mt-7 flex items-center justify-between border-t border-[#e7eeec] pt-4 text-xs"><span className="text-[#8b9d9a]">Peak hour throughput</span><strong className="text-[#243b34]">3:00 PM · 186 Quintals</strong></div></div>
        <div className="rounded-xl border border-[#dfe8e5] bg-white p-5 shadow-[0_5px_18px_rgba(25,55,48,0.04)] sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-black text-[#142a24]">Live operations queue</h2><p className="mt-1 text-xs text-[#8b9d9a]">10 tokens · Updated 3s ago</p></div><input className="w-full rounded-lg border border-[#e0e9e6] bg-[#fbfdfc] px-3 py-2 text-xs outline-none focus:border-[#12ae80] sm:w-56" placeholder="⌕  Search token, farmer or crop" /></div><div className="mt-6 flex gap-2 overflow-x-auto pb-2 text-xs font-bold"><span className="shrink-0 rounded-full bg-[#155b4b] px-4 py-2 text-white">All Tokens <small className="ml-1 opacity-70">10</small></span><span className="shrink-0 rounded-full border border-[#e1e9e7] px-4 py-2 text-[#687d79]">Waiting <small>3</small></span><span className="shrink-0 rounded-full border border-[#e1e9e7] px-4 py-2 text-[#687d79]">Gate Verified <small>2</small></span><span className="shrink-0 rounded-full border border-[#e1e9e7] px-4 py-2 text-[#687d79]">In Inspection <small>3</small></span></div><div className="mt-2 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="bg-[#f7faf9] text-[#93a3a1]"><tr><th className="px-3 py-3 font-semibold">Token #</th><th className="px-3 py-3 font-semibold">Farmer</th><th className="px-3 py-3 font-semibold">Crop</th><th className="px-3 py-3 font-semibold">Slot</th><th className="px-3 py-3 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-[#edf1f0]">{[['#AGRI-8411', 'Harish', 'Soybean (JS-335)', '11:45 AM', 'In Inspection', 'bg-[#f0e8ff] text-[#8454c3]'], ['#AGRI-8402', 'Rameshwar Lal', 'Wheat (HD-2967)', '09:00 AM', 'Waiting', 'bg-[#fff4d2] text-[#b68113]'], ['#AGRI-8403', 'Sunita Devi', 'Paddy (PR-114)', '09:15 AM', 'Gate Verified', 'bg-[#e1f4fc] text-[#2580aa]']].map(([token, farmer, crop, slot, status, tone]) => <tr key={token}><td className="px-3 py-4 font-bold text-[#20332e]">{token}</td><td className="px-3 py-4"><strong className="block text-[#273934]">{farmer}</strong><span className="text-[10px] text-[#9aa9a7]">Jaipur, Rajasthan</span></td><td className="px-3 py-4 text-[#687b77]">{crop}<span className="block text-[10px] text-[#a3b0ae]">45 Qtl</span></td><td className="px-3 py-4 font-bold text-[#354a45]">{slot}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${tone}`}>● {status}</span></td></tr>)}</tbody></table></div></div>
      </section>
    </AuthLayout>
  )
}

function StepRoute({ step, children }) {
  const { farmer, booking, paymentUnlocked } = useApp()
  const unlocked = step === 'register' || (step === 'book' && farmer) || (step === 'queue' && farmer && booking) || (step === 'status' && farmer && booking && paymentUnlocked)
  if (!unlocked) {
    return <Navigate to={step === 'book' ? '/login' : step === 'queue' ? '/book-slot' : '/queue'} replace />
  }
  return children
}

// Main App Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-slot" element={<StepRoute step="book"><SlotBooking /></StepRoute>} />
        <Route path="/queue" element={<StepRoute step="queue"><Queue /></StepRoute>} />
        <Route path="/status" element={<StepRoute step="status"><Status /></StepRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;