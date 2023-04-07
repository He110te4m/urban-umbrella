import { klona } from 'klona'
import type { Ref } from 'vue'
import { each, filter } from './iterator'
import type { NavMenuChildrenConfig, NavMenuConfig, NavMenuOptions, NavMenuVisitor } from './types'
import type { AnyKey, AnyObject } from '~/headless/types/utils'

export function useNavMenus<TData extends AnyObject, TKey extends AnyKey>(
  activeKey: Ref<TKey | undefined | null>,
  config: NavMenuConfig<TData, TKey>,
) {
  const getKey = createGetKeyFn(config)
  const children = createGetChildrenConfig(config)

  const opt: NavMenuOptions<TData, TKey> = {
    source: config.source,
    visitor: {
      ...children,
      getKey,
    },
    behavior: {
      excludeBrotherLevel: 0,
      includeBrotherLevel: Infinity,
    },
  }

  return useBaseNavMenus(activeKey, opt)
}

export function useBaseNavMenus<TData extends AnyObject, TKey extends AnyKey>(
  activeKey: Ref<TKey | undefined | null>,
  opt: NavMenuOptions<TData, TKey>,
) {
  const { source, visitor } = opt

  // 拷贝数据，避免更新 children 篡改数据
  const originData = klona(source)

  const activeTree = computed(() => {
    const activeID = activeKey.value

    return !activeID
      ? originData
      : getActiveTree(activeID, originData, opt)
  })

  const activeKeys = computed(() => getAllKeys(activeTree.value, visitor))

  return { activeTree, activeKeys }
}

function getActiveTree<TData extends AnyObject, TKey extends AnyKey>(
  activeKey: TKey | undefined | null,
  originData: TData[],
  { visitor, behavior: { excludeBrotherLevel, includeBrotherLevel } }: NavMenuOptions<TData, TKey>,
) {
  const { getKey } = visitor

  return filter(originData, {
    visitor,
    checkFn: ({ item }) => getKey(item) === activeKey,
    getCascaderItems: ({ brothers, parents }) => {
      const level = parents.length + 1
      const isInRange = level > excludeBrotherLevel && level <= includeBrotherLevel

      return isInRange ? brothers : []
    },
  })
}

function getAllKeys<TData extends AnyObject, TKey extends AnyKey>(
  tree: TData[],
  visitor: NavMenuVisitor<TData, TKey>,
) {
  const keys = new Set<TKey>()
  const { getKey } = visitor

  each(tree, {
    visitor,
    afterAccessingChildren: ({ item }) => {
      keys.add(getKey(item))
    },
  })

  return Array.from(keys)
}

function createGetKeyFn<TData extends AnyObject, TKey extends AnyKey>(
  { key }: NavMenuConfig<TData, TKey>,
) {
  return typeof key === 'function' ? key : (item: TData) => item[key]
}

function createGetChildrenConfig<TData extends AnyObject, TKey extends AnyKey>(
  { children }: NavMenuConfig<TData, TKey>,
): NavMenuChildrenConfig<TData> {
  return typeof children === 'object'
    ? children
    : {
        getChildren: item => item[children],
        setChildren: (item, list) => {
          item[children] = list as TData[keyof TData]
        },
      }
}
