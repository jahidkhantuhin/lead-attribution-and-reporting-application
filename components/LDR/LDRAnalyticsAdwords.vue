<template>
  <div>
    <v-simple-table>
      <template>
        <tbody>
          <template>
            <tr>
              <th>Conversions</th>
              <td v-if="analytics && analytics.adwords">
                {{ analytics.adwords.conversions }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Impressions</th>
              <td v-if="analytics && analytics.adwords">
                {{ analytics.adwords.impressions }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Clicks</th>
              <td v-if="analytics && analytics.adwords">
                {{ analytics.adwords.clicks }}
              </td>
              <td v-else></td>
            </tr>
            <tr>
              <th>Total Spend</th>
              <td v-if="analytics && analytics.adwords">
                <b>$</b>
                {{ new Number(analytics.adwords.total_spend).toFixed(2) }}
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    analytics: {
      type: Object,
      default: {},
    },
  },
  setup() {
    return {}
  },
})
</script>
