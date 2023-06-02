import { BrowserRouter } from 'react-router-dom'

import Login from '@/pages/login'

import { AuthContext, AuthContextData } from '@/context/AuthContext'
import { fireEvent, render, waitFor } from '@testing-library/react'

const mockAuth: AuthContextData = {
  auth: false,
  signIn: jest.fn(() => {
    mockAuth.auth = true // mock de signIn altera auth para verdadeiro
    return Promise.resolve() // retorna uma Promise resolvida para simular o comportamento assíncrono
  }),
  signOut: jest.fn(() => {
    mockAuth.auth = false // mock de signIn altera auth para falso
    return Promise.resolve() // retorna uma Promise resolvida para simular o comportamento assíncrono
  }),
  user: null,
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

describe('Login Page', () => {
  it('deve navegar para a página inicial após se o auth for true', async () => {
    const { getByLabelText, getByRole, rerender } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    )

    const emailInput = getByLabelText('Email')
    const passwordInput = getByLabelText('Senha')
    const submitButton = getByRole('button', { name: /Entrar/i })

    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin0' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAuth.signIn).toHaveBeenCalledWith('admin@gmail.com', 'admin0')
    })

    rerender(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(mockAuth.auth).toBe(true)
    })
  })

  it('deve chamar a função signIn com os valores de entrada corretos', async () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    )

    const emailInput = getByLabelText('Email')
    const passwordInput = getByLabelText('Senha')
    const submitButton = getByRole('button', { name: /Entrar/i })

    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin0' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAuth.signIn).toHaveBeenCalledWith('admin@gmail.com', 'admin0')
    })
  })

  it('renderiza corretamente', () => {
    const { getByText } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    )

    expect(getByText('Gestor Administrativo')).toBeInTheDocument()
  })

  it('deve chamar a função signIn com valores de entrada incorretos', async () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    )

    const emailInput = getByLabelText('Email')
    const passwordInput = getByLabelText('Senha')
    const submitButton = getByRole('button', { name: /Entrar/i })

    fireEvent.change(emailInput, { target: { value: 'teste@teste.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAuth.signIn).toHaveBeenCalledWith('teste@teste.com', '123456')
    })
  })
})
