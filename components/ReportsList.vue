<template>
  <v-row :justify="justify">
    <v-col v-for="(report, index) in testingReports" :key="index" cols="12" md="4">
      <v-card color="#e6f0ff" hover link nuxt :to="report.link">
        <v-toolbar color="#e6ffff" flat>
          <v-toolbar-title class="display-1 text--primary font-weight-medium">
            {{ report.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon v-if="report.icon">{{ report.icon }}</v-icon>
        </v-toolbar>
        <v-card-text class="text--primary min-height">{{
          report.details
        }}</v-card-text>
        <v-card-actions>
          <v-list-item class="grow">
            <v-row justify="end">
              <v-btn color="#668cff" nuxt link :to="report.link">
                <v-icon v-if="report.icon" left>{{ report.icon }}</v-icon>
                View
              </v-btn>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { 
  defineComponent,
  computed,
  useContext,
 } from '@nuxtjs/composition-api'
import { IReportPageItem } from '~/shared/Types'

export default defineComponent({
  props: {
    justify: {
      type: String,
      required: false,
      default: 'left',
    },
  },
  setup() {
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      $auth.user?.role === 'user'
    )
    // @TODO: i18n these
    const reports: IReportPageItem[] = [
      {
        title: `Payment Report`,
        details: `Displays a list of Call Scorers and allows you to generate a list of clients, calls they scored along with the payable amount based on the dates selcted.`,
        link: `/reports/payment-report`,
        icon: `mdi-account-hard-hat`,
      },
      {
        title: `Lead Details Report`,
        details: `Displays a list different kinds of leads based on the client and the date (range) selected. You may chose to only see a summary as well.`,
        link: `/reports/lead-details-report`,
        icon: `mdi-face-agent`,
      },
      {
        title: `Client Overview Report`,
        details: `Display a all clients with their summary of leads based on the date (range) selected.`,
        link: `/reports/client-overview`,
        icon: `mdi-face-agent`,
      },
      {
        title: `KPI`,
        details: `Display a all clients with their KPI summary of leads based on the date (range) selected.`,
        link: `/reports/kpi`,
        icon: `mdi-face-agent`,
      },
      {
        title: `Statistics`,
        details: `Display statistics of all leads based on the date (range) selected`,
        link: `/reports/statistics`,
        icon: `mdi-graph`,
      },
      {
        title: `Client Records`,
        details: `Display all active clients with various data points and sort controls`,
        link: `/client-records`,
        icon: `mdi-earth`,
      },
      {
        title: `Site Records`,
        details: `Display all active websites with various data points and sort controls`,
        link: `/site-records`,
        icon: `mdi-web`,
      },
      {
        title: `Location Settings`,
        details: `Display all locations with missing client ID with various data points and sort controls`,
        link: `/location-records`,
        icon: `mdi-earth`,
      },
      {
        title: `VPN Setup`,
        details: `Setup VPN`,
        link: `/vpn-setup`,
        icon: `mdi-earth`,
      },
    ]
    const testingReports= computed(() => {
      return (
        nonAccountManagerUserRole.value ? 
      [
      {
        title: `VPN Setup`,
        details: `Setup VPN`,
        link: `/vpn-setup`,
        icon: `mdi-earth`,
      },
    ] :
    [
      {
        title: `Payment Report`,
        details: `Displays a list of Call Scorers and allows you to generate a list of clients, calls they scored along with the payable amount based on the dates selcted.`,
        link: `/reports/payment-report`,
        icon: `mdi-account-hard-hat`,
      },
      {
        title: `Lead Details Report`,
        details: `Displays a list different kinds of leads based on the client and the date (range) selected. You may chose to only see a summary as well.`,
        link: `/reports/lead-details-report`,
        icon: `mdi-face-agent`,
      },
      {
        title: `Client Overview Report`,
        details: `Display a all clients with their summary of leads based on the date (range) selected.`,
        link: `/reports/client-overview`,
        icon: `mdi-face-agent`,
      },
      {
        title: `KPI`,
        details: `Display a all clients with their KPI summary of leads based on the date (range) selected.`,
        link: `/reports/kpi`,
        icon: `mdi-face-agent`,
      },
      {
        title: `Statistics`,
        details: `Display statistics of all leads based on the date (range) selected`,
        link: `/reports/statistics`,
        icon: `mdi-graph`,
      },
      {
        title: `Client Records`,
        details: `Display all active clients with various data points and sort controls`,
        link: `/client-records`,
        icon: `mdi-earth`,
      },
      {
        title: `Site Records`,
        details: `Display all active websites with various data points and sort controls`,
        link: `/site-records`,
        icon: `mdi-web`,
      },
      {
        title: `Location Settings`,
        details: `Display all locations with missing client ID with various data points and sort controls`,
        link: `/location-settings`,
        icon: `mdi-earth`,
      },
      {
        title: `VPN Setup`,
        details: `Setup VPN`,
        link: `/vpn-setup`,
        icon: `mdi-earth`,
      },
      {
        title: `All Active Locations`,
        details: `Display all active locations with various data points and sort controls`,
        link: `/all-locations`,
        icon: `mdi-earth`,
      },
    ]
    )
    })

    return {
      reports,
      nonAccountManagerUserRole,
      testingReports,
    }
  },
})
</script>

<style scoped>
.min-height {
  min-height: 110px;
}
</style>
