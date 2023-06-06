import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FormControlLabel, Switch as SwitchMui, SwitchProps } from '@mui/material'

type ISwitchProps = {
  name: string
  label: string
} & SwitchProps

const Switch: React.FC<ISwitchProps> = ({ name, label }) => {
  const { control } = useFormContext()
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { ref, ...field } }) => (
          <FormControlLabel
            control={
              <SwitchMui
                inputProps={{ 'aria-label': 'controlled' }}
                ref={ref}
                {...field}
                checked={field.value || false}
              />
            }
            label={label}
          />
        )}
      />
    </>
  )
}

export default Switch
