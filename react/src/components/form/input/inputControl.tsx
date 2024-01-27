import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { Input, InputProps as InputControlProps } from './input'

export const InputControl = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  defaultValue,
  label,
  className,
  type,
  onChange: onChangeCustom,
  ...restProps
}: InputControlProps & UseControllerProps<TFieldValues>) => {
  const {
    field: { onChange, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  })
  return (
    <Input
      className={className}
      label={label}
      error={error?.message}
      {...restField}
      onChange={(e) => {
        onChangeCustom?.(e)
        return onChange(
          e.target.value === '' ? '' : type === 'number' ? Number(e.target.value) : e.target.value,
        )
      }}
      type={type}
      {...restProps}
    />
  )
}
