import { useCallback, useEffect, useState } from 'react'
import { FaEdit, FaExchangeAlt, FaEye, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'
import { useUtils } from '@/hooks/useUtils'

import Button from '@/components/Button'
import Label from '@/components/Label/Label'
import Modal from '@/components/Modal'
import Table from '@/components/Table'

import theme from '@/styles/theme'

import { normalizeCurrency } from '@/utils/normalize'

import api from '@/services/api'

import { CardProps } from '@/interfaces/cards'
import {
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  Table as TableMui,
  TableRow,
  Tooltip,
  Typography,
  colors,
} from '@mui/material'

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
  const { search, userFeatures } = useUtils()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState<CardProps[]>([])
  const [cardsFiltered, setCardsFiltered] = useState<CardProps[]>([])
  const [open, setOpen] = useState(false)
  const [openCard, setOpenCard] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardProps>({} as CardProps)
  const [openRemove, setOpenRemove] = useState(false)

  const handleOpenRemove = useCallback(() => {
    setOpenRemove(true)
  }, [])

  const handleCloseRemove = useCallback(() => {
    setOpenRemove(false)
  }, [])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleOpenCard = useCallback(() => {
    setOpenCard(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleCloseCard = useCallback(() => {
    setOpenCard(false)
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
      limit: user?.roles.includes('n2') ? normalizeCurrency((d?.metadatas?.limit as number) || 0) : 'R$ ****',
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
        const formData = {
          ...selectedCard,
          status: status,
          updatedAt: new Date().toDateString(),
        }
        setIsLoading(true)
        const response = await api.put(`/cards/${id}`, formData)
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
          const filteredCards = cards.map((card) => {
            if (card.id === id) {
              return formData
            }
            return card
          })
          setCards(filteredCards)
          toast.success('Status alterado com sucesso')
        }

        handleClose()
        setIsLoading(false)
      } catch (error: any) {
        toast.error(error.response.data.message || 'Erro ao alterar status')
        setIsLoading(false)
      }
    },
    [cards, handleClose, selectedCard, user?.id]
  )

  const handleRemoveCard = useCallback(async () => {
    try {
      api.delete(`/cards/${selectedCard.id}`)
      const filteredCards = cards.filter((card) => card.id !== selectedCard.id)
      setCards(filteredCards)
      toast.success('Cartão removido com sucesso')

      handleCloseRemove()
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao remover cartão')
    }
  }, [cards, handleCloseRemove, selectedCard.id])

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

      <Modal
        title="Visualizar Cartão"
        description={
          <TableContainer>
            <TableMui sx={{ minWidth: 650 }}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Nome: <strong>{selectedCard?.metadatas?.name}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Digito: <strong>{selectedCard?.metadatas?.digits}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Status:{' '}
                      <strong>
                        {(selectedCard?.status === 'requested' && (
                          <Label color="primary" variant="filled">
                            Solicitado
                          </Label>
                        )) ||
                          (selectedCard?.status === 'approved' && (
                            <Label color="success" variant="filled">
                              Aprovado
                            </Label>
                          )) ||
                          (selectedCard?.status === 'rejected' && (
                            <Label color="error" variant="filled">
                              Rejeitado
                            </Label>
                          )) ||
                          (selectedCard?.status === 'canceled' && (
                            <Label color="info" variant="filled">
                              Cancelado
                            </Label>
                          )) ||
                          (selectedCard?.status === 'processed' && (
                            <Label color="warning" variant="filled">
                              Processado
                            </Label>
                          ))}
                      </strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Solicitado:{' '}
                      <strong>{new Date(selectedCard?.createdAt as Date).toLocaleDateString('pt-BR')}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {user?.roles.includes('n2') && (
                    <TableCell>
                      <Typography color="text.secondary" gutterBottom>
                        Limite: <strong>{normalizeCurrency(selectedCard?.metadatas?.limit as number)}</strong>
                      </Typography>
                    </TableCell>
                  )}
                  {selectedCard?.updatedAt && (
                    <TableCell>
                      <Typography color="text.secondary" gutterBottom>
                        Atualizado em:{' '}
                        <strong>{new Date(selectedCard?.updatedAt as Date).toLocaleDateString('pt-BR')}</strong>
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </TableMui>
          </TableContainer>
        }
        open={openCard}
        onClose={handleCloseCard}
        buttons={
          <>
            <Button onClick={handleCloseCard} variant="contained" color="warning">
              Cancelar
            </Button>
          </>
        }
      />

      <Modal
        maxWidth="xs"
        title="Remover Cartão"
        description="Deseja realmente remover esse Cartão?"
        open={openRemove}
        onClose={handleCloseRemove}
        justifyContent="flex-end"
        buttons={
          <>
            <Button onClick={handleCloseRemove} variant="contained" color="warning">
              Cancelar
            </Button>
            <Button onClick={handleRemoveCard} variant="contained" color="error">
              Confirmar
            </Button>
          </>
        }
      />
      <Table
        add={userFeatures.includes('card') ? '/cards/create' : undefined}
        isLoading={isLoading}
        title="Cartões"
        headers={headers}
        data={search.length > 0 ? cardsFiltered : cards}
        traitResponse={handleTraitResponse}
        actions={(data: CardProps) => {
          return (
            <>
              <Tooltip title="Visualizar" arrow placement="top">
                <IconButton
                  onClick={() => {
                    handleOpenCard()
                    setSelectedCard(data)
                  }}
                >
                  <FaEye color={theme.palette.custom.stone} size={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar" arrow placement="top">
                <IconButton onClick={() => navigate(`/cards/edit/${data.id}`)}>
                  <FaEdit color={theme.palette.custom.stone} size={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Alterar Status" arrow placement="top">
                <IconButton
                  onClick={() => {
                    delete data?.statusLabel
                    delete data?.name
                    delete data?.digits
                    delete data?.limit
                    handleOpen()
                    setSelectedCard(data)
                  }}
                >
                  <FaExchangeAlt color={theme.palette.custom.stone} size={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remover" arrow placement="top">
                <IconButton
                  onClick={() => {
                    handleOpenRemove()
                    setSelectedCard(data)
                  }}
                >
                  <FaTrash color={colors.red[600]} size={25} />
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
