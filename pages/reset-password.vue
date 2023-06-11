<template>
  <v-container id="pwResetPage" fluid class="fill-height">
    <v-row no-gutters justify="center">
      <v-col lg="3" md="12">
        <v-expand-transition>
          <v-card v-show="showForm" elevation="10" :loading="busy">
            <v-card-title>{{ $t('message.pwResetTitle') }}</v-card-title>
            <v-card-subtitle>
              {{ $t('message.pwRecoveryInstruction') }}
            </v-card-subtitle>

            <v-card-text>
              <v-form v-model="formValid" @submit.prevent="formValid && submit">
                <v-text-field
                  v-model="email"
                  type="email"
                  :label="$t('fields.email')"
                  readonly
                  name="email"
                  disabled
                  @keypress.enter="submit"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  :disabled="busy"
                  :label="$t('fields.password')"
                  type="password"
                  name="password"
                  @keypress.enter="submit"
                ></v-text-field>
                <v-text-field
                  v-model="passwordConfirmation"
                  :rules="pwConfirmationRules"
                  :disabled="busy"
                  :label="$t('fields.passwordConfirmation')"
                  name="passwordConfirmation"
                  type="password"
                  @keypress.enter="submit"
                ></v-text-field>

                <v-btn
                  block
                  color="warning"
                  :disabled="!formValid || busy"
                  class="mt-4"
                  @click="submit"
                >
                  {{ $t('buttons.resetPW') }}
                </v-btn>
                <v-btn
                  plain
                  text
                  x-small
                  nuxt
                  to="/login"
                  class="mt-4"
                  :disabled="busy"
                >
                  &larr; Log In
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  useRouter,
  useRoute,
  computed,
  useStore,
} from '@nuxtjs/composition-api'
import useAxios from '~/plugins/useAxios'
import swalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  layout: 'blank',
  setup(_props, { root, parent }) {
    const router = useRouter()
    const $axios = useAxios()
    const store = useStore()

    const route = useRoute()

    const email = computed(() =>
      ((route.value.query.email || '') as string).replaceAll(' ', '+')
    )

    const token = computed(() => route.value.query.token)

    // busy
    const busy = ref<boolean>(false)

    // form
    const formValid = ref<boolean>(false)

    // password validation
    const passwordRules = [
      (v: string) =>
        (v && v.length >= 8) ||
        root.$t('alert.error.validation.passwordTooShort', { minLength: 8 }),
      (v: string) =>
        (v && (v.match(/[a-z]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `small letter`,
        }),
      (v: string) =>
        (v && (v.match(/[A-Z]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `capital letter`,
        }),
      (v: string) =>
        (v && (v.match(/[0-9]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `number`,
        }),
      (v: string) =>
        (v && (v.match(/[$@#&^!]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `of the following special characters: $@#&^!`,
        }),
    ]

    const pwConfirmationRules = [
      ...passwordRules,
      (v: string) =>
        (v && v === password.value) ||
        root.$t('alert.error.validation.passwordMatch'),
    ]

    const password = ref<string>('')
    const passwordConfirmation = ref<string>('')

    // this handles the form appearance animation
    const showForm = ref(false)

    const $swal = swalMixin((parent as any).$swal as any)

    const submit = (event: Event) => {
      event.preventDefault()
      if (!formValid.value) return false

      busy.value = true

      $axios
        .post(
          `reset`,
          {
            email: email.value,
            token: token.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
          },
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${(store.state as any).cred.cred}`
            }
          }
        )
        .then(() => {
          router.push('/')
          showToast($swal, {
            title: root.$t('alert.success.pwResetDone') as String,
          })
        })
        .finally(() => {
          busy.value = false
        })
    }

    onBeforeMount(() => {})

    onMounted(async () => {
      setTimeout(() => {
        showForm.value = true
      }, 500)
      await $axios.get('/sanctum/csrf-cookie', {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
    })

    return {
      showForm,
      email,
      busy,
      formValid,
      passwordRules,
      password,
      passwordConfirmation,
      pwConfirmationRules,
      submit,
    }
  },
  head: {
    title: `Password Recovery`,
  },
})
</script>
<style lang="scss" scoped>
#pwResetPage {
  background: url('https://source.unsplash.com/collection/58951836/1920x1080');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: background-image 0.2s ease-in-out;
  height: 100vh;
}
</style>
