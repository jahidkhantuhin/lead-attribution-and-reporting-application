<template>
  <v-alert prominent type="success">
    <v-row align="center">
      <v-col class="grow"> Report generated successfully. </v-col>
    </v-row>
  </v-alert>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    scorer: String,
    date: String,
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return {}
  },
})
</script>
