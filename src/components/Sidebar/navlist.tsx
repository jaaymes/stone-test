import Analytics from '@mui/icons-material/Analytics'
import BorderColor from '@mui/icons-material/BorderColor'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import FolderOpen from '@mui/icons-material/FolderOpen'
import Forum from '@mui/icons-material/Forum'
import Person from '@mui/icons-material/Person'
import Search from '@mui/icons-material/Search'

const navbarList = [
  {
    icon: Search,
    desc: 'Search',
    secondDesc: '',
    badge: 0,
    subList: [],
  },
  {
    icon: DashboardOutlined,
    desc: 'Dashboard',
    secondDesc: '',
    badge: 0,
    subList: [],
  },
  {
    icon: Person,
    desc: 'User',
    secondDesc: '',
    badge: 0,
    subList: [],
  },
  {
    icon: Forum,
    desc: 'Forum',
    secondDesc: 'Message from andi',
    badge: 2,
    subList: [
      {
        desc: 'chat',
        badge: 2,
      },
      {
        desc: 'reminder',
        badge: 0,
      },
    ],
  },
  {
    icon: Analytics,
    desc: 'Analytics',
    secondDesc: '',
    badge: 0,
    subList: [],
  },
  {
    icon: FolderOpen,
    desc: 'Folder',
    secondDesc: '',
    badge: 0,
    subList: [],
  },
  {
    icon: BorderColor,
    desc: 'Edit',
    secondDesc: '',
    badge: 0,
    subList: [],
  },
]

export default navbarList
