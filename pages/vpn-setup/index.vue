<template>
  <div>
    <div>
      <v-row class="my-6" justify="center">
      <v-col xl="8" lg="8" md="8" sm="12">
        <!-- <VpnSetupForm
          @cancel="$router.push(`/vpn-setup/`)"
          @submit="loadFiltersFromURL()"
        ></VpnSetupForm> -->
        <div>
          <div>
            <v-row v-if="connectedToVpn">
              <v-col cols="12">
                <v-alert
                  shaped
                  prominent
                  type="error"
                >
                  You are currently connected to wm4d vpn. Please disconnect from vpn and <v-btn small class="info" @click="refreshPage"> Click Here</v-btn>
                </v-alert>
              </v-col>
            </v-row>
          </div>
          <div>
            <v-form v-model="formValid">
              <v-card>
                <v-card-title> Add IP Address </v-card-title>
                <v-row>
                  <v-col cols="12" xl="6" lg="6" md="8" sm="12">
                    <v-card-text>
                      <v-autocomplete
                        ref="autoComplete"
                        v-model="formData.url"
                        label="Search for a site"
                        clearable
                        placeholder="Search for a client *"
                        :items="clientsList"
                        :loading="clientsListLoading"
                        item-text="url"
                        :filter="() => true"
                        item-value="url"
                        :no-data-text="
                          clientsListLoading === false && searchInput && searchInput.length > 0
                            ? 'No Results found'
                            : clientsListLoading
                            ? 'Loading'
                            : 'Search something'
                        "
                        :search-input.sync="searchInput"
                        @keydown="fetchClients(searchInput)"
                        @change="onChange"
                        :rules="rules.url"
                        @keydown.enter="formValid && submit()"
                      >
                      </v-autocomplete>
                    </v-card-text>
                  </v-col>
                  <v-col cols="4" xl="2" lg="2" md="4" sm="4">
                    <v-card-text>
                      <v-select
                        label="Period"
                        :items="numberOfHours"
                        v-model="formData.number_of_hours"
                        :rules="rules.number_of_hours"
                        clearable
                      ></v-select>
                    </v-card-text>
                  </v-col>
                  <v-col cols="8" xl="4" lg="4" md="6" sm="8" v-if="adminUser">
                    <v-card-text >
                      <v-text-field
                        label="IP Address"
                        class="mb-3"
                        v-model="formData.ip"
                        :rules="rules.ip"
                        clearable
                      >
                      </v-text-field>
                    </v-card-text>
                  </v-col>
                  <v-col cols="8" xl="4" lg="4" md="6" sm="8" v-if="!adminUser">
                    <v-card-text >
                      <v-text-field
                        label="IP Address"
                        class="mb-3"
                        v-model="formData.ip"
                        :rules="rules.ip"
                        readonly
                      >
                      </v-text-field>
                    </v-card-text>
                  </v-col>
                  
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="busy" @click="route.push('/vpn-setup')">Cancel</v-btn>
                  <v-btn
                    :disabled="!formValid || connectedToVpn"
                    :loading="busy"
                    color="primary"
                    @click.prevent="formValid && submit()"
                  >
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </div>
        </div>
      </v-col>
    </v-row>
    </div>
    <div>
        <v-row
          :class="{
            'my-6': true,
            'client-records': true,
          }"
        >
          <v-col md="12">
            <v-card :loading="busy">
              <v-toolbar flat>
                <v-toolbar-title>VPN activity log</v-toolbar-title>
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
              <template #item.user.first_name="{ item }">
                  <span>
                    {{ item.user.first_name }} {{ item.user.last_name }}
                  </span>
                </template>
                <template #item.actions="{ item }">
                  <v-menu>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn small v-bind="attrs" v-on="on"> Actions </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        title="Delete Location"
                        @click="handleDeleteIP(item.id)"
                      >
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
    </div>
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
// import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import useClientRecords from '@/services/useClientRecords'
import useClientLocations from '~/services/useClientLocations'
import ClientRecordsForm from '@/components/forms/ClientRecordsForm.vue'
// import { AM_ROLE } from '~/utils/UserEnums'
// import { Dictionary } from '~/node_modules/@types/lodash'
import FormattedDate from '~/components/FormattedDate.vue'
import ClientStatusChip from '~/components/ClientStatusChip.vue'
import useUsers from '~/services/useUsers'
import useAxios from '~/plugins/useAxios'
import UnauthorizedUser from '~/components/UnauthorizedUser.vue'
import VpnSetupForm from '@/components/forms/VpnSetupForm.vue'
// import LocationForm from './LocationForm.vue'
// import StaffForm from './StaffForm.vue'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
// import useUsers from '~/services/useUsers'
import useApi from '~/services/useApi'
import useLocationRecords from '@/services/useLocationRecords'
// import useAxios from '~/plugins/useAxios'

let timeout: any

interface Client {
      url?: string
      ip?: string
      location_ids?: any[]
    }

export default defineComponent({
  components: {
    VpnSetupForm,
    ClientRecordsForm,
    FormattedDate,
    ClientStatusChip,
    UnauthorizedUser,
  },
  props: {
    id: {
      type: [String, Number],
    },
    name: {
      type: [String, Number],
    },
  },
  middleware: 'isAuthenticated',
  setup(_props, { parent, emit }) {
    const { $auth } = useContext()

    const breadcrumbs = [
      {
        text: `Dashboard`,
        to: `${!$auth.hasScope('create report') ? '/reports' : '/'}`,
        disabled: false,
      },
      {
        text: `VPN Setup`,
        to: `/vpn-setup`,
        disabled: true,
      },
    ]
    const store = useStore()
    const pageTitle = `VPN Setup`
    store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    //Added for VPN Activity Log
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('vpn access')
    )
    const axios = useAxios()

    const statusOptions = ref([])
    const statusOptionsLoading = ref(false)
    const { deleteLocation } = useClientLocations()
    const loadingAccountManagers = ref(false)
    const route = useRoute()
    // const $swal2 = swalMixin((parent as any).$swal as any)
    const accountManagers = ref<Array<any>>([])
    const itemsPerPageOptions = ref([20, 50, 100, 500])
    const itemsPerPage = ref(itemsPerPageOptions.value[0])
    // const filters = ref<IClientRecordsFilter>(defaultFilterValues)
    const tablePage = ref(1)
    const pagination = ref({
      total: 0,
    })
    const router = useRouter()
    // const store = useStore()
    const { list, listStatus } = useClientRecords()
    const { list: listUsers } = useUsers()
    const busy = ref(false)

    const items: any = ref([])

    // const tableHeaders = ref([
    //   {
    //     text: `Actions`,
    //     align: `start`,
    //     width: '130px',
    //     sortable: false,
    //     value: `actions`,
    //   },
    //   {
    //     text: `User Name`,
    //     align: `start`,
    //     sortable: true,
    //     value: `user.first_name`,
    //     width: '200px',
    //   },
    //   {
    //     text: `Status`,
    //     align: `start`,
    //     sortable: true,
    //     width: '130px',
    //     value: `user.status`,
    //   },
      
    //   {
    //     text: `Site`,
    //     align: `start`,
    //     sortable: true,
    //     width: '130px',
    //     value: `site.url`,
    //   },
    //   {
    //     text: `IP Address`,
    //     align: `start`,
    //     sortable: true,
    //     width: '160px',
    //     value: `ip`,
    //   },
    //   {
    //     text: `Expiry Date`,
    //     align: `start`,
    //     width: '130px',
    //     sortable: false,
    //     value: `expiry_date`,
    //   },
    // ])

    const tableHeaders = computed(() => {
      return ($auth.user?.role === 'super admin' ? [
      {
        text: `Actions`,
        align: `start`,
        width: '130px',
        sortable: false,
        value: `actions`,
      },
      {
        text: `User Name`,
        align: `start`,
        sortable: true,
        value: `user.first_name`,
        width: '200px',
      },
      {
        text: `Status`,
        align: `start`,
        sortable: true,
        width: '130px',
        value: `user.status`,
      },
      
      {
        text: `Site`,
        align: `start`,
        sortable: true,
        width: '130px',
        value: `site.url`,
      },
      {
        text: `IP Address`,
        align: `start`,
        sortable: true,
        width: '160px',
        value: `ip`,
      },
      {
        text: `Expiry Date`,
        align: `start`,
        width: '130px',
        sortable: false,
        value: `expiry_date`,
      },
      ] : [
        {
        text: `User Name`,
        align: `start`,
        sortable: true,
        value: `user.first_name`,
        width: '200px',
      },
      {
        text: `Status`,
        align: `start`,
        sortable: true,
        width: '130px',
        value: `user.status`,
      },
      
      {
        text: `Site`,
        align: `start`,
        sortable: true,
        width: '130px',
        value: `site.url`,
      },
      {
        text: `IP Address`,
        align: `start`,
        sortable: true,
        width: '160px',
        value: `ip`,
      },
      {
        text: `Expiry Date`,
        align: `start`,
        width: '130px',
        sortable: false,
        value: `expiry_date`,
      },
      ])
    })

    // const handleDeleteLocation = (id: any) => {
    //   showConfirmDialog($swal2, {
    //     title: 'Delete Location',
    //     text: 'Are you sure you want to delete this location?',
    //     icon: 'warning',
    //   }).then(async (result: any) => {
    //     if (result.isConfirmed) {
    //       busy.value = true
    //       await deleteLocation(id).finally(() => {
    //         busy.value = false
    //       })
    //       showToast($swal2, {
    //         title: 'Location deleted',
    //         icon: 'success',
    //       })
    //       emit('fetchClient')
    //     }
    //     getClientRecords()
    //   })
      
    // }
    // set the page breadcrumbs
    // const breadcrumbs = [
    //   {
    //     text: `Dashboard`,
    //     to: `${!$auth.hasScope('create report') ? '/reports' : '/'}`,
    //     disabled: false,
    //   },
    //   {
    //     text: `VPN activity log'`,
    //     to: `/client-records`,
    //     disabled: true,
    //   },
    // ]

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
        
        // if (tableOptions.value.sortBy[0]) {
        //   filters.value.sort_by =
        //     tableOptions.value.sortBy[0] === 'fullname'
        //       ? 'first_name'
        //       : tableOptions.value.sortBy[0]
        //   filters.value.sorting = tableOptions.value.sortDesc[0]
        //     ? 'desc'
        //     : 'asc'
        // }

        handleFilterApply()
      },
      { deep: true }
    )

    // const pageTitle = `Client Records`

    // store.dispatch('setPageHeading', { pageTitle, breadcrumbs })

    const getClientRecords = () => {
      // if (busy.value === false) {
      //   const appliedFilters = {
      //     ...filters.value,
      //     sort_by:
      //       filters.value.sort_by + `:` + filters.value?.sorting?.toLowerCase(),
      //   }

        busy.value = true
        axios   
        .get(
          '/vpn-access',
          {params: { 
            limit: itemsPerPage.value,
            page: tablePage.value
            }, 
            withCredentials: true})
          .then((resp) => {
            items.value = resp.data.data.result
            pagination.value = resp.data.data.pagination
            console.log('CR', items.value)
          })
          .finally(() => {
            busy.value = false
          })
      // }
    }

    const handleFilterApply = () => {
      router.push({
        path: router.currentRoute.path,
        query: {
          page: tablePage.value.toString(),
          itemsPerPage: itemsPerPage.value.toString(),
          // ...(filters.value as Dictionary<
          //   string | (string | null)[] | null | undefined
          // >),
        },
      })
      // getClientRecords()
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

      // filters.value = { ...defaultFilterValues, ...query }
      getClientRecords()
    }

    const handlePaginationChange = (e: any) => {
      itemsPerPage.value = e.itemsPerPage === -1 ? 500 : e.itemsPerPage
      // tablePage.value = e.page
      // handleFilterApply()
      // getClientRecords()
    }

    // watch(route, () => {
    //   loadFiltersFromURL()
    //   // getClientRecords()
    // })

    onBeforeMount(() => {
      loadFiltersFromURL()
      // getAccountManagers()
      // getClientRecords()
    })

    //Adding for VPN Setup Form
    const ipAddress = ref()
    // const { $auth } = useContext()
    const adminUser = computed(() =>
      $auth.user?.role === 'admin' || $auth.user?.role === 'super admin'
    )
    const refreshPage = () => {
      window.location.reload()
    }
    const connectedToVpn = ref(false)
    const $swal = swalMixin((parent as any).$swal as any)
    const formValid = ref(false)
    // const busy = ref(false)
    const clientStatus = ref(false)
    const isChangingStatus = ref(false)
    // const router = useRouter()
    const clientsListLoading = ref(false)
    const searchInput = ref(router.currentRoute.query.client_name)
    const clientsList = ref<any>([])
    const autoComplete = ref()
    const { get } = useApi()
    const entries = ref<any>([])
    const isLoading = ref(false)
    const search = ref(null)
    const { create} = useLocationRecords()
    // const axios = useAxios()
    const numberOfHours  = ref([
      {text: 72, value: 72},
      {text: 96, value: 96},
    ])


  watch(search, () => {
      if (entries.length > 0) { 
      return
      }
      if (isLoading.value) {
        return
      }

      isLoading.value = true
      list({})
          .then((resp) => {
            entries.value = resp.data.data.result ? resp.data.data.result : []
            console.log('LOCATION RECORDS', entries.value)
          })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (isLoading.value = false))
    })

    const inputValue = ref<Array<string | number> | string | null | number>([])

    const fetchClients = () => {
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        if (searchInput.value) {
          clientsListLoading.value = true
          const res = await get(
            `/sites?name=${searchInput.value}&date_start=2022-08-01&date_end=2022-08-31`,
          )
          clientsList.value = res.data.data.result
          clientsListLoading.value = false
        }
      }, 300)
    }

    const onChange = () => {
      const client = clientsList.value.find(
        (c: any) => c.id === formData.value.url
      )
    }

    watch(searchInput, () => {
      if (!searchInput.value) {
        clientsList.value = []
      }
    })

    const locationId = ref(
      router.currentRoute.query.id
    )
    
    const locationName = ref(
      router.currentRoute.query.name
    )
    const formData = ref<Client>({
    })

    const locations = ref([])


    const rules = {
      url: [(v: string | number) => !!v || 'Client is required'],
      ip: [
        (v: string | number) => !!v || 'IP Address is required',
        (v: string) => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v) || 'IP Address must be valid',],
      number_of_hours: [(v: string | number) => !!v || 'Period is required'],

      //   return !!(e.id.length > 0) || 'Location is required'
      // })],
    }

    const locationRemove = (locationIndex: number) => {
      locations.value.splice(locationIndex, 1)
    }

    const submit = () => {
      busy.value = true
      axios   
        .post(
          '/vpn-access',
          {...formData.value},
          {
            withCredentials: true,
          }
        )
        .then((resp) => {
          loadFiltersFromURL()
          showToast($swal, {
            title: `Request Successfully Sent!`,
          })
        })
        .finally(() => (busy.value = false))
    }
    const submit2 = () => {
      busy.value = true
      create({
        url: formData.value.url,
        location_ids: [locationId.value]
      })
        .then((resp) => {
          showToast($swal, {
            title: `Location Successfully added!`,
          })

          router.push(`/location-records`)
          
        })
        .finally(() => 
        (busy.value = false)
        )
    }

    const handleDeleteIP = (id: any) => {
      showConfirmDialog($swal, {
        title: 'Delete IP',
        text: 'Are you sure you want to delete this IP?',
        icon: 'warning',
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          busy.value = true
          await axios   
        .delete(
          `/vpn-access/${id}`,
          { 
            withCredentials: true})
            .finally(() => {
            busy.value = false
          })
          showToast($swal, {
            title: 'IP deleted',
            icon: 'success',
          })
        }
        getClientRecords()
      })
      
    }

    const isEditing = computed(() => {
      const id = _props.id

      if (id && typeof +id === 'number') {
        return true
      }

      return false
    })
    onBeforeMount(async() => {
      // isLoading.value = true
      await axios   
        .get(
          '', {baseURL: 'https://api.ipify.org/?format=json'}
        )
        .then((resp) => {
          // isLoading.value = false
          if ( resp.data.ip === '34.238.213.152' || resp.data.ip === '54.179.205.95' ) {
            connectedToVpn.value = true
          } else {
            connectedToVpn.value = false
          }
          ipAddress.value = resp.data.ip
          formData.value.ip = resp.data.ip
          // console.log('IP ADDRESS', resp.data.ip)
        })
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
      nonAccountManagerUserRole,
      locations,
      formValid,
      rules,
      formData,
      submit,
      locationRemove,
      isEditing,
      clientStatus,
      isChangingStatus,
      handleDeleteIP,
      // busy,
      clientsListLoading,
      searchInput,
      clientsList,
      fetchClients,
      inputValue,
      autoComplete,
      onChange,
      entries,
      isLoading,
      search,
      locationId,
      locationName,
      submit2,
      numberOfHours,
      ipAddress,
      adminUser,
      connectedToVpn,
      refreshPage,
    }
  },
  head: {
    title: 'VPN Setup',
  },
})
</script>
