import { ISidebarItem } from './SidebarItems'

const AppbarItems: ISidebarItem[] = [
  {
    title: `Dashboard`,
    icon: `mdi-monitor-dashboard`,
    link: `/`,
  },
  {
    title: `Reports`,
    icon: `mdi-graph`,
    link: `/reports`,
  },
  // {
  //   title: `Add a Client`,
  //   icon: `mdi-briefcase-plus-outline`,
  //   link: `/client-records/add`,
  // },
  {
    title: `Search`,
    icon: `mdi-magnify`,
    link: `/search`,
  },
]

export default AppbarItems
