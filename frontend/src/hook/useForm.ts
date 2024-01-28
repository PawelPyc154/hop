import { useForm as useFormBase, UseFormProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const useForm = <TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema
  },
) =>
  useFormBase<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  })
