import type { EffectScope } from 'vue'

export interface SharedOptions<T = unknown> {
  id: symbol
  onDispose: () => void
  onEffect: () => T
}

type SharedContext<T> = Pick<SharedOptions<T>, 'onDispose'> & {
  scopes: Set<EffectScope>
  state?: T
}
type SharedStore<T> = Map<SharedOptions['id'], SharedContext<T>>
const sharedMap: SharedStore<any> = new Map()

/** 创建一个跨 scope 共享的管理器，自动维护共享数据销毁等问题 */
export function createSharedScope<T>(options: SharedOptions<T>) {
  const { id, onDispose } = options

  const item = sharedMap.get(id) ?? {
    onDispose,
    scopes: new Set(),
  }

  const scope = getCurrentScope() ?? effectScope()

  const state = initScope(scope, item, options)
  if (!Reflect.has(item, 'state')) {
    item.state = state
  }

  sharedMap.set(id, item)

  return {
    dispose: () => {
      item.scopes.forEach(scope => scope.stop())
      item.scopes.clear()
      callOnDispose(id)
    },
    state: item.state as T,
  }
}

/** 初始化每个 scope */
function initScope<T>(scope: EffectScope, context: SharedContext<T>, { id, onEffect }: SharedOptions<T>) {
  const val = scope.run(onEffect)
  context.scopes.add(scope)
  onScopeDispose(() => {
    context.scopes.delete(scope)
    callOnDispose(id)
  })

  return val
}

/** 当 scope 为空时，会调用 onDispose 处理 shared scope 自动销毁，并释放 map 中的资源 */
function callOnDispose(id: SharedOptions['id']) {
  const item = sharedMap.get(id)
  if (!item || !!item.scopes.size) {
    return
  }

  item.onDispose()
  sharedMap.delete(id)
}
