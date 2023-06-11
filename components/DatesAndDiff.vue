<template>
  <span>
    <template v-if="datesValid || diff === 1">
      Date: <formatted-date :timezone="false" :date="start" formatString="MMM DD YYYY" ></formatted-date> - <formatted-date :timezone="false" :date="end" formatString="MMM DD YYYY" ></formatted-date> ({{ diff }} day{{ diff > 1 ? `s` : '' }})
    </template>
    <!-- <template v-else> The start date must be after the end date. </template> -->
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import moment from 'moment'
import FormattedDate from "~/components/FormattedDate.vue"

export default defineComponent({
  components: {
    FormattedDate
  },
  props: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const datesValid = computed(() => moment(props.start).isBefore(props.end))
    const diff = computed(
      () => {
        if (props.start === props.end) {
          return 1
        }
        return datesValid.value && moment(props.end).diff(props.start, 'days') + 1
      }
    )
    return {
      datesValid,
      diff,
    }
  },
})
</script>
