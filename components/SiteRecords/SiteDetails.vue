<template>
  <v-row>
    <v-col cols="10" offset="1" v-if="loading">
      <v-expand-transition>
        <v-card >
          <v-card-text>
            <v-skeleton-loader
              type="table-heading, list-item-two-line, image, table-tfoot"
            ></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-expand-transition>
    </v-col>
    <v-col cols="10" offset="1" v-else>
      <!-- <v-card v-if="siteData.client">
        <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary" 
          dark
          title="Edit Location"
          :to="`/client-records/${siteData && siteData.client ?  siteData.client.id : ''}/locations/${siteData.id}/edit`"
        > Edit Location 
        </v-btn>
        </v-card-actions>
      </v-card> -->
      <v-expansion-panels
            class="ldr-expansion-panels"
            v-model="panel"
          >
            <v-expansion-panel :key="0">
              <v-expansion-panel-header>
                <h2> Site Details </h2> 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table style="box-shadow: 10px 10px 5px #E8E8E8;">
                  <template #default>
                    <tbody>
                      <template>
                        <tr>
                          <td><strong>Name</strong></td>
                          <td>{{ siteData.name }}</td>
                        </tr>
                        <tr>
                          <td><strong>Status</strong></td>
                          <td>
                            {{ siteData.location && siteData.location.client ? siteData.location.client.status : '' }} 
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Client Name</strong></td>
                          <td>
                            <nuxt-link class="site-link" :to="`/client-records/${siteData.location && siteData.location.client ? siteData.location.client.id : ''}/locations/${siteData.location ? siteData.location.id : ''}`">
                              <span>
                                {{ siteData.location && siteData.location.client ? siteData.location.client.name : '' }}
                              </span>
                            </nuxt-link>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Email </strong></td>
                          <td>{{ siteData.location && siteData.location.client ? siteData.location.client.email : ''  }}</td>
                        </tr>
                        <tr>
                          <td><strong>WP Version</strong></td>
                          <td>{{ siteData.wp_version }}</td>
                        </tr>
                        <tr>
                          <td><strong>IP Address</strong></td>
                          <td>{{ siteData.site_ip }}</td>
                        </tr>
                      </template>
                    </tbody>
                    <tr>
                      <td>
                        <v-divider></v-divider>
                      </td>
                      <td>
                        <v-divider></v-divider>
                      </td>
                    </tr>
                    <tbody v-for="(item, index) in siteData.site_information" :key="index">
                      <template>
                        <tr>
                          <td><strong>Site URL</strong></td>
                          <td>{{ item.url }}</td>
                        </tr>
                        <tr>
                          <td><strong>Staging URL</strong></td>
                          <td>{{ item.staging_url }}</td>
                        </tr>
                        <tr>
                          <td><strong>Registrar</strong></td>
                          <td>{{ item.registrar }}</td>
                        </tr>
                        <tr>
                          <td><strong>Hosted</strong></td>
                          <td>{{ item.is_cloudways_hosted === 1 ? 'Cloudways' : '' }}</td>
                        </tr>
                        <tr>
                          <td><strong>SSL</strong></td>
                          <td>{{ item.has_ssl }}</td>
                        </tr>
                        <tr>
                          <td><strong>Created At</strong></td>
                          <td>
                            <formatted-date :date="item.created"> 
                              {{ item.created }} 
                            </formatted-date>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Expired At</strong></td>
                          <td>
                            <formatted-date :date="item.expires"> 
                              {{ item.expires }} 
                            </formatted-date>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                    <tr>
                      <td>
                        <v-divider></v-divider>
                      </td>
                      <td>
                        <v-divider></v-divider>
                      </td>
                    </tr>
                    <tbody>
                      <template>
                        <tr>
                          <td><strong>Theme Name</strong></td>
                          <td>
                            <tr>
                              <td ><strong>Version</strong></td>
                              <td style="padding-left: 100px"><strong>Update Available</strong></td>
                              <!-- <td style="padding-left: 100px"><strong>Status</strong></td> -->
                            </tr>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                    <tbody v-for="(item, index) in siteData.themes" :key="index">
                      <template>
                        <tr>
                          <td>{{ item.name }}</td>
                          <td>
                            <tr>
                              <td>{{ item.version }}</td>
                              <td style="padding-left: 130px">{{ item.is_update_available === 1 ? 'Yes' : 'No' }} ({{ item.status === 1 ? 'Active' : 'Not Active' }})</td>
                              <!-- <td style="padding-left: 200px">{{ item.status === 1 ? 'Active' : 'Not Active' }}</td> -->
                            </tr>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :key="1">
              <v-expansion-panel-header>
                <h2> Plugins Details </h2> 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table style="box-shadow: 10px 10px 5px #E8E8E8;">
                  <template #default>
                    <tbody>
                      <template>
                        <tr>
                          <td><strong>Plugin Name</strong></td>
                          <td ><strong>Version</strong></td>
                          <td><strong>Update Available</strong></td>
                          <td><strong>Status</strong></td>
                        </tr>
                      </template>
                    </tbody>
                    <tbody v-for="(item, index) in siteData.plugins" :key="index">
                      <template>
                        <tr>
                          <td>{{ item.name }}</td>
                          <td>{{ item.version }}</td>
                          <td>{{ item.is_update_available === 1 ? 'Yes' : 'No' }}</td>
                          <td>{{ item.status === 1 ? 'Active' : 'Not Active' }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :key="2">
              <v-expansion-panel-header>
                <h2> Speed Score </h2> 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mt-12">
                  <v-col cols="12" md="12">
                    <v-card :loading="reportsLoading">
                      <v-card-title>
                        Speed Score Graph
                        <v-spacer></v-spacer>
                        <v-btn
                          x-small
                          class="mr-3"
                          elevation="1"
                          :color="currentReport == 'this_week' ? 'primary' : 'normal'"
                          :disabled="reportsLoading"
                          @click="setFilters('this_week')"
                          >This Week
                        </v-btn>
                        <v-btn
                          x-small
                          class="mr-3"
                          elevation="1"
                          :color="currentReport == 'last_week' ? 'primary' : 'normal'"
                          :disabled="reportsLoading"
                          @click="setFilters('last_week')"
                          >Last Week
                        </v-btn>
                        <v-btn
                          x-small
                          class="mr-3"
                          elevation="1"
                          :color="currentReport == 'last_month' ? 'primary' : 'normal'"
                          :disabled="reportsLoading"
                          @click="setFilters('last_month')"
                          >Last Month
                        </v-btn>
                        <v-btn
                          x-small
                          class="mr-0"
                          elevation="1"
                          :color="currentReport == 'this_month' ? 'primary' : 'normal'"
                          :disabled="reportsLoading"
                          @click="setFilters('this_month')"
                          >This Month
                        </v-btn>
                        <v-btn
                          x-small
                          class="mr-3"
                          elevation="1"
                          :color="currentReport == 'last_six_month' ? 'primary' : 'normal'"
                          :disabled="reportsLoading"
                          @click="setFilters('last_six_month')"
                          >Last 6 Month
                        </v-btn>
                        <v-btn
                          x-small
                          class="mr-3"
                          elevation="1"
                          :color="currentReport == 'last_year' ? 'primary' : 'normal'"
                          :disabled="reportsLoading"
                          @click="setFilters('last_year')"
                          >Last Year
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <!-- Graph -->
                        <apexchart
                          width="100%"
                          height="300"
                          type="bar"
                          :options="graphOptions"
                          :series="graphSeries"
                        ></apexchart>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
} from '@nuxtjs/composition-api'
import FormattedDate from '~/components/FormattedDate.vue'
import VueApexCharts from 'vue-apexcharts'
import useApi from '~/services/useApi'
import moment from 'moment'

export default defineComponent({
  components: {
    FormattedDate,
    apexchart: VueApexCharts,
  },
  props: {
    siteData: {
      type: Object,
      default: {},
    },
    siteID: {
      type: String,
      default: {},
    },
    loading:{

    },
  },
  setup(props) {
    const panel = ref(0)
    const siteId = computed(() => {
      return props.siteData.id
    })

    const reports = ref([])
    const currentReport = ref('this_week')
    const reportsFilters = ref({
      date_start: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      date_end: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    })
    const reportsLoading = ref(true)
    // const store = useStore()
    // const { $auth } = useContext()
    const { get } = useApi()

    // set the page breadcrumbs
    // const breadcrumbs: IBreadcrumbs[] = [
    //   {
    //     text: `Dashboard`,
    //     to: `/`,
    //     disabled: true,
    //   },
    //   {
    //     text: `Home`,
    //     to: `/`,
    //     disabled: true,
    //   },
    // ]

    // const pageTitle = `Dashboard`

    // store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    // const userFullName = computed(() => $auth.user?.fullname)

    const fetchLeadSummary = () => {
      reportsLoading.value = true
      get(`/sites/${props.siteID}/graph`, reportsFilters.value)
        .then((res) => {
          reports.value = res.data.data
          reportsLoading.value = false
        })
        .finally(() => {
          reportsLoading.value = false
        })
    }

    // graph data
    const graphOptions = computed(() => {
      return {
        dataLabels: {
          enabled: false,
        },
        chart: {
          id: 'vuechart-leadsummary',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories:
            reports &&
            reports.value.map((c: any) => {
              return c.date
            }),
        },
      }
    })

    const graphSeries = computed(() => {
      return [
        {
          name: 'Mobile Score',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.mobile_score).toFixed(2)
            }),
        },
        {
          name: 'Desktop Score',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.desktop_score).toFixed(2)
            }),
        },
        {
          name: 'Mobile Speed',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.mobile_speed_index).toFixed(2)
            }),
        },
        {
          name: 'Desktop Speed',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.desktop_speed_index).toFixed(2)
            }),
        },
        {
          name: 'Server Response Time',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.server_response_time).toFixed(2)
            }),
        },
        {
          name: 'Desktop 1st Contentful Paint',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.desktop_first_contentful_paint).toFixed(2)
            }),
        },
        {
          name: 'Mobile 1st Contentful Paint',
          data:
            reports.value &&
            reports.value.map((c: any) => {
              return new Number(c.summary.mobile_first_contentful_paint).toFixed(2)
            }),
        },
      ]
    })

    const setFilters = (val: string) => {
      if (val === 'this_week') {
        reportsFilters.value = {
          ...reportsFilters.value,
          date_start: moment().startOf('isoWeek').format('YYYY-MM-DD'),
          date_end: moment().endOf('isoWeek').format('YYYY-MM-DD'),
        }
      } else if (val === 'last_week') {
        reportsFilters.value = {
          ...reportsFilters.value,
          date_start: moment()
            .subtract(1, 'weeks')
            .startOf('isoWeek')
            .format('YYYY-MM-DD'),
          date_end: moment()
            .subtract(1, 'weeks')
            .endOf('isoWeek')
            .format('YYYY-MM-DD'),
        }
      } else if (val === 'this_month') {
        reportsFilters.value = {
          ...reportsFilters.value,
          date_start: moment().startOf('month').format('YYYY-MM-DD'),
          date_end: moment().endOf('month').format('YYYY-MM-DD'),
        }
      } else if (val === 'last_month') {
        reportsFilters.value = {
          ...reportsFilters.value,
          date_start: moment()
            .subtract(1, 'months')
            .startOf('month')
            .format('YYYY-MM-DD'),
          date_end: moment()
            .subtract(1, 'months')
            .endOf('month')
            .format('YYYY-MM-DD'),
        }
      } else if (val === 'last_six_month') {
        reportsFilters.value = {
          ...reportsFilters.value,
          date_start: moment()
            .subtract(6, 'months')
            .startOf('month')
            .format('YYYY-MM-DD'),
          date_end: moment()
            .subtract('months')
            .endOf('month')
            .format('YYYY-MM-DD'),
        }
      }
      else if (val === 'last_year') {
        reportsFilters.value = {
          ...reportsFilters.value,
          date_start: moment()
          .subtract(1, 'year')
          .startOf('year')
          .format('YYYY-MM-DD'),
          date_end: moment()
          .subtract(1, 'year')
          .endOf('year')
          .format('YYYY-MM-DD'),
        }
      }
      currentReport.value = val
      fetchLeadSummary()
    }

    onMounted(() => {
      fetchLeadSummary()
    })

    return {
      panel,
      // userFullName,
      graphOptions,
      graphSeries,
      reportsLoading,
      currentReport,
      moment,
      setFilters,
      siteId,
    }
  },
})
</script>