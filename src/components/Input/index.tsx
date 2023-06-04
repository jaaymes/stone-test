import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { TextField, TextFieldProps, Theme } from '@mui/material'

type InputProps = {
  name: string
  label: string
  normalize?: (value: any) => any
  onChangeFunction?: (value: any) => any
} & TextFieldProps

const Input: React.FC<InputProps> = ({ name, label, normalize, onChangeFunction, ...rest }) => {
  const { control } = useFormContext()

  const normalizeValue = (value: any) => {
    if (normalize) {
      return normalize(value)
    }
    return value
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
          {...rest}
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
            field.onChange(normalizeValue(e.target.value))
            onChangeFunction && onChangeFunction(e.target.value)
          }}
          value={field.value ? normalizeValue(field.value) : ''}
          label={label}
          error={invalid}
          helperText={error?.message}
          ref={ref}
        />
      )}
    />
  )
}

export default Input
