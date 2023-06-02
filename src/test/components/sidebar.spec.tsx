import { BrowserRouter } from 'react-router-dom'

import SideNavbar from '@/components/Sidebar'
import navbarList from '@/components/Sidebar/navlist'

import { Matcher, render, screen } from '@testing-library/react'

// Criar um mock do hook 'useNavigate'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

// This code renders the SideNavbar component with the browser router
// then checks if each item in the navbar list is rendered
// also checks if the logo is rendered

describe('SideNavbar', () => {
  let navigate: jest.Mock<any, any, any>

  beforeEach(() => {
    navigate = jest.fn()
    jest
      .spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(navigate)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('render SideNavbar', () => {
    render(
      <BrowserRouter>
        <SideNavbar isOpen={true} />
      </BrowserRouter>
    )

    navbarList.forEach((item: { desc: Matcher }) => {
      const itemDesc = screen.getByText(item.desc)
      expect(itemDesc).toBeInTheDocument()
    })
  })

  navbarList.forEach((item) => {
    it(`render SideNavbar item ${item.desc}`, () => {
      render(
        <BrowserRouter>
          <SideNavbar isOpen={true} />
        </BrowserRouter>
      )

      const itemDesc = screen.getByText(item.desc)
      expect(itemDesc).toBeInTheDocument()
    })
  })

  it('render SideNavbar logo', () => {
    render(
      <BrowserRouter>
        <SideNavbar isOpen={true} />
      </BrowserRouter>
    )

    const logo = screen.getByTestId('logo')
    expect(logo).toBeInTheDocument()
  })
})
