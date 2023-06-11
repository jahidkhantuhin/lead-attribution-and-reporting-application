<template>
  <span
    class="text-lowercase"
    v-if="
      location && location.website && location.name && reportingEmailAddress
    "
  >
    {{ reportingEmailAddress }}
    <a @click="copy(reportingEmailAddress)">
      <v-icon style="font-size: 14px"> mdi-content-copy </v-icon>
    </a>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import swalMixin, { showConfirmDialog, showToast } from '~/utils/swalMixin'
import slugify from 'slugify'

export default defineComponent({
  props: {
    location: {
      type: Object,
      default: null,
    },
  },
  setup(props, { parent }) {
    const $swal = swalMixin((parent as any).$swal as any)
    const copy = (text: string) => {
      window.navigator.clipboard.writeText(text)

      showToast($swal, {
        title: 'Email copied to clipboard',
      })
    }

    const reportingEmailAddress = computed(() => {
      try {
        if (props.location.website && props.location.name) {
          let website = props.location.website as string

          if (!/^https?:\/\//i.test(website)) {
            website = 'http://' + website
          }

          const link = new URL(website)

          let str = `reporting_${link?.hostname?.replace(
            /.+\/\/|www.|\..+/g,
            ''
          )}-${slugify(props.location.name)}@100marketers.com`.toLowerCase()

          return str
        } else {
          return ''
        }
      } catch (e) {
        console.error(e.message)
      }
    })

    return {
      copy,
      reportingEmailAddress,
    }
  },
})
</script>
