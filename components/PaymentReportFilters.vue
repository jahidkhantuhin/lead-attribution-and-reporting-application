<template>
  <v-card elevation="0">
    <v-card-text>
      <v-autocomplete
        :loading="callScorersLoading"
        placeholder="Select a call scorer"
        item-value="id"
        v-model="filters['user_id']"
        clearable
        item-text="fullname"
        :items="callScorers"
        @change="push"
      ></v-autocomplete>

      <Datepicker
        :dateHelpButtons="[
          'thisWeek',
          'lastWeek',
          'last14Days',
          'lastMonth',
          'thisYear',
        ]"
        @change="push"
        v-model="filters['dates']"
      ></Datepicker>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="
          !(
            filters['user_id'] > 0 &&
            filters['dates'] &&
            filters['dates'].length > 0
          )
        "
        class="my-2"
        color="primary"
        @click="$emit('search', filters)"
        :loading="loading"
      >
        {{ loading ? 'Loading...' : 'Apply' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useStore,
  useRouter,
  watch,
  useRoute,
  onBeforeMount,
  onMounted,
} from '@nuxtjs/composition-api'
import Datepicker from '~/components/forms/DatePicker.vue'
import useUsers from '~/services/useUsers'
import { CALL_SCORER_ROLE } from '~/utils/UserEnums'
import moment from 'moment'

export default defineComponent({
  components: {
    Datepicker,
  },
  props: {
    callScorersLoading: {
      type: Boolean,
      defualt: false,
    },
    callScorers: {
      type: Array,
      default: [],
    },
    headers: {
      type: Array,
      default: [],
    },
    loading: {
      default: false,
      type: Boolean,
      required: true,
    },
  },
  setup(_props, { emit }) {
    const router = useRouter()
    const filters: any = ref({
      dates: [],
      user_id: null,
    })

    const push = () => {
      router.push({
        path: router.currentRoute.path,
        query: filters.value as any,
      })
    }

    const loadFromURL = () => {
      let query: any = router.currentRoute.query
      if (query && query.user_id && query.dates) {
        query.user_id = +query.user_id
        filters.value = query
        emit('search', filters.value)
      }
    }

    onMounted(() => {
      loadFromURL()
    })

    return {
      filters,
      push,
      moment,
    }
  },
})
</script>

<style lang="scss">
.filters {
  display: flex;
  > div {
    margin-right: 19px;
    .v-select {
      width: 160px;
    }
    .text-input {
      width: 150px;
    }
  }
}
.date-picker-dialog {
  margin-bottom: 10px;
}
.filter-date-range-actions {
  padding: 12px 20px;
  border: 1px solid #eee;
  border-left: none;
  border-right: none;
  .v-btn {
    padding: 0 6px;
    font-size: 12px;
    margin-right: 0;
    margin-bottom: 7px;
    text-transform: initial;
    height: 22px;
  }
}
</style>
