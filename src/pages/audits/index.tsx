import React, { useCallback, useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'
import { useUtils } from '@/hooks/useUtils'

import Button from '@/components/Button'
import Label from '@/components/Label/Label'
import Modal from '@/components/Modal'
import Table from '@/components/Table'

import theme from '@/styles/theme'

import { normalizeCpf, normalizeCurrency } from '@/utils/normalize'

import api from '@/services/api'

import { AuditProps } from '@/interfaces/audit'
import { FeatureProps } from '@/interfaces/feature'
import { Card, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material'

const headers = [
  {
    id: 'id',
    label: 'ID',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'requestedBy',
    label: 'Autorizado',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'typeElement',
    label: 'Tipo',
    numeric: false,
    disablePadding: false,
  },
]

const Audits = () => {
  const { user, signOut } = useAuth()
  const { search } = useUtils()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [audits, setAudits] = useState<AuditProps[]>([])
  const [auditsFiltered, setAuditsFiltered] = useState<AuditProps[]>([])
  const [features, setFeatures] = useState<FeatureProps[]>([])

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

  const handleLoadFeatures = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/features')
      if (response) setFeatures(response.data.result)
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao carregar funcionalidades')
      setIsLoading(false)
    }
  }, [])

  const handleTraitResponse = (data: AuditProps[]) => {
    return data.map((d) => ({
      ...d,
      typeText: d?.type === 'card-status-change' && 'Troca de Status',
      typeElement:
        (d?.type === 'card-status-change' && (
          <Label color="primary" variant="filled">
            Troca de Status
          </Label>
        )) ||
        (d?.type === 'update-card' && (
          <Label color="primary" variant="filled">
            Atualização de Cartão
          </Label>
        )) ||
        (d?.type === 'update-user' && (
          <Label color="secondary" variant="filled">
            Atualizar Usuário
          </Label>
        )) ||
        (d?.type === 'create-user' && (
          <Label color="secondary" variant="filled">
            Criar Usuário
          </Label>
        )) ||
        (d?.type === 'create-card' && (
          <Label color="primary" variant="filled">
            Criar Cartão
          </Label>
        )),
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
    handleLoadFeatures()
  }, [handleLoadFeatures])

  useEffect(() => {
    if (search) handleSearch(search)
  }, [handleSearch, search])

  useEffect(() => {
    if (!user?.roles.includes('n2')) {
      toast.error('Você não tem permissão para acessar essa página')
      signOut()
    }
  }, [navigate, signOut, user?.roles])

  return (
    <>
      <Modal
        title="Registro de Log"
        description={
          <Grid container spacing={2}>
            {selectedCard.type === 'create-card' && (
              <Grid item xs={12} md={12}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
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
                        Solicitado:{' '}
                        <strong>
                          {new Date(selectedCard?.before?.createdAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">&nbsp;</Typography>
                    </CardContent>
                  </React.Fragment>
                </Card>
              </Grid>
            )}

            {selectedCard.type === 'create-user' && (
              <Grid item xs={12} md={12}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Typography variant="body2">
                        Nome: <strong>{selectedCard?.after?.name}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Email: <strong>{selectedCard?.after?.email}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Nascimento:{' '}
                        <strong>
                          {new Date(selectedCard?.after?.BirthDate as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>

                      <Typography variant="body2">
                        Documento: <strong>{normalizeCpf(selectedCard?.after?.document)}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Criado:{' '}
                        <strong>
                          {new Date(selectedCard?.after?.createdAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>

                      <Typography variant="body2">
                        Atualizado:{' '}
                        <strong>
                          {new Date(selectedCard?.after?.updatedAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Endereço:{' '}
                        <strong>{`${selectedCard?.after?.address?.street || 'Sem Nome'}, ${
                          selectedCard?.after?.address?.streetNumber
                        } - ${selectedCard?.after?.address?.neighborhood} - ${selectedCard?.after?.address?.city} - ${
                          selectedCard?.after?.address?.state
                        }`}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Salario Base: <strong>{normalizeCurrency(selectedCard?.after?.salaryBase)}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Documento Valido?:{' '}
                        <strong>{selectedCard?.after?.metadatas?.validDocument ? 'Sim' : 'Não'}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Usuário Verificado?: <strong>{selectedCard?.after?.metadatas?.verified ? 'Sim' : 'Não'}</strong>
                      </Typography>
                      <Typography variant="body2" color="body2" gutterBottom>
                        Funcionalidades Ativas:{' '}
                        <strong>
                          {selectedCard?.after?.enabledFeatures.map((item, index) => {
                            const feature = features.find((f) => f.id === item)
                            if (!feature) return ''
                            return `${feature.name}${
                              index === selectedCard?.after?.enabledFeatures.length - 1 ? '' : ', '
                            }`
                          })}
                        </strong>
                      </Typography>
                    </CardContent>
                  </React.Fragment>
                </Card>
              </Grid>
            )}

            {(selectedCard.type === 'card-status-change' || selectedCard.type === 'update-card') && (
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
                        Solicitado:{' '}
                        <strong>
                          {new Date(selectedCard?.before?.createdAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">&nbsp;</Typography>
                    </CardContent>
                  </React.Fragment>
                </Card>
              </Grid>
            )}

            {(selectedCard.type === 'card-status-change' || selectedCard.type === 'update-card') && (
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
                        Solicitado:{' '}
                        <strong>
                          {new Date(selectedCard?.before?.createdAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      {selectedCard?.after?.updatedAt && (
                        <Typography variant="body2">
                          Aprovado em:{' '}
                          <strong>
                            {new Date(selectedCard?.after?.updatedAt as Date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </strong>
                          <br />
                        </Typography>
                      )}
                    </CardContent>
                  </React.Fragment>
                </Card>
              </Grid>
            )}

            {selectedCard.type === 'update-user' && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                        Antes
                      </Typography>
                      <Typography variant="body2">
                        Nome: <strong>{selectedCard?.before?.name}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Email: <strong>{selectedCard?.before?.email}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Nascimento:{' '}
                        <strong>
                          {new Date(selectedCard?.before?.BirthDate as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>

                      <Typography variant="body2">
                        Documento: <strong>{normalizeCpf(selectedCard?.before?.document)}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Criado:{' '}
                        <strong>
                          {new Date(selectedCard?.before?.createdAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>

                      <Typography variant="body2">
                        Atualizado:{' '}
                        <strong>
                          {new Date(selectedCard?.before?.updatedAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Endereço:{' '}
                        <strong>{`${selectedCard?.before?.address?.street || 'Sem Nome'}, ${
                          selectedCard?.before?.address?.streetNumber
                        } - ${selectedCard?.before?.address?.neighborhood} - ${selectedCard?.before?.address?.city} - ${
                          selectedCard?.before?.address?.state
                        }`}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Salario Base: <strong>{normalizeCurrency(selectedCard?.before?.salaryBase)}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Documento Valido?:{' '}
                        <strong>{selectedCard?.before?.metadatas?.validDocument ? 'Sim' : 'Não'}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Usuário Verificado?:{' '}
                        <strong>{selectedCard?.before?.metadatas?.verified ? 'Sim' : 'Não'}</strong>
                      </Typography>
                      <Typography variant="body2" color="body2" gutterBottom>
                        Funcionalidades Ativas:{' '}
                        <strong>
                          {selectedCard?.before?.enabledFeatures.map((item, index) => {
                            const feature = features.find((f) => f.id === item)
                            if (!feature) return ''
                            return `${feature.name}${
                              index === selectedCard?.before?.enabledFeatures.length - 1 ? '' : ', '
                            }`
                          })}
                        </strong>
                      </Typography>
                    </CardContent>
                  </React.Fragment>
                </Card>
              </Grid>
            )}

            {selectedCard.type === 'update-user' && (
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Typography sx={{ fontSize: 18, fontWeight: 700 }} color="text.secondary" gutterBottom>
                        Depois
                      </Typography>
                      <Typography variant="body2">
                        Nome: <strong>{selectedCard?.after?.name}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Email: <strong>{selectedCard?.after?.email}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Nascimento:{' '}
                        <strong>
                          {new Date(selectedCard?.after?.BirthDate as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Documento: <strong>{normalizeCpf(selectedCard?.after?.document)}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Criado:{' '}
                        <strong>
                          {new Date(selectedCard?.after?.createdAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>

                      <Typography variant="body2">
                        Atualizado:{' '}
                        <strong>
                          {new Date(selectedCard?.after?.updatedAt as Date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Endereço:{' '}
                        <strong>{`${selectedCard?.after?.address?.street || 'Sem Nome'}, ${
                          selectedCard?.after?.address?.streetNumber
                        } - ${selectedCard?.after?.address?.neighborhood} - ${selectedCard?.after?.address?.city} - ${
                          selectedCard?.after?.address?.state
                        }`}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Salario Base: <strong>{normalizeCurrency(selectedCard?.after?.salaryBase)}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Documento Valido?:{' '}
                        <strong>{selectedCard?.after?.metadatas?.validDocument ? 'Sim' : 'Não'}</strong>
                        <br />
                      </Typography>
                      <Typography variant="body2">
                        Usuário Verificado?: <strong>{selectedCard?.after?.metadatas?.verified ? 'Sim' : 'Não'}</strong>
                      </Typography>
                      <Typography variant="body2" color="body2" gutterBottom>
                        Funcionalidades Ativas:{' '}
                        <strong>
                          {selectedCard?.after?.enabledFeatures.map((item, index) => {
                            const feature = features.find((f) => f.id === item)
                            if (!feature) return ''
                            return `${feature.name}${
                              index === selectedCard?.after?.enabledFeatures.length - 1 ? '' : ', '
                            }`
                          })}
                        </strong>
                      </Typography>
                    </CardContent>
                  </React.Fragment>
                </Card>
              </Grid>
            )}
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
              <Tooltip title="Visualizar" arrow placement="top">
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
