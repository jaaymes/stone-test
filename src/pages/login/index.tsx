import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { LazyLoadImage } from 'react-lazy-load-image-component'
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
        backgroundColor: (theme) => theme.palette.custom.stone,
      }}
    >
      <Box>
        <LazyLoadImage src="/logo_branca.png" alt="logo" effect="blur" height={150} />
      </Box>

      <Box
        sx={{
          borderRadius: 4,
          bgcolor: colors.grey[50],
          padding: { xs: 2, sm: 3, md: 4 },
          maxWidth: { sm: '600px' },
          width: '100%',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight={700} color={'#22B24C'}>
          Gestor de Cartões Stone
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
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: (theme) => theme.palette.custom.stone,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.custom.stone,
                  opacity: 0.8,
                },
              }}
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
