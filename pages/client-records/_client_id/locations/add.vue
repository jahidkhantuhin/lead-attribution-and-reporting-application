<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="6" md="8">
      <location-form
        @onFetchClient="onFetchClient"
        @cancel="handleCancel"
      ></location-form>
    </v-col>
  </v-row>
</template>

<script>
import {
  defineComponent,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import LocationForm from '~/components/forms/LocationForm.vue'

export default defineComponent({
  components: {
    LocationForm,
  },
  middleware: 'isAuthenticated',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const clientId = route.value.params.client_id

    const handleCancel = () => {
      router.push(`/client-records/${clientId}`)
    }

    const onFetchClient = (client) => {
      const pageTitle = 'Add Location'
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
          to: `/client-records/${clientId}`,
          disabled: false,
        },
        {
          text: 'Add Location',
          to: `/client-records/${clientId}/locations/add`,
          disabled: true,
        },
      ]

      store.dispatch('setPageHeading', {
        pageTitle,
        breadcrumbs,
      })
    }

    return {
      handleCancel,
      onFetchClient,
    }
  },
})
</script>
