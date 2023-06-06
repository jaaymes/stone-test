import { FormProvider, useForm } from 'react-hook-form'

import Switch from '@/components/Switch'

import theme from '@/styles/theme'

import { ThemeProvider } from '@emotion/react'
import { fireEvent, render } from '@testing-library/react'

describe('Switch', () => {
  const Form = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm()

    return (
      <FormProvider {...methods}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </FormProvider>
    )
  }

  it('renderiza corretamente o componente', () => {
    const { getByLabelText } = render(
      <Form>
        <Switch name="switch" label="Switch" />
      </Form>
    )

    expect(getByLabelText('Switch')).toBeInTheDocument()
  })

  it('verifica se troca o valor', async () => {
    const { getByLabelText } = render(
      <Form>
        <Switch name="switch" label="Switch" />
      </Form>
    )
    const switchInput = getByLabelText('controlled')
    expect(switchInput).not.toBeChecked()

    fireEvent.click(switchInput)
    expect(switchInput).toBeChecked()
  })
})
