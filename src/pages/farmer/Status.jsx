import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { jsPDF } from 'jspdf'
import DashboardLayout from '../../components/DashboardLayout'
import { useApp } from '../../context/AppContext'

export default function Status() {
  const navigate = useNavigate();
  const { farmer, activeSlot } = useApp()
  const [downloaded, setDownloaded] = useState(false)

  // Mock receipt and payment details
  const receipt = {
    receiptId: "REC-88392",
    crop: farmer?.crop || "Wheat",
    quantity: `${farmer?.quantity || 45} Quintals`,
    ratePerQuintal: "₹2,275",
    grossAmount: "₹1,02,375",
    mandiFee: "- ₹1,024",
    logistics: "- ₹450",
    totalAmount: "₹1,00,901",
    paymentStatus: "Approved (Pending Payout)",
    payoutDate: "Tomorrow, 10:00 AM"
  };

  const paymentHistory = [
    { id: receipt.receiptId, date: '18 Sep 2026', amount: receipt.totalAmount, status: 'Pending payout' },
    { id: 'REC-87211', date: '02 Sep 2026', amount: '₹86,450', status: 'Paid' },
    { id: 'REC-86104', date: '16 Aug 2026', amount: '₹74,920', status: 'Paid' },
  ]

  const downloadReceipt = () => {
    const pdf = new jsPDF()
    pdf.setTextColor(13, 61, 52)
    pdf.setFontSize(22)
    pdf.text('AgriFlow Procurement Receipt', 20, 24)
    pdf.setTextColor(80, 100, 94)
    pdf.setFontSize(11)
    pdf.text(`Receipt: ${receipt.receiptId}`, 20, 36)
    pdf.text(`Farmer: ${farmer?.name || 'Farmer'}   Token: ${activeSlot?.tokenNumber || 'AG-104'}`, 20, 44)
    pdf.text(`Crop: ${receipt.crop}   Quantity: ${receipt.quantity}`, 20, 52)
    pdf.line(20, 60, 190, 60)
    pdf.text(`Gross produce value: ${receipt.grossAmount}`, 20, 72)
    pdf.text(`Mandi service fee: ${receipt.mandiFee}`, 20, 82)
    pdf.text(`Logistics adjustment: ${receipt.logistics}`, 20, 92)
    pdf.setFontSize(15)
    pdf.setTextColor(8, 145, 103)
    pdf.text(`Net payout: ${receipt.totalAmount}`, 20, 108)
    pdf.setTextColor(80, 100, 94)
    pdf.setFontSize(11)
    pdf.text(`Status: ${receipt.paymentStatus}`, 20, 122)
    pdf.text(`Estimated payout: ${receipt.payoutDate}`, 20, 130)
    pdf.save(`${receipt.receiptId}.pdf`)
    setDownloaded(true)
  }

  return (
    <DashboardLayout title="Payment Status" subtitle="Your procurement receipt, settlement status, and payout timeline.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <section className="rounded-xl border border-[#dfe8e5] bg-white p-6 shadow-[0_5px_18px_rgba(25,55,48,0.04)] sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">Procurement receipt</p><h2 className="mt-2 text-2xl font-black text-[#142a24]">{receipt.receiptId}</h2></div><span className="rounded-full bg-[#e8f8f2] px-3 py-1.5 text-[10px] font-bold text-[#138b69]">● Approved</span></div><dl className="mt-8 grid gap-5 border-t border-[#e7eeec] pt-6 sm:grid-cols-2"><div><dt className="text-xs text-[#8b9d9a]">Crop type</dt><dd className="mt-1 text-sm font-bold text-[#253a34]">{receipt.crop}</dd></div><div><dt className="text-xs text-[#8b9d9a]">Quantity received</dt><dd className="mt-1 text-sm font-bold text-[#253a34]">{receipt.quantity}</dd></div><div><dt className="text-xs text-[#8b9d9a]">Rate per quintal</dt><dd className="mt-1 text-sm font-bold text-[#253a34]">{receipt.ratePerQuintal}</dd></div><div><dt className="text-xs text-[#8b9d9a]">Estimated payout</dt><dd className="mt-1 text-sm font-bold text-[#253a34]">{receipt.payoutDate}</dd></div></dl><div className="mt-7 rounded-lg bg-[#f6faf8] p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#71847f]">Transparent price breakdown</p><div className="space-y-2 text-sm"><p className="flex justify-between"><span className="text-[#71847f]">Gross produce value</span><strong>{receipt.grossAmount}</strong></p><p className="flex justify-between"><span className="text-[#71847f]">Mandi service fee</span><strong>{receipt.mandiFee}</strong></p><p className="flex justify-between"><span className="text-[#71847f]">Logistics adjustment</span><strong>{receipt.logistics}</strong></p></div></div><div className="mt-5 flex items-end justify-between border-t border-[#e7eeec] pt-6"><span className="text-sm font-semibold text-[#71847f]">Net payout</span><strong className="text-3xl font-black tracking-tight text-[#0d6c51]">{receipt.totalAmount}</strong></div></section>
        <section className="rounded-xl bg-[#0d3d34] p-6 text-white shadow-[0_12px_30px_rgba(13,61,52,0.16)] sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9bd7c7]">Settlement timeline</p><div className="mt-8 space-y-7"><div className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#19c990] text-xs font-black text-[#0d3d34]">✓</span><div><p className="text-sm font-bold">Produce received</p><p className="mt-1 text-xs text-[#b8d5ce]">Quality grade A confirmed</p></div></div><div className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#19c990] text-xs font-black text-[#0d3d34]">✓</span><div><p className="text-sm font-bold">Payment approved</p><p className="mt-1 text-xs text-[#b8d5ce]">{receipt.paymentStatus}</p></div></div><div className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#6fc6b1] text-xs font-black text-[#9bd7c7]">3</span><div><p className="text-sm font-bold">Payout scheduled</p><p className="mt-1 text-xs text-[#b8d5ce]">{receipt.payoutDate}</p></div></div></div><div className="mt-9 flex flex-col gap-2 sm:flex-row"><button onClick={downloadReceipt} className="rounded-lg bg-white px-4 py-3 text-xs font-bold text-[#145b4b] hover:bg-[#e6f5ef]">Download receipt</button><button onClick={() => navigate('/book-slot')} className="rounded-lg border border-white/25 px-4 py-3 text-xs font-bold text-white hover:bg-white/10">Book another batch</button></div>{downloaded && <p className="mt-3 text-xs font-semibold text-[#9bd7c7]">Receipt downloaded successfully.</p>}</section>
      </div>
      <section className="mt-6 rounded-xl border border-[#dfe8e5] bg-white p-6 shadow-[0_5px_18px_rgba(25,55,48,0.04)]"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">Payment history</p><h2 className="mt-2 text-xl font-black text-[#142a24]">Previous settlements</h2></div><span className="rounded-full bg-[#f2f7f5] px-3 py-1 text-xs font-bold text-[#70837e]">{paymentHistory.length} receipts</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[500px] text-left text-sm"><thead className="text-xs text-[#91a29e]"><tr><th className="px-3 py-3">Receipt</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Status</th></tr></thead><tbody className="divide-y divide-[#edf1f0]">{paymentHistory.map((payment) => <tr key={payment.id}><td className="px-3 py-4 font-bold text-[#294039]">{payment.id}</td><td className="px-3 py-4 text-[#71847f]">{payment.date}</td><td className="px-3 py-4 font-bold text-[#294039]">{payment.amount}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${payment.status === 'Paid' ? 'bg-[#e8f8f2] text-[#138b69]' : 'bg-[#fff4d2] text-[#b68113]'}`}>{payment.status}</span></td></tr>)}</tbody></table></div></section>
    </DashboardLayout>
  );
}