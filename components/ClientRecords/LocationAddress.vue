<template>
  <v-card elevation="0">
    <v-card-title>
      ADDRESS
      <v-spacer></v-spacer>
    </v-card-title>
  <v-card-text>
      <v-simple-table>
        <template #default>
          <tbody>
            <tr>
              <td><strong>Actions</strong></td>
              <td><strong>City</strong></td>
              <td><strong>State</strong></td>
              <td><strong>Zip</strong></td>
              <td><strong>Street</strong></td>
              <td><strong>Last Updated</strong></td>
            </tr>
            <tr>
              <td> </td>
              <td> {{ locationData.city }} </td>
              <td> {{ locationData.state }} </td>
              <td> {{ locationData.zipcode }} </td>
              <td> {{ locationData.address }} </td>
              <td> <formatted-date :date="locationData.updated_at"> {{ locationData.updated_at }} </formatted-date> </td>
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
      default: {},
    },
  },
  setup(props, { parent, emit }) {
    const busy = ref(false)
    const route = useRoute()

    return {
      busy,
    }
  },
})
</script>