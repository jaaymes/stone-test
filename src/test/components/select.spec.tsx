import { FormProvider, useForm } from 'react-hook-form'

import Select from '@/components/Select'

import theme from '@/styles/theme'

import { ThemeProvider } from '@mui/material'
import { fireEvent, render, screen } from '@testing-library/react'

describe('Select', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ]
  const Form = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm()

    return (
      <FormProvider {...methods}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </FormProvider>
    )
  }
  it('renderiza corretamente o componente', () => {
    render(
      <Form>
        <Select name="select" label="Select" options={options} />
      </Form>
    )

    expect(screen.getByLabelText('Select')).toBeInTheDocument()
  })

  it('verifica se troca o valor', async () => {
    const { getByTestId } = render(
      <Form>
        <Select
          name="select"
          label="Select"
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]}
        />
      </Form>
    )
    const select = getByTestId('select')
    fireEvent.change(select, { target: { value: '2' } })
    expect(select).toHaveValue('2')
  })
})
