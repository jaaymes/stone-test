import { useState } from 'react'

import Sidebar from '@/components/Sidebar'

import MenuIcon from '@mui/icons-material/Menu'
import { Box, Button, colors } from '@mui/material'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false)

  const toogleOpen = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isOpen={open} />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box
          component="main"
          sx={{
            backgroundColor: colors.green.A700,
            width: '100%',
            padding: '8px',
          }}
        >
          <Button
            onClick={toogleOpen}
            sx={{
              minWidth: 'initial',
              padding: '10px',
              color: 'gray',
              borderRadius: '8px',
              backgroundColor: open ? 'transparent' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <MenuIcon
              sx={{
                fontSize: '20px',
                color: open ? 'white' : 'white',
              }}
            ></MenuIcon>
          </Button>
        </Box>
        <Box
          component="main"
          sx={{
            height: '100vh',
            width: '100%',
            padding: '8px',
            // margin: '6px 14px',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
