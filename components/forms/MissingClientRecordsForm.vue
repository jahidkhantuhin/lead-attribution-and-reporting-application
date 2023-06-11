<template>
  <v-form v-model="formValid">
    <v-card>
      <v-card-title> Add Client </v-card-title>
      <v-card-text>
        <v-autocomplete
          ref="autoComplete"
          v-model="formData.client_id"
          label="Search for a client"
          clearable
          placeholder="Search for a client *"
          :items="clientsList"
          :loading="clientsListLoading"
          item-text="name"
          :filter="() => true"
          item-value="id"
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
          :rules="rules.client_id"
          @keydown.enter="formValid && submit()"
        >
        </v-autocomplete>
      </v-card-text>
      <v-card-text v-if="!locationId">
        <v-autocomplete
          v-model="formData.location_ids" 
          :items="entries" 
          :loading="isLoading" 
          :search-input.sync="search"
          hide-no-data
          hide-selected 
          item-text="name" 
          :filter="() => true"
          item-value="id" 
          label="Search for locations *" 
          placeholder="Start typing to Search"
          chips
          deletable-chips
          multiple
          clearable
          :rules="rules.location_ids"
          @keydown.enter="formValid && submit()"
        >
        </v-autocomplete>
      </v-card-text>
      <v-card-text v-if="locationId">
        <v-text-field
          label="Location Name"
          class="mb-3"
          :value="''+locationName+ ''"
          readonly
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <span class="red--text text--darken-1"> * required </span>
        <v-spacer></v-spacer>
        <v-btn :disabled="busy" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn
          :disabled="!formValid"
          :loading="busy"
          color="primary"
          @click.prevent="!locationId ? formValid && submit() : formValid && submit2()"
        >
          Add Client
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import {
  onMounted,
  defineComponent,
  ref,
  computed,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import LocationForm from './LocationForm.vue'
import StaffForm from './StaffForm.vue'
import SwalMixin, { showToast } from '~/utils/swalMixin'
import useUsers from '~/services/useUsers'
import useApi from '~/services/useApi'
import useLocationRecords from '@/services/useLocationRecords'


let timeout: any

interface Client {
      client_id?: string
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
            console.log('LOCATION SETTINGS', entries.value)
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
            `/clients?name=${searchInput.value}&limit=100`,
            {
              withCredentials: true,
            }
          )
          clientsList.value = res.data.data.result
          clientsListLoading.value = false
        }
      }, 300)
    }

    const onChange = () => {
      const client = clientsList.value.find(
        (c: any) => c.id === formData.value.client_id
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
      client_id: [(v: string | number) => !!v || 'Client is required'],
      location_ids: [(v: any) => !!v || 'Location is required'],
      // location_ids: [(v: any) => v.map((e: any) => {
      //   return !!(e.id.length > 0) || 'Location is required'
      // })],
    }

    const locationRemove = (locationIndex: number) => {
      locations.value.splice(locationIndex, 1)
    }

    const submit = () => {
      busy.value = true
      create({
        ...formData.value
      })
        .then((resp) => {
          showToast($swal, {
            title: `Location Successfully added!`,
          })

          router.push(`/location-settings`)
        })
        .finally(() => (busy.value = false))
    }
    const submit2 = () => {
      busy.value = true
      create({
        client_id: formData.value.client_id,
        location_ids: [locationId.value]
      })
        .then((resp) => {
          showToast($swal, {
            title: `Location Successfully added!`,
          })

          router.push(`/location-settings`)
        })
        .finally(() => (busy.value = false))
    }

    const isEditing = computed(() => {
      const id = _props.id

      if (id && typeof +id === 'number') {
        return true
      }

      return false
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
