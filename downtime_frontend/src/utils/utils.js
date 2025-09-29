import dayjs from 'dayjs'

// Convert minutes to "2.5h", "20m", "0m"
export function humanMinutes(m) {
  const n = Number(m)
  if (!n || n <= 0) return '0m'
  if (n >= 60) {
    const h = n / 60
    const d = Math.round(h * 10) / 10
    return `${d}h`
  }
  return `${Math.round(n)}m`
}

// dayjs → ISO string (or undefined)
export function toISO(d) {
  if (!d) return undefined
  return dayjs.isDayjs(d) ? d.toDate().toISOString() : new Date(d).toISOString()
}

// Build query string from an object, skipping empty/"All"
export function buildParams(obj = {}) {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '' || v === 'All') continue
    sp.set(k, Array.isArray(v) ? v.join(',') : String(v))
  }
  return sp.toString()
}
