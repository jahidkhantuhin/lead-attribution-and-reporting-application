<template>
  <v-card elevation="0">
    <v-card-title>
      Locations
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        small
        :to="`/client-records/${clientID}/locations/add`"
      >
        Add Location
      </v-btn>
    </v-card-title>
    <v-data-table
      loading-text="Loading locations"
      no-data-text="No locations"
      :loading="loading || busy"
      :headers="headers"
      :items="items"
    >
      <template #item.reporting_email="{ item }">
        <span>
          <reporting-email-address :location="item"></reporting-email-address>
        </span>
      </template>
      <template #item.status="{ item }">
        {{ item.status ? 'Active' : 'Inactive' }}
      </template> 
      <template #item.name="{ item }">
        <nuxt-link class="client-link" :to="`/client-records/${clientID}/locations/${item.id}`">
        <span>{{ item.name }}</span>
        </nuxt-link>
      </template>
      <template #item.website="{ item }">
        <v-btn
          target="_blank"
          :href="`${
            item.website.includes('http') ? item.website : '//' + item.website
          }`"
          elevation="0"
          small
          v-if="item.website"
          class="text-lowercase"
        >
          <!-- Open link -->
          {{ item.website }}
        </v-btn>
      </template>
      <template #item.created_at="{ item }">
        <formatted-date :date="item.created_at"></formatted-date>
      </template>
      <template #item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small v-bind="attrs" v-on="on"> Actions </v-btn>
          </template>
          <v-list>
            <v-list-item
                  title="View Location"
                  :to="`/client-records/${clientID}/locations/${item.id}`"
                >
                  <v-list-item-title>View</v-list-item-title>
                </v-list-item>
            <v-list-item
              title="Edit Location"
              :to="`/client-records/${clientID}/locations/${item.id}/edit`"
            >
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item
              title="Delete Location"
              @click="handleDeleteLocation(item.id)"
            >
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useRoute,
} from '@nuxtjs/composition-api'
import LocationForm from '@/components/forms/LocationForm.vue'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import useClientLocations from '~/services/useClientLocations'
import FormattedDate from '../FormattedDate.vue'
import LocationDetails from './LocationDetails.vue'
import ReportingEmailAddress from '~/components/ReportingEmailAddress.vue'

export default defineComponent({
  components: {
    LocationForm,
    FormattedDate,
    LocationDetails,
    ReportingEmailAddress,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { parent, emit }) {
    const busy = ref(false)
    const route = useRoute()
    const { deleteLocation } = useClientLocations()
    const $swal2 = swalMixin((parent as any).$swal as any)
    const clientID = route.value.params.client_id

    const locationDrawer = ref(false)
    const locationDrawerData = ref(null)

    const headers: Array<any> = [
      {
        text: ``,
        align: `start`,
        sortable: false,
        value: `actions`,
      },
      {
        text: `Location-name`,
        align: `start`,
        sortable: true,
        value: `name`,
      },
      {
        text: `Location-status`,
        align: `start`,
        sortable: true,
        value: `status`,
      },
      
      {
        text: `Account Manager`,
        align: `start`,
        sortable: true,
        value: `account_manager`,
      },
      {
        text: `Website`,
        align: `start`,
        sortable: true,
        value: `website`,
      },
      {
        text: `Created`,
        align: `start`,
        sortable: true,
        value: `created_at`,
      },

      
    ]

    const handleDeleteLocation = (id: any) => {
      showConfirmDialog($swal2, {
        title: 'Delete Location',
        text: 'Are you sure you want to delete this location?',
        icon: 'warning',
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          busy.value = true
          await deleteLocation(id).finally(() => {
            busy.value = false
          })
          showToast($swal2, {
            title: 'Location deleted',
            icon: 'success',
          })
          emit('fetchClient')
        }
      })
    }

    const items = computed(() => {
      return props.list
    })

    return {
      headers,
      items,
      busy,
      handleDeleteLocation,
      clientID,
      locationDrawer,
      locationDrawerData,
    }
  },
})
</script>
