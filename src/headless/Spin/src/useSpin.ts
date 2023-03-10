import { useGlobalState } from '~/composables/useGlobalState'

/** 是否需要展示遮罩，支持响应和非响应方式 */
type State = MaybeRef<boolean>

/** 带有控制的遮罩展示配置 */
interface StateOption {
  /** 异步状态对应的响应式变量 */
  state: State
  /**
   * 控制异步状态是否要纳入 spinning 的计算，只有全为 true 才纳入 spinning 计算
   * 处理手动刷新跟自动刷新是同个响应式变量的场景
   */
  dependOn: State[]
}

/**
 * 外部调用时传入 state 的类型
 * 支持直接配置响应式变量，也支持带控制的配置
 */
type SpinState = State | StateOption

/** state store 的 factory 类型 */
type MakeSpinningStateFn = ReturnType<typeof createSpinStoreFactory>

interface SpinContainerInjector {
  makeSpinState: MakeSpinningStateFn
}

/**
 * 保存全局的 state factory，外部使用的时候
 * 只需要关注 key 是否相同即可，
 * 相同 key 会使用同一个 spinning
 */
const stateMap = new Map<Symbol, MakeSpinningStateFn>()

/** 默认都使用这个 key */
const defaultStateID = Symbol('default')

/**
 * 创建 state store 的 factory 函数
 */
function createSpinStoreFactory() {
  return useGlobalState(() => ({
    spinStateList: ref<StateOption[]>([]),
  }))
}

/** 提供给任意组件处理 spin 的能力 */
export function useSpin(id: Symbol = defaultStateID) {
  let makeSpinState = stateMap.get(id)
  if (!makeSpinState) {
    makeSpinState = createSpinStoreFactory()
    stateMap.set(id, makeSpinState)
  }

  const resources = createSpinResources(makeSpinState)

  onBeforeRouteLeave(() => {
    resources.cleanupSpinState()
    stateMap.clear()
  })

  return resources
}

function createSpinResources(makeSpinState: MakeSpinningStateFn) {
  return {
    /** 提供给业务的带有响应性的 `spinning` 状态 */
    spinning: makeSpinning({ makeSpinState }),
    /** 提供函数，让调用者能为 `spinning` 施加影响 */
    registerSpinState: makeRegisterSpinState({ makeSpinState }),
    /** 清空当前所有的影响，如页面切换时就可以调用 */
    cleanupSpinState: makeCleanupSpinState({ makeSpinState }),
  }
}

function makeSpinning({ makeSpinState }: SpinContainerInjector): ComputedRef<boolean> {
  const { spinStateList } = makeSpinState()

  return computed(
    () =>
      spinStateList.value.some(
        ({ state, dependOn }) =>
          dependOn.every(isNeedSpin => unref(isNeedSpin)) && unref(state),
      ),
  )
}

/** 添加 spin 受控 state */
function makeRegisterSpinState({ makeSpinState }: SpinContainerInjector): (state: SpinState) => void {
  return (state: SpinState) => {
    const { spinStateList } = makeSpinState()

    const option = isStateOption(state) ? state : { state, dependOn: [] }
    spinStateList.value.push(reactive(option))
  }
}

/** 清空 spin 受控 state， spining 会重置为 false */
function makeCleanupSpinState({ makeSpinState }: SpinContainerInjector): () => void {
  return () => {
    const { spinStateList } = makeSpinState()
    spinStateList.value = []
  }
}

function isStateOption(val: SpinState): val is StateOption {
  return !isRef(val) && typeof val !== 'boolean'
}
