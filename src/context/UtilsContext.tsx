import { createContext, useMemo, useState } from 'react'

export interface UtilsContextData {
  search: string
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  normalizeCurrency: (value: number) => string
}

export const UtilsContext = createContext<UtilsContextData>({} as UtilsContextData)

export const UtilsProvider: React.FC<IContextProvider> = ({ children }) => {
  const [search, setSearch] = useState<string>('')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  // normalize currency R$ enter value number and return R$ 0,00
  const normalizeCurrency = (value: number | undefined) => {
    if (!value) return 'R$ 0,00'
    const currency = Number(value)
      .toFixed(2)
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    return `R$ ${currency}`
  }
  const context = useMemo(() => {
    return {
      search,
      handleSearch,
      normalizeCurrency,
    }
  }, [search])

  return <UtilsContext.Provider value={context}>{children}</UtilsContext.Provider>
}
