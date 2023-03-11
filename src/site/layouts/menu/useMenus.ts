import { getMenus } from './data'
import { useNavMenus } from '~/headless/NavMenu'

export function useMenus() {
  // create menus
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

  // update menus
  const route = useRoute()
  watch(
    () => route.path,
    () => {
      activeKey.value = route.path
    },
    { immediate: true },
  )

  // create menus click event
  const router = useRouter()
  function onMenuItemClick(url: string) {
    router.push(url)
  }

  return {
    menus,
    activeNodes: activeKeys,
    onMenuItemClick,
  }
}
