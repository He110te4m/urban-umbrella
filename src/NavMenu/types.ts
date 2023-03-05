export interface NavMenuOptions<TData extends AnyObject, TKey extends AnyKey> {
  visitor: {
    getKey: (item: TData) => TKey
    getSubMenus: (item: TData) => TData[]
    setSubMenus: (item: TData, subMenus: TData[]) => void
  }
}
