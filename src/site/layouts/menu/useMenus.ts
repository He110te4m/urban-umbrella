import { getMenus } from './data'
import { useNavMenus } from '~/headless/NavMenu'

export function useMenus() {
  const activeKey = ref()
  const menus = getMenus()
  const { activeKeys } = useNavMenus(
    activeKey,
    {
      source: menus,
      key: 'url',
      children: 'children',
    },
  )

  return {
    menus,
    activeKey,
    activeNodes: activeKeys,
  }
}
