import React, { forwardRef } from 'react'

import { Button as ButtonMui, ButtonProps } from '@mui/material'

interface IButtonProps extends ButtonProps {
  children: React.ReactNode
  px?: number
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(({ children, px, ...props }, ref) => {
  return (
    <ButtonMui
      sx={{
        '&.MuiButton-contained': {
          backgroundColor: (theme) => (props.color ? undefined : theme.palette.custom.stone),
          '&.Mui-disabled': {
            pointerEvents: 'all',
            cursor: 'not-allowed',
          },
        },
        textTransform: 'none',
        px: px,
      }}
      {...props}
      ref={ref}
    >
      {children}
    </ButtonMui>
  )
})

export default Button
