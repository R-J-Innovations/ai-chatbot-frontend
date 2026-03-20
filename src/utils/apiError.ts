export function getApiError(err: unknown, fallback = 'An unexpected error occurred'): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const r = (err as { response?: { data?: { message?: string } } }).response
    return r?.data?.message ?? fallback
  }
  return fallback
}
