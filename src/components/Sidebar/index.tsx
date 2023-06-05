import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { useAuth } from '@/hooks/useAuth'

import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  colors,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import navbarList from './navlist'

const drawerWidthOpen = 240
const paddingIconButton = 10
const marginIconButton = 14
const iconFontSize = 20
const drawerWidthClose = (paddingIconButton + marginIconButton) * 2 + iconFontSize

interface SideNavbarProps {
  isOpen: boolean
}

interface INavbarProps {
  icon: React.ElementType
  desc: string
  path: string
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen }) => {
  const theme = useTheme()
  const navigation = useNavigate()
  const { signOut, user, auth } = useAuth()
  const location = useLocation()
  const [routesAllowed, setRoutesAllowed] = useState<INavbarProps[]>([])

  const handleRestructureRoutes = useCallback(() => {
    const routes = navbarList.filter((route) => {
      if (route.permission) {
        return user?.roles.includes(route.permission)
      }
      return true
    })
    setRoutesAllowed(routes)
  }, [user])

  useEffect(() => {
    handleRestructureRoutes()
  }, [handleRestructureRoutes, location.pathname])

  useEffect(() => {
    if (!auth) {
      navigation('/')
    }
  }, [auth, navigation, location.pathname])

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '56px',
          width: 'auto',
          backgroundColor: 'transparent',
          margin: '14px 14px',
          padding: '12px 0px',
          borderBottom: '1px solid lightgray',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', sm: 'initial' },
            fontSize: '18px',
            width: '154px',
            marginLeft: isOpen ? '0px' : '8px',
            alignItems: 'center',
          }}
        >
          <svg viewBox="0 0 92 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-testid="logo">
            <path
              d="M51.907 23.38h4.105a.3.3 0 0 0 .22-.076.29.29 0 0 0 .096-.208V11.958c0-3.159 1.58-4.823 4.306-4.823 2.727 0 4.278 1.664 4.278 4.823v11.14a.286.286 0 0 0 .198.268.3.3 0 0 0 .118.015h4.105a.3.3 0 0 0 .22-.075.29.29 0 0 0 .096-.209v-11.11c0-4.767-2.698-8.941-9.015-8.941-6.318 0-9.043 4.174-9.043 8.94v11.111a.285.285 0 0 0 .096.208.296.296 0 0 0 .22.074ZM23.656 23.634c1.493 0 2.47-.17 2.9-.339a.366.366 0 0 0 .23-.31v-3.33c0-.198-.087-.31-.345-.31-.201 0-.775.112-1.235.112-1.78 0-2.554-.648-2.554-2.171v-9.39h3.79a.322.322 0 0 0 .222-.09.31.31 0 0 0 .093-.22V3.948a.31.31 0 0 0-.093-.218.322.322 0 0 0-.223-.092h-3.933V.48c0-.339-.144-.48-.402-.48H18.23c-.315 0-.459.142-.459.48v17.287c0 4.203 2.382 5.867 5.885 5.867ZM7.178 23.859c4.623 0 7.925-2.792 7.925-6.43 0-4.09-2.757-5.273-6.517-6.063l-1.867-.395c-1.406-.31-2.182-.96-2.182-2.059 0-1.41 1.436-2.171 3.417-2.171 2.785 0 4.68 1.24 4.966 1.24a.448.448 0 0 0 .374-.254l.746-2.735c.145-.367.115-.451-.144-.592-1.665-.846-3.445-1.326-5.972-1.326C3.244 3.074 0 5.725 0 9.251c0 3.33 2.613 5.16 6.347 5.951l1.895.395c1.521.31 2.38.902 2.38 2.171 0 1.297-1.034 2.425-3.475 2.425-3.445 0-5.799-1.353-6.172-1.353-.23 0-.316.113-.402.479l-.488 2.285c-.144.479 0 .79.316.93 1.178.648 4.393 1.325 6.777 1.325ZM38.5 19.939c-3.015 0-5.77-2.228-5.77-6.43s2.756-6.377 5.77-6.377c3.043 0 5.742 2.172 5.742 6.377 0 4.23-2.7 6.43-5.742 6.43Zm0 4.061c6.029 0 10.42-4.427 10.42-10.491S44.529 3.046 38.5 3.046c-6 0-10.422 4.4-10.422 10.463C28.078 19.572 32.499 24 38.5 24ZM92 13.283c0-6.234-3.647-10.237-9.448-10.237-5.455 0-10.163 4.118-10.163 10.378 0 6.684 4.823 10.576 9.99 10.576 4.336 0 6.837-1.678 8.384-3.722.3-.396.36-.567.36-.678 0-.11-.071-.197-.332-.425l-1.809-1.55c-.432-.367-.577-.48-.72-.48-.145 0-.231.085-.346.226-1.234 1.636-2.957 2.566-5.282 2.566-2.933 0-4.888-1.958-5.384-5.133h13.248c.924.002 1.502-.284 1.502-1.52Zm-9.618-6.317c3.133 0 4.79 2.076 4.88 4.371H77.32c.545-2.464 2.247-4.371 5.062-4.371Z"
              fill="#00A868"
            ></path>
          </svg>
        </Box>
      </Box>

      <List dense={true}>
        {routesAllowed.map((key, index) => (
          <Tooltip
            key={index}
            onClick={() => {
              navigation(key.path)
            }}
            title={isOpen ? key.desc : ''}
            placement={'right'}
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: 'gray.900',
                  color: 'white',
                  marginLeft: '22px !important',
                  boxShadow: '0px 0px 22px -2px rgba(0,0,0,0.20)',
                },
              },
            }}
          >
            <ListItemButton
              sx={{
                margin: '6px 14px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: location.pathname === key.path ? colors.grey[200] : 'transparent',
                '&:hover': {
                  backgroundColor: colors.grey[200],
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '46px' }}>
                <key.icon sx={{ fontSize: '20px', color: 'gray.900' }} />
              </ListItemIcon>

              <ListItemText
                primary={key.desc}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
                sx={{
                  display: 'inline',
                  margin: '0px',
                  overflowX: 'hidden',
                  color: 'gray.900',
                  whiteSpace: 'nowrap',
                  minWidth: '126px',
                }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          alignContents: 'center',
          margin: '14px 14px',
          padding: '12px 4px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            borderTop: '1px solid lightgray',
          }}
        >
          <IconButton sx={{ color: 'lightGray' }} onClick={signOut}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  )

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? { xs: '0px', sm: drawerWidthClose } : { xs: drawerWidthClose, sm: drawerWidthOpen },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: isOpen ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          // justifyContent: 'space-between',
          overflowX: 'hidden',
          width: isOpen ? { xs: '0px', sm: drawerWidthClose } : { xs: drawerWidthClose, sm: drawerWidthOpen },
          borderRight: '0px',
          boxShadow: theme.shadows[8],
          // backgroundColor: open ? '#11101D' : '#11101D',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isOpen ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default SideNavbar
