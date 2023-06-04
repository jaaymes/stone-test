export const handleLoadData = (
  editData: { [s: string]: unknown } | ArrayLike<unknown> | undefined,
  setValue: (arg0: any, arg1: any) => void
) => {
  if (editData !== undefined) {
    Object.entries(editData).forEach(([name, value]: any) => setValue(name, value))
    return true
  }
}
