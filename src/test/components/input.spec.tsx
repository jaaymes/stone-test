import { FormProvider, useForm } from 'react-hook-form'

import Input from '@/components/Input'

import { fireEvent, render, screen } from '@testing-library/react'

describe('Componente Input', () => {
  // O componente de entrada é um componente controlado que usa o hook useForm
  // para gerenciar seu estado e fornecer a validação.
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm()

    return <FormProvider {...methods}>{children}</FormProvider>
  }

  it('should render correctly', () => {
    render(
      <Wrapper>
        <Input name="test" label="Test Label" />
      </Wrapper>
    )
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('should update value on input change', async () => {
    render(
      <Wrapper>
        <Input name="test" label="Test Label" />
      </Wrapper>
    )
    const inputValue = 'Hello, World!'

    fireEvent.change(screen.getByLabelText('Test Label'), {
      target: { value: inputValue },
    })

    expect(screen.getByLabelText('Test Label')).toHaveValue(inputValue)
  })
})
