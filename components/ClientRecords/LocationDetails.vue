<template>
  <v-row>
    <v-col cols="10" offset="1" v-if="loading">
      <v-expand-transition>
        <v-card >
          <v-card-text>
            <v-skeleton-loader
              type="table-heading, list-item-two-line, image, table-tfoot"
            ></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-expand-transition>
    </v-col>
    <v-col cols="10" offset="1" v-else>
      <v-card v-if="locationData.client">
        <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary" 
          dark
          title="Edit Location"
          :to="`/client-records/${locationData && locationData.client ?  locationData.client.id : ''}/locations/${locationData.id}/edit`"
        > Edit Location 
        </v-btn>
        </v-card-actions>
      </v-card>
      <v-expansion-panels
            class="ldr-expansion-panels"
            v-model="panel"
          >
            <v-expansion-panel :key="0">
              <v-expansion-panel-header>
                <h2> Location Details </h2> 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-simple-table style="box-shadow: 10px 10px 5px #E8E8E8;">
                  <template #default>
                    <tbody>
                      <template>
                        <tr>
                          <td><strong>Name</strong></td>
                          <td>{{ locationData.name }}</td>
                        </tr>
                        <tr>
                          <td><strong>Status</strong></td>
                          <td> 
                            <v-chip
                            :color="`${statusChipColor}`"
                            v-if="locationData.status"
                            > 
                            {{ statusChipName }} 
                            </v-chip> 
                          </td>

                          
                        </tr>
                        <tr>
                          <td><strong>Address</strong></td>
                          <td>{{ locationData.address }}</td>
                        </tr>
                        <tr>
                          <td><strong>City</strong></td>
                          <td>{{ locationData.city }}</td>
                        </tr>
                        <tr>
                          <td><strong>State</strong></td>
                          <td>{{ locationData.state }}</td>
                        </tr>
                        <tr>
                          <td><strong>Zip Code</strong></td>
                          <td>{{ locationData.zipcode }}</td>
                        </tr>
                        <tr>
                          <td><strong>Website</strong></td>
                          <td>{{ locationData.website }}</td>
                        </tr>
                        <tr>
                          <td><strong>Reporting Email Address</strong></td>
                          <td>{{ locationData.reporting_mail }}</td>
                        </tr>
                        <tr>
                          <td><strong>Adwrods Budget</strong></td>
                          <td>{{ locationData.adwords_budget }}</td>
                        </tr>
                        <tr>
                          <td><strong>Facebook Budget</strong></td>
                          <td>{{ locationData.facebook_budget }}</td>
                        </tr>
                        <tr>
                          <td><strong>Monthly Fee</strong></td>
                          <td>{{ locationData.monthly_fee }}</td>
                        </tr>
                        <tr>
                          <td><strong>Apex Chat ID</strong></td>
                          <td>{{ locationData.apexchat_id }}</td>
                        </tr>
                        <tr>
                          <td><strong>Facebook ID</strong></td>
                          <td>{{ locationData.facebook_id }}</td>
                        </tr>
                        <tr>
                          <td><strong>Adwords ID</strong></td>
                          <td>{{ locationData.adwords_id }}</td>
                        </tr>
                        <tr>
                          <td><strong>Last Updated At</strong></td>
                          <td>
                            <formatted-date :date="locationData.updated_at"> 
                              {{ locationData.updated_at }} 
                            </formatted-date>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :key="1">
              <v-expansion-panel-header>
                <h2> Activity Logs </h2> 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div  v-for="(item, index) in locationData.location_activity_logs" :key="index" style="margin-top: 30px; box-shadow: 5px 10px inset #D8D8D8;">
                  <v-row>
                    <v-col cols="3">
                    </v-col>
                    <v-col cols="6">
                      <h3 style="text-align: center;">User who updated on 
                        <formatted-date :date="item.new_data.updated_at"> 
                          {{ item.new_data.updated_at}} 
                        </formatted-date>
                      </h3>
                      <v-simple-table>
                        <template #default>
                          <tbody>
                            <template>
                              <ul style="list-style: none; text-align: center">
                                <li> Name: {{ item.user.first_name }} </li>
                                <li> Email: {{ item.user.email  }} </li>
                              </ul>
                              <truncate-text
                                v-if="item.comment"
                                :quotes="true"
                                title="Comment"
                                class="mt-4 mb-4"
                                align="center"
                                :button="true"
                                :showText="'Show Comment'"
                                :text="item.comment"
                              ></truncate-text>
                            </template>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <h3 style="text-align: center;">Before updated</h3>
                      <v-simple-table>
                        <template #default>
                          <tbody>
                            <template>
                              <tr>
                                <td><strong>Name</strong></td>
                                <td>{{ item.old_data.name }}</td>
                              </tr>
                              <tr>
                                <td><strong>Status</strong></td>
                                <td>{{ item.old_data.client_status }}</td>
                              </tr>
                              <tr>
                                <td><strong>Address</strong></td>
                                <td>{{ item.old_data.address }}</td>
                              </tr>
                              <tr>
                                <td><strong>City</strong></td>
                                <td>{{ item.old_data.city }}</td>
                              </tr>
                              <tr>
                                <td><strong>State</strong></td>
                                <td>{{ item.old_data.state }}</td>
                              </tr>
                              <tr>
                                <td><strong>Zip Code</strong></td>
                                <td>{{ item.old_data.zipcode }}</td>
                              </tr>
                              <tr>
                                <td><strong>Website</strong></td>
                                <td>{{ item.old_data.website }}</td>
                              </tr>
                              <tr>
                                <td><strong>Reporting Email Address</strong></td>
                                <td>{{ item.old_data.reporting_mail }}</td>
                              </tr>
                              <tr>
                                <td><strong>Adwrods Budget</strong></td>
                                <td>{{ item.old_data.adwords_budget }}</td>
                              </tr>
                              <tr>
                                <td><strong>Facebook Budget</strong></td>
                                <td>{{ item.old_data.facebook_budget }}</td>
                              </tr>
                              <tr>
                                <td><strong>Monthly Fee</strong></td>
                                <td>{{ item.old_data.monthly_fee }}</td>
                              </tr>
                              <tr>
                                <td><strong>Apex Chat ID</strong></td>
                                <td>{{ item.old_data.apexchat_id }}</td>
                              </tr>
                              <tr>
                                <td><strong>Facebook ID</strong></td>
                                <td>{{ item.old_data.facebook_id }}</td>
                              </tr>
                              <tr>
                                <td><strong>Adwords ID</strong></td>
                                <td>{{ item.old_data.adwords_id }}</td>
                              </tr>
                            </template>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                    <v-col cols="6">
                      <h3 style="text-align: center;">After updated</h3>
                      <v-simple-table>
                        <template #default>
                          <tbody>
                            <template>
                              <tr :style="`background-color: ${item.new_data.name ? '#adebad' : ''}`">
                                <td>{{ item.new_data.name }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.client_status ? '#adebad' : ''}`">
                                <td>{{ item.new_data.client_status }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.address ? '#adebad' : ''}`">
                                <td>{{ item.new_data.address }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.city ? '#adebad' : ''}`">
                                <td>{{ item.new_data.city }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.state ? '#adebad' : ''}`">
                                <td>{{ item.new_data.state }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.zipcode ? '#adebad' : ''}`">
                                <td>{{ item.new_data.zipcode }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.website ? '#adebad' : ''}`">
                                <td>{{ item.new_data.website }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.reporting_mail ? '#adebad' : ''}`">
                                <td>{{ item.new_data.reporting_mail }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.adwords_budget ? '#adebad' : ''}`">
                                <td>{{ item.new_data.adwords_budget }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.facebook_budget ? '#adebad' : ''}`">
                                <td>{{ item.new_data.facebook_budget }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.monthly_fee ? '#adebad' : ''}`">
                                <td>{{ item.new_data.monthly_fee }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.apexchat_id ? '#adebad' : ''}`">
                                <td>{{ item.new_data.apexchat_id }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.facebook_id ? '#adebad' : ''}`">
                                <td>{{ item.new_data.facebook_id }}</td>
                              </tr>
                              <tr :style="`background-color: ${item.new_data.adwords_id ? '#adebad' : ''}`">
                                <td>{{ item.new_data.adwords_id }}</td>
                              </tr>
                            </template>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                  <!-- <v-row>
                    <v-col cols="12">
                      <truncate-text
                                :quotes="true"
                                title="Comment"
                                class="mb-0"
                                :button="true"
                                :showText="'Show Comment'"
                                :text="item.comment"
                              ></truncate-text>
                    </v-col>
                  </v-row> -->
                </div>
                <p v-if="locationData && locationData.location_activity_logs && locationData.location_activity_logs.length === 0"> No activity info available </p>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :key="2">
              <v-expansion-panel-header>
                <h2> Google Map view </h2> 
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <marquee style="background: #adebad; color: white"> <h2> This section is a work in progress. </h2> </marquee>
              </v-expansion-panel-content>
            </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
} from '@nuxtjs/composition-api'
import LocationNameAndStatus from '~/components/ClientRecords/LocationNameAndStatus.vue'
import LocationAddress from '~/components/ClientRecords/LocationAddress.vue'
import LocationServices from '~/components/ClientRecords/LocationServices.vue'
import LocationSites from '~/components/ClientRecords/LocationSites.vue'
import LocationIds from '~/components/ClientRecords/LocationIds.vue'
import FormattedDate from '~/components/FormattedDate.vue'

export default defineComponent({
  components: {
    LocationNameAndStatus,
    LocationAddress,
    LocationServices,
    LocationSites,
    LocationIds,
    FormattedDate,
  },
  props: {
    locationData: {
      type: Object,
      default: {},
    },
    loading:{

    },
  },
  setup(props) {
    const panel = ref(0)
    const statusChipColor = computed(() => {
      return props.locationData.status === 'paying_client' ? 'green' : props.locationData.status === 'ex_client' ? 'primary' : props.locationData.status === 'trial_client' ? 'orange' : ''
    })
    const statusChipName = computed(() => {
      return props.locationData.status === 'paying_client' ? 'Paying Client' : props.locationData.status === 'ex_client' ? 'Ex Client' : props.locationData.status === 'trial_client' ? 'Trial Client' : ''
    })

    onMounted(() => {
    })

    return {
      panel,
      statusChipColor,
      statusChipName,
    }
  },
})
</script>