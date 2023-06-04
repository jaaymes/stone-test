import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox as CheckboxMui, CheckboxProps, FormControlLabel } from '@mui/material'

type ICheckboxProps = {
  name: string
  options: {
    label: string
    value: string | number
  }[]
} & CheckboxProps

const Checkbox: React.FC<ICheckboxProps> = ({ name, options, ...rest }) => {
  const { control } = useFormContext()
  return (
    <>
      {options.map((option) => (
        <Controller
          name={name}
          control={control}
          key={option.value}
          defaultValue={[]}
          render={({ field: { ref, ...field } }) => (
            <FormControlLabel
              label={option.label}
              control={
                <CheckboxMui
                  {...field}
                  {...rest}
                  sx={{}}
                  checked={field.value.includes(option.value)}
                  ref={ref}
                  onChange={(e) =>
                    field.onChange(
                      e.target.checked
                        ? [...field.value, option.value]
                        : field.value.filter((i: string | number) => i !== option.value)
                    )
                  }
                />
              }
            />
          )}
        />
      ))}
    </>
  )
}

export default Checkbox
