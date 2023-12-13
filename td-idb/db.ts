export enum Store {
  Config = 'config',
  Files = 'files',
}

const DB_NAME = 'td-face'
const DB_VERSION = 1

const STORES = [{
  name: Store.Config,
  key: 'key',
}, {
  name: Store.Files,
  key: 'path',
}]

export class DB {
  private _db: IDBDatabase | null = null

  initDB() {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION)

    return new Promise<void>((resolve, reject) => {
      openRequest.onupgradeneeded = () => {
        const db = openRequest.result

        for (const { name, key } of STORES) {
          const store = db.createObjectStore(name, { keyPath: key })
          store.createIndex(key, key, { unique: true })
        }
      }

      openRequest.onsuccess = () => {
        this._db = openRequest.result
        resolve()
      }
      openRequest.onerror = () => {
        reject(new Error(`IndexedDB error: ${openRequest.error}`))
      }
    })
  }

  getElement<T>(store: string, key: string) {
    return new Promise<T>((resolve, reject) => {
      if (this._db === null) return reject(new Error('IDBDatabase is not init'))

      const transaction = this._db.transaction(store)
      const objectStore = transaction.objectStore(store)
      const request = objectStore.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        const message = request.error?.message ??
          `Bad getElement request. Store: ${store}, key: ${key}`
        reject(new Error(message))
      }
    })
  }

  getAllElements<T>(store: string) {
    return new Promise<T[]>((resolve, reject) => {
      if (this._db === null) return reject(new Error('IDBDatabase is not init'))

      const transaction = this._db.transaction(store)
      const objectStore = transaction.objectStore(store)
      const request = objectStore.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        const message = request.error?.message ??
          `Bad getAll request. Store: ${store}`
        reject(new Error(message))
      }
    })
  }

  addElement<T>(store: string, payload: T) {
    return new Promise<void>((resolve, reject) => {
      if (this._db === null) return reject(new Error('IDBDatabase is not init'))

      const transaction = this._db.transaction(store, 'readwrite')
      const objectStore = transaction.objectStore(store)
      const serialized = JSON.parse(JSON.stringify(payload))
      const request = objectStore.add(serialized)

      transaction.oncomplete = () => resolve()
      request.onerror = () => {
        const message = request.error?.message ??
          `Bad addElement request. Store: ${store}, payload: ${serialized}`
        reject(new Error(message))
      }
    })
  }

  editElement<T>(store: string, key: string, payload: T) {
    return new Promise<void>((resolve, reject) => {
      if (this._db === null) return reject(new Error('IDBDatabase is not init'))

      const transaction = this._db.transaction(store, 'readwrite')
      const objectStore = transaction.objectStore(store)
      const serialized = JSON.parse(JSON.stringify(payload))
      const request = objectStore.get(key)

      request.onsuccess = () => {
        const updateRequest = objectStore.put(serialized)

        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => {
          const message = request.error?.message ??
            `Bad editElement request. Store: ${store}, key: ${key}, payload: ${serialized}`
          reject(new Error(message))
        }
      }
      request.onerror = () => {
        const message = request.error?.message ??
          `Bad editElement request. Store: ${store}, key: ${key}, payload: ${serialized}`
        reject(new Error(message))
      }
    })
  }

  removeElement(store: string, key: string) {
    return new Promise<void>((resolve, reject) => {
      if (this._db === null) return reject(new Error('IDBDatabase is not init'))

      const transaction = this._db.transaction(store, 'readwrite')
      const objectStore = transaction.objectStore(store)
      const request = objectStore.delete(key)

      transaction.oncomplete = () => resolve()
      request.onerror = () => {
        const message = request.error?.message ??
          `Bad removeElement request. Store: ${store}, key: ${key}`
        reject(new Error(message))
      }
    })
  }
}
