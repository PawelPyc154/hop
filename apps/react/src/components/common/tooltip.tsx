import Tippy, { TippyProps } from '@aslakson/tippyjs-react'
import { forwardRef } from 'react'
import 'tippy.js/dist/tippy.css'

export const Tooltip = forwardRef<Element, TippyProps>((props, ref) => (
  <Tippy ref={ref} {...props} />
))
Tooltip.displayName = 'Tooltip'
