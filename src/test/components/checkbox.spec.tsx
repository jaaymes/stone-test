import { FormProvider, useForm } from 'react-hook-form'

import Checkbox from '@/components/Checkbox'

import { fireEvent, render, screen } from '@testing-library/react'

describe('Checkbox', () => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm()

    return <FormProvider {...methods}>{children}</FormProvider>
  }

  it('deve verificar a caixa de seleção quando clicado', async () => {
    const options = [
      { label: 'Opção 1', value: '1' },
      { label: 'Opção 2', value: '2' },
    ]

    render(
      <TestWrapper>
        <Checkbox name="test-checkbox" options={options} />
      </TestWrapper>
    )

    const checkbox = screen.getByLabelText('Opção 1')
    fireEvent.click(checkbox)

    expect(checkbox).toBeChecked()
  })

  it('deve renderizar todas as opções', () => {
    const options = [
      { label: 'Opção 1', value: '1' },
      { label: 'Opção 2', value: '2' },
      { label: 'Opção 3', value: '3' },
    ]

    render(
      <TestWrapper>
        <Checkbox name="test-checkbox" options={options} />
      </TestWrapper>
    )

    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument()
    })
  })

  it('deve desmarcar a caixa de seleção quando clicada duas vezes', () => {
    const options = [{ label: 'Opção 1', value: '1' }]

    render(
      <TestWrapper>
        <Checkbox name="test-checkbox" options={options} />
      </TestWrapper>
    )

    const checkbox = screen.getByLabelText('Opção 1')
    fireEvent.click(checkbox)
    fireEvent.click(checkbox)

    expect(checkbox).not.toBeChecked()
  })
})
