import type { NavMenuVisitor } from './types'
import type { AnyKey, AnyObject } from '~/headless/types/utils'

interface FilterCallbackParams<TData extends AnyObject> {
  item: TData
  parents: TData[]
  brothers: TData[]
}

interface FilterOption<TData extends AnyObject, TKey extends AnyKey> {
  visitor: NavMenuVisitor<TData, TKey>
  checkFn: (opt: FilterCallbackParams<TData>) => boolean
  getCascaderItems?: (opt: FilterCallbackParams<TData>) => TData[]
  beforeAccessingChildren?: (opt: FilterCallbackParams<TData>) => boolean | undefined
  afterAccessingChildren?: (opt: FilterCallbackParams<TData>) => void
}

type EachOption<TData extends AnyObject, TKey extends AnyKey> = Pick<FilterOption<TData, TKey>, 'visitor' | 'beforeAccessingChildren' | 'afterAccessingChildren'>

export function each<TData extends AnyObject, TKey extends AnyKey>(
  data: TData[],
  opt: EachOption<TData, TKey>,
  parents: TData[] = [],
) {
  const { visitor: { getChildren }, beforeAccessingChildren, afterAccessingChildren } = opt

  for (const item of data) {
    const callbackParams: FilterCallbackParams<TData> = {
      item,
      parents,
      brothers: data,
    }

    const res = beforeAccessingChildren?.(callbackParams)
    if (res === false) {
      continue
    }

    const children = getChildren(item)
    each(children, opt, parents.concat(item))
    afterAccessingChildren?.(callbackParams)
  }
}

export function filter<TData extends AnyObject, TKey extends AnyKey>(
  data: TData[],
  opt: FilterOption<TData, TKey>,
  parents: TData[] = [],
) {
  const { visitor: { getChildren, setChildren }, beforeAccessingChildren, checkFn, getCascaderItems: getToBeSettedItems, afterAccessingChildren } = opt

  const set = new Set<TData>()

  for (const item of data) {
    const callbackParams: FilterCallbackParams<TData> = {
      item,
      parents,
      brothers: data,
    }

    const res = beforeAccessingChildren?.(callbackParams)
    if (res === false) {
      afterAccessingChildren?.(callbackParams)
      continue
    }

    const cascaderItems = getToBeSettedItems?.(callbackParams) ?? [item]
    const setItems = () => {
      set.add(item)
      cascaderItems.forEach((cascaderItem) => {
        set.add(cascaderItem)
      })
    }
    if (checkFn(callbackParams)) {
      setItems()
    }

    const children = getChildren(item)
    if (children.length) {
      const newChildren = filter(children, opt, parents.concat(item))
      setChildren(item, newChildren)
      if (newChildren.length) {
        setItems()
      }
    }

    afterAccessingChildren?.(callbackParams)
  }

  return Array.from(set)
}
