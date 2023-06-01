import { FormProvider, useForm } from 'react-hook-form'

import Input from '@/components/Input'

import { fireEvent, render, screen } from '@testing-library/react'

describe('Componente Input', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm()

    return <FormProvider {...methods}>{children}</FormProvider>
  }

  it('deve renderizar corretamente', () => {
    render(
      <Wrapper>
        <Input name="test" label="Test Label" />
      </Wrapper>
    )
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('deve atualizar o valor na mudança de entrada', async () => {
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
