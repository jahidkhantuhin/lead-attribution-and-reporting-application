<template>
  <div class="payment-report-detail">
    <v-card-title> Showing reports for {{ scorer }} </v-card-title>
    <v-card-text>
      <v-data-table
        id="table"
        :headers="headers"
        :items="report"
        :items-per-page="5"
        :disable-pagination="true"
        :disable-filtering="true"
        :no-data-text="`No Reports found for ${scorer}`"
        :hide-default-footer="true"
        :disable-sort="true"
        class="elevation-1 mb-3"
      ></v-data-table>
    </v-card-text>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import { PaymentReportColumns } from '~/utils/reports-upload/payment-report'
import secondsToHHMMSS from './../utils/secondsToHHMMSS'

export default defineComponent({
  props: {
    scorer: [String, Number],
    report: Array,
    payRate: [Number, String],
  },
  setup(props) {
    return {
      headers: PaymentReportColumns(),
      secondsToHHMMSS,
    }
  },
})
</script>

<style lang="scss">
.payment-report-detail {
  margin-top: -10px;
  .v-data-footer {
    display: none;
  }
  table {
    tbody {
      tr {
        &:last-child {
          td {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
