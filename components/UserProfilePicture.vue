<template>
  <span >
    <!-- <v-avatar :height="height" :width="width" size="" max-width=""> -->
    <img
      :src="src"
      :style="{
        height: `${height}px`,
        width: `${width}px`,
        borderRadius: `${radius}`
      }"
      alt="Profile Photo"
    />
    <!-- </v-avatar> -->
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    width: {
      default: 32,
      type: [String, Number],
    },
    height: {
      default: 32,
      type: [String, Number],
    },
    radius: {
      default: "",
      type: String,
    },
    src: {
      default: '',
      type: String
    }
  },
})
</script>