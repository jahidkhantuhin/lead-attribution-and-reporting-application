<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="4" md="6">
      <ClientRecordsForm
        @cancel="$router.push(`/client-records/`)"
      ></ClientRecordsForm>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import ClientRecordsForm from '@/components/forms/ClientRecordsForm.vue'
export default defineComponent({
  components: {
    ClientRecordsForm,
  },
  middleware: 'isAuthenticated',
  setup() {
    const breadcrumbs = [
      {
        text: `Dashboard`,
        to: `/`,
        disabled: false,
      },
      {
        text: `Client Records`,
        to: `/client-records`,
        disabled: false,
      },
      {
        text: `Add client`,
        to: `/client-records/add`,
        disabled: true,
      },
    ]
    const store = useStore()
    const pageTitle = `Cilent Records`
    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })
  },
  head: {
    title: 'Create Client',
  },
})
</script>
