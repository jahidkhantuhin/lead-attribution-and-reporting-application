<template>
  <v-simple-table id="LDR--summary__table">
    <template #default>
      <thead>
        <tr>
          <td><strong>Lead Type</strong></td>
          <td><strong>Count</strong></td>
          <td><strong>Unique</strong></td>
          <td><strong>Percentage of Unique Leads</strong></td>
          <td><strong>Conversion % (Impressions/Unique Leads)</strong></td>
        </tr>
      </thead>
      <tbody>
        <template v-if="summaryFACEBOOK">
          <tr>
            <td><strong>Calls</strong></td>
            <td>{{ totalCallsCount }}</td>
            <td>{{ totalCallsUnique }}</td>
            <td>{{ percentageOfUniqueLeadsForCalls }}</td>
            <td>{{ conversionForCalls }}</td>
          </tr>
          <tr>
            <td><strong>Chats</strong></td>
            <td>{{ totalChatsCount }}</td>
            <td>{{ totalChatsUnique }}</td>
            <td>{{ percentageOfUniqueLeadsForChats }}</td>
            <td>{{ conversionForChats }}</td>
          </tr>
          <tr>
            <td><strong>Forms</strong></td>
            <td>{{ totalFormsCount }}</td>
            <td>{{ totalFormsUnique }}</td>
            <td>{{ percentageOfUniqueLeadsForForms }}</td>
            <td>{{ conversionForForms }}</td>
          </tr>
          <tr>
            <td><strong>Total # of Leads</strong></td>
            <td>{{ totalLeadsCount }}</td>
            <td>{{ totalLeadsUnique }}</td>
            <td></td>  
            <td></td>  
          </tr>
          <tr>
            <td></td>
            <td></td>  
            <td></td>  
            <td></td>
            <td></td>  
          </tr>
          <tr>
            <td><strong>Total FB Spend</strong></td>
            <td>{{ totalFacebookSpend }}
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>CPL</strong></td>
            <td>{{ CPL }}
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>  
            <td></td>  
            <td></td>
            <td></td>  
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="3">{{ $t('message.noResultsFound') }}</td>
          </tr>
        </template>
      </tbody>
      <thead>
          <tr>
            <td><strong>Chat Summary</strong></td>
            <td><strong>Count</strong></td>
            <td><strong>Unique</strong></td>
            <td><strong>Percentage of Unique Leads</strong></td>
            <td><strong> X </strong></td>
          </tr>
      </thead>
      <tbody>
        <template v-if="summaryFACEBOOK">
            <tr>
            <td>Chats started</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Chats converted to leads</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>Leads as a % of Total Chats</strong></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>  
            <td></td>  
            <td></td>
            <td></td>  
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="3">{{ $t('message.noResultsFound') }}</td>
          </tr>
        </template>
      </tbody>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
      <thead>
        <tr>
          <td><strong>Calls Summary</strong></td>
          <td><strong>Count</strong></td>
          <td><strong>Unique</strong></td>
          <td><strong>Percentage of Unique Leads</strong></td>
          <td><strong> X </strong></td>
        </tr>
      </thead>
      <tbody>
        <template v-if="summaryFACEBOOK">
          <tr>
            <td>Appointments booked</td>
            <td></td>
            <td> {{ uniqueForAppointmentBooked }} </td>
            <td> {{ percentageOfUniqueLeadsForAppointmentBooked }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Appointments NOT booked</td>
            <td></td>
            <td> {{ uniqueForAppointmentNotBooked }} </td>
            <td> {{ percentageOfUniqueLeadsForAppointmentNotBooked }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Missed Calls</td>
            <td></td>
            <td> {{ uniqueForMissedCalls }} </td>
            <td> {{ percentageOfUniqueLeadsForMissedCalls }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Irrelevant Calls</td>
            <td></td>
            <td> {{ uniqueForIrrelevantCalls }} </td>
            <td> {{ percentageOfUniqueLeadsForIrrelevantCalls }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Unscored Calls</td>
            <td></td>
            <td> {{ uniqueForUnscoredCalls }} </td>
            <td> {{ percentageOfUniqueLeadsForUnscoredCalls }}  </td>
            <td></td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="3">{{ $t('message.noResultsFound') }}</td>
          </tr>
        </template>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script lang="ts">
import { defineComponent, computed, } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    summaryFACEBOOK: {
      type: Object,
      default: undefined,
      required: true,
    },
  },
  setup(props) {
    const totalCallsCount = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.calls.total || 0 
    })
    const totalCallsUnique = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.calls.unique || 0 
    })
    const additionOfUniques = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.calls.unique + 
              props.summaryFACEBOOK.details.am.facebook.chats.unique +
              props.summaryFACEBOOK.details.am.facebook.forms.unique
    })
    const impressions = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.impressions
    })
    const percentageOfUniqueLeadsForCalls = computed(() => {
      if (totalCallsUnique.value > 0 && additionOfUniques.value > 0) {
        return `${new Number(( totalCallsUnique.value / 
                ( additionOfUniques.value ) ) || 0 * 100).toFixed(2)}%`
      } 
      else return '0%'
    })
    const conversionForCalls = computed(() => {
      if (impressions.value > 0 &&  totalCallsUnique.value > 0) {
        return `${new Number(( impressions.value  / 
                ( totalCallsUnique.value) ) || 0 ).toFixed(2)}%`
      } 
      else return '0%'
    })
    const totalChatsCount = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.chats.total || 0
    })
    const totalChatsUnique = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.chats.unique || 0 
    })
    const percentageOfUniqueLeadsForChats = computed(() => {
      if (totalChatsUnique.value > 0 && additionOfUniques.value > 0) {
        return `${new Number(( totalChatsUnique.value  / 
              ( additionOfUniques.value) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    const conversionForChats = computed(() => {
      if (impressions.value > 0 && totalChatsUnique.value>0) {
        return `${new Number(( impressions.value / 
              ( totalChatsUnique.value ) ) || 0).toFixed(2)}%` 
      }
      else return '0%'
    })
    const totalFormsCount = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.forms.total || 0 
    })
    const totalFormsUnique = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.forms.unique || 0
    })
    const percentageOfUniqueLeadsForForms = computed(() => {
      if (totalFormsUnique.value > 0 && additionOfUniques.value > 0) {
        return `${new Number(( totalFormsUnique.value / 
                ( additionOfUniques.value ) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    const conversionForForms = computed(() => {
      if (impressions.value > 0 && totalFormsUnique.value > 0) {
        return `${new Number(( impressions.value / 
                  (totalFormsUnique.value) ) || 0).toFixed(2)}%`
      }
      else return '0%'
    })
    const totalLeadsCount = computed(() => {
      return (props.summaryFACEBOOK.details.am.facebook.calls.total + 
                    props.summaryFACEBOOK.details.am.facebook.chats.total + 
                    props.summaryFACEBOOK.details.am.facebook.forms.total) || 0
    })
    const totalLeadsUnique = computed(() => {
      return additionOfUniques.value || 0
    })
    const totalFacebookSpend = computed(() => {
      return `$${new Number(
                props.summaryFACEBOOK.lead_analytics.facebook.total_spend || 0).toFixed(2)}`
    })
    const CPL = computed(() => {
      return `$${new Number(
                  props.summaryFACEBOOK.details.am.facebook.cpl || 0 ).toFixed(2)}`
    })
    const uniqueForAppointmentBooked = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.call_summary.booked || 0 
    })
    const uniqueForAppointmentNotBooked = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.call_summary.not_booked || 0
    })
    const uniqueForMissedCalls = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.call_summary.missed || 0
    })
    const uniqueForIrrelevantCalls = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.call_summary.irrelevant || 0
    })
    const uniqueForUnscoredCalls = computed(() => {
      return props.summaryFACEBOOK.details.am.facebook.call_summary.unscored || 0
    })
    const percentageOfUniqueLeadsForAppointmentBooked = computed(() => {
      if (uniqueForAppointmentBooked.value > 0 && totalCallsUnique.value > 0) {
        return `${new Number(( uniqueForAppointmentBooked.value  / 
                ( totalCallsUnique.value  ) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    const percentageOfUniqueLeadsForAppointmentNotBooked = computed(() => {
      if (uniqueForAppointmentNotBooked.value > 0 && totalCallsUnique.value > 0) {
        return `${new Number(( uniqueForAppointmentNotBooked.value  / 
                ( totalCallsUnique.value  ) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    const percentageOfUniqueLeadsForMissedCalls = computed(() => {
      if (uniqueForMissedCalls.value > 0 && totalCallsUnique.value > 0) {
        return `${new Number(( uniqueForMissedCalls.value  / 
                ( totalCallsUnique.value  ) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    const percentageOfUniqueLeadsForIrrelevantCalls = computed(() => {
       if (uniqueForIrrelevantCalls.value > 0 && totalCallsUnique.value > 0) {
        return `${new Number(( uniqueForIrrelevantCalls.value / 
                ( totalCallsUnique.value  ) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    const percentageOfUniqueLeadsForUnscoredCalls = computed(() => {
      if (uniqueForUnscoredCalls.value > 0 && totalCallsUnique.value > 0) {
        return `${new Number(( uniqueForUnscoredCalls.value / 
                ( totalCallsUnique.value  ) ) || 0 * 100).toFixed(2)}%`
      }
      else return '0%'
    })
    return { 
      totalCallsCount,
      totalCallsUnique,
      percentageOfUniqueLeadsForCalls,
      conversionForCalls,
      totalChatsCount,
      totalChatsUnique,
      percentageOfUniqueLeadsForChats,
      conversionForChats,
      totalFormsCount,
      totalFormsUnique,
      percentageOfUniqueLeadsForForms,
      conversionForForms,
      totalLeadsCount,
      totalLeadsUnique,
      totalFacebookSpend,
      CPL,
      uniqueForAppointmentBooked,
      uniqueForAppointmentNotBooked,
      uniqueForMissedCalls,
      uniqueForIrrelevantCalls,
      uniqueForUnscoredCalls,
      percentageOfUniqueLeadsForAppointmentBooked,
      percentageOfUniqueLeadsForAppointmentNotBooked,
      percentageOfUniqueLeadsForMissedCalls,
      percentageOfUniqueLeadsForIrrelevantCalls,
      percentageOfUniqueLeadsForUnscoredCalls,
      additionOfUniques,
      impressions,
    }
  },
  
})
</script>