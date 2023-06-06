import { BrowserRouter } from 'react-router-dom'

import Table from '@/components/Table'

import Users from '@/pages/users'

import theme from '@/styles/theme'

import { AuthContext, AuthContextData } from '@/context/AuthContext'
import { UtilsContext } from '@/context/UtilsContext'
import { ThemeProvider } from '@emotion/react'
import { render, waitFor } from '@testing-library/react'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

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

const mockUtils = {
  setIsLoading: jest.fn(),
  search: 'teste',
  setSearch: jest.fn(),
  userFeatures: ['teste', 'teste2'],
  features: [
    {
      id: 1,
      name: 'teste',
    },
  ],
  handleSearch: jest.fn(),
}

jest.mock('@/services/api', () => {
  return {
    get: jest.fn(),
  }
})

describe('Cards Page', () => {
  let navigate: jest.Mock<any, any, any>

  beforeEach(() => {
    navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthContext.Provider value={mockAuth}>
            <UtilsContext.Provider value={mockUtils}>{children}</UtilsContext.Provider>
          </AuthContext.Provider>
        </ThemeProvider>
      </BrowserRouter>
    )
  }

  it('verifica se a página de cartões está sendo renderizada', async () => {
    const headers = [
      {
        id: 'name',
        label: 'Nome',
        numeric: false,
        disablePadding: false,
      },
      {
        id: 'digits',
        label: 'Últimos dígitos',
        numeric: false,
        disablePadding: false,
      },
      {
        id: 'limit',
        label: 'Limite',
        numeric: false,
        disablePadding: false,
      },
      {
        id: 'statusLabel',
        label: 'Status',
        numeric: false,
        disablePadding: false,
      },
    ]
    const data = [
      {
        updatedAt: null,
        status: 'requested',
        id: 1001,
        user_id: 1,
        metadatas: {
          name: 'Tiago Rodrigues',
          digits: 7963,
          limit: 8771,
        },
      },
      {
        createdAt: '2022-08-13T11:55:54.266Z',
        updatedAt: null,
        status: 'requested',
        id: 1002,
        user_id: 2,
        metadatas: {
          name: 'Rafael Ribeiro',
          digits: 4340,
          limit: 7474,
        },
      },
    ]
    const traitResponse = jest.fn().mockResolvedValue(data)
    const actions = jest.fn().mockReturnValue(<button>Test Button</button>)
    const isLoading = true
    const add = '/add'
    const { findAllByText } = render(
      <Wrapper>
        <Table
          actions={actions}
          headers={headers}
          data={data}
          title="Test Table"
          traitResponse={traitResponse}
          isLoading={isLoading}
          add={add}
        />
        <Users />
      </Wrapper>
    )

    const button = findAllByText('Test Button')
    expect(button).toBeTruthy()

    await waitFor(() => {
      expect(findAllByText('Cartões')).toBeTruthy()
    })
  })
})
