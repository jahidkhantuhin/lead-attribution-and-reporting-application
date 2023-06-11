<template>
    <v-row>
      <v-col cols="3">
      </v-col>
      <v-col cols="6">
        <v-alert
          shaped
          prominent
          type="info"
        >
          Your session expired. Please <v-btn small class="info" @click="refreshPage"> Click Here</v-btn> to reload the page. 
        </v-alert>
      </v-col>
    </v-row>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const refreshPage = () => {
      window.location.reload()
    }
    return {
      refreshPage,
    }
  },
})
</script>


