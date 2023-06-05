/* eslint-disable prettier/prettier */
// eslint-disable-next-line semi
import { UserProps } from './users'

export interface CardProps {
  createdAt: Date | string | null
  id: number
  metadatas: { name: string; digits: number; limit: number | string }
  status: string
  statusLabel?: JSX.Element
  name?: string
  limit?: number
  digits?: number
  updatedAt: Date | string | null
  user_id: number
  user?: UserProps
}
