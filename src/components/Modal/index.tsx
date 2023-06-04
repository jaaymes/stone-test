import * as React from 'react'

import { Alert } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string | JSX.Element
  alert?: string
  buttons: JSX.Element | JSX.Element[]
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  alert,
  buttons,
  maxWidth = 'md',
  justifyContent,
}) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        {typeof description === 'string' ? <DialogContentText>{description}</DialogContentText> : <>{description}</>}
        {alert && <Alert severity="warning">{alert}</Alert>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: justifyContent || 'space-between', px: 3.5 }}>{buttons}</DialogActions>
    </Dialog>
  )
}

export default Modal
