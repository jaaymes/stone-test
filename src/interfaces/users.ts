export interface UserPros {
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
  }
  salaryBase: number
  id: number
}
