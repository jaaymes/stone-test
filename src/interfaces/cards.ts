export interface CardProps {
  createdAt: Date | string | null
  id: number
  metadatas: { name: string; digits: number; limit: number }
  status: string
  updatedAt: Date | string | null
  user_id: number
}
