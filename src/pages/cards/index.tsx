import { useCallback, useEffect, useState } from 'react'
import { FaExchangeAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'
import { useUtils } from '@/hooks/useUtils'

import Button from '@/components/Button'
import Label from '@/components/Label/Label'
import Modal from '@/components/Modal'
import Table from '@/components/Table'

import api from '@/services/api'

import { CardProps } from '@/interfaces/cards'
import { IconButton, Tooltip, colors } from '@mui/material'

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
    id: 'statusLabel',
    label: 'Status',
    numeric: false,
    disablePadding: false,
  },
]

const Cards = () => {
  const { search, normalizeCurrency } = useUtils()
  const { user } = useAuth()
  console.log('🚀 ~ file: index.tsx:48 ~ Cards ~ user:', user)

  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState<CardProps[]>([])
  const [cardsFiltered, setCardsFiltered] = useState<CardProps[]>([])
  const [open, setOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardProps>({} as CardProps)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

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
      digits: d?.metadatas?.digits,
      limit: normalizeCurrency(d?.metadatas?.limit || 0),
      statusLabel:
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

  const handleChangeStatus = useCallback(
    async (id: number, status: string, statusCurrent: string) => {
      if (statusCurrent === 'approved' || statusCurrent === 'rejected') {
        toast.error('Cartão já teve seu status alterado')
        return
      }
      const before = selectedCard
      try {
        setIsLoading(true)
        const response = await api.put(`/cards/${id}`, {
          ...selectedCard,
          status: status,
          updatedAt: new Date(),
        })
        if (response) {
          try {
            const after = response.data
            const formData = {
              before: before,
              after: after,
              requestedBy: user?.id,
              type: 'card-status-change',
            }
            await api.post('/audits', formData)
          } catch (error: any) {
            toast.error(error.response.data.message || 'Erro ao registrar log')
          }
          await handleLoadCards()
        }

        handleClose()
        setIsLoading(false)
      } catch (error: any) {
        toast.error(error.response.data.message || 'Erro ao alterar status')
        setIsLoading(false)
      }
    },
    [handleClose, handleLoadCards, selectedCard, user?.id]
  )

  useEffect(() => {
    handleLoadCards()
  }, [handleLoadCards])

  useEffect(() => {
    if (search) handleSearch(search)
  }, [handleSearch, search])

  return (
    <>
      <Modal
        title="Alterar Status da Soliciação"
        description="Deseja alterar o status da solicitação?"
        alert="Depois de alterado, não será possível reverter a ação."
        open={open}
        onClose={handleClose}
        buttons={
          <>
            <Button onClick={handleClose} variant="contained" color="warning">
              Cancelar
            </Button>
            <Button
              disabled={isLoading || selectedCard.status === 'approved' || selectedCard.status === 'rejected'}
              onClick={() => handleChangeStatus(selectedCard.id, 'rejected', selectedCard.status)}
              variant="contained"
              color="error"
            >
              Reprovar
            </Button>
            <Button
              disabled={isLoading || selectedCard.status === 'approved' || selectedCard.status === 'rejected'}
              onClick={() => handleChangeStatus(selectedCard.id, 'approved', selectedCard.status)}
              variant="contained"
            >
              Aprovar
            </Button>
          </>
        }
      />
      <Table
        title="Cartões"
        headers={headers}
        data={search.length > 0 ? cardsFiltered : cards}
        traitResponse={handleTraitResponse}
        actions={(data: CardProps) => {
          return (
            <>
              <Tooltip title="Alterar Status" arrow placement="left">
                <IconButton
                  onClick={() => {
                    delete data?.statusLabel
                    handleOpen()
                    setSelectedCard(data)
                  }}
                >
                  <FaExchangeAlt color={colors.green[400]} size={25} />
                </IconButton>
              </Tooltip>
            </>
          )
        }}
      />
    </>
  )
}

export default Cards
