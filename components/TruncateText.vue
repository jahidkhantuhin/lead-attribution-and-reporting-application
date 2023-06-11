<template>
  <p class="mb-0">
    <a v-if="button === false">{{ text | truncateText }}</a>
    <a
      v-if="button === false && text && text.length > 50"
      class="expand-link"
      @click="expanded = true"
    >
      {{ showText }}
    </a>
    <v-btn
      v-if="button && text && text.length > 50"
      @click="expanded = true"
      nuxt
      link
      small
    >
      {{ showText }}
    </v-btn>
    <v-btn
      v-if="button && text && text.length < 50"
      @click="expanded = true"
      nuxt
      link
      small
    >
      {{ showText }}
    </v-btn>

    <v-dialog v-model="expanded" width="500">
      <v-card>
        <v-card-title>
          {{ title }}
        </v-card-title>

        <v-card-text class="pt-2">
          <span v-if="quotes" class="quote">“</span>
          <span
            >{{ text }}

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  x-small
                  :ripple="false"
                  @click="copy"
                  v-if="url"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon> mdi-content-copy </v-icon>
                </v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>
          </span>
          <span v-if="quotes" class="quote">”</span>
        </v-card-text>

        <v-card-text v-if="url">
          <v-btn target="_blank" :href="text" small elevation="1">
            <v-icon class="mr-2 body-1">mdi-open-in-new</v-icon>
            Open in new tab
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="expanded = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </p>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import swalMixin, { showToast } from '~/utils/swalMixin'

export default defineComponent({
  props: {
    text: String,
    title: String,
    url: {
      type: Boolean,
      default: false,
    },
    quotes: {
      type: Boolean,
      default: false,
    },
    showText: {
      type: String,
      default: 'Show more',
    },
    button: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { parent }) {
    const expanded = ref(false)
    const $swal = swalMixin(parent.$swal)
    const copy = () => {
      window.navigator.clipboard.writeText(props.text)

      showToast($swal, {
        title: 'Copied to clipboard',
      })
    }
    return {
      expanded,
      copy,
    }
  },
})
</script>


<style scoped lang="scss" >
.quote {
  font-size: 32px;
  &:last-child {
    display: inline-block;
    margin-top: -10px;
    position: relative;
    top: 25px;
  }
}
</style>