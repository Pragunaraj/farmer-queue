import Header from './Header'
import Sidebar from './Sidebar'
import { useApp } from '../context/AppContext'

export default function DashboardLayout({ children, title, subtitle }) {
	const { isOnline, retryConnection, lastSync } = useApp()

	return (
		<div className="min-h-screen bg-[#f5f8f7] text-[#14231f] lg:flex">
			<Sidebar />
			<main className="min-w-0 flex-1">
				{!isOnline && <div className="flex items-center justify-between gap-4 border-b border-[#805333] bg-[#3b2419] px-5 py-3 text-xs text-[#ffd8bb] sm:px-8 lg:px-10"><span>You're offline. Showing saved data from {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</span><button onClick={retryConnection} className="rounded-md border border-[#b8784a] px-3 py-1.5 font-bold text-[#ffd8bb] hover:bg-[#593421]">Retry connection</button></div>}
				<Header title={title} subtitle={subtitle} />
				<div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</div>
			</main>
		</div>
	)
}
