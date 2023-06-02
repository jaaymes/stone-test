import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

import Input from '@/components/Input'

import { Box, Button, Container, Typography, colors } from '@mui/material'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const { signIn, auth } = useAuth()

  const methods = useForm()

  const { handleSubmit } = methods

  const handleOnSubmit = async (data: any) => {
    console.log(data)
    signIn(data.email, data.password)
  }

  useEffect(() => {
    if (auth) {
      navigate('/dashboard')
    }
  }, [auth, navigate])

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          bgcolor: colors.grey[50],
          padding: { xs: 2, sm: 3, md: 4 },
          maxWidth: { sm: '600px' },
          width: '100%',
          margin: 'auto',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          textAlign="center"
          fontWeight={700}
        >
          Gestor Administrativo
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            rowGap={2}
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <Input name="email" label="Email" fullWidth />
            <Input name="password" label="Senha" type="password" fullWidth />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  )
}

export default Login
