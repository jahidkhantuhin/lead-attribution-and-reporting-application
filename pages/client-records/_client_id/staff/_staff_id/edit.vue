<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="4" md="6">
      <staff-form
        @cancel="$router.push(`/client-records/${clientId}/staff/${editId}`)"
        @onFetchClient="onFetchClient"
        :id="editId"
      ></staff-form>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, useRoute, useStore } from '@nuxtjs/composition-api'
import StaffForm from '~/components/forms/StaffForm.vue'

export default defineComponent({
  components: {
    StaffForm,
  },
  middleware: 'isAuthenticated',
  setup() {
    const route = useRoute()
    const store = useStore()

    const id = route.value.params.staff_id
    const clientId = route.value.params.client_id

    const onFetchClient = (client, staff) => {
      console.log(client, staff)

      const pageTitle = 'Edit Staff'

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
            text: client.name,
            to: `/client-records/${clientId}`,
            disabled: false,
          },
          {
            text: 'Staff',
            to: `/client-records/${clientId}`,
            disabled: true,
          },
          {
            text: staff.name,
            to: `/client-records/${clientId}/staff/${staff.id}`,
            disabled: false,
          },
          {
            text: 'Edit',
            to: `/client-records/${clientId}/staff/${id}/edit`,
            disabled: true,
          },
        ],
      })
    }

    return {
      editId: id,
      clientId,
      onFetchClient,
    }
  },
})
</script>
