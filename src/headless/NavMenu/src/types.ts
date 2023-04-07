import type { AnyKey, AnyObject } from '~/headless/types/utils'

export interface NavMenuChildrenConfig<TData extends AnyObject> {
  getChildren: (item: TData) => TData[]
  setChildren: (item: TData, list: TData[]) => void
}

export interface NavMenuVisitor<TData extends AnyObject, TKey extends AnyKey> extends NavMenuChildrenConfig<TData> {
  getKey: (item: TData) => TKey
  setActive?: (item: TData, isActive: boolean) => void
}

export interface NavMenuBehavior {
  includeBrotherLevel: number
  excludeBrotherLevel: number
}

export interface NavMenuOptions<TData extends AnyObject, TKey extends AnyKey> {
  source: TData[]
  visitor: NavMenuVisitor<TData, TKey>
  behavior: NavMenuBehavior
}

export interface NavMenuConfig<TData extends AnyObject, TKey extends AnyKey> {
  source: TData[]
  key: keyof TData | NavMenuVisitor<TData, TKey>['getKey']
  children: keyof TData | NavMenuChildrenConfig<TData>
}
