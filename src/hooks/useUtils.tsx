import { useContext } from 'react'

import { UtilsContext, UtilsContextData } from '@/context/UtilsContext'

export const useUtils = (): UtilsContextData => {
  const context = useContext(UtilsContext)

  if (!context) {
    throw new Error('The hook useUtils must be used within an UtilsProvider')
  }

  return context
}
