<template>
  <v-card :loading="loading" v-bind="cardProps">
    <v-card-title>
      <span>{{ staffData.name }}</span>
      <v-spacer></v-spacer>
      <v-btn
        color="white"
        :to="`/client-records/${clientId}/`"
        v-if="showAllButton"
        class="mr-3"
      >
        Show all staff
      </v-btn>
      <v-btn
        color="primary"
        :to="`/client-records/${clientId}/staff/${staffData.id}/edit`"
      >
        Edit
      </v-btn>
    </v-card-title>
    <v-card-text>
      <table>
        <thead>
          <tr v-if="staffData.name">
            <th>Name</th>
            <td>
              {{ staffData.name }}
              &nbsp;
              <a @click="copy(staffData.name)">
                <v-icon style="font-size: 14px"> mdi-content-copy </v-icon>
              </a>
            </td>
          </tr>
          <tr v-if="staffData.email">
            <th>Email</th>
            <td>
              {{ staffData.email }}
              &nbsp;
              <a @click="copy(staffData.email)">
                <v-icon style="font-size: 14px"> mdi-content-copy </v-icon>
              </a>
            </td>
          </tr>
          <tr v-if="staffData.phone_number">
            <th>Phone Number</th>
            <td>
              {{ staffData.phone_number }}
              &nbsp;
              <a @click="copy(staffData.phone_number)">
                <v-icon style="font-size: 14px"> mdi-content-copy </v-icon>
              </a>
            </td>
          </tr>
          <tr v-if="staffData.designation">
            <th>Role</th>
            <td>
              {{ staffData.designation }}

              &nbsp;
              <a @click="copy(staffData.designation)">
                <v-icon style="font-size: 14px"> mdi-content-copy </v-icon>
              </a>
            </td>
          </tr>
          <tr v-if="staffData && staffData.client">
            <th>Client</th>
            <td>
              {{ staffData.client.name }}

              &nbsp;
              <a @click="copy(staffData.client.name)">
                <v-icon style="font-size: 14px"> mdi-content-copy </v-icon>
              </a>
            </td>
          </tr>
          <tr v-if="staffData.updated_at">
            <th>Last Updated</th>
            <td>
              {{ lastUpdated }}
            </td>
          </tr>
        </thead>
      </table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api'
import swalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    showAllButton: {
      type: Boolean,
      default: true,
    },
    staffData: {
      type: Object,
      default: {},
    },
    cardProps: {
      type: Object,
      default: {},
    },
  },
  setup(props, { parent }: any) {
    const $swal = swalMixin(parent.$swal)
    const route = useRoute()
    const clientId = route.value.params.client_id
    const copy = (text: string) => {
      window.navigator.clipboard.writeText(text)

      showToast($swal, {
        title: 'Copied to clipboard',
      })
    }
    return {
      copy,
      clientId,
    }
  },
})
</script>

<style lang="scss" scoped>
table {
  td,
  th {
    text-align: left;
    padding: 5px 10px;
  }
  th {
    padding-right: 20px;
  }
}
</style>
