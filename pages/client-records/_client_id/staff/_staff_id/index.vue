<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="8" md="10">
      <staff-details :loading="busy" :staffData="staffData"></staff-details>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  useRoute,
  useStore,
  ref,
  onMounted,
  computed,
} from '@nuxtjs/composition-api'
import useClientRecords from '~/services/useClientRecords'
import useClientStaff from '~/services/useClientStaff'
import moment from 'moment'
import StaffDetails from '~/components/ClientRecords/StaffDetails.vue'

export default defineComponent({
  components: {
    StaffDetails,
  },
  middleware: 'isAuthenticated',
  setup() {
    const route = useRoute()
    const store = useStore()

    const staffData = ref({})
    const busy = ref(false)

    const { clientById } = useClientRecords()
    const { staffById } = useClientStaff()

    const staffID = route.value.params.staff_id
    const clientId = route.value.params.client_id
    const pageTitle = 'Staff'

    const fetchStaff = () => {
      busy.value = true

      staffById(staffID)
        .then((res) => {
          staffData.value = res.data.data

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
                text: (staffData.value as any).client.name,
                to: `/client-records/${clientId}`,
                disabled: false,
              },
              {
                text: 'Staff',
                to: `/client-records/${clientId}`,
                disabled: true,
              },
              {
                text: (staffData.value as any).name,
                to: `/client-records/${clientId}/staff/${staffID}`,
                disabled: true,
              },
            ],
          })
        })
        .finally(() => {
          busy.value = false
        })
    }

    const lastUpdated = computed(() => {
      return moment((staffData.value as any).updated_at).fromNow()
    })

    onMounted(() => {
      fetchStaff()
    })

    return {
      staffData,
      busy,
      clientId,
      staffID,
      lastUpdated,
    }
  },
})
</script>
