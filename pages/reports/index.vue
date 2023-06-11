<template>
  <ReportsList class="mt-6" />
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import ReportsList from '~/components/ReportsList.vue'
import { IBreadcrumbs } from '~/store'

const pageTitle = `Reports`

export default defineComponent({
  components: {
    ReportsList,
  },
  middleware: 'isAuthenticated',
  setup() {
    const store = useStore()

    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: 'Dashboard',
        to: `/`,
      },
      {
        text: `Reports`,
        to: '',
        disabled: true,
      },
    ]

    store.dispatch('setPageHeading', {
      pageTitle,
      breadcrumbs,
    })

    return {}
  },
  head: {
    title: pageTitle,
  },
})
</script>
