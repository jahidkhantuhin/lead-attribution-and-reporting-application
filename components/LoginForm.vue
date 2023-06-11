<template>
  <v-form ref="loginForm" v-model="formValid" @submit="formValid && logIn()">
    <v-text-field
      v-model="email"
      type="email"
      label="E-mail"
      name="email"
      :rules="emailRules"
      @blur="clearErrorsOnEmptyForm"
      @keypress.enter="formValid && logIn()"
    ></v-text-field>
    <v-text-field
      v-model="password"
      type="password"
      name="password"
      label="Password"
      :rules="passwordRules"
      @blur="clearErrorsOnEmptyForm"
      @keypress.enter="formValid && logIn()"
    ></v-text-field>
    <v-btn
      color="primary"
      class="mt-2"
      :disabled="!formValid || formBusy"
      block
      :loading="formBusy"
      @click="logIn()"
    >
      <v-icon left>mdi-login</v-icon> {{ $t('buttons.logIn') }}
    </v-btn>
    <v-btn
      color="error"
      class="mt-2"
      block
      :loading="formBusy"
      @click="logInWithGoogle()"
    >
      <v-icon color="secondary" left>mdi-google</v-icon> LOG IN WITH GOOGLE
    </v-btn>
    
    <v-btn
      block
      plain
      text
      color="default"
      x-small
      class="mt-2"
      :disabled="formBusy"
      @click="showPWReset = !showPWReset"
    >
      {{ $t('buttons.forgotPW') }}
    </v-btn>
    <PasswordResetModal :show.sync="showPWReset" />
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref, useRoute, useRouter, SetupContext, useStore } from '@nuxtjs/composition-api'
import PasswordResetModal from '@/components/PasswordResetModal.vue'
import SwalMixin, { showToast } from '~/utils/swalMixin'
import useAxios from '~/plugins/useAxios'


export default defineComponent({
  components: { PasswordResetModal },
  setup(_props: any, context: SetupContext) {
    // toast msgs
    const $swal = SwalMixin((context.parent as any).$swal as any)

    const inputValue = ref()

    // const onChange = () => {
    //   context.emit('change', inputValue.value)
    // }

    const { $axios } = context.root
    const router = useRouter()
    const route = useRoute()

    // PW reset modal
    const showPWReset = ref(false)

    // we'll use this to i18n text
    // useContext() doesn't work here for some reason
    const translate = (text: string, params?: any): string =>
      (context.root as any).$t(text, params)

    // form validation model to control UI actions
    const formValid = ref(false)

    const formBusy = ref<boolean>(false)

    // creds
    const email = ref<string>('')
    const password = ref<string>('')

    // email validation rules
    const emailRules = [
      // @TODO: when migrating to vue 3, this needs to be changed to
      // an equivalent method since context.root will be deprecated
      (v: string) => !!v || translate(`alert.error.validation.email`),
      (v: string) =>
        /.+@.+\..+/.test(v) || translate(`alert.error.validation.email`),
    ]

    // password validation
    const passwordRules = [
      (v: string) =>
        !!v || translate('alert.error.validation.passwordMissingCurrent'),
      (v: string) =>
        (v && v.length >= 8) ||
        translate('alert.error.validation.passwordTooShort', { minLength: 8 }),
    ]

    // clears the validation errors if the form is empty
    const clearErrorsOnEmptyForm = () => {
      if (!email.value && !password.value)
        (context.refs.loginForm as any).resetValidation()
    }

    const logIn = () => {
      if (email.value && password.value && formValid) {
        const data = {
          email: email.value,
          password: password.value,
        }

        formBusy.value = true
        ;(context.root as any).$auth
          .loginWith(`laravelSanctum`, {
            data,
          })
          .then((response: any) => {
            showToast($swal, {
              title: translate(`alert.success.login`),
            })
            router.push((route.value.query as any).redirect || '/')
          })
          .finally(() => {
            formBusy.value = false
          })
      }
    }

    const axios = useAxios()
    const store = useStore()


    const logInWithGoogle = (provider: any) => {
        formBusy.value = true;
        (context.root as any).$auth
          .loginWith(`google`, { params: { prompt: "select_account" } })
          .then((response: any) => {
            // context.emit('clicked', response)
            
            console.log('GOOGLE', response)
            // showToast($swal, {
            //   title: translate(`alert.success.login`),
            // })
            router.push('/login')
          })
          .finally(() => {
            formBusy.value = false
          })
        // window.location.href = `${process.env.baseUrl}/social-redirect`

              // ;(root as any).$auth.authenticate(provider).then((response: any) =>{
              //   // router.push('/social-login')
              //   SocialLogin(provider,response)

              //   }).catch((err: any) => {
              //       console.log({err:err})
              //   })

            }

    const SocialLogin = (provider: any, response: any) => {
            console.log(response)
        axios.get(`/social-login?code=${response.code}`).then((response: any) => {


        }).catch((err: any) => {
            console.log({err:err})
        })
    }

    return {
      formValid,
      formBusy,
      email,
      password,
      emailRules,
      passwordRules,
      clearErrorsOnEmptyForm,
      logIn,
      logInWithGoogle,
      showPWReset,
      SocialLogin,
      // onChange,
      inputValue,

    }
  },
})
</script>
