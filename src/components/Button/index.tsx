import React, { forwardRef } from 'react'

import { Button as ButtonMui, ButtonProps } from '@mui/material'

interface IButtonProps extends ButtonProps {
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(({ children, ...props }, ref) => {
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
      }}
      {...props}
      ref={ref}
    >
      {children}
    </ButtonMui>
  )
})

export default Button
