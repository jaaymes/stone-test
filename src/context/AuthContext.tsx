import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import api from '@/services/api'

import { UserProps } from '@/interfaces/users'

export interface AuthContextData {
  auth: boolean
  signIn: (email: string, password: string) => void
  signOut: () => void
  user: UserPropsData | null
}

interface UserPropsData {
  email: string
  id: number
  password: string
  roles: string[]
  user_id: number
  user: UserProps | null
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<IContextProvider> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [auth, setAuth] = useState<boolean>(false)
  const [user, setUser] = useState<UserPropsData | null>(null)

  const signIn = useCallback(
    async (email: string, password: string) => {
      api
        .get('/analysts')
        .then(async (response) => {
          const users = response.data
          const user = users.find((user: any) => user.email === email && user.password === password)
          if (user) {
            const { data: userData } = await api.get(`/users/${user.user_id}`)
            const _user = {
              ...user,
              user: userData,
            }
            if (!_user) {
              setAuth(false)
              toast.error('Usuário ou senha inválidos')
              return
            }
            setAuth(true)
            localStorage.setItem('auth', 'true')
            localStorage.setItem('user', JSON.stringify(_user))
            setUser(_user)
            navigate('/dashboard')
          }
        })
        .catch(() => {
          toast.error('Erro ao tentar fazer login')
        })
    },
    [navigate]
  )

  const signOut = useCallback(() => {
    localStorage.removeItem('auth') // nao é seguro, é apenas um exemplo
    localStorage.removeItem('user')
    setAuth(false)
    setUser(null)
    navigate('/')
  }, [navigate])

  useEffect(() => {
    const auth = localStorage.getItem('auth') // nao é seguro, é apenas um exemplo
    const user = localStorage.getItem('user')

    if (auth) {
      setAuth(true)
    }
    if (!auth) {
      setAuth(false)
    }
    if (user) {
      setUser(JSON.parse(user))
    }
  }, [location])

  useEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!auth) {
          signOut()
        }
        if (error?.response?.status === 401) {
          toast.warn('Você está deslogado, entre novamente')
          signOut()
        } else if (error?.response?.status === 403) {
          toast.error('Você não tem permissão à este recurso')
        } else if (error?.response?.status === 400) {
          toast.error(error?.response?.data?.message)
        } else if (error?.response?.status === 404) {
          toast.error(error?.response?.data?.message)
        } else if (error?.response?.status === 422) {
          error?.response.data.errors.forEach((d: any) => {
            toast.error(d.message)
          })
        } else if (error?.response?.status === 500) {
          toast.error('Ocorreu um erro inesperado em nossos sistema, contate o suporte')
        } else if (error?.response?.status === 502) {
          toast.error('Sistema fora do ar, contate o suporte')
        }

        return Promise.reject(error.response)
      }
    )
  }, [auth, signOut, navigate])

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
