<template>
  <div>redirecting...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  middleware: 'isAuthenticated',
  setup() {
    const router = useRouter()

    onMounted(() => {
      router.push({
        path: '/reports/statistics',
        query: router.currentRoute.query,
      })
    })
  },
})
</script>
