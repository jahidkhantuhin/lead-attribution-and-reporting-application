<template>
  <v-card elevation="0">
    <v-card-title>
      Staff
      <v-btn
        color="primary"
        small
        :to="`/client-records/${clientID}/staff/add`"
        class="ml-4"
      >
        Add Staff
      </v-btn>
    </v-card-title>
    <v-data-table
      loading-text="Loading Staff"
      no-data-text="No staff"
      :loading="loading || busy"
      :headers="headers"
      :items="items"
      hide-default-footer

    >
      <template #item.name="{ item }">
        <span>
          <a
            @click="
              staffDrawer = true
              staffDrawerData = item
            "
            to="`/client-records/${clientID}/staff/${item.id}`"
            >{{ item.name }}</a
          >
        </span>
      </template>
      <template #item.created_at="{ item }">
        <formatted-date
          v-if="item.created_at"
          :date="item.created_at"
        ></formatted-date>
      </template>
      <template #item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small v-bind="attrs" v-on="on"> Actions </v-btn>
          </template>
          <v-list>
            <v-list-item
              title="View Staff"
              ato="`/client-records/${clientID}/staff/${item.id}/`"
              @click="
                staffDrawer = true
                staffDrawerData = item
              "
            >
              <v-list-item-title>View</v-list-item-title>
            </v-list-item>
            <v-list-item
              title="Edit Staff"
              :to="`/client-records/${clientID}/staff/${item.id}/edit`"
            >
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item
              title="Delete User"
              @click="handleDeleteStaff(item.id)"
            >
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <v-navigation-drawer
      v-model="staffDrawer"
      right
      fixed
      temporary
      width="700px"
    >
      <staff-details
        :loading="false"
        v-if="staffDrawerData"
        :staffData="staffDrawerData"
        :showAllButton="false"
        :cardProps="{
          elevation: 0,
        }"
      ></staff-details>
    </v-navigation-drawer>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useRoute,
} from '@nuxtjs/composition-api'
import StaffForm from '@/components/forms/StaffForm.vue'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import useClientStaff from '~/services/useClientStaff'
import FormattedDate from '../FormattedDate.vue'
import StaffDetails from './StaffDetails.vue'

export default defineComponent({
  components: {
    StaffForm,
    FormattedDate,
    StaffDetails,
  },
  props: {
    list: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: [],
    },
  },
  setup(props, { parent, emit }) {
    const { deleteStaff } = useClientStaff()
    const busy = ref(false)
    const $swal = swalMixin((parent as any).$swal as any)
    const route = useRoute()
    const clientID = route.value.params.client_id
    const staffDrawer = ref(false)
    const staffDrawerData = ref(null)
    const headers: Array<any> = [
      {
        text: `Name`,
        align: `start`,
        sortable: true,
        value: `name`,
      },
      {
        text: `Role`,
        align: `start`,
        sortable: true,
        value: `designation`,
      },
      {
        text: `Email`,
        align: `start`,
        sortable: true,
        value: `email`,
      },
      {
        text: `Phone#`,
        align: `start`,
        sortable: true,
        value: `phone_number`,
      },
      
      {
        text: `Last Update`,
        align: `start`,
        sortable: true,
        value: `updated_at`,
      },

      {
        text: ``,
        align: `start`,
        sortable: false,
        value: `actions`,
      },
    ]

    const items = computed(() => {
      return props.list
    })

    const handleDeleteStaff = (id: any) => {
      showConfirmDialog($swal, {
        title: 'Delete Staff',
        text: 'Are you sure you want to delete this Staff?',
        icon: 'warning',
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          busy.value = true
          await deleteStaff(id).finally(() => {
            busy.value = false
          })
          showToast($swal, {
            title: 'Staff deleted',
            icon: 'success',
          })
          emit('fetchClient')
        }
      })
    }

    return {
      headers,
      items,
      busy,
      handleDeleteStaff,
      clientID,
      staffDrawer,
      staffDrawerData,
    }
  },
})
</script>
