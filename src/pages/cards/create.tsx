import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import Input from '@/components/Input'

import api from '@/services/api'

import { UserProps } from '@/interfaces/users'
import { Box, Grid, Paper, Typography } from '@mui/material'

const CardSchema = yup
  .object()
  .shape({
    name: yup.string().required('Nome é obrigatório'),
  })
  .required()

const CreateCards = () => {
  const { id } = useParams()
  const [users, setUsers] = useState<UserProps[]>([])

  const methods = useForm({
    resolver: yupResolver(CardSchema),
  })

  const handleLoadUsers = useCallback(async () => {
    try {
      const response = await api.get('/users')
      if (response.status === 200) {
        setUsers(response.data)
      }
      console.log('🚀 ~ file: create.tsx:36 ~ handleLoadUsers ~ response.data:', response.data)
    } catch (error: any) {
      toast.error('Erro ao carregar usuários' || error.message)
    }
  }, [])

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          Adicionar cartão
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            rowGap={2}
            p={2}
            // onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Input name="name" label="Nome" fullWidth />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </Paper>
    </Box>
  )
}

export default CreateCards
