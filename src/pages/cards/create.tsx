import { FormProvider, useForm } from 'react-hook-form'

import Input from '@/components/Input'

import { Box, Grid, Paper, Typography } from '@mui/material'

const CreateCards = () => {
  const methods = useForm()
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
