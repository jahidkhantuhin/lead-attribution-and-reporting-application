<template>
  <div>
    <UnauthorizedUser v-if="nonAccountManagerUserRole"/>
    <v-row 
      :class="{
        'my-6': true,
        'site-records': true,
        }"
        v-if="!nonAccountManagerUserRole"
        >
      <v-col cols="12" md="12">
        <v-card>
          <v-form @submit.prevent="">
            <v-card-title>
              <v-icon left>mdi-filter</v-icon>
              {{ $t('message.filters') }}
            </v-card-title>
            <v-card-text>
              <v-row>
                
                <v-col cols="3">
                  <v-text-field
                    label="Search by name"
                    clearable
                    v-model="filters.name"
                    maxlength="250"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-autocomplete
                  v-model="filters.plugin"
                  :items="pluginOptions"
                  label="Plugin"
                  item-text="name"
                  item-value="id"
                  clearable
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-autocomplete
                  v-model="filters.theme"
                  :items="themeOptions"
                  label="Theme"
                  item-text="name"
                  item-value="id"
                  clearable
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="Status"
                    :items="statusOptions"
                    v-model="filters.status"
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <Datepicker
                    v-model="filters['date']"
                    :dateHelpButtons="[
                      'lastWeek',
                      'thisWeek',
                      'thisMonth',
                      'lastMonth',
                      'thisYear',
                      'lastYear',
                    ]"
                  ></Datepicker>
                </v-col>
                <v-col cols="3">
                  <v-subheader>Min and max speed score</v-subheader>
                  <v-range-slider
                  v-model="filters.speed_score"
                  :max="max"
                  :min="min"
                  hide-details
                  class="align-center"
                  >
                    <template v-slot:prepend>
                      <v-text-field
                        :value="filters.speed_score[0]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(filters.speed_score, 0, $event)"
                      ></v-text-field>
                    </template>
                    <template v-slot:append>
                      <v-text-field
                        :value="filters.speed_score[1]"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @change="$set(filters.speed_score, 1, $event)"
                      ></v-text-field>
                    </template>
                  </v-range-slider>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="handleFilterApply">
                <v-icon left>mdi-check</v-icon>
                {{ $t('buttons.apply') }}
              </v-btn>
              <v-btn link nuxt to="/site-records" plain>Clear</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col md="12">
        <v-card :loading="busy">
          <v-toolbar flat>
            <v-toolbar-title>Site Records</v-toolbar-title>
            <v-spacer></v-spacer>
              <v-btn icon title="Copy link to this report" @click="copyLink">
                <v-icon>mdi-link</v-icon>
              </v-btn>
              <v-btn
                v-show="loadedReport"
                icon
                @click="uploadReport"
                title="Upload to Google Drive"
                :color="googleDocLink ? 'info' : 'normal'"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
          </v-toolbar>
          <v-toolbar flat>
            <v-card-text class="ml-n4">
              <DatesAndDiff
                :start="filterParams.date_start"
                :end="filterParams.date_end"
              />
            </v-card-text>
          </v-toolbar>
          <v-data-table
            v-if="loadedReport"
            :items="computedReport"
            :headers="tableHeaders"
            @pagination="handlePaginationChange"
            :options.sync="tableOptions"
            :fixed-header="true"
            height="calc(100vh - 318px)"
            class="elevation-1"
            :footer-props="{
              'items-per-page-options': itemsPerPageOptions,
            }"
            :server-items-length="pagination.total"
          >
            <template #item.siteURL="{ item }">
              <nuxt-link class="site-link" :to="`/site-records/${item.id}`">
                <span>
                  {{ item.siteURL }}
                </span>
              </nuxt-link>
            </template>
            <template #item.clientName="{ item }">
              <nuxt-link class="site-link" :to="`/site-records/${item.id}`">
                <span>
                  {{ item.location && item.location.client ? item.location.client : '' }}
                </span>
              </nuxt-link>
            </template>
            <template #item.status="{ item }">
                  {{ item.status === 1 ? 'Active' : 'Inactive' }}
            </template>
            <template #item.accountManager="{ item }">
                  {{ item.accountManager }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
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
            <v-card-title class="mb-4">
              {{ $t('alert.success.driveUpload') }}.
            </v-card-title>

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
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  useRouter,
  useStore,
  useRoute,
  onBeforeMount,
  computed,
  useContext,
} from '@nuxtjs/composition-api'
import useSiteRecords from '@/services/useSiteRecords'
import { Dictionary } from '~/node_modules/@types/lodash'
import generateSiteRecordsReport, {
  siteRecordsColumns
} from '~/utils/reports-upload/site-records'
import swalMixin, { showToast } from '~/utils/swalMixin'
import useAxios from '~/plugins/useAxios'
import Datepicker from '~/components/forms/DatePicker.vue'
import moment from 'moment'
import { extendMoment } from 'moment-range'
const MomentRange = extendMoment(moment as any)
import DatesAndDiff from '~/components/DatesAndDiff.vue'
import UnauthorizedUser from '~/components/UnauthorizedUser.vue'

interface IClientRecordsFilter {
  sort_by?: string | null
  sorting?: string | null
  date?: any | null
  name?: any | null
  plugin?: any | null
  theme?: any | null
  status?: string | null
  speed_score?: any | null
}

export default defineComponent({
  components: {
    Datepicker,
    DatesAndDiff,
    UnauthorizedUser,
  },
  //middleware: 'isAuthenticated',
  setup(_props, { parent }) {
    // New Update Start
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('create report')
    )
    const pluginOptions = ref()
    const getPluginOptions = () => {
      pluginList().then((resp) => {
        pluginOptions.value = resp.data.data
      })
    }
    const themeOptions = ref()
    const getThemeOptions = () => {
      themeList().then((resp) => {
        themeOptions.value = resp.data.data
      })
    }
    const statusOptions = ref([
    {text: 'Active', value: 'active'},
    {text: 'Inactive', value: 'inactive'},
    ])
    // New Update End
    const route = useRoute()
    const itemsPerPageOptions = ref([20, 50, 100, 500])
    const itemsPerPage = ref(itemsPerPageOptions.value[0])
    const min = ref(0)
    const max = ref(100)
    const defaultFilterValues: IClientRecordsFilter = {
      // sort_by: `url`,
      // sorting: 'asc',
      date: [
        moment().subtract('1', 'month').startOf('month').format('YYYY-MM-DD'),
        moment().subtract('1', 'month').endOf('month').format('YYYY-MM-DD'),
      ],
      name: [],
      plugin: [],
      theme: [],
      // status: 'all',
      speed_score: [0, 100]
    }
    const filters = ref<IClientRecordsFilter>(defaultFilterValues)
    const filterParams = computed(() => {
      return {
        date_start: filters.value.date[0],
        date_end: filters.value.date[1],
        name: filters.value.name,
        plugin: filters.value.plugin,
        theme: filters.value.theme,
        status: filters.value.status,
        speed_score_min: filters.value.speed_score[0],
        speed_score_max: filters.value.speed_score[1],
      }
    })

    const tablePage = ref(1)
    const pagination = ref({
      total: 0,
    })
    const router = useRouter()
    const store = useStore()
    const { list, pluginList, themeList} = useSiteRecords()
    const busy = ref(false)
    const loadedReport = ref(false)
    const uploadReportLoading = ref(false)
    const reportLoadingDialog = ref(false)
    const reportUploaded = ref(false)
    const $swal = swalMixin((parent as any).$swal as any)
    const axios = useAxios()

    const report = ref({
      result: []
    })

    const computedReport = computed(() => {
      let data = report.value
      return (
        data.result.map((reportItem: any) => {
          reportItem.siteURL = reportItem.url ? reportItem.url : ''
          reportItem.clientName = reportItem?.location?.client?.name || ''
          reportItem.status = reportItem?.status || ''
          reportItem.accountManager = reportItem?.location?.client?.account_manager_id || ''
        const item = {
            ...reportItem,
          }

          return item
        })
      )

    })

    const tableHeaders = ref([...siteRecordsColumns()])

    // set the page breadcrumbs
    const breadcrumbs = [
      {
        text: `Dashboard`,
        to: `/`,
        disabled: false,
      },
      {
        text: `Site Records`,
        to: `/site-records`,
        disabled: true,
      },
    ]

    const tableOptions = ref<any>({})

    watch(
      tableOptions,
      (v: any) => {
        tablePage.value = v.page;
        itemsPerPage.value = v.itemsPerPage
        console.log('TableOptions', v)
        
        if (tableOptions.value.sortBy[0]) {
          filters.value.sort_by =
            tableOptions.value.sortBy[0] === 'fullname'
              ? 'first_name'
              : tableOptions.value.sortBy[0]
          filters.value.sorting = tableOptions.value.sortDesc[0]
            ? 'desc'
            : 'asc'
        }

        handleFilterApply()
      },
      { deep: true }
    )

    const pageTitle = `Site Records`

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    const getSiteRecords = () => {
      if (busy.value === false) {
        const appliedFilters = {
          ...filterParams.value,
          // sort_by:
          //   filters.value.sort_by + `:` + filters.value?.sorting?.toLowerCase(),
        }
        googleDocLink.value = ''
        reportUploaded.value = false
        busy.value = true
        list({
          ...appliedFilters,
          limit: itemsPerPage.value,
          page: tablePage.value,
        })
          .then((resp) => {
            report.value = resp.data.data ? resp.data.data : []
            resp.data.data.result.map((item:any) => {
              return (
                item.avg_desktop_score = item.avg_desktop_score ? `${new Number(item.avg_desktop_score).toFixed(2)}` : 0,
                item.avg_desktop_speed_index = item.avg_desktop_speed_index ? `${new Number(item.avg_desktop_speed_index).toFixed(2)}` : 0,
                item.avg_mobile_score = item.avg_mobile_score ? `${new Number(item.avg_mobile_score).toFixed(2)}` : 0,
                item.avg_mobile_speed_index = item.avg_mobile_speed_index ? `${new Number(item.avg_mobile_speed_index).toFixed(2)}` : 0,
                item.avg_server_response_time = item.avg_server_response_time ? `${new Number(item.avg_server_response_time).toFixed(2)}` : 0
              )
            })
            pagination.value = resp.data.data.pagination
            loadedReport.value = true
            console.log('SITE RECORDS', report.value)
          })
          .finally(() => {
            busy.value = false
          })
      }
    }

    const handleFilterApply = () => {
      router.push({
        path: router.currentRoute.path,
        query: {
          page: tablePage.value.toString(),
          itemsPerPage: itemsPerPage.value.toString(),
          ...(filters.value as Dictionary<
            string | (string | null)[] | null | undefined
          >),
        },
      })
    }

    const loadFiltersFromURL = () => {
      const query = route.value.query
      if (query.page) {
        tablePage.value = +query.page
        delete query['page']
      } else {
        tablePage.value = 1
      }
      console.log('PageNumber', tablePage.value)
      if (query.itemsPerPage) {
        itemsPerPage.value = +query.itemsPerPage
        delete query['itemsPerPage']
      } else {
        itemsPerPage.value = 20
      }
      console.log('ItemsPerPage', itemsPerPage.value)

      filters.value = { ...defaultFilterValues, ...query }
      getSiteRecords()
    }

    const handlePaginationChange = (e: any) => {
      itemsPerPage.value = e.itemsPerPage === -1 ? 500 : e.itemsPerPage
      // handleFilterApply()
    }

    const googleDocLink = ref('')


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
          generateSiteRecordsReport(computedReport, {
            user: (store as any).state.auth.user,
            filters: filters,
          }),
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

    const copyLink = () => {
      window.navigator.clipboard.writeText(window.location.href)
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

    watch(route, () => {
      loadFiltersFromURL()
      // getSiteRecords()
    })

    onBeforeMount(() => {
      loadFiltersFromURL()
      getPluginOptions()
      getThemeOptions()
    })

    onMounted(() => {
    })

    return {
      tableOptions,
      tableHeaders,
      getSiteRecords,
      busy,
      itemsPerPageOptions,
      pagination,
      handlePaginationChange,
      handleFilterApply,
      filters,
      report,
      computedReport,
      loadedReport,
      uploadReport,
      uploadReportLoading,
      googleDocLink,
      copy,
      copyLink,
      reportLoadingDialog,
      reportUploaded,
      // New Update Start
      pluginOptions,
      getPluginOptions,
      themeOptions,
      getThemeOptions,
      statusOptions,
      filterParams,
      min,
      max,
      nonAccountManagerUserRole,
      // New Update End
    }
  },
  head: {
    title: 'Site Records',
  },
})
</script>
<style lang="scss">
.site-link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: red;
  }
}
.site-records .v-data-table {
  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 4;
    background: white;
  }
  table > tbody > tr {
    &:hover {
      th,
      td {
        background: #eee !important;
      }
    }
  }
  table > thead > tr > th:nth-child(1) {
    z-index: 5;
  }

  // @media (min-width: 768px) {
  //   table > tbody > tr > td:nth-child(2),
  //   table > thead > tr > th:nth-child(2) {
  //     position: sticky !important;
  //     position: -webkit-sticky !important;
  //     left: 340px;
  //     z-index: 4;
  //     background: white;
  //   }
  //   table > thead > tr > th:nth-child(2) {
  //     z-index: 5;
  //   }
  // }
}
.theme--dark {
  .site-records .v-data-table {
  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 4;
    background: rgb(29, 28, 28);
  }
  table > tbody > tr {
    &:hover {
      th,
      td {
        background: rgb(63, 62, 62) !important;
      }
    }
  }
  table > thead > tr > th:nth-child(1) {
    z-index: 5;
  }
}
}

</style>

