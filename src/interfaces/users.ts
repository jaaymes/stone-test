export interface UserProps {
  name: string | null
  email: string
  BirthDate: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  enabledFeatures: number[]
  document: number
  metadatas: { validDocument: boolean; verified: boolean }
  address: {
    streetNumber: number
    city: string
    state: string
    neighborhood: string
    postalCode: string
    street: string
  }
  salaryBase: number
  id: number
}
