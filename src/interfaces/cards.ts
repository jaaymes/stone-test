/* eslint-disable prettier/prettier */
// eslint-disable-next-line semi
import { UserProps } from './users'

export interface CardProps {
  createdAt: Date | string | null
  id: number
  metadatas: { name: string; digits: number; limit: number }
  status: string
  statusLabel?: JSX.Element
  updatedAt: Date | string | null
  user_id: number
  user?: UserProps
}
