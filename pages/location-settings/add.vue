<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="4" md="6">
      <MissingClientRecordsForm
        @cancel="$router.push(`/location-records/`)"
      ></MissingClientRecordsForm>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import MissingClientRecordsForm from '@/components/forms/MissingClientRecordsForm.vue'
export default defineComponent({
  components: {
    MissingClientRecordsForm,
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
        text: `Location Settings`,
        to: `/location-settings`,
        disabled: false,
      },
      {
        text: `Add client`,
        to: `/location-settings/add`,
        disabled: true,
      },
    ]
    const store = useStore()
    const pageTitle = `Location Settings`
    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })
  },
  head: {
    title: 'Create Client',
  },
})
</script>
