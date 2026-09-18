import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout'
import { Field } from '../../components/FarmerShell'
import { useApp } from '../../context/AppContext'

const centers = [
  { id: 'center-1', name: 'Central APMC Hub - North', distance: '4.2 km away', capacity: '18 slots left' },
  { id: 'center-2', name: 'District Grain Depot - East', distance: '8.6 km away', capacity: '6 slots left' },
]

const timeSlots = [
  { value: '09:00 AM - 11:00 AM', label: '09:00 AM - 11:00 AM', seats: '8 spots' },
  { value: '11:00 AM - 01:00 PM', label: '11:00 AM - 01:00 PM', seats: '3 spots' },
  { value: '02:00 PM - 04:00 PM', label: '02:00 PM - 04:00 PM', seats: '12 spots' },
]

function dateOptions() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    return { value: date.toISOString().slice(0, 10), day: date.toLocaleDateString('en-IN', { weekday: 'short' }), number: date.getDate(), month: date.toLocaleDateString('en-IN', { month: 'short' }) }
  })
}

export default function SlotBooking() {
  const navigate = useNavigate();
  const { saveProduce, saveBooking, farmer, produce } = useApp()
  const dates = dateOptions()
  const [bookingData, setBookingData] = useState({
    crop: produce?.crop || '',
    quantity: produce?.quantity || '',
    center: 'center-1',
    date: dates[0].value,
    timeSlot: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const batch = { crop: bookingData.crop, quantity: bookingData.quantity }
    const slot = { ...bookingData, tokenNumber: `AG-${Math.floor(100 + Math.random() * 899)}`, farmerName: farmer?.name || 'Farmer', createdAt: new Date().toISOString() }
    saveProduce(batch)
    saveBooking({ ...slot, batch })
    navigate('/queue');
  };

  return (
    <DashboardLayout title="Book Procurement Slot" subtitle="Choose where and when your produce will be received.">
      <div className="mx-auto max-w-4xl rounded-xl border border-[#dfe8e5] bg-white p-6 shadow-[0_5px_18px_rgba(25,55,48,0.04)] sm:p-8"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">Protected booking flow</p><h2 className="mt-2 text-2xl font-black text-[#142a24]">Book your procurement slot</h2><p className="mt-1 text-sm text-[#829490]">Add your batch details, then choose an arrival window.</p></div><form onSubmit={handleSubmit} className="grid gap-7">
        <section className="rounded-xl border border-[#dfe8e5] bg-[#fbfdfc] p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">Step 1: Batch Details</p><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field label="Crop Type"><input className="w-full rounded-lg border border-[#d6e2df] bg-white px-3.5 py-3 text-sm text-[#1c302b] outline-none transition placeholder:text-[#9badab] focus:border-[#12ae80] focus:ring-4 focus:ring-[#12ae80]/10" type="text" placeholder="e.g. Wheat, Paddy, Soybean" value={bookingData.crop} onChange={(event) => setBookingData({ ...bookingData, crop: event.target.value })} required /></Field><Field label="Estimated Quantity (in Quintals)"><input className="w-full rounded-lg border border-[#d6e2df] bg-white px-3.5 py-3 text-sm text-[#1c302b] outline-none transition placeholder:text-[#9badab] focus:border-[#12ae80] focus:ring-4 focus:ring-[#12ae80]/10" type="number" min="1" step="0.1" placeholder="e.g. 45" value={bookingData.quantity} onChange={(event) => setBookingData({ ...bookingData, quantity: event.target.value })} required /></Field></div></section>
        <section className="rounded-xl border border-[#dfe8e5] bg-[#fbfdfc] p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">Step 2: Arrival Plan</p>
        <Field label="Procurement center"><div className="grid gap-3 sm:grid-cols-2">{centers.map((center) => <button type="button" key={center.id} onClick={() => setBookingData({ ...bookingData, center: center.id })} className={`rounded-lg border p-4 text-left transition ${bookingData.center === center.id ? 'border-[#0eaa7a] bg-[#edf9f4] ring-2 ring-[#0eaa7a]/10' : 'border-[#d6e2df] hover:border-[#8ccdb8]'}`}><strong className="block text-sm text-[#234039]">{center.name}</strong><span className="mt-2 block text-xs text-[#849692]">{center.distance} · {center.capacity}</span></button>)}</div></Field>
        <Field label="Select arrival date"><div className="grid grid-cols-4 gap-2 sm:grid-cols-7">{dates.map((date) => <button type="button" key={date.value} onClick={() => setBookingData({ ...bookingData, date: date.value })} className={`rounded-lg border px-2 py-3 text-center ${bookingData.date === date.value ? 'border-[#0eaa7a] bg-[#0d3d34] text-white' : 'border-[#d6e2df] text-[#48625a] hover:border-[#8ccdb8]'}`}><span className="block text-[10px] font-bold uppercase">{date.day}</span><strong className="mt-1 block text-lg">{date.number}</strong><span className="block text-[10px]">{date.month}</span></button>)}</div></Field>
        <Field label="Available time slots"><div className="grid gap-3 sm:grid-cols-3">{timeSlots.map((slot) => <button type="button" key={slot.value} onClick={() => setBookingData({ ...bookingData, timeSlot: slot.value })} className={`rounded-lg border p-4 text-left ${bookingData.timeSlot === slot.value ? 'border-[#0eaa7a] bg-[#edf9f4]' : 'border-[#d6e2df] hover:border-[#8ccdb8]'}`}><strong className="block text-sm text-[#234039]">{slot.label}</strong><span className="mt-2 block text-xs text-[#15946e]">● {slot.seats} available</span></button>)}</div></Field>
        </section><button type="submit" disabled={!bookingData.crop.trim() || !bookingData.quantity || Number(bookingData.quantity) <= 0 || !bookingData.timeSlot} className="w-full rounded-lg bg-[#08a979] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#078e67] disabled:cursor-not-allowed disabled:bg-[#a9c9bf]">Confirm & Generate Digital Token <span className="ml-2">→</span></button>
      </form></div>
    </DashboardLayout>
  );
}