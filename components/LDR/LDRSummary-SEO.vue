<template>
  <v-simple-table id="LDR--summary__table">
    <template #default>
      <thead>
        <tr>
          <td><strong>Lead Type</strong></td>
          <td><strong>Count</strong></td>
          <td><strong>Unique</strong></td>
          <td><strong>Percentage of Unique Leads</strong></td>
          <td><strong>Conversion % (CLicks/Unique Leads)</strong></td>
        </tr>
      </thead>
      <tbody>
        <template v-if="summarySEO">
          <tr>
            <td><strong>Calls</strong></td>
            <td>{{ }}</td>
            <td>{{ }}</td>
            <td>{{ }}
            </td>
            <td>{{ }}
            </td>
          </tr>
          <tr>
            <td><strong>Chats</strong></td>
            <td>{{ }}</td>
            <td>{{ }}</td>
            <td>{{ }}</td>
            <td>{{ }}</td>
          </tr>
          <tr>
            <td><strong>Forms</strong></td>
            <td>{{ }}</td>
            <td>{{ }}</td>
            <td>{{ }}</td>
            <td>{{ }}</td>
          </tr>
          <tr>
            <td><strong>Total # of Leads</strong></td>
            <td>{{ }}</td>
            <td>{{ }}</td>
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
            <td><strong>Total SEO Spend</strong></td>
            <td>{{ }}
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>CPL</strong></td>
            <td>{{ }}
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
        <template v-if="summarySEO">
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
        <template v-if="summarySEO">
          <tr>
            <td>Appointments booked</td>
            <td></td>
            <td> {{ }} </td>
            <td> {{ }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Appointments NOT booked</td>
            <td></td>
            <td> {{ }} </td>
            <td> {{ }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Missed Calls</td>
            <td></td>
            <td> {{ }} </td>
            <td> {{ }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Irrelevant Calls</td>
            <td></td>
            <td> {{ }} </td>
            <td> {{ }}  </td>
            <td></td>
          </tr>
          <tr>
            <td>Unscored Calls</td>
            <td></td>
            <td> {{ }} </td>
            <td> {{ }}  </td>
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    summarySEO: {
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