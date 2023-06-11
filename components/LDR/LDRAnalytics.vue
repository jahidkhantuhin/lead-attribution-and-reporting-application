<template>
  <div>
    <v-simple-table>
      <template>
        <tbody>
          <template>
            <tr>
              <th>CPL</th>
              <td v-if="analytics && analytics.aggregate">
                <b>$</b> {{ cpl }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Conversions</th>
              <td v-if="analytics && analytics.aggregate">
                {{ analytics.aggregate.conversions }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Impressions</th>
              <td v-if="analytics && analytics.aggregate">
                {{ analytics.aggregate.impressions }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Clicks</th>
              <td v-if="analytics && analytics.aggregate">
                {{ analytics.aggregate.clicks }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Total Spend</th>
              <td v-if="analytics && analytics.aggregate">
                <b>$</b>
                {{ new Number(analytics.aggregate.total_spend).toFixed(2) }}
              </td>
              <td v-else></td>
            </tr>
          </template>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    analytics: {
      type: Object,
      default: {},
    },
    summary: {
      type: Object,
      default: undefined,
      required: true,
    },
  },
  setup(props) {
    const totalUnique = computed(() => {
      return (props.summary.calls.unique +
              props.summary.chats.unique +
              props.summary.facebook_leads.unique +
              props.summary.emails.unique) || 0 
    })
    const cpl = computed(() => {
      if (props.analytics.aggregate.total_spend > 0 && totalUnique.value > 0) {
        return `${new Number(props.analytics.aggregate.total_spend / totalUnique.value).toFixed(2) || 0}`
      }
      else return 0
       
    })
    return {
      totalUnique,
      cpl,
    }
  },
})
</script>
