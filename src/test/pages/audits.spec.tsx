import { BrowserRouter } from 'react-router-dom'

import Table from '@/components/Table'

import Audits from '@/pages/audits'

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

describe('Audits', () => {
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

  it('verifica se a página de auditorias está sendo renderizada', async () => {
    const headers = [
      {
        id: 'id',
        label: 'ID',
        numeric: false,
        disablePadding: false,
      },
      {
        id: 'requestedBy',
        label: 'Autorizado',
        numeric: false,
        disablePadding: false,
      },
      {
        id: 'typeElement',
        label: 'Tipo',
        numeric: false,
        disablePadding: false,
      },
    ]
    const data = [
      {
        id: 0,
        createdAt: '2021-02-28T23:00:02.790Z',
        type: 'card-status-change',
        before: {
          createdAt: '2012-12-14T11:23:05.635Z',
          id: 1001,
          metadatas: {
            name: 'Tiago Rodrigues',
            digits: 4405,
          },
          digits: 4405,
          name: 'Tiago Rodrigues',
          status: 'requested',
          updatedAt: null,
          user_id: 1,
        },
        after: {
          createdAt: '2012-12-14T11:23:05.635Z',
          id: 1001,
          metadatas: {
            name: 'Tiago Rodrigues',
            digits: 4405,
          },
          digits: 4405,
          name: 'Tiago Rodrigues',
          status: 'rejected',
          updatedAt: null,
          user_id: 1,
        },
        requestedBy: 11112,
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
        <Audits />
      </Wrapper>
    )

    const button = findAllByText('Test Button')
    expect(button).toBeTruthy()

    await waitFor(() => {
      expect(findAllByText('Auditoria')).toBeTruthy()
    })
  })
})
