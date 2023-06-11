<template>
  <div>
    <v-menu
      v-model="showDatePicker"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="auto"
      @input="handleChange"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="displayedDates"
          clearable
          label=""
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          :disabled="disabled"
          @click:clear="handleClickClear"
        ></v-text-field>
      </template>
      <v-card style="width: 290px">
        <v-date-picker
          v-model="dates"
          range
          @change="handleDatePickerChange"
          :min="minimum"
          :max="maximum"
        ></v-date-picker>
        <v-card-text>
          <v-btn
            @click="setDate(button)"
            v-for="button in dateHelpButtons"
            v-bind:key="button"
            class="mr-1 mb-2"
            elevation="0"
            small
            >{{ datePickerHelperButtons[button].label }}</v-btn
          >
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
} from '@nuxtjs/composition-api'
import moment from 'moment'
import { datePickerHelperButtons } from '~/utils/datepicker'
export default defineComponent({
  props: {
    kpi: {
      type: Boolean,
      default: false,
    },
    value: [String, Array],
    disabled: {
      type: Boolean,
      default: false,
    },
    datePickerProps: {
      type: Object,
      default: () => ({
        max: '',
        min: '',
      }),
    },
    dateHelpButtons: {
      default: () => [
        'last14Days',
        'lastWeek',
        'thisWeek',
        'last2Weeks',
        'lastMonth',
        'thisMonth',
        'last3Months',
        'last6Months',
        'thisYear',
        'lastYear',
        'last2Years',
        'last5Years',
      ],
      type: Array,
    },
  },
  setup(props, app) {
    const showDatePicker = ref(false)
    const dates = ref([])

    const minimum = computed(() => {
      if (props.datePickerProps?.min) {
        return moment(props.datePickerProps?.min).format()
      }
      return ''
    })

    const maximum = computed(() => {
      if (dates.value.length === 2) {
        return ''
      }

      if (props.datePickerProps?.max) {
        return props.datePickerProps.max
      }

      const defaultDate = moment().subtract(1, 'day')
      const firstDate = dates.value[0] ? moment(dates.value[0]) : null
      if (!firstDate) {
        return defaultDate.format()
      }
      const plus365 = firstDate.add(365, 'days')
      if (plus365.isAfter(defaultDate)) {
        return defaultDate.format()
      }
      return plus365.format()
    })

    const displayedDates = computed({
      get: () => {
        if (props.kpi && dates.value.length === 0) {
          return 'All'
        } else {
          return dates.value
            .map((d) => moment(d).format('DD MMM YY'))
            .join(' to ')
        }
      },
      set: (v) => {
        if (!v) {
          dates.value = []
        }
      },
    })

    const handleDatePickerChange = () => {
      if (dates.value.length > 1) {
        if (moment(dates.value[0]).isAfter(dates.value[1])) {
          dates.value = [dates.value[1], dates.value[0]]
        }
      } else if (dates.value.length === 1) {
        dates.value = [dates.value[0], dates.value[0]]
      }
    }

    const emitValue = () => {
      app.emit('input', dates.value)
    }

    const emitChange = () => {
      app.emit('change', dates.value)
    }

    const setDate = function (val) {
      dates.value = datePickerHelperButtons[val].handler()
      showDatePicker.value = false
      emitValue()
      emitChange()
    }
    const handleChange = () => {
      emitValue()
      if (showDatePicker.value === false) {
        emitChange()
      }
    }
    const handleClickClear = () => {
      emitValue()
      app.emit('clear')
    }

    const setValuetoDates = () => {
      if (props.value && props.value.constructor === Array) {
        dates.value = props.value
      } else {
        dates.value = []
      }
    }

    watch(
      () => props.value,
      () => {
        setValuetoDates()
      }
    )

    watch(
      () => dates.value,
      () => {
        emitValue()
        emitChange()
      }
    )

    watch(
      () => showDatePicker.value,
      () => {
        handleDatePickerChange()
      }
    )

    onMounted(() => {
      setValuetoDates()
    })

    return {
      showDatePicker,
      handleChange,
      displayedDates,
      handleDatePickerChange,
      dates,
      setDate,
      handleClickClear,
      moment,
      datePickerHelperButtons,
      minimum,
      maximum,
    }
  },
})
</script>
