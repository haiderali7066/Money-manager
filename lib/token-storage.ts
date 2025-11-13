// Client-side token management utility
export const TOKEN_KEY = "mm_auth_token"
export const USER_KEY = "mm_user"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setUser(user: any): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}

export function logout(): void {
  removeToken()
  removeUser()
}
