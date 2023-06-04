// normalize currency R$ enter value string R$ 1.000,00
export const normalizeCurrency = (value: number) => {
  const currency = String(value).replace(/\D/g, '')
  const currencyFormat = Number(currency) / 100
  return currencyFormat.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// normalize cpf enter value number and return 000.000.000-00
export const normalizeCpf = (value: number | undefined | string) => {
  if (!value) return
  const cpf = String(value)
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return cpf
}

// normalize Date type Date and return dd/mm/yyyy
export const normalizeDate = (value: Date | undefined) => {
  if (!value) return
  const date = new Date(value)
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  const month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// normalize Date type Date and return yyyy-mm-dd
export const normalizeDateToInput = (value: Date | undefined) => {
  if (!value) return
  const date = new Date(value)
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
  const month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

// normalize CEP enter value number and return 00000-000
export const normalizeCep = (value: string) => {
  const cep = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
  return cep
}
