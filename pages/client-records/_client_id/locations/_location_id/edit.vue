<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="6" md="8">
      <location-form
        @cancel="
          $router.push(`/client-records/${clientId}/locations/${editId}`)
        "
        :id="editId"
        @onFetchClient="onFetchClient"
      ></location-form>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, useRoute, useStore } from '@nuxtjs/composition-api'
import LocationForm from '~/components/forms/LocationForm.vue'

export default defineComponent({
  components: {
    LocationForm,
  },
  middleware: 'isAuthenticated',
  setup() {
    const route = useRoute()
    const store = useStore()

    const id = route.value.params.location_id
    const clientId = route.value.params.client_id
    const pageTitle = 'Edit Location'

    const onFetchClient = (client, location) => {
      store.dispatch('setPageHeading', {
        pageTitle,
        breadcrumbs: [
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
            to: `/client-records/${clientId}`,
            disabled: false,
          },
          {
            text: 'Locations',
            to: `/client-records/${clientId}/locations`,
            disabled: true,
          },
          {
            text: location.name,
            to: `/client-records/${clientId}/locations/${location.id}`,
            disabled: false,
          },
          {
            text: 'Edit',
            to: `/client-records/${clientId}/locations/${id}/edit`,
            disabled: true,
          },
        ],
      })
    }

    return {
      editId: id,
      clientId,
      onFetchClient,
    }
  },
})
</script>
