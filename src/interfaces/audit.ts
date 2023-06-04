import { CardProps } from './cards'
import { UserProps } from './users'

export interface AuditProps {
  after: CardProps & UserProps
  before: CardProps & UserProps
  createdAt: Date | string | null
  typeText?: string
  id: number
  requestedBy: number
  type: string
  user: UserProps
}
