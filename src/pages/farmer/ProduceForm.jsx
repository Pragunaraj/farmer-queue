import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import { Field, inputClass } from '../../components/FarmerShell'
import { useApp } from '../../context/AppContext'

export default function ProduceForm() {
  const navigate = useNavigate()
  const { saveProduce, produce } = useApp()
  const [formData, setFormData] = useState({
    crop: produce?.crop || '',
    quantity: produce?.quantity || '',
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    saveProduce(formData)
    navigate('/book-slot')
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0da678]">New batch</p>
          <h1 className="mt-2 text-2xl font-black text-[#142a24]">Register your produce</h1>
          <p className="mt-1 text-sm text-[#829490]">Add only the batch details needed for your next slot.</p>
        </div>
        <div className="grid gap-5">
          <Field label="Crop Type"><input className={inputClass} type="text" placeholder="e.g. Wheat, Rice" value={formData.crop} onChange={(event) => setFormData({ ...formData, crop: event.target.value })} required /></Field>
          <Field label="Estimated Quantity (Quintals)"><input className={inputClass} type="number" min="1" step="0.1" placeholder="e.g. 45" value={formData.quantity} onChange={(event) => setFormData({ ...formData, quantity: event.target.value })} required /></Field>
        </div>
        <button type="submit" className="mt-7 w-full rounded-lg bg-[#08a979] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#078e67]">Continue to book slot <span className="ml-2">→</span></button>
      </form>
    </AuthLayout>
  )
}