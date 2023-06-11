<template>
  <v-row class="my-6" justify="center">
    <v-col cols="12" lg="4" md="6">
      <staff-form
        @onFetchClient="onFetchClient"
        @cancel="handleCancel"
      ></staff-form>
    </v-col>
  </v-row>
</template>

<script>
import {
  defineComponent,
  onMounted,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import StaffForm from '~/components/forms/StaffForm.vue'

export default defineComponent({
  components: {
    StaffForm,
  },
  middleware: 'isAuthenticated',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const id = route.value.params.staff_id
    const clientId = route.value.params.client_id

    const handleCancel = () => {
      router.push(`/client-records/${clientId}`)
    }

    const onFetchClient = (client) => {
      const pageTitle = 'Add Staff'
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
        {
          text: client.name,
          to: `/client-records/${clientId}`,
          disabled: false,
        },
        {
          text: 'Add Staff',
          to: `/client-records/${clientId}/staff/add`,
          disabled: true,
        },
      ]

      store.dispatch('setPageHeading', {
        pageTitle,
        breadcrumbs,
      })
    }

    return {
      handleCancel,
      onFetchClient,
    }
  },
})
</script>
