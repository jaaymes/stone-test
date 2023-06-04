import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import api from '@/services/api'

export interface AuthContextData {
  auth: boolean
  signIn: (email: string, password: string) => void
  signOut: () => void
  user: UserProps | null
}

interface UserProps {
  email: string
  id: number
  password: string
  roles: string[]
  user_id: number
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<IContextProvider> = ({ children }) => {
  const navigate = useNavigate()

  const [auth, setAuth] = useState<boolean>(false)
  const [user, setUser] = useState<UserProps | null>(null)

  const signIn = useCallback(async (email: string, password: string) => {
    api
      .get('/analysts')
      .then((response) => {
        const users = response.data
        const user = users.find((user: any) => user.email === email && user.password === password)
        if (!user) {
          setAuth(false)
          toast.error('Usuário ou senha inválidos')
          return
        }
        setAuth(true)
        localStorage.setItem('auth', 'true')
        setUser(user)
      })
      .catch(() => {
        toast.error('Erro ao tentar fazer login')
      })
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('auth') // nao é seguro, é apenas um exemplo
    setAuth(false)
    setUser(null)
    navigate('/')
  }, [navigate])

  useEffect(() => {
    const auth = localStorage.getItem('auth') // nao é seguro, é apenas um exemplo
    if (auth) {
      setAuth(true)
    }
  }, [])

  const context = useMemo(() => {
    return {
      auth,
      signIn,
      signOut,
      user,
    }
  }, [auth, signIn, signOut, user])

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}
