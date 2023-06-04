import { Controller, useFormContext } from 'react-hook-form'

import { TextField, TextFieldProps } from '@mui/material'

type InputProps = {
  name: string
  label: string
} & TextFieldProps

const Input: React.FC<InputProps> = ({ name, label, ...rest }) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.custom.stone, // Cor da borda no estado hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.custom.stone, // Cor da borda quando o campo está focado
              },
            },
            '& .MuiFormLabel-root': {
              '&.Mui-focused': {
                color: (theme) => theme.palette.custom.stone, // Cor do label quando o campo está focado
              },
            },
          }}
          value={field.value || ''}
          label={label}
          error={invalid}
          helperText={error?.message}
          ref={ref}
          {...rest}
        />
      )}
    />
  )
}

export default Input
