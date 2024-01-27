import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { Checkbox, CheckboxProps } from './checkbox'

type CheckboxControlProps = Omit<CheckboxProps, 'onChange' | 'checked'>

export const CheckboxControl = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  defaultValue,
  ...restProps
}: CheckboxControlProps & UseControllerProps<TFieldValues>) => {
  const {
    field: { onChange, value, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  })

  return (
    <Checkbox
      error={error?.message}
      {...restField}
      onChange={(e) => onChange(e.target.checked)}
      checked={value}
      {...restProps}
    />
  )
}
