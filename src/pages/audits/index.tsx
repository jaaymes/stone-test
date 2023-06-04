import React, { useCallback, useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { useUtils } from '@/hooks/useUtils'

import Button from '@/components/Button'
import Label from '@/components/Label/Label'
import Modal from '@/components/Modal'
import Table from '@/components/Table'

import theme from '@/styles/theme'

import api from '@/services/api'

import { AuditProps } from '@/interfaces/audit'
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'

const headers = [
  {
    id: 'id',
    label: 'ID',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'name',
    label: 'Autorizado',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'type',
    label: 'TIpo',
    numeric: false,
    disablePadding: false,
  },
]

const Audits = () => {
  const { search } = useUtils()

  const [isLoading, setIsLoading] = useState(false)
  const [audits, setAudits] = useState<AuditProps[]>([])
  const [auditsFiltered, setAuditsFiltered] = useState<AuditProps[]>([])

  const [open, setOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<AuditProps>({} as AuditProps)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleLoadAudits = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/audits')
      if (response) {
        try {
          const { data: users } = await api.get(`/analysts`)
          const _response = await Promise.all(
            response.data.map(async (audit: any) => {
              const user = users.find((user: any) => user.id === audit.requestedBy) || {}
              return { ...audit, user }
            })
          )
          console.log('🚀 ~ file: index.tsx:75 ~ handleLoadAudits ~ _response:', _response)
          setAudits(_response)
        } catch (error: any) {
          toast.error(error.response.data.message || 'Erro ao carregar usuário')
        }
      }
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao carregar usuários')
      setIsLoading(false)
    }
  }, [])

  const handleTraitResponse = (data: AuditProps[]) => {
    return data.map((d) => ({
      ...d,
      name: d.user?.email || d?.requestedBy,
      typeText: d?.type === 'card-status-change' && 'Troca de Status',
      type: d?.type === 'card-status-change' && (
        <Label color="primary" variant="filled">
          Troca de Status
        </Label>
      ),
    }))
  }

  const handleSearch = useCallback(
    (search: string) => {
      const filteredUsers = audits.filter((user) => {
        if (!user?.typeText) return false
        return user?.typeText.toLowerCase().includes(search.toLowerCase())
      })
      setAuditsFiltered(filteredUsers)
    },
    [audits]
  )

  useEffect(() => {
    handleLoadAudits()
  }, [handleLoadAudits])

  useEffect(() => {
    if (search) handleSearch(search)
  }, [handleSearch, search])

  return (
    <>
      <Modal
        title="Registro de Log"
        description={
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <React.Fragment>
                  <CardContent>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                      Antes
                    </Typography>
                    <Typography variant="body2">
                      Nome: <strong>{selectedCard?.before?.metadatas?.name}</strong>
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Digito: <strong>{selectedCard?.before?.metadatas?.digits}</strong>
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Status:{' '}
                      <strong>
                        {(selectedCard?.before?.status === 'requested' && (
                          <Label color="primary" variant="filled">
                            Solicitado
                          </Label>
                        )) ||
                          (selectedCard?.before?.status === 'approved' && (
                            <Label color="success" variant="filled">
                              Aprovado
                            </Label>
                          )) ||
                          (selectedCard?.before?.status === 'rejected' && (
                            <Label color="error" variant="filled">
                              Rejeitado
                            </Label>
                          )) ||
                          (selectedCard?.before?.status === 'canceled' && (
                            <Label color="info" variant="filled">
                              Cancelado
                            </Label>
                          )) ||
                          (selectedCard?.before?.status === 'processed' && (
                            <Label color="warning" variant="filled">
                              Processado
                            </Label>
                          ))}
                      </strong>
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Data:{' '}
                      <strong>
                        {new Date(selectedCard?.before?.createdAt as Date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </strong>
                      <br />
                    </Typography>
                  </CardContent>
                </React.Fragment>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <React.Fragment>
                  <CardContent>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                      Depois
                    </Typography>
                    <Typography variant="body2">
                      Nome: <strong>{selectedCard?.after?.metadatas?.name}</strong>
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Digito: <strong>{selectedCard?.after?.metadatas?.digits}</strong>
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Status:{' '}
                      <strong>
                        {(selectedCard?.after?.status === 'requested' && (
                          <Label color="primary" variant="filled">
                            Solicitado
                          </Label>
                        )) ||
                          (selectedCard?.after?.status === 'approved' && (
                            <Label color="success" variant="filled">
                              Aprovado
                            </Label>
                          )) ||
                          (selectedCard?.after?.status === 'rejected' && (
                            <Label color="error" variant="filled">
                              Rejeitado
                            </Label>
                          )) ||
                          (selectedCard?.after?.status === 'canceled' && (
                            <Label color="info" variant="filled">
                              Cancelado
                            </Label>
                          )) ||
                          (selectedCard?.after?.status === 'processed' && (
                            <Label color="warning" variant="filled">
                              Processado
                            </Label>
                          ))}
                      </strong>
                      <br />
                    </Typography>
                    <Typography variant="body2">
                      Data:{' '}
                      <strong>
                        {new Date(selectedCard?.before?.createdAt as Date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </strong>
                      <br />
                    </Typography>
                  </CardContent>
                </React.Fragment>
              </Card>
            </Grid>
          </Grid>
        }
        open={open}
        onClose={handleClose}
        justifyContent="flex-end"
        buttons={
          <>
            <Button onClick={handleClose} variant="contained">
              Fechar
            </Button>
          </>
        }
      />
      <Table
        isLoading={isLoading}
        traitResponse={handleTraitResponse}
        title="Auditoria"
        headers={headers}
        data={search.length > 0 ? auditsFiltered : audits}
        actions={(data: AuditProps) => {
          return (
            <>
              <Tooltip title="Visualizar" arrow placement="left">
                <IconButton
                  onClick={() => {
                    handleOpen()
                    setSelectedCard(data)
                  }}
                >
                  <FaEye color={theme.palette.custom.stone} size={25} />
                </IconButton>
              </Tooltip>
            </>
          )
        }}
      />
    </>
  )
}

export default Audits
