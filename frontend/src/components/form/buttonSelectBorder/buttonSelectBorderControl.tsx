import { ReactNode } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { ButtonSelectBorder } from './buttonSelectBorder'

type InputControlProps = {
  className?: string
  classNameOptionsWrapper?: string

  options?: {
    slot: ReactNode
    value: string
  }[]
  label?: ReactNode
  isRequired?: boolean
}

export const ButtonSelectBorderControl = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  rules,
  defaultValue,
  label,
  className,
  shouldUnregister,
  ...restProps
}: InputControlProps & UseControllerProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
  })
  return (
    <ButtonSelectBorder
      className={className}
      label={label}
      error={error?.message}
      {...field}
      {...restProps}
      onChange={(v) => {
        field.onChange(v)
      }}
    />
  )
}
