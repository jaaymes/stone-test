import { useCallback, useEffect, useState } from 'react'
import { GrValidate } from 'react-icons/gr'
import { toast } from 'react-toastify'

import Table from '@/components/Table'

import api from '@/services/api'

import { UserPros } from '@/interfaces/users'
import { colors } from '@mui/material'

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
    disablePadding: false,
  },
  {
    id: 'validDocument',
    label: 'Documento válido',
    numeric: false,
    disablePadding: false,
  },
  {
    id: 'verified',
    label: 'Verificado',
    numeric: false,
    disablePadding: false,
  },
]

const Users = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<UserPros[]>([])

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
        <GrValidate color={colors.green.A700} />
      ) : (
        'Não'
      ),
    }))
  }

  useEffect(() => {
    handleLoadUsers()
  }, [handleLoadUsers])

  return (
    <div>
      <Table
        headers={headers}
        data={users}
        traitResponse={handleTraitResponse}
      />
    </div>
  )
}

export default Users
