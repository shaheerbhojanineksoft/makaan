import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

const STYLES = {
  error: {
    wrap: 'border-rose-200 bg-white text-rose-800 shadow-rose-200/40',
    iconWrap: 'bg-rose-100 text-rose-600',
    bar: 'bg-rose-500',
    Icon: AlertCircle,
  },
  success: {
    wrap: 'border-emerald-200 bg-white text-emerald-800 shadow-emerald-200/40',
    iconWrap: 'bg-emerald-100 text-emerald-600',
    bar: 'bg-emerald-500',
    Icon: CheckCircle2,
  },
}

export default function Toast({
  open,
  message,
  variant = 'error',
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!open || !message) return undefined
    const timer = window.setTimeout(() => onClose?.(), duration)
    return () => window.clearTimeout(timer)
  }, [open, message, duration, onClose])

  if (!open || !message) return null

  const style = STYLES[variant] || STYLES.error
  const Icon = style.Icon

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4">
      <div
        role="alert"
        className={`pointer-events-auto animate-fade-up relative w-full max-w-md overflow-hidden rounded-2xl border shadow-xl ${style.wrap}`}
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${style.iconWrap}`}>
            <Icon className="h-5 w-5" />
          </span>
          <p className="min-w-0 flex-1 pt-1.5 text-sm font-bold leading-snug">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-1 w-full bg-slate-100">
          <div
            className={`h-full ${style.bar}`}
            style={{ animation: `toast-shrink ${duration}ms linear forwards` }}
          />
        </div>
      </div>
    </div>
  )
}
