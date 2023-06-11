<template>
  <div>
    <v-data-table
      class="elevation-1 data-table"
      :headers="facebookHeader"
      :footer-props="{
        itemsPerPageOptions: [100, 200, 500, -1],
        itemsPerPage: 100,
      }"
      :no-data-text="`No Facebook Leads`"
      :items="items"
      :disable-pagination="false"
      :disable-filtering="true"
      :items-per-page="20"
      :fixed-header="true"
      height="700px"
    >
      <template v-slot:item.lead.phone_number="props">
        <span> {{ props.item.lead.phone_number | usPhone }}</span>
      </template>
      <template v-slot:item.date="props">
        <formatted-date :date="props.item.date"></formatted-date>
      </template>
      <template v-slot:item.phone_number="props">
        <span v-if="props.item && props.item.lead">
          {{ props.item.lead.phone_number | usPhone }}
        </span>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { ldr_FB_FormsColumns } from '~/utils/reports-upload/ldr/columns'

import FormattedDate from '~/components/FormattedDate.vue'
import TruncateText from '~/components/TruncateText.vue'

export default defineComponent({
  components: {
    FormattedDate,
    TruncateText,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup() {
    return {
      facebookHeader: ldr_FB_FormsColumns(),
    }
  },
})
</script>
