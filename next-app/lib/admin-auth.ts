import { cookies } from 'next/headers'

export async function isAdmin(): Promise<boolean> {
  const c = await cookies()
  return c.get('admin_session')?.value === '1'
}
