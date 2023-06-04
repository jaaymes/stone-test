import AddCardIcon from '@mui/icons-material/AddCard'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import Person from '@mui/icons-material/Person'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

const navbarList = [
  {
    icon: DashboardOutlined,
    desc: 'Início',
    path: '/dashboard',
  },
  {
    icon: Person,
    desc: 'Usuários',
    path: '/users',
  },
  {
    icon: AddCardIcon,
    desc: 'Cartões',
    path: '/cards',
  },
  {
    icon: VerifiedUserIcon,
    desc: 'Auditoria',
    path: '/audits',
    permission: 'n2',
  },
]

export default navbarList
