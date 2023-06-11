<template>
  <div>
    <div  v-if="isAllowed"><slot> </slot></div>
    <div v-else>Not allowed to {{permission}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    permission: {
      type: String,
      default: '',
    },
  },
  setup(props, root) {
    const isAllowed = computed(() => {
      const scope: Array<String> = root.parent?.$auth.user?.scope as any
      return scope && scope.includes(props.permission)
    })
    return {
      isAllowed,
    }
  },
})
</script>
