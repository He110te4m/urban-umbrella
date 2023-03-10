export function useGlobalState<T>(stateFactory: () => T) {
  let initialized = false
  let state: T
  const scope = effectScope(true)
  return () => {
    if (!initialized) {
      state = scope.run(stateFactory)!
      initialized = true
    }
    return state
  }
}
