import Login from '@/pages/login'

import { AuthContext, AuthContextData } from '@/context/AuthContext'
import { fireEvent, render, waitFor } from '@testing-library/react'

const mockAuth: AuthContextData = {
  auth: false,
  signIn: jest.fn(),
  signOut: jest.fn(),
  user: null,
}

describe('Login Page', () => {
  it('should call the signIn function with correct input values', async () => {
    const { getByLabelText, getByRole } = render(
      <AuthContext.Provider value={mockAuth}>
        <Login />
      </AuthContext.Provider>
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

  it('renders correctly', () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockAuth}>
        <Login />
      </AuthContext.Provider>
    )

    expect(getByText('Gestor Administrativo')).toBeInTheDocument()
  })

  it('should call the signIn function with incorrect input values', async () => {
    const { getByLabelText, getByRole } = render(
      <AuthContext.Provider value={mockAuth}>
        <Login />
      </AuthContext.Provider>
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
