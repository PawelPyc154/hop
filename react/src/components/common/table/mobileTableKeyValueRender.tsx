import { ReactNode } from 'react'

interface MobileTableKeyValueRenderProps {
  property: { header: ReactNode; cell: ReactNode }
}
export const MobileTableKeyValueRender = ({ property }: MobileTableKeyValueRenderProps) => (
  <div>
    <div className="opacity-50 text-xs">
      {property.header}
      <span>:</span>
    </div>
    <div>{property.cell}</div>
  </div>
)
