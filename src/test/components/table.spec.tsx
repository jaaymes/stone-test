import { BrowserRouter } from 'react-router-dom'

import Table from '@/components/Table'

import { ThemeProvider, createTheme } from '@mui/material'
import { render, screen } from '@testing-library/react'

// Criar um mock do hook 'useNavigate'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

const theme = createTheme({
  palette: {
    custom: {
      stone: '#000',
    },
  },
})

describe('Table', () => {
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
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    )
  }

  it('renderizar corretamente', () => {
    const headers = [
      { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
      { id: 'age', numeric: true, disablePadding: false, label: 'Age' },
    ]
    const data = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]
    const { container } = render(
      <Wrapper>
        <Table headers={headers} data={data} title="Test Table" />
      </Wrapper>
    )
    expect(container.firstChild).toBeInTheDocument()
    data.map((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
      expect(screen.getByText(item.age)).toBeInTheDocument()
    })
  })

  it('renderizar corretamente com traitResponse', async () => {
    const headers = [
      { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
      { id: 'age', numeric: true, disablePadding: false, label: 'Age' },
    ]
    const data = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' },
    ]
    const traitResponse = jest.fn().mockResolvedValue(data)
    const actions = jest.fn().mockReturnValue(<button>Test Button</button>)
    const isLoading = true
    const add = '/add'
    render(
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
      </Wrapper>
    )
    const button = screen.findAllByText('Test Button')
    expect(button).toBeTruthy()
    expect(traitResponse).toHaveBeenCalled()
  })
})
