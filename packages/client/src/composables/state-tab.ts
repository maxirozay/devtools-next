import type { ModuleBuiltinTab } from '~/types/tab'

export interface TabSettings {
  hiddenTabCategories: string[]
  hiddenTabs: string[]
  pinnedTabs: string[]
}

export interface CategorizedTab extends ModuleBuiltinTab {
  hidden: boolean
}

export interface CategorizedCategory {
  name: string
  hidden: boolean
}

export const categorizedTabs = computed(() => {
  const { hiddenTabCategories, hiddenTabs, pinnedTabs } = devtoolsClientState.value.tabSettings
  // TODO: custom tabs
  const tabs = builtinTab.reduce<[CategorizedCategory, CategorizedTab[]][]>((prev, [category, tabs]) => {
    const data: [CategorizedCategory, CategorizedTab[]] = [{ hidden: false, name: category }, []]
    let hiddenCount = 0
    tabs.forEach((tab) => {
      const hidden = hiddenTabs.includes(tab.name) || hiddenTabCategories.includes(category)
      if (hidden)
        hiddenCount += 1

      if (pinnedTabs.includes(tab.name)) {
        prev[0][1].push({
          ...tab,
          hidden,
        })
      }
      else { data[1].push({ ...tab, hidden }) }
    })
    if (hiddenCount === tabs.length)
      data[0].hidden = true
    prev.push(data)
    return prev
  }, [[{ name: 'pinned', hidden: false }, []]])
  // sort pinned tabs by pinned order
  tabs[0][1].sort((a, b) => pinnedTabs.indexOf(a.name) - pinnedTabs.indexOf(b.name))
  return tabs
})
