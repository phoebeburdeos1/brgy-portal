/**
 * Persists "last time admin opened the notification panel" so the badge only
 * counts appointments created after that moment. Uses localStorage + a cookie so
 * it survives logout/login on the same browser (cookie + localStorage both kept).
 */

const LS_KEY = 'admin_notifications_last_opened_at'
const COOKIE_NAME = 'admin_notif_last_opened_at'
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 400 // ~400 days

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${name}=`
  const hit = document.cookie.split('; ').find((row) => row.startsWith(prefix))
  if (!hit) return null
  try {
    return decodeURIComponent(hit.slice(prefix.length))
  } catch {
    return null
  }
}

/** Prefer the latest timestamp from storage or cookie so state never regresses. */
export function getNotificationLastOpenedAt(): string | null {
  if (typeof window === 'undefined') return null
  const fromLs = window.localStorage.getItem(LS_KEY)
  const fromCookie = readCookie(COOKIE_NAME)
  if (!fromLs && !fromCookie) return null
  if (!fromLs) return fromCookie
  if (!fromCookie) return fromLs
  const tLs = new Date(fromLs).getTime()
  const tCk = new Date(fromCookie).getTime()
  if (!Number.isFinite(tLs)) return fromCookie
  if (!Number.isFinite(tCk)) return fromLs
  return tLs >= tCk ? fromLs : fromCookie
}

export function setNotificationLastOpenedAt(iso: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LS_KEY, iso)
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(iso)}; path=/; max-age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`
}
