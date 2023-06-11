<template>
  <v-app dark>
    <!-- Left sidebar -->
    <Sidebar
      :open="sidebarOpen"
      :items="SidebarItems"
      @changed="changeSidebar"
      @signout="handleSignOut"
    />

    <!-- the main conent -->
    <v-main>
      <v-container fluid>
        <!-- The app bar -->
        <AppBar @toggle="changeSidebar" />
        <v-breadcrumbs
          class="pb-3"
          divider="➡"
          :items="breadcrumbs"
        ></v-breadcrumbs>

        <nuxt />
      </v-container>
    </v-main>

    <!-- The log out modal -->
    <LogOutModal :show.sync="showLogoutModal" />

    <!-- Version number -->
    <Version class="dont-print" />

    <!-- to top -->
    <v-btn
      v-show="showToTop"
      id="toTop"
      v-scroll="onScroll"
      class="dont-print"
      fab
      color="primary"
      x-small
      @click="$vuetify.goTo(0)"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
    <div class="fetch-user" v-if="fetchingUser">
      <v-container class="auth-page" fill-height fluid>
        <v-row align="center" justify="center">
          <div class="inner">
            <v-progress-circular
              indeterminate
              width="2"
              color="black darken-5"
            ></v-progress-circular>
            <span>Loading...</span>
          </div>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  useContext,
  useRoute,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import AppBar from '@/components/parts/AppBar.vue'
import Version from '@/components/parts/Version.vue'
import LogOutModal from '@/components/LogOutModal.vue'
import LeftMenuItems from '@/shared/SidebarItems'
import Sidebar from '~/components/parts/Sidebar.vue'
import { IBreadcrumbs } from '~/store'

export default defineComponent({
  components: { Sidebar, LogOutModal, Version, AppBar },
  middleware: 'auth',
  setup(_props, { root, parent }) {
    // register the toast plugin

    // vuex store
    const store = useStore<any>()
    const { $auth, $axios } = useContext()
    const route = useRoute()

    // breadcrumbs
    const breadcrumbs = computed<IBreadcrumbs>(() => store.state.breadcrumbs)

    // controls the left sidebar
    const sidebarOpen = ref<boolean>(true)
    const fetchingUser = ref<boolean>(true)

    const changeSidebar = (val?: boolean | null | undefined) => {
      // if val is not provided, we use the opposite of what we have now
      // otherwise, we use the boolean value
      sidebarOpen.value =
        typeof val === `undefined` || val === null ? !sidebarOpen.value : val
    }

    // left sidebar menu items
    // const SidebarItems = LeftMenuItems(parent?.$auth.hasScope('create report'))
    const SidebarItems = LeftMenuItems(parent?.$auth)

    // signout modal
    const showLogoutModal = ref<boolean>(false)
    const handleSignOut = () => {
      showLogoutModal.value = true
    }

    // to top
    const showToTop = ref<boolean>(false)

    const onScroll = (e: any) => {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      showToTop.value = top > 100
    }

    const isAuthenticated = computed(() => {
      return store.getters['users/isAuthenticated']
    })

    onBeforeMount(() => {
      // set up the dark mode
      const savedDarkMode = $auth?.user
        ? (($auth.user as any).meta || []).find((meta: { name: string }) => {
            return meta.name === 'dark_mode'
          })
        : null

      if (savedDarkMode) {
        ;(root as any).$vuetify.theme.dark = parseInt(savedDarkMode.value)
      }
    })

    const fetchUser = async () => {
      // $axios
      //   .get('/sanctum/csrf-cookie', {
      //     headers: {
      //       'X-Requested-With': 'XMLHttpRequest',
      //     },
      //   })
      //   .then(() => {
      $auth.setUserToken(true)
      setTimeout(() => {
        fetchingUser.value = false
      }, 900)
      // })
    }

    watch(route, () => {
      fetchUser()
    })

    onMounted(async () => {
      $axios.get('/sanctum/csrf-cookie', {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      fetchUser()
    })

    return {
      sidebarOpen,
      changeSidebar,
      SidebarItems,
      showLogoutModal,
      handleSignOut,
      breadcrumbs,
      showToTop,
      onScroll,
      fetchingUser,
      isAuthenticated,
    }
  },
})
</script>

<style lang="scss">
.v-main__wrap {
  padding-bottom: 70px;
}
.dont-print {
  @media print {
    display: none !important;
  }
}
#version {
  position: fixed;
  bottom: 0;
  left: 0;
  background: lightcyan;
  border-radius: 0 4px 0 0;
  color: #999;
  z-index: 4;
}
.min-h-300 {
  min-height: 300px;
}
#toTop {
  position: fixed;
  bottom: 29px;
  left: 5px;
  z-index: 4;
}
.text-capitialize {
  text-transform: capitalize;
}

.fetch-user {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 99;
  background: white;
  text-align: center;
  .inner {
    > div {
      display: block;
      margin: auto;
    }
    span {
      position: relative;
      left: 7px;
    }
  }
}
</style>

<style>
.v-data-table.v-data-table-sticky-header .v-data-table-header {
  position: sticky;
  top: 0;
}

.v-data-table.v-data-table-sticky-header .v-data-table__wrapper {
  overflow: unset;
}
</style>
