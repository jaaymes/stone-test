import Label from '@/components/Label/Label'

import theme from '@/styles/theme'

import { ThemeProvider } from '@mui/material'
import { render } from '@testing-library/react'

describe('Label', () => {
  it('renderiza label com children', () => {
    const childrenText = 'Test Label'

    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <Label>{childrenText}</Label>
      </ThemeProvider>
    )

    expect(getByText(childrenText)).toBeInTheDocument()
  })
})
