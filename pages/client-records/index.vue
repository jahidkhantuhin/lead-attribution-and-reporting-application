<template>
  <div>
    <UnauthorizedUser v-if="nonAccountManagerUserRole"/>
    <v-row
      :class="{
        'my-6': true,
        'client-records': true,
      }"
      v-if="!nonAccountManagerUserRole"
    >
      <v-col  md="12">
        <v-card>
          <v-col md="6"><v-card-text>
            <v-text-field
              label="Search"
              append-icon="mdi-magnify"
              clearable
              v-model="filters.name"
              @keydown.enter="handleFilterApply"
              maxlength="250"
              >
            </v-text-field>
          </v-card-text></v-col>
        <v-col md="6"></v-col>
          
        </v-card>
      </v-col>
      <v-col md="12">
        <v-card :loading="busy">
          <v-toolbar flat>
            <v-toolbar-title>Client Records</v-toolbar-title>
            <!-- <v-spacer></v-spacer> -->
            <v-btn class="ml-5" color="primary" nuxt to="/client-records/add">
              <v-icon left>mdi-account-plus</v-icon>
              Add
            </v-btn>
          </v-toolbar>
      <v-data-table
            :items="items"
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
            <template #item.status="{ item }">
              <nuxt-link class="client-link" :to="`/client-records/${item.id}`">
              {{ item.status }}
              </nuxt-link>
            </template>
            <template #item.num_of_locations="{ item }">
              <nuxt-link class="client-link" :to="`/client-records/${item.id}`">
              {{ item.num_of_locations }}
              </nuxt-link>
            </template>
            <template #item.account_manager_id="{ item }">
              <nuxt-link class="client-link" :to="`/client-records/${item.id}`">
              <span v-if="item && item.account_manager"
                >{{ item.account_manager.first_name }}
                {{ item.account_manager.last_name }}
              </span>
              </nuxt-link>
            </template>
            <template #item.name="{ item }">
              <nuxt-link class="client-link" :to="`/client-records/${item.id}`">
                <span>{{ item.last_name }} {{ item.first_name }}</span>
              </nuxt-link>
            </template>
            <template #item.updated_at="{ item }">
              <formatted-date :date="item.updated_at"></formatted-date>
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
                    title="View Client"
                    :to="`/client-records/${item.id}`"
                  >
                    <v-list-item-title>View Client</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    title="Edit Client"
                    :to="`/client-records/${item.id}/edit`"
                  >
                    <v-list-item-title>Edit Client</v-list-item-title>
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
  useContext,
  computed,
} from '@nuxtjs/composition-api'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import useClientRecords from '@/services/useClientRecords'
import useClientLocations from '~/services/useClientLocations'
import ClientRecordsForm from '@/components/forms/ClientRecordsForm.vue'
import { AM_ROLE } from '~/utils/UserEnums'
import { Dictionary } from '~/node_modules/@types/lodash'
import FormattedDate from '~/components/FormattedDate.vue'
import ClientStatusChip from '~/components/ClientStatusChip.vue'
import useUsers from '~/services/useUsers'
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
    ClientRecordsForm,
    FormattedDate,
    ClientStatusChip,
    UnauthorizedUser,
  },
  // middleware: 'isAuthenticated',
  setup(_props, { parent, emit }) {
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('create report')
    )
    const statusOptions = ref([])
    const statusOptionsLoading = ref(false)
    const { deleteLocation } = useClientLocations()
    const loadingAccountManagers = ref(false)
    const route = useRoute()
    const $swal2 = swalMixin((parent as any).$swal as any)
    const accountManagers = ref<Array<any>>([])
    const itemsPerPageOptions = ref([20, 50, 100, 500])
    const itemsPerPage = ref(itemsPerPageOptions.value[0])
    const defaultFilterValues: IClientRecordsFilter = {
      // search: null,
      // status: '',
      sort_by: `name`,
      sorting: 'asc',
      // account_manager: '',
    }
    const filters = ref<IClientRecordsFilter>(defaultFilterValues)
    const tablePage = ref(1)
    const pagination = ref({
      total: 0,
    })
    const router = useRouter()
    const store = useStore()
    const { list, listStatus } = useClientRecords()
    const { list: listUsers } = useUsers()
    const busy = ref(false)

    const items: any = ref([])

    const tableHeaders = ref([
      {
        text: `Actions`,
        align: `start`,
        width: '130px',
        sortable: false,
        value: `actions`,
      },
      {
        text: `Client Name`,
        align: `start`,
        sortable: true,
        value: `name`,
        width: '200px',
      },
      
      {
        text: `Status`,
        align: `start`,
        sortable: true,
        width: '130px',
        value: `status`,
      },
      {
        text: `Account Manager`,
        align: `start`,
        sortable: true,
        width: '160px',
        value: `account_manager_id`,
      },
      {
        text: `Locations`,
        align: `start`,
        width: '130px',
        sortable: false,
        value: `num_of_locations`,
      },
      {
        text: `Last updated`,
        align: `start`,
        sortable: false,
        width: '120px',
        value: `updated_at`,
      },
    ])

    const handleDeleteLocation = (id: any) => {
      showConfirmDialog($swal2, {
        title: 'Delete Location',
        text: 'Are you sure you want to delete this location?',
        icon: 'warning',
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          busy.value = true
          await deleteLocation(id).finally(() => {
            busy.value = false
          })
          showToast($swal2, {
            title: 'Location deleted',
            icon: 'success',
          })
          emit('fetchClient')
        }
        getClientRecords()
      })
      
    }
    // set the page breadcrumbs
    const breadcrumbs = [
      {
        text: `Dashboard`,
        to: `/`,
        disabled: false,
      },
      {
        text: `Client Records`,
        to: `/client-records`,
        disabled: true,
      },
    ]

    const sortingOptions = [
      { text: `Ascending`, value: `asc` },
      { text: `Descending`, value: `desc` },
    ]

    const tableOptions = ref<any>({})

    watch(
      tableOptions,
      (v: any) => {
        tablePage.value = v.page;
        itemsPerPage.value = v.itemsPerPage
        
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

    const pageTitle = `Client Records`

    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    const getClientRecords = () => {
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
            items.value = resp.data.data.result
            pagination.value = resp.data.data.pagination
            console.log('CR', items.value)
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
      // getClientRecords()
    }

    const getStatusOptions = () => {
      listStatus().then((resp) => {
        statusOptions.value = Object.keys(resp.data.data).map((key) => {
          return {
            id: new String(key).toString(),
            value: resp.data.data[key],
          }
        }) as any
      })
    }

    const getAccountManagers = () => {
      loadingAccountManagers.value = true
      listUsers({
        sort_by: 'first_name:asc',
        role: AM_ROLE,
        limit: 200,
      })
        .then((res) => {
          accountManagers.value = [
            {
              fullname: 'All',
              id: null,
            },
            ...res.data.data.result.map((item: any) => {
              return {
                ...item,
                id: new String(item.id).toString(),
              }
            }),
          ]
        })
        .finally(() => {
          loadingAccountManagers.value = false
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
      if (query.itemsPerPage) {
        itemsPerPage.value = +query.itemsPerPage
        delete query['itemsPerPage']
      } else {
        itemsPerPage.value = 20
      }

      filters.value = { ...defaultFilterValues, ...query }
      getClientRecords()
    }

    const handlePaginationChange = (e: any) => {
      itemsPerPage.value = e.itemsPerPage === -1 ? 500 : e.itemsPerPage
      // tablePage.value = e.page
      // handleFilterApply()
      // getClientRecords()
    }

    watch(route, () => {
      loadFiltersFromURL()
      // getClientRecords()
    })

    onBeforeMount(() => {
      loadFiltersFromURL()
      getAccountManagers()
    })

    onMounted(() => {
      // getClientRecords()
      getStatusOptions()
    })

    return {
      tableOptions,
      statusOptionsLoading,
      statusOptions,
      sortingOptions,
      tableHeaders,
      items,
      getClientRecords,
      busy,
      itemsPerPageOptions,
      pagination,
      handlePaginationChange,
      accountManagers,
      handleFilterApply,
      loadingAccountManagers,
      filters,
      handleDeleteLocation,
      nonAccountManagerUserRole,
    }
  },
  head: {
    title: 'Client Records',
  },
})
</script>

<style lang="scss">
/* stylelint-disable no-descending-specificity */

.client-link {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: red;
  }
}
// @todo Wait for Vuetify table fixed column feature. Remove this code when that's done. so we can use configuration.
.client-records .v-data-table {
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
  .client-records .v-data-table {
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
