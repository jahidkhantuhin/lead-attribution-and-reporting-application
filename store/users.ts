import { capitalize } from 'lodash'
import crudStore from '~/traits/crudStore'

const usersStore = crudStore('Users', {
  createPath: 'register',
})

export const state: any = {
  users: [],
  loading: false,
  ...usersStore.state,
}
export const mutations = {
  ...usersStore.mutations,
  setUserLoading(state: any, payload: Boolean) {
    state.loading = payload
  },
}

export const actions = usersStore.actions

export const getters = {
  ...usersStore.getters,
  usersWithFullName(state: any, getters: any) {
    return getters.fetchResData.map((c: any) => {
      return {
        full_name: `${c.first_name} ${c.last_name}`,
        ...c,
      }
    })
  },
  isAuthenticated(state: any, getters: any, rootState: any) {
    return rootState.auth.loggedIn
  },
  isUserLoading(state: any) {
    return state.loading
  },
  roles(state: any, getters: any, rootState: any) {
    return rootState.auth && rootState.auth.user
      ? rootState.auth.user.data.role.map((c: any) => c.name)
      : null
  },
  permissions(state: any, getters: any, rootState: any) {
    return rootState.auth.user.scope
  },
  authenticatedUser(state: any, getters: any, rootState: any) {
    return rootState.auth && rootState.auth.user
      ? rootState.auth.user.data
      : null
  },
  isAllowed(state: any, getters: any, rootState: any) {
    return (name: String) => {
      const scope = rootState.auth?.user?.scope
      if (!name) {
        return true
      }
      return scope.includes(name)
    }
  },
  userProfilePicture(state: any, getters: any, rootState: any) {
    const user = rootState.auth.user;
    if (user) {
      const picture = user.meta.find((c: any) => c.name === "profile_picture");
      if (picture) {
        return picture.value;
      }
    }
    return ''
  },
}
