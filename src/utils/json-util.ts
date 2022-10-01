export const isJson = (value: string) => {
  try {
    const o = JSON.parse(value)
    if (o && typeof o === 'object') {
      return true
    }
  } catch (e) {
    return false
  }
  return true
}
