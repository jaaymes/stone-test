import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    custom: {
      stone: string
    }
  }
  interface PaletteOptions {
    custom?: {
      stone?: string
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f5f5f5',
    },
    custom: {
      stone: '#00a868',
    },
  },
})

export default theme
