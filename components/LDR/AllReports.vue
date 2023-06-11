<template>
  <v-data-table
    class="elevation-1 data-table"
    :headers="allReportsHeader"
    :no-data-text="`No Items`"
    :footer-props="{
      itemsPerPageOptions: [100, 200, 500, -1],
      itemsPerPage: 100,
    }"
    :item-class="callItemClass"
    :sort-by="['timestamp']"
    :sort-desc="[true]"
    :items="allReportsList"
    :disable-pagination="false"
    :disable-filtering="true"
    :fixed-header="true"
    height="700px"
  >
    <template v-slot:item.phone="props">
      <span> {{ props.item.phone | usPhone }}</span>
    </template>
    <template v-slot:item.email="props">
      <span>{{ props.item.email }}</span>
    </template>
    <template v-slot:item.timestamp="props">
      <formatted-date
        :timezone="props.item.timezone"
        :date="props.item.datetime"
      ></formatted-date>
    </template>
    <template v-slot:item.type="props">
      <span class="text-capitialize">{{ props.item.type }}</span>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

import { ldrAllColumns } from '~/utils/reports-upload/ldr/columns'

export default defineComponent({
  props: {
    allReportsList: {
      type: Array,
      default: () => [],
    },
    callItemClass: {
      type: Function,
      required: true,
      default: () => {},
    },
  },
  setup() {
    return { allReportsHeader: ldrAllColumns() }
  },
})
</script>
