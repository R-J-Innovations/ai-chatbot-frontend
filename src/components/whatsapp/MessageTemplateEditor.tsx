interface MessageTemplateEditorProps {
  template: string
  onChange: (template: string) => void
  botName?: string
}

const SAMPLE_VALUES: Record<string, string> = {
  '{{event}}': 'New Lead',
  '{{bot_name}}': 'My Bot',
  '{{timestamp}}': '2024-01-01 12:00:00',
}

function renderPreview(template: string, botName?: string): string {
  let preview = template
  const values = { ...SAMPLE_VALUES }
  if (botName) values['{{bot_name}}'] = botName
  for (const [key, value] of Object.entries(values)) {
    preview = preview.split(key).join(value)
  }
  return preview
}

export default function MessageTemplateEditor({ template, onChange, botName }: MessageTemplateEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Message Template</label>
        <textarea
          value={template}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono"
          placeholder="New {{event}} captured by {{bot_name}} at {{timestamp}}"
        />
        <p className="text-xs text-slate-400 mt-1">
          Available placeholders:{' '}
          <span className="font-mono">{'{{event}}'}</span>,{' '}
          <span className="font-mono">{'{{bot_name}}'}</span>,{' '}
          <span className="font-mono">{'{{timestamp}}'}</span>
        </p>
      </div>

      {template && (
        <div>
          <p className="text-xs font-medium text-slate-600 mb-1">Preview:</p>
          <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
            {renderPreview(template, botName)}
          </div>
        </div>
      )}
    </div>
  )
}
