<template>
  <v-form v-model="formValid">
    <v-card>
      <v-card-title> {{ title }} </v-card-title>
      <v-card-text>
        <v-text-field
          label="Person's name *"
          clearable
          maxlength="50"
          counter="50"
          v-model="formData.name"
          :rules="rules.name"
          max="50"
        >
        </v-text-field>
        <v-text-field
          :rules="rules.phone_number"
          v-model="formData.phone_number"
          label="Person's phone number"
          clearable
          maxlength="250"
        >
        </v-text-field>
        <v-text-field
          label="Person's E-mail *"
          :rules="rules.email"
          v-model="formData.email"
          clearable
          maxlength="250"
        >
        </v-text-field>
        <v-combobox
          :rules="rules.designation"
          v-model="formData.designation"
          hint="Press enter to add custom designation"
          :items="designationItems"
          placeholder="Role"
          @keydown.enter="handleAddNewDesignation"
          :search-input.sync="designationInput"
          persistent-hint
        ></v-combobox>
      </v-card-text>
      <v-card-actions>
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
import useClientRecords from '~/services/useClientRecords'
import useClientStaff from '~/services/useClientStaff'
import SwalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  props: {
    id: {
      type: [String, Number],
    },
  },
  setup(_props, { parent, emit }) {
    const formValid = ref(false)

    const { create, staffById, updateStaff } = useClientStaff()
    const { clientById } = useClientRecords()
    const busy = ref(false)
    const $swal = SwalMixin((parent as any).$swal as any)
    const router = useRouter()

    const clientID = router.currentRoute.params.client_id
    const designationInput = ref('')
    const designationItems = ref(['Office Manager', 'Front Desk'])

    const handleAddNewDesignation = () => {
      setTimeout(() => {
        const find = designationItems.value.find((str: string) => {
          console.log(str, designationInput.value)
          return str.toLowerCase() === designationInput.value.toLowerCase()
        })

        if (!find) {
          designationItems.value.push(find ? find : designationInput.value)
        }

        ;(formData.value as any)['designation'] = designationInput.value
      }, 10)
    }

    const title = computed(() => {
      return (_props.id ? 'Edit' : 'Add') + ' Staff'
    })

    const formData = ref({
      client_id: clientID,
    })

    const rules = {
      name: [(v: string) => !!v || 'Name is required'],
      phone_number: [],
      email: [
        (v: string) => !!v || 'Email is required',
        (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],

      designation: [(v: string) => !!v || 'Designation is required'],
    }

    const submit = () => {
      const action = _props.id ? updateStaff : create
      busy.value = true
      action(formData.value)
        .then((res) => {
          showToast($swal, {
            title: `Staff Successfully ${_props.id ? 'updated' : 'created'}!`,
          })
          if (_props.id) {
            router.push(
              `/client-records/${clientID}/staff/${
                _props.id || res.data.data.id
              }`
            )
          } else {
            router.push(`/client-records/${clientID}`)
          }
          emit('finish')
        })
        .finally(() => {
          busy.value = false
        })
    }

    const fetchClient = () => {
      if (clientID) {
        clientById(clientID).then((res) => {
          emit('onFetchClient', res.data.data, formData.value)
        })
      }
    }

    const fetchExistingStaff = () => {
      const id = _props.id

      if (id) {
        busy.value = true
        staffById(id)
          .then((resp) => {
            const data = resp.data.data

            formData.value = data
            // @ts-ignore
            formData.value.client_id = formData.value?.client?.id

            delete (formData as any).value['client']

            fetchClient()
          })
          .finally(() => {
            busy.value = false
          })
      } else {
        fetchClient()
      }
    }

    onMounted(() => {
      fetchExistingStaff()
    })

    return {
      submit,
      formValid,
      busy,
      rules,
      formData,
      title,
      designationItems,
      designationInput,
      handleAddNewDesignation,
    }
  },
})
</script>
