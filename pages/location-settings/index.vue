<template>
  <div>
    <UnauthorizedUser v-if="nonAccountManagerUserRole"/>
    <v-row class="my-6" v-if="!nonAccountManagerUserRole">    
      <v-col md="12">
        <v-card :loading="busy">
          <v-toolbar flat>
            <v-toolbar-title>Location Settings (Missing Client)</v-toolbar-title>
            <v-btn class="ml-5" color="primary" nuxt to="/location-settings/add">
              <v-icon left>mdi-account-plus</v-icon>
              Add to Existing Client
            </v-btn>
            <v-spacer></v-spacer>
              <v-btn icon title="Copy link to this report" @click="copyLink">
                <v-icon>mdi-link</v-icon>
              </v-btn>
          </v-toolbar>
          <v-data-table
            :items="report"
            :headers="tableHeaders"
            @pagination="handlePaginationChange"
            :options.sync="tableOptions"
            :fixed-header="true"
            height="calc(100vh - 318px)"
            class="elevation-1"
            :footer-props="{
              'items-per-page-options': itemsPerPageOptions,
            }"
          >
          <template #item.created_at="{ item }">
              <formatted-date :date="item.created_at"></formatted-date>
            </template>
            <template #item.actions="{ item }">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small color="primary" dark v-bind="attrs" v-on="on">
                    Actions
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    title="Add to exsisting client"
                    :to="`/location-settings/add?id=${item.id}&name=${item.name}`"
                  >
                    <v-list-item-title>Add to exsisting client</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    title="Create new client"
                    @click="handleCreateClientRequest(item.id)"
                  >
                    <v-list-item-title>Create new client</v-list-item-title>
                </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
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
import useLocationRecords from '@/services/useLocationRecords'
import { Dictionary } from '~/node_modules/@types/lodash'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import useAxios from '~/plugins/useAxios'
import FormattedDate from '~/components/FormattedDate.vue'
import UnauthorizedUser from '~/components/UnauthorizedUser.vue'


interface IClientRecordsFilter {
  account_manager?: string | null
  status?: string | null
  sort_by?: string | null
  sorting?: string | null
  name?: string | null
}

export default defineComponent({
  components: {
    FormattedDate,
    UnauthorizedUser,
  },
  // middleware: 'isAuthenticated',
  setup(_props, { parent }) {
    const route = useRoute()
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('create report')
    )
    const itemsPerPageOptions = ref([20, 50, 100, 500])
    const itemsPerPage = ref(itemsPerPageOptions.value[0])
    const defaultFilterValues: IClientRecordsFilter = {
      sort_by: `url`,
      sorting: 'asc',
    }
    const filters = ref<IClientRecordsFilter>(defaultFilterValues)
    const tablePage = ref(1)
    const pagination = ref({
      total: 0,
    })
    const router = useRouter()
    const store = useStore()
    const { list, createClientByLocationId} = useLocationRecords()
    const busy = ref(false)
    const loadedReport = ref(false)
    const $swal = swalMixin((parent as any).$swal as any)
    const axios = useAxios()

    const report = ref([])


    const tableHeaders = ref([
      {
        text: ``,
        align: `start`,
        sortable: false,
        value: `actions`,
      },
      {
        text: `Location-name`,
        align: `start`,
        sortable: true,
        value: `name`,
      },
      {
        text: `Location-status`,
        align: `start`,
        sortable: true,
        value: `status`,
      },
      
      {
        text: `Account Manager`,
        align: `start`,
        sortable: true,
        value: `account_manager`,
      },
      {
        text: `Website`,
        align: `start`,
        sortable: true,
        value: `website`,
      },
      {
        text: `Created`,
        align: `start`,
        sortable: true,
        value: `created_at`,
      },
    ])

    // set the page breadcrumbs
    const breadcrumbs = [
      {
        text: `Dashboard`,
        to: `/`,
        disabled: false,
      },
      {
        text: `Location Settings`,
        to: `/location-settings`,
        disabled: true,
      },
    ]

    const tableOptions = ref<any>({})

    const handleCreateClientRequest = (id: any) => {
      showConfirmDialog($swal, {
        title: 'Create New Client',
        text: 'Are you sure you want to create a new client for this location?',
        icon: 'warning',
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          busy.value = true
          await createClientByLocationId(id).finally(() => {
            busy.value = false
            loadFiltersFromURL()
          })
          showToast($swal, {
            title: 'Request sent for creating client',
            icon: 'success',
          })
        }
      })
    }

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

    const pageTitle = `Location Settings (Missing Client)`

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    const getLocationRecords = () => {
      if (busy.value === false) {
        const appliedFilters = {
          ...filters.value,
          sort_by:
            filters.value.sort_by + `:` + filters.value?.sorting?.toLowerCase(),
        }
        busy.value = true
        list({
          ...appliedFilters,
          limit: itemsPerPage.value,
          page: tablePage.value,
        })
          .then((resp) => {
            report.value = resp.data.data.result ? resp.data.data.result : []
            pagination.value = resp.data.data.pagination
            loadedReport.value = true
            console.log('LOCATION RECORDS', report.value)
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
      getLocationRecords()
    }

    const handlePaginationChange = (e: any) => {
      itemsPerPage.value = e.itemsPerPage === -1 ? 500 : e.itemsPerPage
    }

    const copyLink = () => {
      window.navigator.clipboard.writeText(window.location.href)
      showToast($swal, {
        title: 'Link copied to clipboard',
      })
    }

    watch(route, () => {
      loadFiltersFromURL()
    })

    onBeforeMount(() => {
      loadFiltersFromURL()
    })

    onMounted(() => {
    })

    return {
      tableOptions,
      tableHeaders,
      getLocationRecords,
      busy,
      itemsPerPageOptions,
      pagination,
      handlePaginationChange,
      handleFilterApply,
      filters,
      report,
      loadedReport,
      copyLink,
      handleCreateClientRequest,
      nonAccountManagerUserRole,
    }
  },
  head: {
    title: 'Location Settings (Missing Client)',
  },
})
</script>

