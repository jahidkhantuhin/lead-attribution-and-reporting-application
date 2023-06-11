<template>
  <v-navigation-drawer
    v-model="syncShow"
    persistent
    absolute
    :width="`100%`"
    clipped
  >
    <v-card flat>
      <v-toolbar color="warning" rounded="0">
        <v-toolbar-title>{{ $t(`message.pwResetTitle`) }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="syncShow = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        {{ $t(`message.pwRecoverFormTitle`) }}
      </v-card-text>

      <v-card-text>
        <v-form ref="pwResetForm" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            type="email"
            :label="$t(`fields.email`)"
            name="email"
            :rules="emailRules"
            @keypress.enter="submit"
          ></v-text-field>

          <v-btn
            class="mt-3"
            :loading="busy"
            color="warning"
            block
            :disabled="!valid || busy"
            @click="submit"
          >
            <v-icon left>mdi-send</v-icon>
            {{ $t(`buttons.submit`) }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  watch,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'

import useAxios from '@/plugins/useAxios'
import swalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, { emit, root, refs, parent }) {
    const { show } = props
    const $axios = useAxios()
    const $swal = swalMixin((parent as any).$swal as any)

    const syncShow = computed({
      get: () => props.show,
      set: (v) => emit('update:show', v),
    })

    const busy = ref<boolean>(false)
    const email = ref<string>('')
    const valid = ref<boolean>(false)

    // email validation rules
    const emailRules = [
      // @TODO: when migrating to vue 3, this needs to be changed to
      // an equivalent method since context.root will be deprecated
      (v: string) => !!v || root.$t(`alert.error.validation.email`),
      (v: string) =>
        /.+@.+\..+/.test(v) || root.$t(`alert.error.validation.email`),
    ]

    const reset = () => {
      email.value = ''
      busy.value = false
      valid.value = false
      ;(refs.pwResetForm as any).resetValidation()
    }

    // reset the errors and the form upon the disalog being closed
    watch(syncShow, (_oldVal, newVal) => {
      if (!newVal) {
        reset()
      }
    })

    const submit = async (event: Event) => {
      event.preventDefault()
      if (valid.value) {
        await requestReset()
      }
    }

    const requestReset = async () => {
      busy.value = true
      await $axios.get('/sanctum/csrf-cookie', {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
      })
      $axios
        .post(
          '/password-reset',
          {
            email: email.value,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          reset()
          syncShow.value = false
          busy.value = false
          showToast($swal, {
            title: root.$t(`alert.success.pwResetEmail`) as String,
          })
        })
        .finally(() => {
          busy.value = false
        })
    }
    return {
      syncShow,
      email,
      valid,
      emailRules,
      busy,
      submit,
    }
  },
})
</script>
