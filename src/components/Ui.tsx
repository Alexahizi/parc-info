import type React from 'react'
import type { PropsWithChildren } from 'react'

export function PageTitle({ children }: PropsWithChildren) {
  return <h1 className="text-xl font-semibold text-slate-900">{children}</h1>
}

export function Card({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <section className="border border-slate-200 bg-white">
      {title ? (
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  )
}

export function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'default' | 'danger'
  },
) {
  const { variant = 'default', className, ...rest } = props
  const base =
    'inline-flex items-center justify-center border px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
  const v =
    variant === 'primary'
      ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
      : variant === 'danger'
        ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
        : 'border-slate-300 bg-white text-slate-900'
  return <button className={[base, v, className].filter(Boolean).join(' ')} {...rest} />
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string },
) {
  const { label, className, ...rest } = props
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-xs font-medium text-slate-700">{label}</div>
      ) : null}
      <input
        className={[
          'w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    </label>
  )
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string },
) {
  const { label, className, ...rest } = props
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-xs font-medium text-slate-700">{label}</div>
      ) : null}
      <textarea
        className={[
          'w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
    </label>
  )
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string },
) {
  const { label, className, children, ...rest } = props
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-xs font-medium text-slate-700">{label}</div>
      ) : null}
      <select
        className={[
          'w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </select>
    </label>
  )
}

export function Table({
  columns,
  children,
}: PropsWithChildren<{ columns: string[] }>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((c) => (
              <th
                key={c}
                className="border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-900"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

