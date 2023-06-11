<template>
  <div>
    <div>
      <UnauthorizedUser v-if="nonAccountManagerUserRole"/>
    </div>
    <div v-if="!nonAccountManagerUserRole"> 
      <v-card :loading="loading">
        <v-card-title>
          <span> Statistics </span>
          <Datepicker
            class="ml-8"
            :dateHelpButtons="['thisYear', 'lastYear', 'last2Years', 'last5Years']"
            @change="fetchGraph"
            v-model="filters['dates']"
          ></Datepicker>
        </v-card-title>
        <v-card-text style="margin-left: 150px; margin-top: -30px;">
          <span >Date or Date Range</span>
        </v-card-text>
        <v-card-text>
          <span>
            Showing reports from
            <formatted-date
              :timezone="false"
              :date="filters.dates[0]"
            ></formatted-date>
            to
            <formatted-date
              :timezone="false"
              :date="filters.dates[1]"
            ></formatted-date
            >.
          </span>
        </v-card-text>
        <!-- <p> {{ testingValue }} </p> -->
        <!-- <p> {{ testingValueTwo }} </p> -->
          <v-toolbar flat v-if="dataLoaded">
            <v-spacer></v-spacer>
                <v-btn
                  icon
                  title="Copy link to this report"
                  @click="copyReportLink"
                >
                  <v-icon>mdi-link</v-icon>
                </v-btn>
                <v-btn
                  @click="uploadReport"
                  :loading="uploadReportLoading"
                  icon
                  title="Upload to Google Drive"
                  :color="googleDocLink ? 'info' : 'normal'"
                >
                  <v-icon>mdi-upload</v-icon>
                </v-btn>
              </v-toolbar>
          <v-dialog v-model="reportLoadingDialog" persistent width="500">
          <v-expand-transition>
            <v-card v-show="uploadReportLoading">
              <v-card-text class="pt-5">
                <p class="mb-3 text-center">
                  {{ $t('message.uploadingToGoogleDrive') }}
                </p>
                <v-progress-linear
                  indeterminate
                  color="black"
                  class="mb-0"
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-expand-transition>
          <v-expand-transition>
            <v-card v-show="reportUploaded">
              <v-card-title class="mb-4"
                >{{ $t('alert.success.driveUpload') }}.</v-card-title
              >
              <v-card-text>
                <span class="google-doc-link">{{ googleDocLink }}</span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <a @click="copy('.google-doc-link')" v-bind="attrs" v-on="on">
                      <v-icon> mdi-content-copy </v-icon>
                    </a>
                  </template>
                  <span>Copy</span>
                </v-tooltip>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :href="googleDocLink" target="_blank">
                  Open File
                </v-btn>
                <v-btn color="yellow" @click="reportLoadingDialog = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-dialog>
        <v-card-text>
          <apexchart
            width="100%"
            height="500px"
            type="line"
            :series="graph.series"
            :options="graph.options"
          >
          </apexchart>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRouter,
  useStore,
  useContext,
} from '@nuxtjs/composition-api'
import { IBreadcrumbs } from '~/store'
import VueApexCharts from 'vue-apexcharts'
import useAxios from '~/plugins/useAxios'
import Datepicker from '~/components/forms/DatePickerForStatistics.vue'
import FormattedDate from '~/components/FormattedDate.vue'
import { callColors } from '~/shared/callColors'
import generateStatisticsReport from '~/utils/reports-upload/statistic-report'
import swalMixin, { showToast } from '~/utils/swalMixin'
import UnauthorizedUser from '~/components/UnauthorizedUser.vue'


export default defineComponent({
  components: {
    apexchart: VueApexCharts,
    Datepicker,
    FormattedDate,
    UnauthorizedUser,
  },
  // middleware: 'isAuthenticated',
  setup(props, { parent }) {
    const { get } = useAxios()
    const store = useStore()
    const router = useRouter()
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('create report') && $auth.hasScope('vpn access')
    )
    const axios = useAxios()
    const uploadData: any = ref([])
    const uploadReportLoading = ref(false)
    const googleDocLink = ref('')
    const reportLoadingDialog = ref(false)
    const reportUploaded = ref(false)
    const $swal = swalMixin((parent as any).$swal as any)

    const isCopied = ref(false)

    const copy = (element: string) => {
      window.navigator.clipboard.writeText(googleDocLink.value)
      showToast($swal, {
        title: 'Copied to clipboard',
      })
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 5000)
    }

    const copyReportLink = () => {
      window.navigator.clipboard.writeText(window.location.href)
      showToast($swal, {
        title: 'Link copied to clipboard',
      })
    }

    const filters = ref({
      dates: ['2020-01-01', '2021-12-3'],
    })
    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: `Dashboard`,
        to: `/`,
        disabled: false,
      },
      {
        text: `Reports`,
        to: `/reports`,
        disabled: false,
      },
      {
        text: `Statistics`,
        to: `/reports/statistics`,
        disabled: true,
      },
    ]
    const response = ref<{
      [key: string]: any
    }>({})

    const loading = ref(false)
    const dataLoaded = ref(false)

    const graph = computed(() => {
      const keys = Object.keys(response.value)

      return {
        series: [
          {
            name: 'All Calls',
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) =>
                    item.lead_type === 'call' &&
                    item.conversion_status === null
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Emails',
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) => item.lead_type === 'email'
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Chat',
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) => item.lead_type === 'chat'
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Calls Unscored',
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) =>
                    item.lead_type === 'call' &&
                    item.conversion_status === 'unscored'
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Irrelevant Calls',
            color: callColors.irrelevant_color,
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) =>
                    item.lead_type === 'call' &&
                    item.conversion_status === 'irrelevant'
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Missed Calls',
            color: callColors.missed_color,
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) =>
                    item.lead_type === 'call' &&
                    item.conversion_status === 'missed'
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Booked Calls',
            color: callColors.booked_color,
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) =>
                    item.lead_type === 'call' &&
                    item.conversion_status === 'booked'
                )?.total_leads || 0
              )
            }),
          },
          {
            name: 'Not Booked Calls',
            color: callColors.not_booked_color,
            data: keys.map((key: string) => {
              return (
                response.value[key].find(
                  (item: any) =>
                    item.lead_type === 'call' &&
                    item.conversion_status === 'not booked'
                )?.total_leads || 0
              )
            }),
          },
        ],
        options: {
          chart: {
            height: 500,
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false,
          },

          stroke: {
            curve: 'straight',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: keys,
          },
        },
      }
    })

    // testing start


    const uploadReport = () => {
      try {
        if (reportUploaded.value === true) {
          reportLoadingDialog.value = true
          return
        }

        uploadReportLoading.value = true
        reportLoadingDialog.value = true
      axios
        .post(
          '/reports/upload',
          generateStatisticsReport(uploadData, {
            user: (store as any).state.auth.user,
          }) as any,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${(store.state as any).cred.cred}`
            }
          }
        ).then((res) => {
            googleDocLink.value = res.data?.data?.url
            reportUploaded.value = true
          })
          .catch(() => {
            uploadReportLoading.value = false
            reportLoadingDialog.value = false
          })
          .finally(() => {
            uploadReportLoading.value = false
          })
          } catch (e) {
        console.error(e.message)
        showToast($swal, {
          title: 'Something went wrong while uploading report to G-Drive',
        })
      }
    }

    // testing end

    const pageTitle = `Statistics`

    const fetchGraph = () => {
      if (filters.value.dates.length > 1) {
        loading.value = true
        router.push({
          query: filters.value,
        })
        get('/reports/data', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${(store.state as any).cred.cred}`
          },
          params: {
            date_start: filters.value.dates[0],
            date_end: filters.value.dates[1],
          },
        })
          .then((res) => {
            response.value = res.data.data
            dataLoaded.value = true
            // console.log('STATISTIC', response.value)
            let transformedData = Object.entries(response.value)
            // console.log('NEW-DATA', transformedData)
            let dataOne = transformedData.map((itemOne) => {
              return itemOne[1].map((itemTwo: any) => {
                return itemTwo
              })
            })
            let computedArray = dataOne
            // console.log('computedArray', computedArray)
            let computedArrayTwo = computedArray.map((itemOne: any) => {
              return itemOne
            })
            let computedArrayThree = computedArrayTwo.map((itemOne: any) => {
                const keys = Object.keys(itemOne)
                return {
                  month_year: itemOne[0].month_year,
                  total_calls: itemOne[5].total_leads,
                  total_forms: itemOne[7].total_leads,
                  total_chats: itemOne[6].total_leads,
                  total_booked: itemOne[0].total_leads,
                  total_not_booked: itemOne[1].total_leads,
                  total_missed: itemOne[3].total_leads,
                  total_irrelevant: itemOne[2].total_leads,
                  total_not_scored: itemOne[4].total_leads,
                  avg_total_calls: 
                  `${new Number(itemOne[5].total_leads / ((itemOne[0].month_year).includes('January') ? 31 :
                  (itemOne[0].month_year).includes('February') ? 28 :
                  (itemOne[0].month_year).includes('March') ? 31 :
                  (itemOne[0].month_year).includes('April') ? 30 :
                  (itemOne[0].month_year).includes('May') ? 31 :
                  (itemOne[0].month_year).includes('February') ? 28 :
                  (itemOne[0].month_year).includes('June') ? 30 :
                  (itemOne[0].month_year).includes('July') ? 31 :
                  (itemOne[0].month_year).includes('August') ? 31 :
                  (itemOne[0].month_year).includes('September') ? 30 :
                  (itemOne[0].month_year).includes('October') ? 31 :
                  (itemOne[0].month_year).includes('November') ? 30 :
                  (itemOne[0].month_year).includes('December') ? 31 :
                  30)).toFixed(2)}`,
                  avg_total_chats: 
                  `${new Number(itemOne[6].total_leads / ((itemOne[0].month_year).includes('January') ? 31 :
                  (itemOne[0].month_year).includes('February') ? 28 :
                  (itemOne[0].month_year).includes('March') ? 31 :
                  (itemOne[0].month_year).includes('April') ? 30 :
                  (itemOne[0].month_year).includes('May') ? 31 :
                  (itemOne[0].month_year).includes('February') ? 28 :
                  (itemOne[0].month_year).includes('June') ? 30 :
                  (itemOne[0].month_year).includes('July') ? 31 :
                  (itemOne[0].month_year).includes('August') ? 31 :
                  (itemOne[0].month_year).includes('September') ? 30 :
                  (itemOne[0].month_year).includes('October') ? 31 :
                  (itemOne[0].month_year).includes('November') ? 30 :
                  (itemOne[0].month_year).includes('December') ? 31 :
                  30)).toFixed(2)}`,
                  avg_total_forms: 
                  `${new Number(itemOne[7].total_leads / ((itemOne[0].month_year).includes('January') ? 31 :
                  (itemOne[0].month_year).includes('February') ? 28 :
                  (itemOne[0].month_year).includes('March') ? 31 :
                  (itemOne[0].month_year).includes('April') ? 30 :
                  (itemOne[0].month_year).includes('May') ? 31 :
                  (itemOne[0].month_year).includes('February') ? 28 :
                  (itemOne[0].month_year).includes('June') ? 30 :
                  (itemOne[0].month_year).includes('July') ? 31 :
                  (itemOne[0].month_year).includes('August') ? 31 :
                  (itemOne[0].month_year).includes('September') ? 30 :
                  (itemOne[0].month_year).includes('October') ? 31 :
                  (itemOne[0].month_year).includes('November') ? 30 :
                  (itemOne[0].month_year).includes('December') ? 31 :
                  30)).toFixed(2)}`,
                }
              })
            // console.log('newFormat', computedArrayThree)
            uploadData.value = computedArrayThree
            // console.log('uploadData', uploadData)
          })
          .finally(() => {
            loading.value = false
          })
      }
    }

    onMounted(() => {
      // fetchGraph()
    })

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    return {
      response,
      graph,
      loading,
      filters,
      fetchGraph,
      uploadReport,
      uploadData,
      uploadReportLoading,
      googleDocLink,
      reportLoadingDialog,
      reportUploaded,
      copy,
      isCopied,
      copyReportLink,
      dataLoaded,
      nonAccountManagerUserRole,
    }
  },
})
</script>
<style lang="scss">
.theme--dark {
 .apexcharts-tooltip{
   color: rgb(61, 60, 60);
 }
 .apexcharts-canvas{
  color: white;
} 
}


</style>
