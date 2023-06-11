<template>
  <v-card elevation="0">
    <v-card-title>
      SITES
      <v-spacer></v-spacer>
    </v-card-title>
  <v-card-text>
      <v-simple-table>
        <template #default>
          <tbody>
            <tr>
              <td><strong>Actions</strong></td>
              <td><strong>Services</strong></td>
              <td><strong>Status</strong></td>
              <td><strong>Reporting email</strong></td>
              <td><strong>Phone#'s</strong></td>
              <td><strong>Last Updated</strong></td>
            </tr>
            <tr>
              <td> </td>
              <td> </td>
              <td > {{ locationData.status ? 'Active' : 'Inactive' }} </td>
              <td> {{ locationData.reporting_mail }}  </td>
              <td> {{ locationData && locationData.client ?  locationData.client.phone_number : '' }}  </td>
              <td> 
                <formatted-date :date="locationData.updated_at"> 
                  {{ locationData.updated_at }} 
                </formatted-date> 
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useRoute,
} from '@nuxtjs/composition-api'
import FormattedDate from '~/components/FormattedDate.vue'

export default defineComponent({
  components: {
    FormattedDate,
  },
  props: {
    locationData: {
      type: Object,
        default() {
            return {}
        }
    },
    },
  setup() {
    const busy = ref(false)
    const route = useRoute()


    return {
      busy,
    }
  },
})
</script>
