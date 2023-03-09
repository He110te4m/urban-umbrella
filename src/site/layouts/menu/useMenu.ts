import { getMenus } from './data'
import { useNavMenu } from '~/headless/NavMenu'

export function useMenu() {
  const avtiveKeys = ref()

  return useNavMenu(
    avtiveKeys,
    {
      source: getMenus(),
      key: 'url',
      children: 'children',
    },
  )
}
