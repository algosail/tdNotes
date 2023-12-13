import { TDClient } from './client.ts'
import type { AppManifest } from './client.ts'
import type { LocalStorage, TextData } from './types.ts'

interface Options {
  scope: string
  manifest: AppManifest
  localStorage: LocalStorage
}

export const createTDClient = (
  { scope, manifest, localStorage }: Options,
): TDClient => {
  return new TDClient(scope, manifest, localStorage)
}

export type { AppManifest, LocalStorage, TextData }
