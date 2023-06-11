<template>
  <v-form v-model="formValid" ref="form">
    <v-card>
      <v-card-title>
        <h4 class="heading">{{ title }}</h4>
      </v-card-title>
      <v-card-text>
        <h3>General Info</h3>
      </v-card-text>
      <v-card-text>
        <v-row class="mt-n10">
          <v-col cols="12" md="6">
            <v-text-field
              label="Name *"
              clearable
              v-model="formData.name"
              :rules="rules.name"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="Address *"
              clearable
              v-model="formData.address"
              :rules="rules.address"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="City"
              clearable
              v-model="formData.city"
              :rules="rules.city"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="State"
              clearable
              v-model="formData.state"
              :rules="rules.state"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Zip Code *"
              clearable
              v-model="formData.zip"
              :rules="rules.zipcode"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Location Website *"
              clearable
              v-model="formData.website"
              :rules="rules.website"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              :items="accountManagers"
              item-value="id"
              :loading="loadingAccountManagers"
              v-model="formData.account_manager_id"
              item-text="fullname"
              label="Account Manager *"
              :rules="rules.account_manager"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :items="statusOptions"
              placeholder="Select Status *"
              item-value="id"
              item-text="value"
              v-model="formData.status"
              :rules="rules.status"
            >
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="mt-n6">
        <h3>Lead details information</h3>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="mt-n10">
            <v-text-field
              label="Apex chat ID"
              clearable
              v-model="formData.apexchat_id"
              :rules="rules.apexchat_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n10">
            <v-text-field
              label="Call Service id *"
              clearable
              v-model="formData.account_id"
              :rules="rules.account_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Reporting Email Address *"
              clearable
              v-model="formData.reporting_mail"
              :rules="rules.reporting_mail"
            >
            </v-text-field>
          </v-col>
          <!-- <v-col cols="12" md="6" class="mt-n10" v-if="editForm">
            <v-text-field
              label="Lh2 Api Key"
              clearable
              v-model="formData.lh2_api_key"
            >
            </v-text-field>
          </v-col> -->
          <!-- <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Twillio Number"
              clearable
              v-model="formData.twilio_number"
              :rules="rules.twilio_number"
            >
            </v-text-field>
          </v-col> -->
          <!-- <v-col cols="12" md="6" class="mt-n10">
            <v-checkbox v-model="formData.is_edge" label="Edge"></v-checkbox>
          </v-col> -->
        </v-row>
      </v-card-text>
      <v-card-text class="mt-n6">
        <h3>Advertising information</h3>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Facebook ID"
              clearable
              v-model="formData.facebook_id"
              :rules="rules.facebook_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Adwords ID"
              clearable
              v-model="formData.adwords_id"
              :rules="rules.adwords_id"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Adwords Budget"
              clearable
              v-model="formData.adwords_budget"
              :rules="rules.adwords_budget"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Facebook Budget"
              clearable
              v-model="formData.facebook_budget"
              :rules="rules.facebook_budget"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="mt-n8">
            <v-text-field
              label="Monthly Fee"
              clearable
              v-model="formData.monthly_fee"
              :rules="rules.monthly_fee"
              maxlength="50"
              counter="50"
              max="50"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="!editForm">
        <span class="red--text text--darken-1"> * required </span>
        <v-spacer></v-spacer>
        <v-btn :disabled="busy" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn
          :loading="busy"
          :disabled="!formValid"
          color="primary"
          @click.prevent="formValid && submit()"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
      <!-- <v-card-actions v-if="editForm">
        <span class="red--text text--darken-1"> * required </span>
        <v-spacer></v-spacer>
        <v-btn :disabled="busy" @click="$emit('cancel')">Cancel</v-btn>
        <v-btn
          :loading="busy"
          :disabled="!formValid"
          color="primary"
          @click.prevent="formValid && submit()"
        >
          Go Ahead
        </v-btn>
      </v-card-actions> -->
      <v-card-actions v-if="editForm">
        <span class="red--text text--darken-1"> * required </span>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="busy" @click="$emit('cancel')">Cancel</v-btn>
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="on"
              :disabled="!formValid"
            >
              Go Ahead
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Add a comment</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                  >
                    <v-text-field
                      label="Reason for changes*"
                      v-model="formData.comment"
                      :rules="rules.comment"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                :loading="busy"
                :disabled="!formValid"
                color="primary"
                @click.prevent="formValid && submit()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRouter,
} from '@nuxtjs/composition-api'
import useClientLocations from '~/services/useClientLocations'
import useClientRecords from '~/services/useClientRecords'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import slugify from 'slugify'
import ReportingEmailAddress from '~/components/ReportingEmailAddress.vue'
import useUsers from '~/services/useUsers'
import { AM_ROLE } from '~/utils/UserEnums'

export default defineComponent({
  components: {
    ReportingEmailAddress,
  },
  props: {
    id: {
      type: [String, Number],
    },
  },
  setup(_props, { emit, parent }) {

    const dialog = ref(false)
    const formValid = ref(false)
    const busy = ref(false)
    const hasChat = ref(false)
    const form = ref(null)
    const router = useRouter()
    const $swal = swalMixin((parent as any).$swal as any)
    const { create, locationById, updateLocation } = useClientLocations()
    const { clientById, listStatus  } = useClientRecords()

    const clientID = router.currentRoute.params.client_id
    const statusOptions = ref([])

    const formData = ref<any>({
      client_id: clientID,
      // is_edge: false,
      phone_number: null,
      // twilio_number: null,
    })
    const accountManagers = ref<Array<any>>([])
    const loadingAccountManagers = ref(false)
    const { list: listUsers } = useUsers()

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

    const title = computed(() => {
      return (_props.id ? 'Edit' : 'Add') + ' Location'
    })
    const editForm = computed(() => {
      return _props.id ? true : false
    })

    const rules = computed(() => {
      return {
        name: [(v: string) => !!v || 'Name is required'],
        // twilio_number: [
        //   (v: string) => {
        //     if (!v) {
        //       return true
        //     }
        //     return (v && v.startsWith('+1')) || 'Number should start with +1'
        //   },
        // ],
        address: [(v: string) => !!v || 'Address is required'],
        comment: [(v: string) => !!v || 'Comment is required'],
        street: [(v: string) => !!v || 'Street is required'],
        // city: [(v: string) => !!v || 'City is required'],
        // state: [(v: string) => !!v || 'State is required'],
        status: [(v: string) => !!v || 'Status is required'],
        zipcode: [(v: Number) => !!v || 'Zip Code is required'],
        email: [
          (v: string) => !!v || 'Email is required',
          (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        adwords_budget: [
          (v: string) =>  !v || !/\D/.test(v) || 'Adwords budget must be numeric',
        ],
        facebook_budget: [
          (v: string) => !v || !/\D/.test(v) || 'Facebook budget must be numeric',
        ],
        monthly_fee: [
          (v: string) => !v || !/\D/.test(v) || 'Monthly fee must be numeric',
        ],
        account_id: [(v: string) => !!v || 'Marchex ID is required'],
        website: [
          (v: string) => !!v || 'Personal website is required',
          (v: string) =>
            /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(v) ||
            'Website should start with https:// e.g "https://example.com"',
        ],
        reporting_mail: [
          (v: string) => !!v || 'Reporting Email is required',
          (v: string) => /.+@.+\..+/.test(v) || 'Reporting Email must be valid',
        ],
        account_manager: [
          (v: string) => !!v || 'Account Manager is required',
        ],
      }
    })
    const getStatusOptions = () => {
      listStatus().then((resp) => {
        statusOptions.value = Object.keys(resp.data.data).map((key) => {
          return {
            id: key,
            value: resp.data.data[key],
          }
        }) as any
        // console.log('KEY', statusOptions.value)
      })
    }
    const submit = () => {
      const action = _props.id ? updateLocation : create
      busy.value = true
      action(formData.value)
        .then((res) => {
          showToast($swal, {
            title: `Location Successfully ${
              _props.id ? 'updated' : 'created'
            }!`,
          })
          emit('finish')
          if (_props.id) {
            router.push(
              `/client-records/${clientID}/locations/${
                _props.id || res.data.data.id
              }`
            )
          } else {
            router.push(`/client-records/${clientID}/`)
          }

          setTimeout(() => {
            ;(form.value as any).resetValidation()
          }, 50)
        })
        .finally(() => {
          busy.value = false
        })
    }
    const fetchExistingLocaton = () => {
      const id = _props.id

      if (id) {
        busy.value = true
        locationById(id)
          .then((resp) => {
            const data = resp.data.data

            formData.value.name = data.name
            formData.value.id = data.id
            formData.value.account_id = data.account_id
            formData.value.website = data.website.includes('http') ? data.website : 'https://' + data.website
            formData.value.address = data.address
            formData.value.street = data.street
            formData.value.city = data.city
            formData.value.state = data.state
            formData.value.zip = data.zip
            // formData.value.lh2_api_key = data.lh2_api_key
            // formData.value.twilio_number = data.twilio_number
            formData.value.reporting_mail = data.reporting_mail
            formData.value.facebook_id = data.facebook_id
            formData.value.adwords_id = data.adwords_id
            formData.value.status =  data.status
            formData.value.apexchat_id = data.apexchat_id
            formData.value.account_manager_id = data.account_manager_id
            formData.value.monthly_fee = data.monthly_fee
            formData.value.adwords_budget = data.adwords_budget
            formData.value.facebook_budget = data.facebook_budget
            fetchClient()
          })
          .finally(() => {
            busy.value = false
          })
      } else {
        fetchClient()
      }
    }

    const fetchClient = () => {
      if (clientID) {
        clientById(clientID).then((res) => {
          emit('onFetchClient', res.data.data, formData.value)
        })
      }
    }

    onMounted(() => {
      fetchExistingLocaton()
      getStatusOptions()
      getAccountManagers()
    })

    return {
      submit,
      formValid,
      busy,
      rules,
      formData,
      form,
      hasChat,
      title,
      statusOptions,
      editForm,
      dialog,
      accountManagers,
      loadingAccountManagers,
      getAccountManagers,

    }
  },
})
</script>
