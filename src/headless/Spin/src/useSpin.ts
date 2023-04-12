import type { ComputedRef } from 'vue'
import { createSharedScope } from '~/utils/createSharedScope'

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
type SpinStore = ReturnType<typeof createSpinStore>

/** 提供给任意组件处理 spin 的能力 */
export function useSpin(id: symbol) {
  const { state, dispose } = createSharedScope({
    id,
    onEffect: () => createSpinStore(),
    onDispose: () => {
      cleanupSpinStore(state)
    },
  })

  return {
    /** 提供给业务的带有响应性的 `spinning` 状态 */
    spinning: makeSpinning(state),
    /** 提供函数，让调用者能为 `spinning` 施加影响 */
    registerSpinState: makeRegisterSpinState(state),
    /** 清空当前所有的影响，如页面切换时就可以调用 */
    cleanupSpinState: dispose,
  }
}

function makeSpinning(store: SpinStore | undefined): ComputedRef<boolean> {
  const spinStateList = getList(store)

  return computed(
    () =>
      spinStateList.value.some(
        ({ state, dependOn }) =>
          dependOn.every(isNeedSpin => unref(isNeedSpin)) && unref(state),
      ),
  )
}

/** 添加 spin 受控 state */
function makeRegisterSpinState(store: SpinStore | undefined): (state: SpinState) => void {
  return (state: SpinState) => {
    const spinStateList = getList(store)

    const option = isStateOption(state) ? state : { state, dependOn: [] }
    spinStateList.value.push(reactive(option))
  }
}

/**
 * 创建 state store 的 factory 函数
 */
function createSpinStore() {
  const spinStateList = ref<StateOption[]>([])
  const sharedState = {
    spinStateList,
  }
  return sharedState
}

function cleanupSpinStore(store: SpinStore | undefined): void {
  if (store) {
    store.spinStateList.value = []
  }
}

function isStateOption(val: SpinState): val is StateOption {
  return !isRef(val) && typeof val !== 'boolean'
}

function getList(store: SpinStore | undefined): SpinStore['spinStateList'] {
  return store?.spinStateList ?? ref([])
}
