import { useState } from 'react'

const E164_REGEX = /^\+[1-9]\d{6,14}$/

interface RecipientManagerProps {
  recipients: string[]
  onChange: (recipients: string[]) => void
}

export default function RecipientManager({ recipients, onChange }: RecipientManagerProps) {
  const [errors, setErrors] = useState<Record<number, string>>({})

  const validate = (value: string): string => {
    if (!value.trim()) return 'Phone number is required'
    if (!E164_REGEX.test(value.trim())) return 'Must be E.164 format (e.g. +27821234567)'
    return ''
  }

  const handleChange = (index: number, value: string) => {
    const updated = [...recipients]
    updated[index] = value
    onChange(updated)
  }

  const handleBlur = (index: number) => {
    const error = validate(recipients[index])
    setErrors((prev) => ({ ...prev, [index]: error }))
  }

  const handleRemove = (index: number) => {
    const updated = recipients.filter((_, i) => i !== index)
    const newErrors: Record<number, string> = {}
    Object.entries(errors).forEach(([k, v]) => {
      const ki = parseInt(k)
      if (ki < index) newErrors[ki] = v
      else if (ki > index) newErrors[ki - 1] = v
    })
    setErrors(newErrors)
    onChange(updated)
  }

  const handleAdd = () => {
    onChange([...recipients, ''])
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">Notification Recipients</label>
      <p className="text-xs text-slate-400">Phone numbers that receive WhatsApp notifications when a lead is captured.</p>

      {recipients.map((number, index) => (
        <div key={index}>
          <div className="flex items-center gap-2">
            <input
              type="tel"
              value={number}
              onChange={(e) => handleChange(index, e.target.value)}
              onBlur={() => handleBlur(index)}
              className={`flex-1 px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors[index] ? 'border-red-400' : 'border-slate-300'
              }`}
              placeholder="+27821234567"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Remove"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {errors[index] && (
            <p className="text-xs text-red-500 mt-1">{errors[index]}</p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Number
      </button>
    </div>
  )
}
