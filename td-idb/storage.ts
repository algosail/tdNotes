import type { LocalStorage, TextData } from 'td-client'

import { DB, Store } from './db.ts'

enum ConfigKey {
  UserAddress = 'userAddress',
  Token = 'token',
}

interface ConfigRow {
  key: string
  value: string
}

export class IdbStorage extends DB implements LocalStorage {
  // Config
  private _userAddress: string | null = null
  private _token: string | null = null
  private _ready = false

  constructor() {
    super()
    if (!indexedDB) {
      console.error('indexedDB is not available!')
      return
    }
    this.initDB()
      .then(() => this.init())
      .catch((err) => console.error((err as Error).message))
  }

  private async init(): Promise<void> {
    try {
      const { value: userAddress } = await this.getElement<ConfigRow>(
        Store.Config,
        ConfigKey.UserAddress,
      )
      this._userAddress = userAddress

      const { value: token } = await this.getElement<ConfigRow>(
        Store.Config,
        ConfigKey.UserAddress,
      )
      this._token = token
      this._ready = true
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  async setUserAddress(address: string): Promise<void> {
    try {
      await this.addElement<ConfigRow>(Store.Config, {
        key: ConfigKey.UserAddress,
        value: address,
      })
      this._userAddress = address
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await this.addElement<ConfigRow>(Store.Config, {
        key: ConfigKey.Token,
        value: token,
      })
      this._token = token
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  async getFile(path: string): Promise<TextData | null> {
    try {
      const data = await this.getElement<TextData>(Store.Files, path)
      return data
    } catch (error) {
      console.error((error as Error).message)
      return null
    }
  }

  async getAll(): Promise<TextData[]> {
    try {
      const data = await this.getAllElements<TextData>(Store.Files)
      return data
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  }

  async createFile(data: TextData): Promise<void> {
    try {
      await this.addElement(Store.Files, data)
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  async updateFile(data: TextData): Promise<void> {
    try {
      await this.editElement(Store.Files, data.path, data)
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await this.removeElement(Store.Files, path)
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  get userAddress(): string | null {
    return this._userAddress
  }

  get token(): string | null {
    return this._token
  }

  get ready(): boolean {
    return this._ready
  }
}
