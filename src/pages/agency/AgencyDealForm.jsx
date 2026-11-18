import { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

import { createAgencyDeal } from '../../utils/agencyDealsStore'

const FIELD =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function Field({ label, children, hint, required }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
      {hint ? <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p> : null}
    </label>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="space-y-4 border-t border-slate-100 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

const EMPTY = {
  dealType: 'buy',
  dealDate: new Date().toISOString().slice(0, 10),
  client1Name: '',
  client2Name: '',
  dealOn: '',
  brokerageAmount: '',
  dealAmount: '',
  brokers: [{ name: '', commission: '' }],
  expenses: [{ key: '', value: '' }],
}

export default function AgencyDealForm() {
  const navigate = useNavigate()
  const { agencyId } = useOutletContext()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  function setBroker(index, key, value) {
    setForm((prev) => ({
      ...prev,
      brokers: prev.brokers.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }))
    setError('')
  }

  function setExpense(index, key, value) {
    setForm((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }))
    setError('')
  }

  function addBroker() {
    setForm((prev) => ({ ...prev, brokers: [...prev.brokers, { name: '', commission: '' }] }))
  }

  function removeBroker(index) {
    setForm((prev) => {
      const next = prev.brokers.filter((_, i) => i !== index)
      return { ...prev, brokers: next.length ? next : [{ name: '', commission: '' }] }
    })
  }

  function addExpense() {
    setForm((prev) => ({ ...prev, expenses: [...prev.expenses, { key: '', value: '' }] }))
  }

  function removeExpense(index) {
    setForm((prev) => {
      const next = prev.expenses.filter((_, i) => i !== index)
      return { ...prev, expenses: next.length ? next : [{ key: '', value: '' }] }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.client1Name.trim()) {
      setError('Client 1 name is required.')
      return
    }
    if (!form.dealOn.trim()) {
      setError('Deal on (project detail) is required.')
      return
    }
    if (!form.dealDate) {
      setError('Deal date is required.')
      return
    }
    if (form.dealAmount === '' || Number(form.dealAmount) < 0) {
      setError('Enter a valid deal amount.')
      return
    }
    if (form.brokerageAmount === '' || Number(form.brokerageAmount) < 0) {
      setError('Enter a valid brokerage amount.')
      return
    }
    if (form.brokers.some((item) => item.name.trim() && item.commission === '')) {
      setError('Each broker needs a commission amount.')
      return
    }
    if (form.expenses.some((item) => item.key.trim() && item.value === '')) {
      setError('Each expense needs an amount.')
      return
    }

    createAgencyDeal(agencyId, {
      dealType: form.dealType,
      dealDate: form.dealDate,
      client1Name: form.client1Name,
      client2Name: form.client2Name,
      dealOn: form.dealOn,
      brokerageAmount: Number(form.brokerageAmount) || 0,
      dealAmount: Number(form.dealAmount) || 0,
      brokers: form.brokers
        .map((item) => ({
          name: item.name.trim(),
          commission: Number(item.commission) || 0,
        }))
        .filter((item) => item.name),
      expenses: form.expenses
        .map((item) => ({
          key: item.key.trim(),
          value: Number(item.value) || 0,
        }))
        .filter((item) => item.key),
    })
    navigate('/agency/deals', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.16em] text-brand uppercase">Revenue</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">Add deal</h1>
          <p className="mt-2 text-sm text-slate-500">Fill deal details — each field is independent.</p>
        </div>
        <Link
          to="/agency/deals"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to deals
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Deal type" required>
            <select
              className={FIELD}
              value={form.dealType}
              onChange={(e) => set('dealType', e.target.value)}
            >
              <option value="buy">Buy</option>
              <option value="rental">Rental</option>
            </select>
          </Field>

          <Field label="Deal date" required>
            <input
              type="date"
              className={FIELD}
              value={form.dealDate}
              onChange={(e) => set('dealDate', e.target.value)}
              required
            />
          </Field>

          <Field label="Client 1 name" required>
            <input
              className={FIELD}
              value={form.client1Name}
              onChange={(e) => set('client1Name', e.target.value)}
              placeholder="Client 1 name"
              required
            />
          </Field>

          <Field label="Client 2 name">
            <input
              className={FIELD}
              value={form.client2Name}
              onChange={(e) => set('client2Name', e.target.value)}
              placeholder="Client 2 name"
            />
          </Field>

          <Field
            label="Deal on"
            required
            hint='Project detail — e.g. "Plot no 3 Street 2" or "COM-3 Building"'
          >
            <input
              className={FIELD}
              value={form.dealOn}
              onChange={(e) => set('dealOn', e.target.value)}
              placeholder="Plot no 3, Street 2"
              required
            />
          </Field>

          <Field label="Brokerage amount on deal" required>
            <input
              type="number"
              min="0"
              className={FIELD}
              value={form.brokerageAmount}
              onChange={(e) => set('brokerageAmount', e.target.value)}
              placeholder="e.g. 450000"
              required
            />
          </Field>

          <Field label="Deal amount" required>
            <input
              type="number"
              min="0"
              className={FIELD}
              value={form.dealAmount}
              onChange={(e) => set('dealAmount', e.target.value)}
              placeholder="e.g. 85000000"
              required
            />
          </Field>
        </div>

        <Section
          title="Brokers"
          action={
            <button
              type="button"
              onClick={addBroker}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-bold text-brand hover:bg-brand hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Add broker
            </button>
          }
        >
          <div className="space-y-3">
            {form.brokers.map((broker, index) => (
              <div
                key={`broker-${index}`}
                className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:grid-cols-[1fr_160px_auto]"
              >
                <Field label={`Broker ${index + 1} name`}>
                  <input
                    className={FIELD}
                    value={broker.name}
                    onChange={(e) => setBroker(index, 'name', e.target.value)}
                    placeholder="Broker name"
                  />
                </Field>
                <Field label="Commission">
                  <input
                    type="number"
                    min="0"
                    className={FIELD}
                    value={broker.commission}
                    onChange={(e) => setBroker(index, 'commission', e.target.value)}
                    placeholder="0"
                  />
                </Field>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeBroker(index)}
                    className="inline-flex h-[46px] items-center gap-1 rounded-xl border border-rose-200 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Extra expenses"
          action={
            <button
              type="button"
              onClick={addExpense}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2 text-xs font-bold text-brand hover:bg-brand hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Add expense
            </button>
          }
        >
          <div className="space-y-3">
            {form.expenses.map((expense, index) => (
              <div
                key={`expense-${index}`}
                className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:grid-cols-[1fr_160px_auto]"
              >
                <Field label={`Expense ${index + 1}`}>
                  <input
                    className={FIELD}
                    value={expense.key}
                    onChange={(e) => setExpense(index, 'key', e.target.value)}
                    placeholder="e.g. Transfer fee"
                  />
                </Field>
                <Field label="Amount">
                  <input
                    type="number"
                    min="0"
                    className={FIELD}
                    value={expense.value}
                    onChange={(e) => setExpense(index, 'value', e.target.value)}
                    placeholder="0"
                  />
                </Field>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeExpense(index)}
                    className="inline-flex h-[46px] items-center gap-1 rounded-xl border border-rose-200 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}

        <div className="flex flex-wrap justify-end gap-3 pt-1">
          <Link
            to="/agency/deals"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
          >
            Save deal
          </button>
        </div>
      </form>
    </div>
  )
}
