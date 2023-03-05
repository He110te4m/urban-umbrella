declare global {
  type AnyKey = keyof any
  type AnyObject = Record<AnyKey, any>
}

export {}
