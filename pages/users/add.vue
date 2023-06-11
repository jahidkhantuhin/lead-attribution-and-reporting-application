<template>
  <restricted-component permission="create user">
    <v-row class="my-6" justify="center">
      <v-col cols="12" lg="4" md="6">
        <v-card>
          <v-card-title> Create a user </v-card-title>
          <user-form
            @cancel="$router.push('/users/')"
            scope="admin"
            @done="onCreate"
          ></user-form>
        </v-card>
      </v-col>
    </v-row>
  </restricted-component>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { IBreadcrumbs } from '@/store'

import useUsers from '@/services/useUsers'
import UserForm from '~/components/forms/UserForm.vue'
import RestrictedComponent from '~/components/RestrictedComponent.vue'

export default defineComponent({
  components: {
    UserForm,
    RestrictedComponent,
  },
  middleware: 'isAuthenticated',
  setup() {
    const store = useStore()
    const router = useRouter()
    const usersApi = useUsers()
    const busy = ref(false)

    // set the page breadcrumbs
    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: `Dashboard`,
        to: `/`,
      },
      {
        text: `Users`,
        to: `/users`,
      },
      {
        text: `Add`,
        to: '/users/add',
      },
    ]

    const pageTitle = `Add a User`

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    const onCreate = () => {
      router.replace('/users')
    }

    return {
      busy,
      onCreate,
    }
  },
  head: {
    title: 'Add a User',
  },
})
</script>
