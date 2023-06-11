<template>
  <div>
    <KPITable mode="day" :rows="summary_transformed"></KPITable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { sortBy } from 'lodash'
import moment from 'moment'
import KPITable from '~/components/KPI/table.vue'
import { callColors } from '~/shared/callColors'
export default defineComponent({
  components: {
    KPITable,
  },
  props: {
    response: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    let summary_transformed = computed(() => {
      return (
        props.response &&
        sortBy(
          props.response.summary.map((c: any) => {
            return {
              colors: callColors,
              timestamp: moment(c.date).endOf('day').valueOf(),
              ...c,
            }
          })
        ).reverse()
      )
    })
    return {
      summary_transformed,
    }
  },
})
</script>
