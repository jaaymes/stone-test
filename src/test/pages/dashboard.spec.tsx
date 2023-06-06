import { BrowserRouter } from 'react-router-dom'

import Dashboard from '@/pages/dashboard'

import theme from '@/styles/theme'

import { ThemeProvider } from '@emotion/react'
import { render } from '@testing-library/react'

// Criamos um mock para o componente LazyLoadImage
jest.mock('react-lazy-load-image-component', () => {
  return {
    LazyLoadImage: ({ alt, src }: { alt: string; src: string }) => <img src={src} alt={alt} />,
  }
})

describe('Dashboard Page', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    )
  }

  it('renderiza logo e texto', () => {
    const { getByAltText, getByText } = render(
      <Wrapper>
        <Dashboard />
      </Wrapper>
    )
    // Verificamos se a imagem está presente no documento
    const imgElement = getByAltText(/logo/i)
    expect(imgElement).toBeInTheDocument()
    expect(imgElement).toHaveAttribute('src', '/logo.png')
    const text = getByText('Gestor de Cartões Stone')
    expect(text).toBeInTheDocument()
  })
})
