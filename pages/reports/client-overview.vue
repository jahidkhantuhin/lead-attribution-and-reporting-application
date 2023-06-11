<template>
  <div>
    <client-overview></client-overview>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import ClientOverview from '~/components/ClientOverview.vue'

export default defineComponent({
  components: {
    ClientOverview,
  },
  // middleware: 'isAuthenticated',
  setup() {},
})
</script>
