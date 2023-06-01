import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  const signIn = async (email: string, password: string) => {
    api.get('/analysts').then((response) => {
      const users = response.data
      console.log('🚀 ~ file: AuthContext.tsx:31 ~ api.get ~ users:', users)
      const user = users.find(
        (user: any) => user.email === email && user.password === password
      )
      if (!user) {
        setAuth(false)
        alert('Usuário ou senha inválidos')
        return
      }
      setAuth(true)
      setUser(user)
      navigate('/dashboard')
    })
    setAuth(true)
    localStorage.setItem('email', email)
    localStorage.setItem('password', password) // nao é seguro, é apenas um exemplo
  }

  const signOut = () => {
    setAuth(false)
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password') // nao é seguro, é apenas um exemplo
    if (email && password) {
      signIn(email, password)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
