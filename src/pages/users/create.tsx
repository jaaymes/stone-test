import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import * as yup from 'yup'

import { useAuth } from '@/hooks/useAuth'

import { yupResolver } from '@hookform/resolvers/yup'

import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import Input from '@/components/Input'
import Label from '@/components/Label/Label'
import Switch from '@/components/Switch'

import { handleLoadData } from '@/utils/loadData'
import { normalizeCep, normalizeCpf, normalizeCurrency } from '@/utils/normalize'

import api from '@/services/api'
import { consultCep } from '@/services/consultCep'

import { FeatureProps } from '@/interfaces/feature'
import { UserProps } from '@/interfaces/users'
import { Box, FormHelperText, Grid, Paper, Typography } from '@mui/material'

const CardSchema = yup
  .object()
  .shape({
    name: yup.string().required('Nome é obrigatório'),
    document: yup.string().required('CPF é obrigatório'),
    email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    BirthDate: yup.string().required('Data de nascimento é obrigatório'),
    address: yup.object().shape({
      street: yup.string().required('Rua é obrigatório'),
      streetNumber: yup.string().required('Número é obrigatório'),
      neighborhood: yup.string().required('Bairro é obrigatório'),
      city: yup.string().required('Cidade é obrigatório'),
      state: yup.string().required('Estado é obrigatório'),
      postalCode: yup.string().required('CEP é obrigatório'),
    }),
    enabledFeatures: yup.array().min(1, 'Selecione pelo menos uma funcionalidade'),
  })
  .required()

const CreateUser = () => {
  const { user: userContext } = useAuth()
  const [features, setFeatures] = useState<{ label: string; value: string | number }[]>([])
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const navigate = useNavigate()

  const { id } = useParams()

  const methods = useForm<UserProps>({
    resolver: yupResolver(CardSchema),
  })

  const {
    handleSubmit,
    setFocus,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = methods

  const watchFields = watch()

  const handleLoadUser = useCallback(async () => {
    try {
      const response = await api.get(`/users/${id}`)
      if (response.status === 200) {
        const _data = {
          ...response.data,
          BirthDate: new Date(response.data.BirthDate).toISOString().split('T')[0],
        }
        setUser(_data)
        handleLoadData(_data, methods.setValue)
      }
    } catch (error: any) {
      toast.error('Erro ao carregar usuários' || error.message)
    }
  }, [id, methods.setValue])

  const handleLoadCEP = useCallback(
    async (cep: string) => {
      const data = await consultCep(cep.replace(/\D/g, ''))
      if (typeof data !== 'boolean') {
        const address = {
          city: data.localidade,
          neighborhood: data.bairro,
          postalCode: data.cep,
          state: data.uf,
          street: data.logradouro,
        }
        setValue('address.city', address.city)
        setValue('address.neighborhood', address.neighborhood)
        setValue('address.postalCode', address.postalCode)
        setValue('address.state', address.state)
        setValue('address.street', address.street)
        setFocus('address.streetNumber')
        clearErrors('address.postalCode')
        clearErrors('address.street')
        clearErrors('address.neighborhood')
        clearErrors('address.city')
        clearErrors('address.state')
      } else {
        toast.error('CEP não encontrado')
      }
    },
    [clearErrors, setFocus, setValue]
  )

  const handleLoadFeatures = useCallback(async () => {
    try {
      const response = await api.get('/features')
      if (response) {
        const _results = response.data.result.map((item: FeatureProps) => {
          return {
            label: item.name,
            value: item.id,
          }
        })
        setFeatures(_results)
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao carregar funcionalidades')
    }
  }, [])

  const handleOnSubmit = useCallback(
    async (data: UserProps) => {
      try {
        if (id) {
          const _data = {
            ...data,
            BirthDate: new Date(data.BirthDate).toISOString(),
            updatedAt: new Date().toISOString(),
          }
          await api.put(`/users/${id}`, _data)
          toast.success('Usuário atualizado com sucesso')

          const before = user
          const after = _data
          try {
            const formData = {
              before: before,
              after: after,
              requestedBy: userContext?.id,
              type: 'update-user',
            }
            await api.post('/audits', formData)

            navigate('/users')
          } catch (error) {
            toast.error('Erro ao salvar log')
          }
        } else {
          const _data = {
            ...data,
            BirthDate: new Date(data.BirthDate).toISOString(),
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString(),
          }

          const response = await api.post('/users', _data)

          if (response.status === 201) {
            const formData = {
              before: null,
              after: response.data,
              requestedBy: userContext?.id,
              type: 'create-user',
            }
            await api.post('/audits', formData)
          }

          toast.success('Usuário salvo com sucesso')
          navigate('/users')
        }
      } catch (error: any) {
        toast.error(error.response.data.message || 'Erro ao salvar usuário')
      }
    },
    [id, navigate, user, userContext?.id]
  )

  useEffect(() => {
    if (id) {
      handleLoadUser()
    }
  }, [handleLoadUser, id])

  useEffect(() => {
    handleLoadFeatures()
  }, [handleLoadFeatures])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          {id ? 'Editar usuário' : 'Novo usuário'}
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(handleOnSubmit)}
            display="flex"
            flexDirection="column"
            rowGap={2}
            p={2}
          >
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
              Dados
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Input name="name" label="Nome" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Input
                  inputProps={{ maxLength: 14 }}
                  normalize={normalizeCpf}
                  name="document"
                  label="Documento"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Input
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="date"
                  name="BirthDate"
                  label="Nascimento"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
              Endereço
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Input
                  inputProps={{ maxLength: 9 }}
                  onBlur={(e) => handleLoadCEP(e.target.value)}
                  normalize={normalizeCep}
                  name="address.postalCode"
                  label="CEP"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Input disabled name="address.street" label="Rua" fullWidth />
              </Grid>
              <Grid item xs={12} md={3}>
                <Input disabled name="address.neighborhood" label="Bairro" fullWidth />
              </Grid>
              <Grid item xs={12} md={3}>
                <Input normalize={normalizeCpf} name="address.streetNumber" label="Número" fullWidth />
              </Grid>
              <Grid item xs={12} md={4}>
                <Input disabled name="address.city" label="Cidade" fullWidth />
              </Grid>
              <Grid item xs={12} md={2}>
                <Input disabled name="address.state" label="UF" fullWidth />
              </Grid>
            </Grid>
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
              Informações
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Input name="email" label="E-mail" fullWidth />
              </Grid>
              {userContext?.roles.includes('n2') && (
                <Grid item xs={12} md={4}>
                  <Input normalize={normalizeCurrency} name="salaryBase" label="Salário Base" fullWidth />
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} gap={1} display="flex">
                {watchFields?.createdAt && (
                  <Label color="info">
                    <Typography variant="body2" component="div" textTransform="none">
                      Data de Criação:&nbsp;
                    </Typography>
                    {new Date(watchFields?.createdAt).toLocaleDateString()}
                  </Label>
                )}
                {watchFields?.updatedAt && (
                  <Label color="info">
                    <Typography variant="body2" component="div" textTransform="none">
                      Ultima atualiação:&nbsp;
                    </Typography>
                    {new Date(watchFields?.updatedAt).toLocaleDateString()}
                  </Label>
                )}
              </Grid>
            </Grid>
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
              Funcionalidades
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Checkbox name="enabledFeatures" options={features} />
                <FormHelperText error={!!errors.enabledFeatures}>{errors.enabledFeatures?.message}</FormHelperText>
              </Grid>
            </Grid>
            <Typography variant="h6" component="div" sx={{ p: 2 }}>
              Validações
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Switch name="metadatas.validDocument" label="Validar Documento" />
              </Grid>
              <Grid item md={12}>
                <Switch name="metadatas.verified" label="Verificar Usuário" />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button type="button" onClick={() => navigate('/users')} variant="contained" color="error">
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

export default CreateUser
