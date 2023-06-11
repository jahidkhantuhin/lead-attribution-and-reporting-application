<template>
  <div v-if="response">
    <!-- <pre>{{ JSON.stringify(summary_transformed, null, 2) }}</pre> -->

    <div
      :key="index"
      class=""
      v-for="(year, index) in Object.keys(summary_transformed)"
    >
      <h1 class="heading">{{ year }}</h1>
      <KPITable mode="month" :rows="summary_transformed[year]"></KPITable>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import KPITable from '~/components/KPI/table.vue'
import { callColors } from '~/shared/callColors'
import { transformMonthlyReportIntoObject } from '~/utils/reports-upload/kpi'

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
    const summary_transformed = computed(() => {
      return transformMonthlyReportIntoObject(props.response.summary)
    })
    return {
      summary_transformed,
    }
  },
})
</script>

<style scoped>
.heading {
  font-size: 30px;
  margin: 50px 0;
}
</style>
