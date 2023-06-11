<template>
  <span>
    {{ formattedDate }}
  </span>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import defaultTimezone from '~/utils/defaultTimezone'

export default defineComponent({
  props: {
    date: [String, Number],
    timezone: {
      type: [String, Boolean],
      default: defaultTimezone,
    },
    formatString: {
      type: String,
      // default: 'dddd, MMMM DD, YYYY @ hh:mm:ss A z',
      // default: 'dddd, MMMM DD, YYYY',
      // default: 'MMMM DD, YYYY',
      default: 'MMM DD, YYYY',
    },
  },
  setup(props) {
    const formattedDate = computed(() => {
      /*
        https://www.wrike.com/open.htm?id=701233522

        Since we are using EST formatting on backend so me(Ilyas) and Francis removed the timezone conversion on frontend.

        // if (props.timezone === false) {
        // }
        // return momentTZ(props.date).tz('EST').format(props.formatString)
      */

      return momentTZ(props.date).format('ddd')
    })

    return {
      formattedDate,
    }
  },
})
</script>
