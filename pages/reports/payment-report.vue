<template>
  <div>
    <div>
      <UnauthorizedUser v-if="nonAccountManagerUserRole"/>
    </div>
    <div v-if="!nonAccountManagerUserRole">
      <v-row class="my-5">
        <v-col cols="12" md="12" lg="3">
          <v-card color="default" rounded class="min-h-300">
            <v-card-title>{{ $t('message.filters') }}</v-card-title>
            <payment-report-filters
              :callScorersLoading="callScorersLoading"
              :headers="headers"
              :callScorers="callScorers"
              :loading="generatingPaymentReportLoading"
              @search="handleGenerateReport"
            ></payment-report-filters>
          </v-card>
        </v-col>
        <v-col md="12" lg="9">
          <v-card v-if="generatingPaymentReportLoading">
            <v-card-text>
              <v-skeleton-loader
                type="table-heading, list-item-two-line, image, table-tfoot"
              ></v-skeleton-loader>
            </v-card-text>
          </v-card>
          <v-card v-else class="min-h-300">
            <v-toolbar flat>
              <v-toolbar-title> Report Details: </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                v-show="loaded"
                icon
                title="Copy link to this report"
                @click="copyReportLink"
              >
                <v-icon>mdi-link</v-icon>
              </v-btn>
              <v-btn
                icon
                title="Reload the report"
                v-show="loaded"
                @click="fetchPaymentReport"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                v-show="loaded"
                icon
                @click="uploadReport"
                title="Upload to Google Drive"
                :color="googleDocLink ? 'info' : 'normal'"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </v-toolbar>

            <!-- no filters selected -->
            <v-card-subtitle
              v-if="loaded === false && paymentReport.ratings.length === 0"
            >
              Please apply appropriate filters to see the data.
            </v-card-subtitle>

            <!-- nothing found -->
            <v-card-text
              v-if="loaded === true && paymentReport.ratings.length === 0"
            >
              <v-alert color="info lighten-2"> No reports found. </v-alert>
            </v-card-text>

            <v-card-text>
              <report-generated
                :scorer="selectedCallScorer && selectedCallScorer.fullname"
                :date="
                  selectedFilters &&
                  selectedFilters.date &&
                  selectedFilters.date.join(',')
                "
                v-if="
                  paymentReport.ratings.length > 0 &&
                  generatingPaymentReportSuccess === true &&
                  generatingPaymentReportLoading === false
                "
              ></report-generated>
            </v-card-text>

            <!-- CLient Info -->
            <v-card-text
              class="text-h5"
              v-if="loaded === true && paymentReport.ratings.length > 0"
            >
              Scorer: {{ selectedCallScorer && selectedCallScorer.fullname }}
            </v-card-text>
            <v-card-text v-if="loaded === true">
              <DatesAndDiff
                :start="selectedFilters.from"
                :end="selectedFilters.to"
              />
            </v-card-text>

            <v-card-text v-if="loaded">
              <p class="body-2 mb-2">
                Last updated at
                <formatted-date
                  :timezone="false"
                  :date="paymentReport.cache.created_at"
                ></formatted-date>
              </p>
            </v-card-text>
            <!-- summary -->
            <div class="payment-report-detail">
              <payment-report-detail
                :scorer="selectedCallScorer && selectedCallScorer.fullname"
                :payRate="payRate"
                :report="computedReport"
                v-if="
                  generatingPaymentReportSuccess === true &&
                  generatingPaymentReportLoading === false
                "
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
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
                  <a @click="copy" v-bind="attrs" v-on="on">
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
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  useStore,
  onMounted,
  computed,
  onBeforeMount,
  useRouter,
  useContext,
} from '@nuxtjs/composition-api'
import PaymentReportFilters from '~/components/PaymentReportFilters.vue'
import ReportGenerated from '~/components/ReportGenerated.vue'
import ReportGenerateFailed from '~/components/ReportGenerateFailed.vue'
import PaymentReportDetail from '~/components/PaymentReportDetail.vue'
import useAxios from '~/plugins/useAxios'
import { IBreadcrumbs } from '~/store'
import useUsers from '~/services/useUsers'
import { CALL_SCORER_ROLE } from '~/utils/UserEnums'
import FormattedDate from '~/components/FormattedDate.vue'
import DatesAndDiff from '~/components/DatesAndDiff.vue'
import secondsToHHMMSS from '~/utils/secondsToHHMMSS'
import swalMixin, { showToast } from '~/utils/swalMixin'
import generatePaymentReport from '~/utils/reports-upload/payment-report'
import UnauthorizedUser from '~/components/UnauthorizedUser.vue'


interface IFilters {
  user_id: any
  from: any
  to: any
}

const totalsSkeleton = {
  name: 'Totals',
  total_calls: 0,
  total_call_duration: 0,
  total_rating_time: 0,
  pay_rate: 0,
  total: 0,
}

export default defineComponent({
  components: {
    PaymentReportFilters,
    ReportGenerated,
    ReportGenerateFailed,
    DatesAndDiff,
    PaymentReportDetail,
    FormattedDate,
    UnauthorizedUser,
  },
  // middleware: 'isAuthenticated',
  setup(props, { parent }) {
    const store = useStore()
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('create report') && $auth.hasScope('vpn access')
    )
    let payRate = ref(0)
    const axios = useAxios()
    let paymentReport = ref({
      ratings: [],
      cache: {},
    })
    let selectedFilters = ref({
      user_id: null,
      from: '',
      to: '',
    })
    let generatingPaymentReportLoading = ref(false)
    let generatingPaymentReportSuccess = ref(false)
    let loaded = ref(false)
    let headers = ref([])
    const $swal = swalMixin((parent as any).$swal as any)

    const callScorers = ref([])
    const callScorersLoading = ref(true)

    const { list } = useUsers()
    const router = useRouter()

    const totals = ref({
      ...totalsSkeleton,
    })

    const copyReportLink = () => {
      window.navigator.clipboard.writeText(
        `${window.location.host}${router.currentRoute.fullPath}`
      )
      showToast($swal, {
        title: 'Link copied to clipboard',
      })
    }
    const copy = () => {
      window.navigator.clipboard.writeText(googleDocLink.value)
      showToast($swal, {
        title: 'Copied to clipboard',
      })
    }

    const computedReport = computed(() => {
      let list = paymentReport.value?.ratings.map((rating: any) => {
        totals.value.total_calls = totals.value.total_calls + rating.total_calls
        totals.value.total_call_duration =
          +totals.value.total_call_duration + rating.total_call_duration
        totals.value.total_rating_time =
          +totals.value.total_rating_time + rating.total_rating_time

        rating.pay_rate = payRate.value
        return rating
      })

      list = list.map((rating) => {
        let reportTotal: any = payRate.value * (rating.total_rating_time / 3600)
        reportTotal = reportTotal.toFixed(2)
        rating.total = reportTotal
        let totalsTotal = +rating.total + totals.value.total

        totals.value.total = +new Number(totalsTotal).toFixed(2)

        return rating
      })

      // Now show
      list = list.map((rating) => {
        rating.total = `$${rating.total}`
        rating.pay_rate = `$${rating.pay_rate}`
        rating.total_call_duration = secondsToHHMMSS(rating.total_call_duration)
        rating.total_rating_time = secondsToHHMMSS(rating.total_rating_time)
        return rating
      })

      // @ts-ignore
      totals.value.total = `$${totals.value.total}`
      // @ts-ignore
      totals.value.pay_rate = `$${payRate.value}`
      // @ts-ignore
      totals.value.total_call_duration = secondsToHHMMSS(
        totals.value.total_call_duration
      )
      // @ts-ignore
      totals.value.total_rating_time = secondsToHHMMSS(
        totals.value.total_rating_time
      )

      return [...list, totals.value]
    })

    const getUsers = () => {
      callScorersLoading.value = true
      list({
        sort_by: 'first_name:asc',
        role: CALL_SCORER_ROLE,
        limit: 200,
      })
        .then((res) => {
          callScorers.value = res.data.data.result
        })
        .finally(() => {
          callScorersLoading.value = false
        })
    }

    onBeforeMount(() => {
      getUsers()
    })

    let selectedCallScorer = computed(() => {
      if (selectedFilters && (selectedFilters as any).value.user_id) {
        const userid = (selectedFilters as any).value.user_id
        return (callScorers as any).value.find((c: any) => {
          return c.id === userid
        })
      } else {
        return ''
      }
    })

    const fetchPaymentReport = () => {
      googleDocLink.value = ''
      reportUploaded.value = false
      totals.value = { ...totalsSkeleton }
      generatingPaymentReportLoading.value = true
      generatingPaymentReportSuccess.value = true
      loaded.value = false
      axios
        .get(
          `/reports?type=payment&user_id=${selectedFilters.value.user_id}&from=${selectedFilters.value.from}&to=${selectedFilters.value.to}`,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${(store.state as any).cred.cred}`
            }
          }
        )
        .then((res: any) => {
          generatingPaymentReportLoading.value = false
          generatingPaymentReportSuccess.value = true
          loaded.value = true
          if (res.data && res.data && res.data.data && res.data.data.ratings) {
            paymentReport.value = res.data.data
            payRate.value = res.data.data.pay_rate
          }
        })
        .catch((e: any) => {
          generatingPaymentReportLoading.value = false
          generatingPaymentReportSuccess.value = false
          loaded.value = true
        })
    }
    const handleGenerateReport = (filters: any) => {
      selectedFilters.value = {
        user_id: filters['user_id'],
        from: filters['dates'][0],
        to: filters['dates'][1] ? filters['dates'][1] : filters['dates'][0],
      }
      fetchPaymentReport()
    }

    const uploadReportLoading = ref(false)
    const googleDocLink = ref('')
    const reportLoadingDialog = ref(false)
    const reportUploaded = ref(false)

    const uploadReport = () => {
      if (reportUploaded.value === true) {
        reportLoadingDialog.value = true
        return
      }

      uploadReportLoading.value = true
      reportLoadingDialog.value = true
      axios
        .post(
          '/reports/upload',
          generatePaymentReport(computedReport, {
            scorer: selectedCallScorer,
            filters: selectedFilters,
            user: (store as any).state.auth.user,
          }) as any,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${(store.state as any).cred.cred}`
            }
          }
        )
        .then((res) => {
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
    }

    // const uploadReport = () => {

    // if (reportUploaded.value === true) {
    //   reportLoadingDialog.value = true
    //   return
    // }

    // uploadReportLoading.value = true
    // reportLoadingDialog.value = true
    // axios
    //   .post(
    //     '/reports/reports/upload',
    //     {
    //       type: 'payment-report',
    //       from: selectedFilters.value.from,
    //       to: selectedFilters.value.to,
    //       user_id: selectedFilters.value.user_id,
    //       ratings: computedReport.value,
    //     },
    //     {
    //       withCredentials: true,
    //     }
    //   )
    //   .then((res) => {
    //     googleDocLink.value = res.data?.data?.url
    //     reportUploaded.value = true
    //   })
    //   .catch(() => {
    //     uploadReportLoading.value = false
    //     reportLoadingDialog.value = false
    //   })
    //   .finally(() => {
    //     uploadReportLoading.value = false
    //   })
    // }

    onMounted(() => {
      const breadcrumbs: IBreadcrumbs[] = [
        {
          text: 'Dashboard',
          to: '/',
        },
        {
          text: 'Reports',
          to: '/reports',
        },
        {
          text: 'Payment Report',
          to: '#',
          disabled: true,
        },
      ]

      store.dispatch('setPageHeading', {
        pageTitle: 'Payment Report',
        breadcrumbs,
      })
    })

    return {
      payRate,
      paymentReport,
      selectedFilters,
      generatingPaymentReportLoading,
      generatingPaymentReportSuccess,
      loaded,
      headers,
      fetchPaymentReport,
      handleGenerateReport,
      callScorers,
      computedReport,

      selectedCallScorer,

      uploadReportLoading,
      googleDocLink,
      reportLoadingDialog,
      reportUploaded,
      uploadReport,
      copy,
      copyReportLink,
      callScorersLoading,
      nonAccountManagerUserRole,
    }
  },
  head: {
    title: 'Payment Report',
  },
})
</script>

<style lang="scss">
.generate-report-form {
  padding-top: 0;
  padding-bottom: 0;
}

.payment-report-detail table tbody {
  tr {
    &:last-child {
      background: #eee;
    }
  }
}
.theme--dark {
 .payment-report-detail table tbody {
  tr {
    &:last-child {
      background: #000;
    }
  }
} 
}
</style>
