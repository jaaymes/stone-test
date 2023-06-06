import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { MenuItem, TextField, TextFieldProps, Theme } from '@mui/material'

type InputProps = {
  name: string
  label: string
  options: {
    label: string
    value: string | number
  }[]
} & TextFieldProps

const Select: React.FC<InputProps> = ({ name, label, options, ...rest }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={''}
      render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
          {...rest}
          inputProps={{ id: 'select', 'data-testid': 'select' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme: Theme) => theme.palette.custom.stone, // Cor da borda no estado hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme: Theme) => theme.palette.custom.stone, // Cor da borda quando o campo está focado
              },
            },
            '& .MuiFormLabel-root': {
              '&.Mui-focused': {
                color: (theme: Theme) => theme.palette.custom.stone, // Cor do label quando o campo está focado
              },
            },
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(e.target.value)
          }}
          value={field.value}
          select
          label={label}
          error={invalid}
          helperText={error?.message}
          ref={ref}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

export default Select
