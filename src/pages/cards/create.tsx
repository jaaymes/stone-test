import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import * as yup from 'yup'

import { useAuth } from '@/hooks/useAuth'

import { yupResolver } from '@hookform/resolvers/yup'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'

import { handleLoadData } from '@/utils/loadData'
import { normalizeCurrency } from '@/utils/normalize'

import api from '@/services/api'

import { CardProps } from '@/interfaces/cards'
import { Box, Grid, Paper, Typography } from '@mui/material'

const CardSchema = yup
  .object()
  .shape({
    metadatas: yup.object().shape({
      name: yup.string().required('Nome impresso é obrigatório'),
    }),
  })
  .required()

const CreateCards = () => {
  const navigate = useNavigate()
  const { user: userAuth } = useAuth()
  const { id } = useParams()
  const [users, setUsers] = useState<{ label: string; value: number | string }[]>([])
  const [card, setCard] = useState<CardProps | null>(null)

  const methods = useForm<CardProps>({
    resolver: yupResolver(CardSchema),
  })

  const { handleSubmit } = methods

  const handleLoadCard = useCallback(async () => {
    try {
      const response = await api.get(`/cards/${id}`)
      if (response.status === 200) {
        setCard(response.data)
        handleLoadData(response.data, methods.setValue)
      }
    } catch (error: any) {
      toast.error('Erro ao carregar cartão' || error.message)
    }
  }, [id, methods.setValue])

  const handleLoadUsers = useCallback(async () => {
    try {
      const response = await api.get('/users')
      if (response.status === 200) {
        const _data = response.data.map((user: any) => ({
          label: user.name,
          value: user.id,
        }))
        setUsers(_data)
      }
    } catch (error: any) {
      toast.error('Erro ao carregar usuários' || error.message)
    }
  }, [])

  const handleOnSubmit = useCallback(
    async (data: CardProps) => {
      try {
        let _formData = {
          ...data,
          metadatas: {
            ...data.metadatas,
            limit: Number(data.metadatas?.limit?.toString().replace(/\D/g, '')) || 0,
          },
        }
        if (id) {
          const response = await api.put(`/cards/${id}`, _formData)
          toast.success('Cartão atualizado com sucesso')
          const before = card
          if (response.data) {
            const after = response.data
            await api.post('/audits', {
              before,
              after,
              type: 'update-card',
              requestedBy: userAuth?.id,
            })
          }
        } else {
          _formData = {
            ..._formData,
            status: 'requested',
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toISOString(),
          }
          const response = await api.post('/cards', _formData)
          if (response.data) {
            await api.post('/audits', {
              before: null,
              after: response.data,
              type: 'create-card',
              requestedBy: userAuth?.id,
            })
          }
          toast.success('Cartão criado com sucesso')
        }
        navigate('/cards')
      } catch (error: any) {
        toast.error('Erro ao salvar cartão' || error.message)
      }
    },
    [card, id, navigate, userAuth?.id]
  )

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers])

  useEffect(() => {
    if (id) handleLoadCard()
  }, [handleLoadCard, id])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          {id ? 'Editar cartão' : 'Criar cartão'}
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            rowGap={2}
            p={2}
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Input name="metadatas.name" label="Nome impresso no cartão" fullWidth />
              </Grid>
              {userAuth?.roles.includes('n2') && (
                <Grid item xs={12} md={3}>
                  <Input normalize={normalizeCurrency} name="metadatas.limit" label="Limite" fullWidth />
                </Grid>
              )}

              <Grid item xs={12} md={3}>
                <Input name="metadatas.digits" label="Digitos" disabled={id ? true : false} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Select options={users} name="user_id" label="Usuário" fullWidth data-testid="select-user" />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button type="button" onClick={() => navigate('/cards')} variant="contained" color="error">
                Voltar
              </Button>
              <Button type="submit" variant="contained">
                <Typography>Salvar</Typography>
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Paper>
    </Box>
  )
}

export default CreateCards
