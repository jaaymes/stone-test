import { FormProvider, useForm } from 'react-hook-form'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import CreateCards from '@/pages/cards/create'

import theme from '@/styles/theme'

import { ThemeProvider } from '@emotion/react'
import { fireEvent, render, waitFor } from '@testing-library/react'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ id: '1' }),
}))

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({ user: { roles: ['n2'] } })),
}))

jest.mock('@/services/api', () => ({
  get: jest.fn(() => Promise.resolve({ status: 200, data: [] })),
  post: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
  put: jest.fn(() => Promise.resolve({ status: 200, data: {} })),
}))

describe('Create Cards', () => {
  let navigate: jest.Mock<any, any, any>

  beforeEach(() => {
    navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const Form = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm()
    return (
      <BrowserRouter>
        <FormProvider {...methods}>
          <ToastContainer />
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </FormProvider>
      </BrowserRouter>
    )
  }

  it('should render the form', async () => {
    const { getByLabelText, getByText } = render(
      <Form>
        <CreateCards />
      </Form>
    )

    await waitFor(() => expect(getByText('Criar cartão')).toBeInTheDocument())

    expect(getByLabelText('Nome impresso no cartão')).toBeInTheDocument()
    expect(getByLabelText('Limite')).toBeInTheDocument()
    expect(getByLabelText('Digitos')).toBeInTheDocument()
    expect(getByLabelText('Usuário')).toBeInTheDocument()
  })

  it('should submit the form', async () => {
    const { getByText, getByLabelText } = render(
      <Form>
        <CreateCards />
      </Form>
    )

    await waitFor(() => expect(getByText('Criar cartão')).toBeInTheDocument())

    const nomeCartao = getByLabelText('Nome impresso no cartão')
    const limite = getByLabelText('Limite')
    const digitos = getByLabelText('Digitos')

    // fireEvent.select(usuario, { target: { value: '1' } })

    fireEvent.change(nomeCartao, { target: { value: 'Teste' } })
    fireEvent.change(limite, { target: { value: '1000' } })
    fireEvent.change(digitos, { target: { value: '1234' } })

    fireEvent.click(getByText('Salvar'))

    await waitFor(() => expect(getByText('Cartão criado com sucesso')).toBeInTheDocument())
  })
})
