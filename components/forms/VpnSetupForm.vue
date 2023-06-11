<template>
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
            <v-col cols="5">
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
            <v-col cols="3">
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
            <v-col cols="4" v-if="adminUser">
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
            <v-col cols="4" v-if="!adminUser">
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
            <v-btn :disabled="busy" @click="$emit('cancel')">Cancel</v-btn>
            <v-btn
              :disabled="!formValid || connectedToVpn"
              :loading="busy"
              color="primary"
              @click.prevent="formValid && submit() && $emit('submit')"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  ref,
  computed,
  useRouter,
  watch,
  onBeforeMount,
  useContext,
} from '@nuxtjs/composition-api'
import LocationForm from './LocationForm.vue'
import StaffForm from './StaffForm.vue'
import SwalMixin, { showToast } from '~/utils/swalMixin'
import useUsers from '~/services/useUsers'
import useApi from '~/services/useApi'
import useLocationRecords from '@/services/useLocationRecords'
import useAxios from '~/plugins/useAxios'


let timeout: any

interface Client {
      url?: string
      ip?: string
      location_ids?: any[]
    }

export default defineComponent({
  components: { LocationForm, StaffForm },
  props: {
    id: {
      type: [String, Number],
    },
    name: {
      type: [String, Number],
    },
  },
  setup(_props, { parent, emit }) {
    const ipAddress = ref()
    const { $auth } = useContext()
    const adminUser = computed(() =>
      $auth.user?.role === 'admin' || $auth.user?.role === 'super admin'
    )
    const refreshPage = () => {
      window.location.reload()
    }
    const connectedToVpn = ref(false)
    const $swal = SwalMixin((parent as any).$swal as any)
    const formValid = ref(false)
    const busy = ref(false)
    const clientStatus = ref(false)
    const isChangingStatus = ref(false)
    const router = useRouter()
    const clientsListLoading = ref(false)
    const searchInput = ref(router.currentRoute.query.client_name)
    const clientsList = ref<any>([])
    const autoComplete = ref()
    const { get } = useApi()
    const entries = ref<any>([])
    const isLoading = ref(false)
    const search = ref(null)
    const { list, create} = useLocationRecords()
    const axios = useAxios()
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
      number_of_hours: [(v: string | number) => !!v || 'Number of hours is required'],

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
          showToast($swal, {
            title: `Request Successfully Sent!`,
          })

          router.push(`/vpn-setup`)
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
      locations,
      formValid,
      rules,
      formData,
      submit,
      locationRemove,
      isEditing,
      clientStatus,
      isChangingStatus,
      busy,
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
})
</script>

<style lang="scss" scoped>
.location-card {
  padding: 20px;
  margin-bottom: 20px;
  .heading {
    color: #898989;
    font-size: 13px;
    font-weight: 400;
    position: relative;
    top: -8px;
  }
}

.form-card {
  padding: 12px 22px;
}

.location-card-create {
  margin-top: 20px;
  padding: 24px 0;
  text-align: center;
  border: 1px solid #f9f9f9;
  cursor: pointer;
  h4 {
    color: #939393;
    font-weight: 400;
  }
  &:hover,
  &:focus {
    border-color: #e6e6e6;
  }
}
</style>
