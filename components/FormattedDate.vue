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
import { Shortened_Date } from '~/utils/dateFormat'

export default defineComponent({
  props: {
    date: [String, Number],
    timezone: {
      type: [String, Boolean],
      default: defaultTimezone,
    },
    formatString: {
      type: String,
      default: Shortened_Date,
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

      return momentTZ(props.date).format(props.formatString) + '(EST)'
    })

    return {
      formattedDate,
    }
  },
})
</script>
