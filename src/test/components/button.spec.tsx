import Button from '@/components/Button'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render } from '@testing-library/react'

const theme = createTheme({
  palette: {
    custom: {
      stone: '#000',
    },
  },
})

describe('Button', () => {
  it('renderiza corretamente', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <Button>Click me</Button>
      </ThemeProvider>
    )
    expect(getByText('Click me')).toBeInTheDocument()
  })

  it('aplica preenchimento personalizado', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Button px={2}>Click me</Button>
      </ThemeProvider>
    )
    expect(container.firstChild).toHaveStyle('padding-left: 16px; padding-right: 16px;')
  })
})
