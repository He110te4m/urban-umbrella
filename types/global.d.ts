import type { App } from 'vue'

interface AppInitParams {
  app: App<Element>
}

declare global {
  type AnyKey = keyof any
  type AnyObject = Record<AnyKey, any>
  interface AppPlugin {
    init: (params: AppInitParams) => MaybePromise<void>
  }
}

export { }
