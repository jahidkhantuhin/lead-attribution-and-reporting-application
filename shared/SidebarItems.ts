export interface ISidebarItem {
  constructor: Function
  title: String
  scope?: String | null
  icon?: String
  link?: String
  show?: Boolean
  children?: Array<ISidebarItem>
}
const LeftMenuItems: ISidebarItem[] = [
  {
    title: 'Home',
    link: '/',
    scope: null,
    icon: 'mdi-home',
  },
  {
    title: 'Reports',
    link: '',
    scope: 'view reports',
    icon: 'mdi-graph',
    children: [
      {
        title: 'Payment',
        link: '/reports/payment-report',
        scope: 'view reports',
        icon: 'mdi-graph',
      },
      {
        title: 'Lead Details',
        link: '/reports/lead-details-report',
        scope: 'view reports',
        icon: 'mdi-graph',
      },
      {
        title: 'Client Overview',
        link: '/reports/client-overview',
        scope: 'view reports',
        icon: 'mdi-graph',
      },
      {
        title: 'KPI ',
        link: '/reports/kpi',
        scope: 'view reports',
        icon: 'mdi-graph',
      },
      {
        title: 'Statistics',
        link: '/reports/statistics',
        scope: 'view reports',
        icon: 'mdi-graph',
      },
      // {
      //   title: 'Reports',
      //   link: '/reports',
      //   scope: 'view reports',
      //   icon: 'mdi-graph',
      // },
      // {
      //   title: 'Reports',
      //   link: '/reports',
      //   scope: 'view reports',
      //   icon: 'mdi-graph',
      // },
      // {
      //   title: 'Reports',
      //   link: '/reports',
      //   scope: 'view reports',
      //   icon: 'mdi-graph',
      // },
    ],
  },
  {
    title: 'Client Records',
    link: '/client-records',
    scope: 'view client records',
    icon: 'mdi-earth',
  },
  {
    title: 'Site Records',
    link: '/site-records',
    scope: 'view site records',
    icon: 'mdi-web',
  },
  {
    title: 'Location Settings',
    link: '/location-settings',
    scope: 'view location settings',
    icon: 'mdi-earth',
  },
  {
    title: 'VPN Setup',
    link: '/vpn-setup',
    scope: 'view vpn setup',
    icon: 'mdi-earth',
  },
  {
    title: 'All Active Locations',
    link: '/all-locations',
    scope: 'view all active locations',
    icon: 'mdi-earth',
  },
  {
    title: 'Users',
    link: '/users',
    scope: 'view users',
    icon: 'mdi-account-group',
  },

  {
    title: 'Profile',
    link: '/profile',
    scope: 'view profile',
    icon: 'mdi-account',
  },
]

export default (user: any) => {
  if (
    user &&
    user.role === 'super admin' &&
    LeftMenuItems.filter((c: ISidebarItem) => c.title === 'Settings').length ===
      0
  ) {
    LeftMenuItems.push({
      title: 'Settings',
      link: '/settings',
      scope: 'manage settings',
      icon: 'mdi-cog',
    })
  } 
  else if (
    !user.hasScope('create report') && user.hasScope('vpn access')) {
      return LeftMenuItems.filter((c: ISidebarItem) => c.title === 'VPN Setup' || c.title === 'Profile')
    }
    // else if (
    //   !user.hasScope('create report') || !user.hasScope('vpn access')) {
    //     return LeftMenuItems.filter((c: ISidebarItem) => c.title === 'VPN Setup' || c.title === 'Profile')
    //   }
  return LeftMenuItems
}
