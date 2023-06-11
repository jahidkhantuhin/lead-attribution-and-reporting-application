<template>
  <v-simple-table id="LDR--summary__table">
    <template #default>
      <thead>
        <tr>
          <th>Lead Type</th>
          <th>Count</th>
          <th>Uniques</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="summary">
          <tr>
            <td>Calls</td>
            <td>{{ summary.calls.total }}</td>
            <td>{{ summary.calls.unique }}</td>
          </tr>
          <tr>
            <td>Chats</td>
            <td>{{ summary.chats.total }}</td>
            <td>{{ summary.chats.unique }}</td>
          </tr>
          <tr>
            <td>Web Forms</td>
            <td>{{ summary.emails.total }}</td>
            <td>{{ summary.emails.unique }}</td>
          </tr>
          <tr>
            <td>FB Forms</td>
            <td>{{ summary.facebook_leads.total }}</td>
            <td>{{ summary.facebook_leads.unique }}</td>
          </tr>
          <tr>
            <td><strong>Totals</strong></td>
            <td>
              <strong>{{
                summary.calls.total +
                summary.chats.total +
                summary.emails.total +
                summary.facebook_leads.total
              }}</strong>
            </td>
            <td>
              <strong>
                {{
                  summary.calls.unique +
                  summary.chats.unique +
                  summary.facebook_leads.unique +
                  summary.emails.unique
                }}
              </strong>
            </td>
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    summary: {
      type: Object,
      default: undefined,
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>
