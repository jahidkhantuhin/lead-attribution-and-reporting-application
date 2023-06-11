<template>
  <v-container id="loginPage" fluid class="fill-height">
    <v-row no-gutters>
      <v-col lg="3" xl="2" md="12" offset-lg="1">
        <v-expand-transition>
          <v-card class="text-center" v-if="fetchingUser">
            <v-card-text>
              <v-progress-circular :size="50" color="primary" indeterminate>
              </v-progress-circular>
            </v-card-text>
            <v-card-text class="text-center">Checking User info</v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card v-show="showForm" elevation="10">
            <v-card-title>{{ $t('welcome') }}</v-card-title>
            <v-card-subtitle>{{
              $t('message.loginFormTitle')
            }}</v-card-subtitle>

            <v-card-text>
              <LoginForm />
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  defineComponent,
  onBeforeMount,
  ref,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'

import LoginForm from '@/components/LoginForm.vue'
import { useContext } from '@nuxtjs/composition-api'
import useAxios from '~/plugins/useAxios'

export default defineComponent({
  components: { LoginForm },
  middleware: 'redirectToHomeIfAlreadyLoggedIn',
  auth: 'guest',
  layout: 'blank',
  setup(_props, { root, parent }) {
    const { $auth } = useContext()
    const $axios = useAxios()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const showForm = ref(false)

    const fetchingUser = ref(true)

    onBeforeMount(async () => {
      await $axios
        .get('/sanctum/csrf-cookie', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
        .then(() => {
          $auth
            .setUserToken(true)
            .then((resp) => {
              console.log(resp)
              if (resp) {
                router.push(route.value.query.redirect || '/')
              }
            })
            .finally(() => {
              fetchingUser.value = false
              showForm.value = true
            })
        })
    })

    return {
      showForm,
      fetchingUser,
    }
  },
  head: {
    title: `Login`,
  },
})
</script>
<style lang="scss" scoped>
#loginPage {
  background: url('https://source.unsplash.com/collection/58951836/1920x1080');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: background-image 0.2s ease-in-out;
  height: 100vh;
}
</style>
