import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useUtils } from '@/hooks/useUtils'

import Label from '@/components/Label/Label'
import Table from '@/components/Table'

import api from '@/services/api'

import { CardProps } from '@/interfaces/cards'

const headers = [
  {
    id: 'name',
    label: 'Nome',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'digits',
    label: 'Últimos dígitos',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'limit',
    label: 'Limite',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'status',
    label: 'Status',
    numeric: false,
    disablePadding: false,
  },
]

const Cards = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState<CardProps[]>([])
  const [cardsFiltered, setCardsFiltered] = useState<CardProps[]>([])
  const { search, normalizeCurrency } = useUtils()

  const handleLoadCards = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/cards')
      if (response) setCards(response.data)
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao carregar Cartões')
      setIsLoading(false)
    }
  }, [])

  const handleTraitResponse = (data: CardProps[]) => {
    return data.map((d) => ({
      ...d,
      name: d?.metadatas?.name,
      digits: d?.metadatas.digits,
      limit: normalizeCurrency(d?.metadatas.limit || 0),
      status:
        (d?.status === 'requested' && (
          <Label color="primary" variant="filled">
            Solicitado
          </Label>
        )) ||
        (d?.status === 'approved' && (
          <Label color="success" variant="filled">
            Aprovado
          </Label>
        )) ||
        (d?.status === 'rejected' && (
          <Label color="error" variant="filled">
            Rejeitado
          </Label>
        )) ||
        (d?.status === 'canceled' && (
          <Label color="info" variant="filled">
            Cancelado
          </Label>
        )) ||
        (d?.status === 'processed' && (
          <Label color="warning" variant="filled">
            Processado
          </Label>
        )),
    }))
  }

  const handleSearch = useCallback(
    (search: string) => {
      const filteredCards = cards.filter((user) => {
        if (!user?.metadatas.name) return false
        return user?.metadatas.name.toLowerCase().includes(search.toLowerCase())
      })
      setCardsFiltered(filteredCards)
    },
    [cards]
  )

  useEffect(() => {
    handleLoadCards()
  }, [handleLoadCards])

  useEffect(() => {
    if (search) handleSearch(search)
  }, [handleSearch, search])

  return (
    <div>
      <Table
        title="Cartões"
        headers={headers}
        data={search.length > 0 ? cardsFiltered : cards}
        traitResponse={handleTraitResponse}
      />
    </div>
  )
}

export default Cards
