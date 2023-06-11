<template>
  <v-form v-model="formValid">
    <v-card>
      <v-card-title> {{ title }} </v-card-title>
      <v-card-text>
        <v-text-field
          label="Last name *"
          clearable
          class="mb-3"
          maxlength="50"
          counter="50"
          v-model="formData.last_name"
          :rules="formData.status === 'inactive' ? false : rules.last_name"
          @keydown.enter="formValid && submit()"
          max="50"
        >
        </v-text-field>
        <v-text-field
          label="First name *"
          clearable
          class="mb-3"
          maxlength="50"
          counter="50"
          v-model="formData.first_name"
          :rules="formData.status === 'inactive' ? false : rules.first_name"
          @keydown.enter="formValid && submit()"
          max="50"
        >
        </v-text-field>
        <v-text-field
          label="Email *"
          clearable
          class="mb-3"
          maxlength="250"
          v-model="formData.email"
          :rules="formData.status === 'inactive' ? false : rules.email"
          @keydown.enter="formValid && submit()"
        >
        </v-text-field>
        <v-text-field
          label="Phone number *"
          clearable
          class="mb-3"
          v-model="formData.phone_number"
          :rules="formData.status === 'inactive' ? false : rules.phone_number"
          @keydown.enter="formValid && submit()"
          maxlength="250"
        >
        </v-text-field>
        <v-text-field
          label="Personal website"
          clearable
          class="mb-3"
          v-model="formData.personal_website"
          :rules="formData.status === 'inactive' ? false : rules.personal_website"
          maxlength="250"
          @keydown.enter="formValid && submit()"
        >
        </v-text-field>
        <v-autocomplete
          :items="accountManagers"
          item-value="id"
          :rules="formData.status === 'inactive' ? false : rules.account_manager_id"
          :loading="loadingAccountManagers"
          v-model="formData['account_manager_id']"
          item-text="fullname"
          label="Account Manager *"
        >
        </v-autocomplete>
        <v-select
          :items="statusOptions"
          placeholder="Select Status"
          item-value="value"
          item-text="text"
          v-model="formData['status']"
        >
        </v-select>
      </v-card-text>
      <v-card-actions>
        <span class="red--text text--darken-1"> * required </span>
        <v-spacer></v-spacer>
        <v-btn :disabled="busy" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn
          :disabled="!formValid"
          :loading="busy"
          color="primary"
          @click.prevent="formValid && submit()"
        >
          Save Changes
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
} from '@nuxtjs/composition-api'
import useClientRecords from '~/services/useClientRecords'
import LocationForm from './LocationForm.vue'
import StaffForm from './StaffForm.vue'
import SwalMixin, { showToast } from '~/utils/swalMixin'
import useUsers from '~/services/useUsers'
import { AM_ROLE } from '~/utils/UserEnums'
import { Client } from '~/shared/Types'
import { mapValues } from 'lodash'

export default defineComponent({
  components: { LocationForm, StaffForm },
  props: {
    id: {
      type: [String, Number],
    },
  },
  setup(_props, { parent, emit }) {
    const $swal = SwalMixin((parent as any).$swal as any)
    const formValid = ref(false)
    const busy = ref(false)
    const { list: listUsers } = useUsers()
    const clientStatus = ref(false)
    const isChangingStatus = ref(false)
    const {
      create,
      clientById,
      update,
      changeStatus,
      listStatus,
    } = useClientRecords()
    const accountManagers = ref<Array<any>>([])
    const loadingAccountManagers = ref(false)

    const formData = ref<Client>({})

    const locations = ref([])
    const statusOptions = ref([
      {text: 'Active', value: 'active'},
      {text: 'Inactive', value: 'inactive'},
    ])
    const router = useRouter()

    const title = computed(() => {
      return (_props.id ? 'Edit' : 'Add') + ' Client'
    })

    const rules = {
      first_name: [(v: string) => !!v || 'First name is required'],
      last_name: [(v: string) => !!v || 'Last name is required'],
      email: [
        (v: string) => !!v || 'E-mail is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      phone_number: [(v: string) => !!v || 'Phone is required'],
      account_manager_id: [
        (v: string | number) => !!v || 'Account Manager is required',
      ],
      personal_website: [
        (v: string) => {
          if (v) {
            return (
              /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(v) ||
              'Website should start with https:// e.g "https://example.com"'
            )
          } else return true
        },
      ],
    }

    const locationRemove = (locationIndex: number) => {
      locations.value.splice(locationIndex, 1)
    }

    const submit = () => {
      const action = _props.id ? update : create

      busy.value = true
      action({
        ...(formData.value as any),
      })
        .then((resp) => {
          showToast($swal, {
            title: `Client Successfully ${_props.id ? 'updated' : 'created'}!`,
          })

          router.push(`/client-records/${_props.id || resp.data.data.id}/`)
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

    const handleChangeClientStatus = () => {
      const id = _props.id as number | string
      isChangingStatus.value = true
      changeStatus(id)
        .then(() => {
          showToast($swal, {
            title: `Client status changed`,
          })
          emit('status-changed')
        })
        .finally(() => {
          isChangingStatus.value = false
        })
    }

    const getExistingClient = () => {
      const id = _props.id

      if (id) {
        busy.value = true
        clientById(id)
          .then((resp) => {
            const data = resp.data.data
            formData.value = data
            delete formData.value['staff']
            delete formData.value['locations']
            // delete formData.value['status']
            formData.value['account_manager_id'] =
              formData.value.account_manager?.id

            // formData.value['status'] = 1

            formData.value.status = data?.status?.key

            emit('onFetchClient', data)
          })
          .finally(() => {
            busy.value = false
          })
      }
    }

    const getAccountManagers = () => {
      loadingAccountManagers.value = true
      listUsers({
        sort_by: 'first_name:asc',
        role: AM_ROLE,
        limit: 200,
      })
        .then((res) => {
          accountManagers.value = res.data.data.result
        })
        .finally(() => {
          loadingAccountManagers.value = false
        })
    }

    onMounted(() => {
      getExistingClient()
      getAccountManagers()
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
      handleChangeClientStatus,
      loadingAccountManagers,
      accountManagers,
      isChangingStatus,
      busy,
      title,
      statusOptions,
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
