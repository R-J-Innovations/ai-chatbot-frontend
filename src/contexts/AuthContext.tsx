import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../api/client'

interface AuthState {
  token: string | null
  tenantId: string | null
  role: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, tenantName: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem('token'),
    tenantId: localStorage.getItem('tenantId'),
    role: localStorage.getItem('role'),
  })

  const saveAuth = (token: string, tenantId: string, role: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('tenantId', tenantId)
    localStorage.setItem('role', role)
    setAuth({ token, tenantId, role })
  }

  const login = async (email: string, password: string) => {
    const res = await api.post<{ data: { token: string; tenantId: string; role: string } }>(
      '/auth/login',
      { email, password }
    )
    const { token, tenantId, role } = res.data.data
    saveAuth(token, tenantId, role)
  }

  const register = async (email: string, password: string, tenantName: string) => {
    const res = await api.post<{ data: { token: string; tenantId: string; role: string } }>(
      '/auth/register',
      { email, password, tenantName }
    )
    const { token, tenantId, role } = res.data.data
    saveAuth(token, tenantId, role)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('tenantId')
    localStorage.removeItem('role')
    setAuth({ token: null, tenantId: null, role: null })
  }

  return (
    <AuthContext.Provider
      value={{ ...auth, login, register, logout, isAuthenticated: !!auth.token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
