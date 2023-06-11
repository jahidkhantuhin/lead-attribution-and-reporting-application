<template>
  <v-dialog
    v-model="open"
    transition="dialog-top-transition"
    width="360"
    :persistent="busy"
  >
    <v-card>
      <v-toolbar flat dense>
        <h3>{{ $t('warning.sure') }}</h3>
      </v-toolbar>
      <v-card-text class="py-4">{{ $t('warning.logOut') }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="busy"
          :loading="busy"
          color="warning"
          text
          @click="logOut()"
        >
          {{ $t('buttons.logOut') }}
        </v-btn>
        <v-btn :disabled="busy" color="primary" @click="open = false">
          {{ $t('buttons.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, useRouter } from '@nuxtjs/composition-api'
import swalMixin, { showToast } from '~/utils/swalMixin'
export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, { emit, root, parent }) {
    const $swal = swalMixin((parent as any).$swal as any)
    const router = useRouter()

    const open = computed({
      get: () => props.show,
      set: (val) => emit('update:show', val),
    })

    const busy = ref<boolean>(false)

    const logOut = async () => {
      busy.value = true
      await root.$auth.logout()
      showToast($swal, {
        title: root.$t(`alert.success.logout`) as String,
      })
      open.value = !open.value
      busy.value = false
      router.push("/login");
    }
    return {
      open,
      logOut,
      busy,
    }
  },
})
</script>
