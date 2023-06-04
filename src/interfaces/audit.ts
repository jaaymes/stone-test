import { CardProps } from './cards'
import { UserPros } from './users'

export interface AuditProps {
  after: CardProps
  before: CardProps
  createdAt: Date | string | null
  typeText?: string
  id: number
  requestedBy: number
  type: string
  user: UserPros
}
