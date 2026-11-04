import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, UserRound } from 'lucide-react'

import { updateCurrentUser, useCurrentUser } from '../utils/currentUser'

const FIELD_CLASS =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/15'

function Field({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const saved = useCurrentUser()
  const [form, setForm] = useState({
    name: saved.name || '',
    email: saved.email || '',
    phone: saved.phone || '',
  })

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    updateCurrentUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    })
    navigate('/', { replace: true })
  }

  return (
    <section className="bg-offwhite py-12 sm:py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-center text-center">
            <img
              src={saved.avatar}
              alt=""
              className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-soft"
            />
            <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">My Profile</h1>
            <p className="mt-1 text-sm text-slate-500">Update your basic account details.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Full name" htmlFor="profile-name">
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                  aria-hidden="true"
                />
                <input
                  id="profile-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => set('name', event.target.value)}
                  className={`${FIELD_CLASS} pl-10`}
                  placeholder="Your full name"
                />
              </div>
            </Field>

            <Field label="Email" htmlFor="profile-email">
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                  aria-hidden="true"
                />
                <input
                  id="profile-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => set('email', event.target.value)}
                  className={`${FIELD_CLASS} pl-10`}
                  placeholder="you@example.com"
                />
              </div>
            </Field>

            <Field label="Phone number" htmlFor="profile-phone">
              <div className="relative">
                <Phone
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand"
                  aria-hidden="true"
                />
                <input
                  id="profile-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(event) => set('phone', event.target.value)}
                  className={`${FIELD_CLASS} pl-10`}
                  placeholder="+92 300 1234567"
                />
              </div>
            </Field>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
