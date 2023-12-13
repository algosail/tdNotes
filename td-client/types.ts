export interface LocalStorage {
  readonly userAddress: string | null
  readonly token: string | null
  readonly ready: boolean
  setUserAddress(address: string): Promise<void>
  setToken(token: string): Promise<void>
  getFile(path: string): Promise<TextData | null>
  getAll(): Promise<TextData[]>
  createFile(data: TextData): Promise<void>
  updateFile(data: TextData): Promise<void>
  deleteFile(path: string): Promise<void>
}

export interface TextData {
  path: string
  public: boolean
  vector: string
  data: string
}
