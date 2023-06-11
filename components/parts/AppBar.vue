<template>
  <v-expand-transition>
    <v-app-bar
      v-show="showBar"
      :color="!darkMode ? `#43a047` : `light-blue darken-3`"
      dense
      dark
      class="dont-print"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>
      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-tooltip v-for="(item, index) in appbarItems" :key="index" bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" :to="item.link" v-on="on">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ item.title }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-app-bar-nav-icon
            v-bind="attrs"
            @click.stop="toggleNavbar()"
            v-on="on"
          ></v-app-bar-nav-icon>
        </template>
        <span>Toggle Sidebar</span>
      </v-tooltip>
    </v-app-bar>
  </v-expand-transition>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useStore,
} from '@nuxtjs/composition-api'
import { IMainState } from '@/store/'
import AppbarItems from '@/shared/AppbarItems'
import { ISidebarItem } from '~/shared/SidebarItems'

export default defineComponent({
  setup(_props, { emit, root }) {
    const store = useStore<IMainState>()

    const pageTitle = computed(() => store.state.pageTitle)

    const toggleNavbar = () => emit('toggle')

    const appbarItems: ISidebarItem[] = AppbarItems

    // this handles the appbar appearance animation
    const showBar = ref(false)

    const darkMode = computed(() => (root as any).$vuetify.theme.dark)

    onMounted(() => {
      setTimeout(() => {
        showBar.value = true
      }, 100)
    })

    return {
      pageTitle,
      toggleNavbar,
      appbarItems,
      showBar,
      darkMode,
    }
  },
})
</script>

<style lang="scss">
.v-table-compact {
  thead {
    tr {
      th {
        font-size: 11px !important;
        .v-icon {
          font-size: 10px !important;
        }
      }
    }
  }
  tbody {
    tr {
      td {
        font-size: 13px !important;
        height: 36px !important;
      }
    }
  }
}
</style>
