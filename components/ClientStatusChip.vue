<template>
  <span>
    <v-chip
      v-if="chip.text && chip.color && chip.textColor"
      :color="chip.color"
      :text-color="chip.textColor"
    >
      <span class="text-capitalize">{{ chip.text }}</span>
    </v-chip>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    client: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const chip = computed(() => {
      if (props.client?.status?.key == 121) {
        return {
          textColor: 'white',
          color: 'blue',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 122) {
        return {
          textColor: 'white',
          color: 'green',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 128) {
        return {
          textColor: 'white',
          color: 'red',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 200) {
        return {
          textColor: 'white',
          color: 'orange',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 201) {
        return {
          textColor: 'white',
          color: 'orange',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 320) {
        return {
          textColor: 'white',
          color: 'red',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 321) {
        return {
          textColor: 'white',
          color: 'red',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 322) {
        return {
          textColor: 'white',
          color: 'red',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 323) {
        return {
          textColor: 'white',
          color: 'yellow',
          text: props.client?.status?.value,
        }
      }
      if (props.client?.status?.key == 'paying_client') {
        return {
          textColor: 'white',
          color: 'green',
          text: props.client?.status?.value,
        }
      }
      return {}
    })
    return { chip }
  },
})
</script>
