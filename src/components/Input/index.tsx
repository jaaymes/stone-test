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
      render={({
        field: { ref, ...field },
        fieldState: { invalid, error },
      }) => (
        <TextField
          {...field}
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
