<template>
  <v-row>
    <v-col cols="10" offset="1">
      <v-card :loading="busy" v-if="apiStatus === 200">
        <v-card-title>
          <h3 class="text-capitalize client-name">
            {{ !busy ? clientData.name : 'Loading...' }}
          </h3>
          <h5 v-if="clientData.status" class="ml-4"> 
            {{ clientData.status }} 
          </h5>
          <h5 v-if="clientData.email" class="ml-4">
            {{ clientData.email }}
          </h5>

          <v-spacer></v-spacer>
          <v-btn class="mr-3" to="/client-records" small
            >Show all clients</v-btn
          >
          <v-btn
            color="primary"
            small
            :to="`/client-records/${clientData.id}/edit`"
            >Edit</v-btn
          >
        </v-card-title>
        <v-card-text>
          <span class="text-capitalize">{{ clientData.city ? clientData.city : 'city' }}</span>
          <span class="text-capitalize ml-4">{{ clientData.state ? clientData.state : 'state' }}</span>
          <span class="text-capitalize ml-4">{{ clientData.zipcode ? clientData.zipcode : 'zipcode' }}</span>
          <span class="text-capitalize ml-4">{{ clientData.address ? clientData.address : 'address' }}</span>
        </v-card-text>
        <staff-list
          @fetchClient="getClient"
          :loading="busy"
          :list="clientData.staff ? clientData.staff : []"
        ></staff-list>
        <location-list
          :loading="busy"
          @fetchClient="getClient"
          :list="clientData.locations ? clientData.locations : []"
        ></location-list>
      </v-card>
      <v-card v-else-if="apiStatus === 404">
        <v-card-text>
          <v-alert type="error">
            The client you're looking for cannot be found.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn to="/client-records" small>Show all clients</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import {
  defineComponent,
  useStore,
  ref,
  useRouter,
  onMounted,
} from '@nuxtjs/composition-api'
import ClientRecordsForm from '@/components/forms/ClientRecordsForm.vue'
import useClientRecords from '~/services/useClientRecords'
import StaffList from '~/components/ClientRecords/StaffList.vue'
import LocationList from '~/components/ClientRecords/LocationList.vue'
// import LocationDetails from '~/components/ClientRecords/LocationDetails.vue'
import ClientStatusChip from '~/components/ClientStatusChip.vue'

export default defineComponent({
  components: {
    ClientRecordsForm,
    StaffList,
    LocationList,
    ClientStatusChip,
  },
  middleware: 'isAuthenticated',
  setup() {
    const store = useStore()
    const busy = ref(false)
    const router = useRouter()
    const clientData = ref({})
    const { clientById } = useClientRecords()
    const apiStatus = ref(200)

    // set the page breadcrumbs
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
    ]

    const pageTitle = `Client Records`

    const getClient = () => {
      busy.value = true
      clientById(router.currentRoute.params.client_id)
        .then((resp) => {
          clientData.value = resp.data.data

          breadcrumbs.push({
            text: (clientData.value as any).last_name + ',' + ' ' + (clientData.value as any).first_name,
            to: `/client-records/${(clientData.value as any).id}`,
            disabled: true,
          },
          {
           text: (clientData.value as any).last_name + ' ' + 'Details',
            to: ``,
            disabled: true, 
          },
          )

          store.dispatch('setPageHeading', { pageTitle, breadcrumbs })
        })
        .catch((err) => {
          apiStatus.value = err.response.status
        })
        .finally(() => (busy.value = false))
    }

    onMounted(() => {
      getClient()
    })

    return {
      busy,
      clientData,
      apiStatus,
      getClient,
    }
  },
})
</script>

<style lang="scss" scoped>
.client-name {
  span {
    font-size: 12px;
    position: relative;
    left: -2px;
    top: -2px;
  }
}
</style>
