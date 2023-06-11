<template>
  <div>
    <v-data-table
      class="elevation-1 data-table"
      :headers="formsHeader"
      :footer-props="{
        itemsPerPageOptions: [100, 200, 500, -1],
        itemsPerPage: 100,
      }"
      :no-data-text="`No Forms`"
      :items="items"
      :disable-pagination="false"
      :disable-filtering="true"
      :items-per-page="20"
      :fixed-header="true"
      height="700px"
    >
      <template v-slot:item.lead.phone="props">
        <span> {{ props.item.lead.phone | usPhone }}</span>
      </template>
      <template v-slot:item.lead.page_visited="props">
        <truncate-text
          :text="props.item.lead.page_visited"
          title="Show URL"
          :url="true"
          showText="Show URL"
          :button="true"
        ></truncate-text>
      </template>
      <template v-slot:item.leademail="props">
        <span>{{ props.item.lead.email }}</span>
      </template>
      <template v-slot:item.date="props">
        <formatted-date :date="props.item.date"></formatted-date>
      </template>
      <template #item.lead.message="{ item }">
        <truncate-text
          :text="item && item.lead && item.lead.message"
          title="Lead Message"
          :url="false"
          :quotes="true"
          showText="Lead Message"
          :button="true"
        ></truncate-text>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { ldr_SEO_FormsColumns } from '~/utils/reports-upload/ldr/columns'

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
      formsHeader: ldr_SEO_FormsColumns(),
    }
  },
})
</script>
