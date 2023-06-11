<template>
  <div>
    <v-card elevation="1">
      <v-card-text>
        <p>Not implemented yet.</p>
        <v-btn elevation="0" to="/">Home page</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { IBreadcrumbs } from '~/store'

export default defineComponent({
  middleware: 'isAuthenticated',
  setup() {
    const store = useStore()
    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: `Dashboard`,
        to: `/`,
      },
      {
        text: `Search`,
        to: `/search`,
      },
    ]

    const pageTitle = `Search`

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })
  },
})
</script>
