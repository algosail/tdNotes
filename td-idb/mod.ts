import { IdbStorage } from './storage.ts'

export const createIdbStorage = (): IdbStorage => {
  return new IdbStorage()
}
