import { useCallback, useEffect, useState } from 'react'
import { AiFillCheckCircle, AiOutlineCloseSquare } from 'react-icons/ai'
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'
import { IoMdCloseCircle } from 'react-icons/io'
import { MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { useAuth } from '@/hooks/useAuth'
import { useUtils } from '@/hooks/useUtils'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Table from '@/components/Table'

import theme from '@/styles/theme'

import { normalizeCpf, normalizeCurrency } from '@/utils/normalize'

import api from '@/services/api'

import { FeatureProps } from '@/interfaces/feature'
import { UserProps } from '@/interfaces/users'
import {
  Box,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  Table as TableMui,
  TableRow,
  Tooltip,
  Typography,
  colors,
} from '@mui/material'

const headers = [
  {
    id: 'name',
    label: 'Nome',
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'email',
    label: 'E-mail',
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'validDocument',
    label: 'Documento',
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'verified',
    label: 'Verificado',
    numeric: false,
    disablePadding: true,
  },
]

const Users = () => {
  const { search } = useUtils()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserProps[]>([])
  const [usersFiltered, setUsersFiltered] = useState<UserProps[]>([])
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null)
  const [openUser, setOpenUser] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)
  const [features, setFeatures] = useState<FeatureProps[]>([])

  const handleOpenUser = useCallback(() => {
    setOpenUser(true)
  }, [])

  const handleCloseUser = useCallback(() => {
    setOpenUser(false)
  }, [])

  const handleOpenRemove = useCallback(() => {
    setOpenRemove(true)
  }, [])

  const handleCloseRemove = useCallback(() => {
    setOpenUser(false)
  }, [])

  const handleLoadFeatures = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/features')
      if (response) setFeatures(response.data.result)
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao carregar funcionalidades')
      setIsLoading(false)
    }
  }, [])

  const handleLoadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/users')
      if (response) setUsers(response.data)
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message || 'Erro ao carregar usuários')
      setIsLoading(false)
    }
  }, [])

  const handleTraitResponse = (data: any) => {
    return data.map((d: any) => ({
      ...d,
      email:
        d?.email.length > 30 ? `${d?.email.substring(0, 15)}...${d?.email.substring(d?.email.length - 10)}` : d.email,
      validDocument: d.metadatas.validDocument ? (
        <Tooltip title="Validado" arrow placement="left">
          <IconButton>
            <AiFillCheckCircle color={colors.green[400]} size={25} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Não validado" arrow placement="left">
          <IconButton>
            <AiOutlineCloseSquare color={colors.red[400]} size={25} />
          </IconButton>
        </Tooltip>
      ),
      verified: d.metadatas.verified ? (
        <Tooltip title="Verificado" arrow placement="left">
          <IconButton>
            <MdVerified color={colors.green[400]} size={25} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Não verificado" arrow placement="left">
          <IconButton>
            <IoMdCloseCircle color={colors.red[400]} size={25} />
          </IconButton>
        </Tooltip>
      ),
    }))
  }

  const handleSearch = useCallback(
    (search: string) => {
      const filteredUsers = users.filter((user) => {
        if (!user?.name) return false
        return user?.name.toLowerCase().includes(search.toLowerCase())
      })
      setUsersFiltered(filteredUsers)
    },
    [users]
  )

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers])

  useEffect(() => {
    handleLoadFeatures()
  }, [handleLoadFeatures])

  useEffect(() => {
    if (search) handleSearch(search)
  }, [handleSearch, search])

  return (
    <>
      <Modal
        title="Visualizar Usuário"
        description={
          <TableContainer>
            <TableMui sx={{ minWidth: 650 }}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Nome: <strong>{selectedUser?.name}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Email: <strong>{selectedUser?.email}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Documento: <strong>{normalizeCpf(String(selectedUser?.document))}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Nascimento:{' '}
                      <strong>{new Date(selectedUser?.BirthDate as Date).toLocaleDateString('pt-BR')}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Rua: <strong>{selectedUser?.address.neighborhood}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Numero: <strong>{selectedUser?.address.streetNumber}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      CEP: <strong>{selectedUser?.address.postalCode}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Estado: <strong>{selectedUser?.address.state}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" gutterBottom>
                      Cidade: <strong>{selectedUser?.address.city}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  {user?.roles.includes('n2') && (
                    <TableCell>
                      <Typography color="text.secondary" gutterBottom>
                        Salario: <strong>{normalizeCurrency(selectedUser?.salaryBase as number)}</strong>
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography color="text.secondary" gutterBottom>
                      Criado: <strong>{new Date(selectedUser?.createdAt as Date).toLocaleDateString('pt-BR')}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Typography color="text.secondary" gutterBottom>
                      Ultima Atualização:{' '}
                      <strong>{new Date(selectedUser?.updatedAt as Date).toLocaleDateString('pt-BR')}</strong>
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary" gutterBottom>
                      Funcionalidades Ativas:{' '}
                      <strong>
                        {selectedUser?.enabledFeatures.map((item, index) => {
                          const feature = features.find((f) => f.id === item)
                          if (!feature) return ''
                          return `${feature.name}${index === selectedUser?.enabledFeatures.length - 1 ? '' : ', '}`
                        })}
                      </strong>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </TableMui>
          </TableContainer>
        }
        open={openUser}
        onClose={handleCloseUser}
        buttons={
          <>
            <Button onClick={handleCloseUser} variant="contained" color="warning">
              Cancelar
            </Button>
          </>
        }
      />

      <Modal
        maxWidth="xs"
        title="Remover Usuário"
        description="Deseja realmente remover o usuário?"
        open={openRemove}
        onClose={handleCloseRemove}
        justifyContent="flex-end"
        buttons={
          <>
            <Button onClick={handleCloseRemove} variant="contained" color="warning">
              Cancelar
            </Button>
            <Button onClick={handleCloseRemove} variant="contained" color="error">
              Confirmar
            </Button>
          </>
        }
      />
      <Table
        add="/users/create"
        isLoading={isLoading}
        title="Usuários"
        headers={headers}
        data={search.length > 0 ? usersFiltered : users}
        traitResponse={handleTraitResponse}
        actions={(data: UserProps) => {
          return (
            <Box display="flex">
              <Tooltip title="Visualizar" arrow placement="left">
                <IconButton
                  onClick={() => {
                    handleOpenUser()
                    setSelectedUser(data)
                  }}
                >
                  <FaEye color={theme.palette.custom.stone} size={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar" arrow placement="left">
                <IconButton onClick={() => navigate(`/users/edit/${data.id}`)}>
                  <FaEdit color={theme.palette.custom.stone} size={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remover" arrow placement="left">
                <IconButton
                  onClick={() => {
                    handleOpenRemove()
                    setSelectedUser(data)
                  }}
                >
                  <FaTrash color={colors.red[600]} size={25} />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }}
      />
    </>
  )
}

export default Users
