interface MetaCloudAPIFieldsProps {
  phoneNumberId: string
  accessToken: string
  wabaId: string
  onPhoneNumberIdChange: (value: string) => void
  onAccessTokenChange: (value: string) => void
  onWabaIdChange: (value: string) => void
}

export default function MetaCloudAPIFields({
  phoneNumberId,
  accessToken,
  wabaId,
  onPhoneNumberIdChange,
  onAccessTokenChange,
  onWabaIdChange,
}: MetaCloudAPIFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number ID</label>
        <input
          type="text"
          value={phoneNumberId}
          onChange={(e) => onPhoneNumberIdChange(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g. 123456789012345"
        />
        <p className="text-xs text-slate-400 mt-1">Found in Meta Business Suite under WhatsApp &gt; API Setup</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Access Token</label>
        <input
          type="password"
          value={accessToken}
          onChange={(e) => onAccessTokenChange(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={accessToken ? '••••••••••••••••' : 'Paste your permanent access token'}
        />
        <p className="text-xs text-slate-400 mt-1">Permanent token from Meta System User or temporary token from API Setup</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp Business Account ID (WABA ID)</label>
        <input
          type="text"
          value={wabaId}
          onChange={(e) => onWabaIdChange(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="e.g. 987654321098765"
        />
        <p className="text-xs text-slate-400 mt-1">Found in Meta Business Suite under WhatsApp Accounts</p>
      </div>
    </div>
  )
}
