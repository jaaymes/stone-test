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

describe('Users', () => {
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

  it('verifica se a página de usuarios está sendo renderizada', async () => {
    const headers = [
      {
        id: 'name',
        label: 'Nome',
        numeric: false,
        disablePadding: true,
      },
      {
        id: 'email',
        label: 'E-mail',
        numeric: false,
        disablePadding: true,
      },
      {
        id: 'validDocument',
        label: 'Documento',
        numeric: false,
        disablePadding: true,
      },
      {
        id: 'verified',
        label: 'Verificado',
        numeric: false,
        disablePadding: true,
      },
    ]
    const data = [
      {
        name: 'Lucas da Silva',
        email: 'lucas_da_silva@gmail.com',
        BirthDate: '2021-08-23T20:21:35.360Z',
        createdAt: '2016-06-08T06:40:25.524Z',
        updatedAt: '2018-07-01T02:34:26.157Z',
        enabledFeatures: [2, 0],
        document: 82521848671,
        metadatas: {
          validDocument: true,
          verified: false,
        },
        address: {
          streetNumber: 201,
          city: 'Uberaba',
          state: 'RJ',
          neighborhood: 'Centro',
          postalCode: '52474-486',
        },
        salaryBase: 419859,
        id: 0,
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
      expect(findAllByText('Usuários')).toBeTruthy()
    })
  })
})
