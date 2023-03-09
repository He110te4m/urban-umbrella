import routes from '~pages'

export interface Menu {
  url: string
  label: string
  children: Menu[]
}

export function getMenus(): Menu[] {
  const map = new Map<string, Menu>()

  routes.forEach((route) => {
    const paths = route.path.split(/[\\\/]/g) ?? []
    if (paths.length < 3) {
      return
    }
    const [, comp, demoName] = paths
    const parentMenu = map.get(comp) ?? createMenu(comp)
    const title = route.meta?.title as string | undefined
    parentMenu.children.push(
      createMenu(
        title ?? demoName,
        route.path,
      ),
    )

    map.set(comp, parentMenu)
  })

  return Array.from(map.values())
}

function createMenu(label: string, url = label): Menu {
  return {
    url,
    label,
    children: [],
  }
}
