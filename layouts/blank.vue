<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
    <!-- Version number -->
    <Version />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Version from '@/components/parts/Version.vue'

export default defineComponent({
  components: { Version },
  setup() {
    return {}
  },
})
</script>
