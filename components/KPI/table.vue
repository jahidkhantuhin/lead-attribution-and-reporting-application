<template>
  <div>
    <!-- Report Table -->
    <v-data-table
      :headers="tableHeaders"
      :items="rows"
      :items-per-page="100"
      :fixed-header="true"
      :footer-props="{
        itemsPerPageOptions: [100, 200, 500, -1],
        itemsPerPage: -1,
      }"
      :sort-by="['date_start']"
      :sort-desc="[true]"
      :disable-pagination="true"
      :disable-filtering="true"
      hide-default-footer
      class="v-table-compact kpi-table"
    >
      <template #item.date="{ item }">
        <span>
          <formatted-date
            formatString="ddd, MMM DD, YYYY"
            :date="item.date"
          ></formatted-date>
        </span>
      </template>
      <template #item.adwords_clicks="{ item }">
        <span data-color-span class="red lighten-5">{{
          item.adwords_clicks
        }}</span>
      </template>
      <template #item.fb_clicks="{ item }">
        <span data-color-span class="blue lighten-5">{{ item.fb_clicks }}</span>
      </template>
      <template #item.fb_conversions="{ item }">
        <span data-color-span class="blue lighten-5">
          <abbr :title="item.fb_conversions">{{ item.fb_conversions }}</abbr>
        </span>
      </template>
      <template #item.conversion_percentage="{ item }">
        <span>
          <abbr :title="item.conversion_percentage">{{
            item.conversion_percentage
          }}</abbr>
        </span>
      </template>
      <template #item.fb_impressions="{ item }">
        <span data-color-span class="blue lighten-5">{{
          item.fb_impressions
        }}</span>
      </template>
      <template #item.adwords_impressions="{ item }">
        <span data-color-span class="red lighten-5">{{
          item.adwords_impressions
        }}</span>
      </template>
      <template #item.adwords_avg_cost="{ item }">
        <span> ${{ new Number(item.adwords_avg_cost).toFixed(2) }} </span>
      </template>
      <template #item.total_conversions="{ item }">
        <span>
          <abbr :title="item.total_conversions">{{
            new Number(item.total_conversions).toFixed(2)
          }}</abbr>
        </span>
      </template>
      <template #item.total_cost="{ item }">
        <span>
          <abbr :title="`$${item.total_cost}`"
            >${{ new Number(item.total_cost).toFixed(2) }}</abbr
          >
        </span>
      </template>
      <template #item.adwords_avg_cpc="{ item }">
        <span> ${{ new Number(item.adwords_avg_cpc).toFixed(2) }} </span>
      </template>
      <template #item.total_cpl="{ item }">
        <span>
          <abbr :title="`$${item.total_cpl}`"
            >${{ new Number(item.total_cpl).toFixed(2) }}</abbr
          >
        </span>
      </template>
      <template #item.adwords_cpl="{ item }">
        <span data-color-span class="red lighten-5">
          <abbr :title="`$${item.adwords_cpl}`"
            >${{ new Number(item.adwords_cpl).toFixed(2) }}</abbr
          >
        </span>
      </template>
      <template #item.fb_cpl="{ item }">
        <span data-color-span class="blue lighten-5">
          <abbr :title="`$${item.fb_cpl}`"
            >${{ new Number(item.fb_cpl).toFixed(2) }}</abbr
          >
        </span>
      </template>
      <template #item.adwords_cost="{ item }">
        <span data-color-span class="red lighten-5">
          <abbr :title="`$${item.adwords_cost}`"
            >${{ new Number(item.adwords_cost).toFixed(2) }}
          </abbr>
        </span>
      </template>
      <template #item.total_adwords_cpc="{ item }">
        <span data-color-span class="red lighten-5">
          <abbr :title="`$${item.total_adwords_cpc}`"
            >${{ item.total_adwords_cpc ? new Number(item.total_adwords_cpc).toFixed(2) : 0 }}
          </abbr>
        </span>
      </template>
      <template #item.adwords_conversions="{ item }">
        <span data-color-span class="red lighten-5">
          <abbr :title="item.adwords_conversions">
            {{ item.adwords_conversions }}
          </abbr>
        </span>
      </template>
      <template #item.fb_avg_cost="{ item }">
        <span data-color-span class="blue lighten-5">
          <abbr :title="`$${item.fb_avg_cost}`">
            ${{ new Number(item.fb_avg_cost).toFixed(2) }}
          </abbr>
        </span>
      </template>
      <template #item.fb_avg_cpc="{ item }">
        <span data-color-span class="blue lighten-5">
          <abbr :title="`$${item.fb_avg_cpc}`">
            ${{ new Number(item.fb_avg_cpc).toFixed(2) }}
          </abbr>
        </span>
      </template>
      <template #item.fb_cost="{ item }">
        <span data-color-span class="blue lighten-5">
          <abbr :title="`$${item.fb_cost}`">
            ${{ new Number(item.fb_cost).toFixed(2) }}
          </abbr>
        </span>
      </template>
      <template #item.total_booked="{ item }">
        <span :style="`color: ${item.colors.booked_color}`">
          {{ item.total_booked }}
        </span>
      </template>

      <template #item.total_irrelevant="{ item }">
        <span :style="`color: ${item.colors.irrelevant_color}`">
          {{ item.total_irrelevant }}
        </span>
      </template>
      <template #item.total_missed="{ item }">
        <span :style="`color: ${item.colors.missed_color}`">
          {{ item.total_missed }}
        </span>
      </template>
      <template #item.total_not_booked="{ item }">
        <span :style="`color: ${item.colors.not_booked_color}`">
          {{ item.total_not_booked }}
        </span>
      </template>
      <template #item.total_voice_mail_booking="{ item }">
        <span :style="`color: ${item.colors.voice_mail_booking}`">
          {{ item.total_voice_mail_booking }}
        </span>
      </template>
    </v-data-table>
    <!-- Report Table -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import FormattedDate from '~/components/FormattedDate.vue'
import { KPIColumnSections } from '~/utils/reports-upload/kpi'

export default defineComponent({
  components: {
    FormattedDate,
  },
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    mode: {
      required: true,
      type: String,
      default: '',
    },
  },
  setup(props) {
    let dateColumn = computed(() => {
      if (props.mode === 'day') {
        return KPIColumnSections.dates.dailyColumn
      } else {
        return KPIColumnSections.dates.monthColumn
      }
    })

    let tableHeaders = computed(() => {
      return [
        dateColumn.value,
        ...KPIColumnSections.leads,
        ...KPIColumnSections.adwords,
        ...KPIColumnSections.fb,
        ...KPIColumnSections.score,
      ]
    })

    return {
      tableHeaders,
    }
  },
})
</script>
<style lang="scss">
// @todo Wait for Vuetify table fixed column feature. Remove this code when that's done. so we can use configuration.
.kpi-table {
  table > tbody > tr {
    &:hover {
      span,
      td {
        background: white !important;
      }
    }
  }

  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 4;
    background: white;
  }
  table > thead > tr > th:nth-child(1) {
    z-index: 5;
  }
}
.theme--dark{
.kpi-table {
  table > tbody > tr {
    &:hover {
      span,
      td {
        background: rgb(138, 134, 134) !important;
      }
    }
  }

  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 4;
    background: rgb(29, 28, 28);
  }
}
}
</style>
