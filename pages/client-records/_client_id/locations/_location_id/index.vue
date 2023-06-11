<template>
  <location-details
    :loading="busy"
    :locationData="locationData"
  ></location-details>
</template>

<script lang="ts">
import {
  defineComponent,
  useRoute,
  useStore,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
import LocationDetails from '~/components/ClientRecords/LocationDetails.vue'
import useClientLocations from '~/services/useClientLocations'
import useClientRecords from '~/services/useClientRecords'

export default defineComponent({
  components: {
    LocationDetails,
  },
  middleware: 'isAuthenticated',
  setup() {
    const route = useRoute()
    const store = useStore()

    const locationData = ref({})
    const busy = ref(false)

    const { clientById } = useClientRecords()
    const { locationById } = useClientLocations()

    const locationID = route.value.params.location_id
    const clientId = route.value.params.client_id
    const pageTitle = 'Location Details'

    const fetchLocation = () => {
      busy.value = true

      locationById(locationID)
        .then((resp) => {
          locationData.value = resp.data.data

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
                text: (locationData.value as any).client.last_name + ',' + ' ' + (locationData.value as any).client.first_name,
                to: `/client-records/${clientId}`,
                disabled: false,
              },
              {
                text: (locationData.value as any).city + ' ' + 'Details',
                to: ``,
                disabled: true,
              },
            ],
          })
        })
        .finally(() => {
          busy.value = false
        })
    }

    onMounted(() => {
      fetchLocation()
    })

    return {
      locationData,
      busy,
      clientId,
      locationID,
    }
  },
})
</script>
