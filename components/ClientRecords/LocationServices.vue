<template>
  <v-card elevation="0">
    <v-card-title>
      SERVICES
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
              <td>
                <ul style="list-style: none; margin-left: -25px">
                  <li> {{ locationData.has_apex ? 'APEX' : '' }} </li>
                  <li> {{ locationData.has_ppc ? 'PPC' : '' }} </li>
                  <li> {{ locationData.has_seo ? 'SEO' : '' }} </li>
                  <li> {{ !locationData.has_apex && !locationData.has_ppc && !locationData.has_seo ? 'No service available' : '' }} </li>
                </ul>
              </td>
              <td > {{ locationData.status ? 'Active' : 'Inactive' }} </td>
              <td> {{ locationData.reporting_mail }}  </td>
              <td> 
                <ul style="list-style: none; margin-left: -30px">
                    <li v-for="(item, index) in locationData.phone_numbers" :key="index">
                      {{ item }}
                    </li>
                  </ul>
                </td>
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
