import { useCallback, useEffect, useState } from 'react'
import { AiFillCheckCircle, AiOutlineCloseSquare } from 'react-icons/ai'
import { IoMdCloseCircle } from 'react-icons/io'
import { MdVerified } from 'react-icons/md'
import { toast } from 'react-toastify'

import { useUtils } from '@/hooks/useUtils'

import Table from '@/components/Table'

import api from '@/services/api'

import { UserPros } from '@/interfaces/users'
import { IconButton, Tooltip, colors } from '@mui/material'

const headers = [
  {
    id: 'name',
    label: 'Nome',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'email',
    label: 'E-mail',
    numeric: false,
    disablePadding: true,
  },
  {
    id: 'validDocument',
    label: 'Documento válido',
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
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserPros[]>([])
  const [usersFiltered, setUsersFiltered] = useState<UserPros[]>([])
  const { search } = useUtils()

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
    if (search) handleSearch(search)
  }, [handleSearch, search])

  return (
    <>
      <Table
        isLoading={isLoading}
        title="Usuários"
        headers={headers}
        data={search.length > 0 ? usersFiltered : users}
        traitResponse={handleTraitResponse}
      />
    </>
  )
}

export default Users
