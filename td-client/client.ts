import type { LocalStorage } from './types.ts'

export interface AppManifest {
  title: string
  description?: string
  link?: string
}

export class TDClient {
  // Config
  private scope: string
  private manifest: AppManifest
  private localStorage: LocalStorage

  // Connection
  private _connected = false
  private lastSyncAt: string | null = null

  constructor(
    scope: string,
    manifest: AppManifest,
    localStorage: LocalStorage,
  ) {
    this.scope = scope
    this.manifest = manifest
    this.localStorage = localStorage
  }

  private init = () => {
  }

  connect = async (userAddress: string) => {
    await this.localStorage.setUserAddress(userAddress)

    const manifest = atob(JSON.stringify(this.manifest))
  }

  get connected(): boolean {
    return this.connected
  }
}
