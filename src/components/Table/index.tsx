import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useUtils } from '@/hooks/useUtils'

import theme from '@/styles/theme'

import { AddCircle } from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  TableBody,
  TableCell,
  TableContainer,
  TableHead as TableHeadMui,
  Table as TableMui,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'

import Button from '../Button'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  numeric: boolean
}

interface TableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
  order: Order
  orderBy: string
  headers: readonly HeadCell[]
  action: boolean
}

const TableHead: React.FC<TableHeadProps> = ({ order, orderBy, onRequestSort, headers, action }) => {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHeadMui>
      <TableRow>
        {headers.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {action && <TableCell align="left">Ações</TableCell>}
      </TableRow>
    </TableHeadMui>
  )
}

interface TableToolbarProps {
  title: string
  add?: string
}

const TableToolbar: React.FC<TableToolbarProps> = ({ title, add }) => {
  const { handleSearch } = useUtils()
  const navigate = useNavigate()
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        gap: 2,
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
        {title}
      </Typography>

      <TextField
        label="Pesquisar"
        type="search"
        variant="outlined"
        onChange={handleSearch}
        sx={{ width: '100%', maxWidth: '300px' }}
        size="small"
      />
      {add && (
        <Button
          variant="contained"
          onClick={() => {
            navigate(add)
          }}
          px={4}
          startIcon={<AddCircle />}
        >
          <Typography>Adicionar</Typography>
        </Button>
      )}
    </Toolbar>
  )
}

interface TableProps {
  headers: HeadCell[]
  data: any[]
  traitResponse?: (data: any) => any
  title: string
  actions?: (data: any) => JSX.Element
  isLoading?: boolean
  add?: string
}

const Table = ({ headers, data, traitResponse, title, actions, isLoading, add }: TableProps) => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<string>(headers[0].id)
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [rows, setRows] = useState<any[]>([])
  const [progress, setProgress] = useState(10)

  const handleRequestSort = (_: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const handleRestructure = useCallback(async () => {
    if (traitResponse) {
      setRows(await traitResponse(data))
      return
    }
    setRows(data)
  }, [data, traitResponse])

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage]
  )

  useEffect(() => {
    handleRestructure()
  }, [data, handleRestructure])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10))
    }, 800)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableToolbar title={title} add={add} />
        <TableContainer>
          <TableMui sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <TableHead
              action={actions ? true : false}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headers={headers}
            />
            {isLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center">
                    {/* <CircularProgress size={80} sx={{ color: theme.palette.custom.stone }} /> */}
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress size={80} sx={{ color: theme.palette.custom.stone }} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
                          progress
                        )}%`}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      {headers.map((header) => {
                        return (
                          <TableCell align={header.numeric ? 'right' : 'left'} key={header.id}>
                            {row[header.id]}
                          </TableCell>
                        )
                      })}
                      {actions && <TableCell align="left">{actions(row)}</TableCell>}
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </TableMui>
        </TableContainer>
        <TablePagination
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Espaçamento" />
    </Box>
  )
}

export default Table
