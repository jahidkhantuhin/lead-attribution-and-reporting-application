<template>
  <span>
    {{ link }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    lead: {
      type: Object,
    },
  },
  setup(props) {
    const link = computed(() => {
      return props.lead
    })
    return {
      link,
    }
  },
})
</script>
