<template>
  <span>
    <v-autocomplete
      :placeholder="
        (multiple && inputValue.length === 0) || !inputValue
          ? 'Select location'
          : ''
      "
      :prefix="
        (multiple && inputValue.length === 0) || !inputValue
          ? 'Select location'
          : ''
      "
      style="margin-top: 8px"
      no-data-text="Search locations"
      :search-input.sync="searchInput"
      :loading="busy"
      :items="locationList"
      :disabled="!client"
      item-text="name"
      item-value="id"
      small-chips
      deletable-chips
      v-model="inputValue"
      :multiple="multiple"
      @change="onChange"
      :filter="() => true"
    >
    <v-list-tile
        slot="prepend-item"
        class="grey--text"
        v-if="locationList.length > 1 && showButton">
      <v-btn color="success" @click="selectAll">Select all</v-btn>
    </v-list-tile>
    <v-list-tile
        slot="prepend-item"
        class="grey--text ml-2"
        v-if="locationList.length > 1 && showButton">
      <v-btn color="error" @click="deSelectAll">Deselect all</v-btn>
    </v-list-tile>
    </v-autocomplete>
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  useRouter,
  watch,
} from '@nuxtjs/composition-api'
import useClientLocations from '~/services/useClientLocations'

export default defineComponent({
  props: {
    client: {
      type: [String, Number],
      default: null,
    },
    multiple: {
      type: [Boolean],
      default: true,
    },
    showButton: {
      type: [Boolean],
      default: false,
    }
  },
  setup(props, { emit }) {
    const searchInput = ref('')
    const busy = ref(false)
    const { clientLocations } = useClientLocations()
    const locationList = ref([])
    const router = useRouter()
    const inputValue = ref<Array<string | number> | string | null | number>([])

    const onChange = () => {
      emit('input', inputValue.value)
      emit('change', inputValue.value)
    }
    const selectAll = () => {
      inputValue.value = [...locationList.value]
    }
    const deSelectAll = () => {
      inputValue.value = []
    }

    const fetchLocations = () => {
      busy.value = true
      clientLocations(props.client)
        .then((res) => {
          locationList.value = res.data?.data?.result
          let alphabeticalOption = (locationList.value.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          )[0] as any).id
          let firstOption = (locationList.value[0] as any).id
          let location_ids = router.currentRoute.query.location_ids as Array<string>
          let locationFromUrl = location_ids.map((item) => +item) as Array<
            string | number
          >
          if (locationList.value.length === 1) {
            inputValue.value = props.multiple ? [firstOption] : firstOption
            onChange()
          } else if (locationList.value.length > 1) {
            inputValue.value = props.multiple
              ? locationFromUrl
              : alphabeticalOption
            onChange()
            // selectAll()
          }
        })
        .finally(() => {
          busy.value = false
        })
    }

    onBeforeMount(() => {
      if (props.multiple) {
        let location_ids = router.currentRoute.query
          .location_ids as Array<string>

        if (typeof location_ids === 'string') {
          location_ids = [location_ids]
        }

        if (location_ids) {
          inputValue.value = location_ids.map((item) => +item) as Array<
            string | number
          >
        }
      } else {
        inputValue.value = router.currentRoute.query.location_ids as string
      }
      // fetchLocations()
    })

    watch(
      () => props.client,
      (newValue, oldValue) => {
        if (
          props.multiple &&
          locationList.value.length > 0 &&
          +newValue === +oldValue
        ) {
          return
        }
        if (
          typeof newValue === 'number' &&
          typeof oldValue === 'number' &&
          oldValue !== newValue
        ) {
          inputValue.value = props.multiple ? [] : null
        }
        if (props.client) {
          fetchLocations()
        } else {
          inputValue.value = props.multiple ? [] : null
          onChange()
        }
      }
    )

    return {
      searchInput,
      locationList,
      inputValue,
      onChange,
      busy,
      selectAll,
      deSelectAll,
    }
  },
})
</script>
