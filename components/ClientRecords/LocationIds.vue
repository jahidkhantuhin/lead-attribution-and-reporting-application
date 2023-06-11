<template>
  <v-card elevation="0">
    <v-card-title>
      IDs
      <v-spacer></v-spacer>
    </v-card-title>
  <v-card-text>
      <v-simple-table>
        <template #default>
          <tbody>
            <tr>
              <td><strong>Actions</strong></td>
              <td><strong>Adwords</strong></td>
              <td><strong>Facebook</strong></td>
              <td><strong>Marchex</strong></td>
              <td><strong>LH2</strong></td>
              <td><strong>Apexchat</strong></td>
              <td><strong>Hubspot</strong></td>

            </tr>
            <tr>
              <td> </td>
              <td > {{ locationData.adwords_id }} </td>
              <td > {{ locationData.facebook_id }} </td>
              <td> {{ locationData.account_id }}  </td>
              <td> {{ locationData.lh2_api_key }}  </td>
              <td> {{ locationData.apexchat_id }} </td>
              <td> {{ locationData.hubspot_id }} </td>
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
