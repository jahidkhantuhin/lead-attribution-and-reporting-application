<template>
  <div id="version" class="px-2 dont-print">
    <small>v{{ ver }}</small>
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'
import { useStore } from '~/node_modules/@nuxtjs/composition-api/lib/entrypoint'

export default defineComponent({
  setup() {
    const store = useStore()
    // control the app's version here
    const ver = computed(() => store.state.appVersion)
    return {
      ver,
    }
  },
})
</script>
