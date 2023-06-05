import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'

import api from '@/services/api'

import { FeatureProps } from '@/interfaces/feature'

export interface UtilsContextData {
  search: string
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  userFeatures: string[]
  features: FeatureProps[]
}

export const UtilsContext = createContext<UtilsContextData>({} as UtilsContextData)

export const UtilsProvider: React.FC<IContextProvider> = ({ children }) => {
  const [search, setSearch] = useState<string>('')
  const [features, setFeatures] = useState<FeatureProps[]>([])
  const [userFeatures, setUserFeatures] = useState<string[]>([])
  const { user } = useAuth()

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleLoadFeatures = useCallback(async () => {
    try {
      const response = await api.get('/features')
      if (response) {
        const features = response.data.result
        setFeatures(features)
        const userFeatures = features
          .filter((feature: FeatureProps) => {
            return user?.user?.enabledFeatures.includes(feature.id)
          })
          .map((feature: FeatureProps) => feature.name)
        setUserFeatures(userFeatures)
      }
    } catch (error: any) {
      toast.error('Erro ao carregar as funcionalidades' || error.message)
    }
  }, [user])

  useEffect(() => {
    handleLoadFeatures()
  }, [handleLoadFeatures])

  const context = useMemo(() => {
    return {
      search,
      handleSearch,
      userFeatures,
      features,
    }
  }, [search, userFeatures, features])

  return <UtilsContext.Provider value={context}>{children}</UtilsContext.Provider>
}
