import { isJson } from './json-util'

// a localStorage wrapper
export const storageUtil = {
  get<T = string>(key: string): T | string | null {
    const item = localStorage.getItem(key)
    if (item && isJson(item)) {
      return JSON.parse(item)
    }
    return item
  },
  set<T = string>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  },
}
