import { BrowserRouter } from 'react-router-dom'

import SideNavbar from '@/components/Sidebar'
import navbarList from '@/components/Sidebar/navlist'

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

describe('SideNavbar', () => {
  let navigate: jest.Mock<any, any, any>
  const user = {
    roles: ['n1'],
  }

  const filteredRoutes = navbarList.filter((route) => {
    if (route.permission) {
      return user?.roles.includes(route.permission)
    }
    return true
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('render SideNavbar', () => {
    render(
      <Wrapper>
        <SideNavbar isOpen={true} />
      </Wrapper>
    )

    filteredRoutes.forEach((item) => {
      const itemDesc = screen.getByText(item.desc)
      expect(itemDesc).toBeInTheDocument()
    })
  })

  filteredRoutes.forEach((item) => {
    it(`render SideNavbar item ${item.desc}`, () => {
      render(
        <Wrapper>
          <SideNavbar isOpen={true} />
        </Wrapper>
      )

      const itemDesc = screen.getByText(item.desc)
      expect(itemDesc).toBeInTheDocument()
    })
  })

  it('render SideNavbar logo', () => {
    render(
      <Wrapper>
        <SideNavbar isOpen={true} />
      </Wrapper>
    )

    const logo = screen.getByTestId('logo')
    expect(logo).toBeInTheDocument()
  })
})
