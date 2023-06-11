<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="4" md="6">
      <ClientRecordsForm
        @onFetchClient="onFetchClient"
        @cancel="$router.push(`/client-records/${clientId}/`)"
        :id="clientId"
      ></ClientRecordsForm>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, useRouter, useStore } from '@nuxtjs/composition-api'
import ClientRecordsForm from '@/components/forms/ClientRecordsForm.vue'
export default defineComponent({
  components: {
    ClientRecordsForm,
  },
  middleware: 'isAuthenticated',
  setup() {
    const router = useRouter()
    const store = useStore()

    const onFetchClient = (client) => {
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
          text: client.name,
          to: `/client-records/${router.currentRoute.params.client_id}`,
          disabled: false,
        },
        {
          text: `Edit`,
          to: `/client-records/${router.currentRoute.params.client_id}/edit`,
          disabled: true,
        },
      ]

      const pageTitle = `Edit Client`
      store.dispatch('setPageHeading', { pageTitle, breadcrumbs })
    }

    return {
      clientId: router.currentRoute.params.client_id,
      onFetchClient,
    }
  },
  head: {
    title: 'Edit Client',
  },
})
</script>
