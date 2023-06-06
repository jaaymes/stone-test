import { BrowserRouter } from 'react-router-dom'

import Layout from '@/pages/layout'

import theme from '@/styles/theme'

import { ThemeProvider } from '@mui/material'
import { fireEvent, render } from '@testing-library/react'

describe('Layout Page', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    )
  }
  it('should render child content', () => {
    const { getByText } = render(
      <Wrapper>
        <Layout>
          <div>Child content</div>
        </Layout>
      </Wrapper>
    )

    expect(getByText('Child content')).toBeInTheDocument()
  })

  it('deve abrir e fechar a barra lateral quando o botão for clicado', () => {
    const { container } = render(
      <Wrapper>
        <Layout>
          <div>Child content</div>
        </Layout>
      </Wrapper>
    )

    const button = container.querySelector('#menu-button')
    expect(button).toBeInTheDocument()
    fireEvent.click(button as Element)
  })
})
