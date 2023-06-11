<template>
  <div>
    <v-data-table
      :class="{
      'elevation-1': true,
      'data-table': true,
      'dark-page': $vuetify.theme.dark,
    }"
      :headers="callsHeader"
      :no-data-text="`No Calls`"
      :footer-props="{
        itemsPerPageOptions: [100, 200, 500, -1],
        itemsPerPage: 100,
      }"
      :item-class="callItemClass"
      :items="items"
      :disable-pagination="false"
      :disable-filtering="true"
      :fixed-header="true"
      height="700px"
    >
      <template v-slot:item.other_details.lead_source="props">
        <span style="text-transform: capitalize">
          {{ props.item.other_details.lead_source }}</span
        >
      </template>
      <template v-slot:item.answering_number="props">
        <span> {{ props.item.other_details.answering_number | usPhone }}</span>
      </template>
      <template v-slot:item.marketing_number="props">
        <span> {{ props.item.other_details.marketing_number | usPhone }}</span>
      </template>
      <template v-slot:item.caller_number="props">
        <span>
          {{ props.item.caller_number | usPhone }}
          <a
            target="_blank"
            :href="callAudio(props.item.call_url)"
            class="caller-number-play-icon"
          >
            <v-icon> mdi mdi-play </v-icon>
          </a>
        </span>
      </template>
      <template v-slot:item.day="props">
        <formatted-date
          :date="props.item.call_start"
          :formatString="Only_Day"
        ></formatted-date>
      </template>
      <template v-slot:item.procedure="props">
        <span>Root Canal</span>
      </template>
      <template v-slot:item.score.booked_appointment="props">
        <span style="text-transform: capitialize">
          {{ props.item.score && props.item.score.booked_appointment }}
        </span>
      </template>
      <template v-slot:item.score.comment="props">
        <span v-if="!props.item.score">Not scored yet.</span>
        <truncate-text
          v-else
          :quotes="true"
          title="Comment"
          class="mb-0"
          :button="true"
          :showText="'Show Comment'"
          :text="props.item.score.comment"
        ></truncate-text>
      </template>
      <template v-slot:item.landing_page_url="props"> 
        <truncate-text
          class="mb-0"
          title="Landing page url "
          v-if="props.item && props.item.other_details"
          :text="props.item.other_details.landing_page_url"
        ></truncate-text>
      </template>
      <template v-slot:item.call_start="props">
        <formatted-date
          :timezone="
            props.item && props.item.campaign && props.item.campaign.timezone
          "
          :date="props.item.call_start"
        ></formatted-date>
      </template>
      <template v-slot:item.call_status="props">
        <v-chip
        x-small
        >
        {{ props.item.call_status }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { callAudio } from '~/plugins/callAudio'
import { ldr_PPC_CallsColumns } from '~/utils/reports-upload/ldr/columns'
import FormattedDate from '~/components/FormattedDate.vue'
import TruncateText from '~/components/TruncateText.vue'
import { Only_Day } from '~/utils/dateFormat'

export default defineComponent({
  components: {
    FormattedDate,
    TruncateText,
  },
  props: {
    callItemClass: {
      type: Function,
      default: () => {},
      required: true,
    },
    items: {
      type: Array,
      default: () => {},
    },
  },
  setup() {
    return {
      callsHeader: ldr_PPC_CallsColumns(),
      callAudio,
      Only_Day,
    }
  },
})
</script>
<style lang="scss" src="~/components/LDR/LDRCallsStyles.scss" scoped></style>
