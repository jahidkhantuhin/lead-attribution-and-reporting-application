<template>
  <div>
    <!-- <SessionExpired v-if="sessionExpired"/> -->
    <UnauthorizedUser v-if="unAuthorizedToPullReport"/>
    <v-row
      :class="{
        'my-5': true,
        'dark-page': $vuetify.theme.dark,
      }"
      v-if="!unAuthorizedToPullReport"
    >
      <v-col cols="12">
        <!-- <v-alert class="mb-5" type="info" dismissible v-if="sectionProgressAlert">
          {{ $t('message.wip') }}
        </v-alert> -->
        <v-card color="default" rounded elevation="1">
          <v-card-title>{{ $t('message.filters') }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12">
                <client-picker
                  @achange="onClientChange"
                  v-model="filters.client"
                  URLQueryParam="client"
                ></client-picker>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" sm="12" xs="12">
                <location-picker
                  v-model="filters.location_ids"
                  :client="filters.client"
                  :showButton= "showButton"
                ></location-picker>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12">
                <Datepicker
                  @achange="push"
                  @clear="
                    filters.dates = []
                    push()
                  "
                  :disabled="
                    filters.location_ids && filters.location_ids.length > 0
                      ? false
                      : true
                  "
                  :dateHelpButtons="[
                    'thisWeek',
                    'lastWeek',
                    'last14Days',
                    'thisMonth',
                    'lastMonth',
                  ]"
                  v-model="filters.dates"
                ></Datepicker>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2" sm="12" xs="12">
                <div class="text-lg-center">
                  <v-btn
                    :loading="LDRReportLoading"
                    color="primary"
                    class="my-2"
                    style="width: 250px"
                    :disabled="
                      !filters.client ||
                      !(filters.location_ids && !!filters.location_ids.length) ||
                      !(filters.dates && !!filters.dates.length)
                    "
                    @click="fetchLDRReport"
                  >
                    <v-icon left>mdi-check</v-icon>
                    Apply
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <v-form> </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <pre>{{ JSON.stringify(computedReport, null, 2) }}</pre> -->
      <v-col cols="12">
        <v-expand-transition>
          <v-card v-if="!loaded && LDRReportLoading === false">
            <v-card-text>
              {{ $t('message.supplyFilters') }}
            </v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card v-if="LDRReportLoading">
            <v-card-text>
              <v-skeleton-loader
                type="table-heading, list-item-two-line, image, table-tfoot"
              ></v-skeleton-loader>
            </v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card v-if="LDRReportLoading === false && loaded" class="min-h-300">
            <v-toolbar flat>
              <v-toolbar-title> Report Details: </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                v-show="loaded && LDRReportLoading === false"
                icon
                title="Copy link to this report"
                @click="copyReportLink"
              >
                <v-icon>mdi-link</v-icon>
              </v-btn>
              <v-btn
                v-show="loaded"
                icon
                title="Reload the report"
                @click="fetchLDRReport"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                @click="uploadReport"
                :loading="uploadReportLoading"
                icon
                title="Upload to Google Drive"
                :color="googleDocLink ? 'info' : 'normal'"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </v-toolbar>

            <!-- CLient Info -->
            <v-card-text v-if="loaded" class="text-h5">
              Client:
              <nuxt-link class="client-link" :to="`/client-records/${LDRReport.id}`">
              {{ LDRReport.name }}
              </nuxt-link>
            </v-card-text>
            <v-card-text
              v-if="loaded && LDRReport && LDRReport.locations"
              class="subtitle-1"
            >
              Locations:
              <v-chip
                v-for="(location, index) in LDRReport.locations"
                small
                class="mr-2"
                :key="index"
              >
              <nuxt-link class="client-link" :to="`/client-records/${LDRReport.id}/locations/${location.location.id}`">
                {{ location.location.name }}
                </nuxt-link>
              </v-chip>
            </v-card-text>
            <v-card-text v-if="loaded">
              <DatesAndDiff
                :start="transformReport.date_start"
                :end="transformReport.date_end"
              />
            </v-card-text>

            <v-card-text>
              <p class="body-2 mb-2">
                Last updated at
                <!-- <formatted-date
                  :timezone="false"
                  :date="computedReport.cache && computedReport.cache.created_at"
                ></formatted-date> -->
                {{previousDay}} @ 1 AM EST
              </p>
            </v-card-text>

            <v-expansion-panels
              class="ldr-expansion-panels"
              v-model="panel"
              v-if="loaded"
            >
              <v-expansion-panel :key="0">
                <v-expansion-panel-header>
                  Lead Summary
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card-text v-if="loaded" id="LDR--summary">
                    <v-row>
                      <v-col cols="3">
                      </v-col>
                      <v-col cols="3">
                        <h3 class="my-2">Lead Summary</h3>
                        <LDRSummary :summary="summary" />
                      </v-col>
                      <v-col cols="3">
                        <h3 class="my-2">Aggregate</h3>
                        <LDRAnalytics
                          :analytics="
                            computedReport && computedReport.lead_analytics
                          "
                          :summary="summary"
                        ></LDRAnalytics>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3">
                      </v-col>
                      <v-col cols="3">
                        <h3 class="my-2">Facebook</h3>
                        <LDRAnalyticsFacebook
                          :analytics="
                            computedReport && computedReport.lead_analytics
                          "
                        ></LDRAnalyticsFacebook>
                      </v-col>
                      <v-col cols="3">
                        <h3 class="my-2">Adwords</h3>
                        <LDRAnalyticsAdwords
                          :analytics="
                            computedReport && computedReport.lead_analytics
                          "
                        ></LDRAnalyticsAdwords>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel :key="1">
                <v-expansion-panel-header>
                  Summary by Source
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card-text v-if="loaded" id="LDR--summary">
                    <v-row>
                      <v-col cols="3">
                      </v-col>
                      <v-col cols="6">
                        <h1 class="my-2" style="text-align: center;">ADWORDS</h1>
                        <LDRSummaryGOOGLE :summaryGOOGLE=
                          "computedReport" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3">
                      </v-col>
                      <v-col cols="6">
                        <h1 style="text-align: center" class="my-2">FACEBOOK</h1>
                        <LDRSummaryFACEBOOK :summaryFACEBOOK="computedReport" />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="3">
                      </v-col>
                      <v-col cols="6">
                        <h1 style="text-align: center" class="my-2">SEO</h1>
                        <LDRSummarySEO :summarySEO="computedReport" />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel :key="2">
                <v-expansion-panel-header>
                  Lead Details
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-tabs
                    class="mt-5"
                    :background-color="
                      $vuetify.theme.dark ? 'rgb(18 18 18)' : '#f1f1f1'
                    "
                    v-model="tab"
                  >
                    <v-tab key="all">All</v-tab>
                    <!-- <v-tab key="calls">Calls</v-tab> -->
                    <v-tab key="adwords_calls">Calls-ppc</v-tab>
                    <v-tab key="facebook_calls">Calls-fb</v-tab>
                    <v-tab key="seo_calls">Calls-seo</v-tab>

                    <!-- <v-tab key="chats">Chats</v-tab> -->
                    <v-tab key="chats-ppc">Chats-ppc</v-tab>
                    <v-tab key="chats-fb">Chats-fb</v-tab>
                    <v-tab key="chats-seo">Chats-seo</v-tab>
                    <v-tab key="forms-ppc">Forms-ppc</v-tab>
                    <v-tab key="forms-fb">Forms-fb</v-tab>
                    <v-tab key="forms-seo">Forms-seo</v-tab>
                  </v-tabs>
                  <div class="mb-2"></div>
                  <v-tabs-items v-model="tab">
                    <v-tab-item key="all">
                      <LDRAllReports
                        :callItemClass="callItemClass"
                        :allReportsList="allReportsList"
                        :allDetails="computedReport"
                      ></LDRAllReports>
                    </v-tab-item>
                    <!-- <v-tab-item key="calls">
                      <div v-if="loaded">
                        <LDRCalls
                          :callItemClass="callItemClass"
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.calls
                          "
                        ></LDRCalls>
                      </div>
                    </v-tab-item> -->
                    <v-tab-item key="adwords_calls">
                      <!--  -->
                      <div v-if="loaded">
                        <LDRCallsPPC
                          :callItemClass="callItemClass"
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.adwords_calls
                          "
                        ></LDRCallsPPC>
                      </div>
                      </v-tab-item>
                      <v-tab-item key="facebook_calls">
                      <!--  -->
                      <div v-if="loaded">
                        <LDRCallsFB
                          :callItemClass="callItemClass"
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.facebook_calls
                          "
                        ></LDRCallsFB>
                      </div>
                    </v-tab-item>
                    <v-tab-item key="seo_calls">
                      <!--  -->
                      <div v-if="loaded">
                        <LDRCallsSEO
                          :callItemClass="callItemClass"
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.seo_calls
                          "
                        ></LDRCallsSEO>
                      </div>
                    </v-tab-item>
                    <!-- <v-tab-item key="chats">
                      <div v-if="loaded">
                        <LDRChats
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.chats
                          "
                        ></LDRChats>
                      </div>
                    </v-tab-item> -->
                    <v-tab-item key="chats-ppc">
                      <div v-if="loaded">
                        <!--  -->
                        <LDRChatsPPC
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.adwords_chats
                          "
                        ></LDRChatsPPC>
                      </div>
                    </v-tab-item>
                    <v-tab-item key="chats-fb">
                      <div v-if="loaded">
                        <!--  -->
                        <LDRChatsFB
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.facebook_chats
                          "
                        ></LDRChatsFB>
                      </div>
                    </v-tab-item>
                    <v-tab-item key="chats-seo">
                      <!--  -->
                      <div v-if="loaded">
                        <LDRChatsSEO
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.seo_chats
                          "
                        ></LDRChatsSEO>
                      </div>
                    </v-tab-item>
                    <v-tab-item key="forms-ppc">
                      <div v-if="loaded">
                        <!--  -->
                        <LDRFormsPPC
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.emails
                          "
                        ></LDRFormsPPC>
                      </div>
                    </v-tab-item>

                    <v-tab-item key="forms-fb">
                      <div v-if="loaded">
                        <!--  -->
                        <LDRFormsFB
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.facebook_leads
                          "
                        ></LDRFormsFB>
                      </div>
                    </v-tab-item>
                    <v-tab-item key="forms-seo">
                      <!--  -->
                      <div v-if="loaded">
                        <LDRFormsSEO
                          :items="
                            computedReport &&
                            computedReport.details &&
                            computedReport.details.seo_emails
                          "
                        ></LDRFormsSEO>
                      </div>
                    </v-tab-item>
                  </v-tabs-items>
                  <!-- full details -->
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-expand-transition>
      </v-col>
      <v-dialog v-model="reportLoadingDialog" persistent width="500">
        <v-expand-transition>
          <v-card v-show="uploadReportLoading">
            <v-card-text class="pt-5">
              <p class="mb-3 text-center">
                {{ $t('message.uploadingToGoogleDrive') }}
              </p>
              <v-progress-linear
                indeterminate
                color="black"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card v-show="reportUploaded">
            <v-card-title class="mb-4"
              >{{ $t('alert.success.driveUpload') }}.</v-card-title
            >
            <v-card-text>
              <span class="google-doc-link">{{ googleDocLink }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a @click="copy('.google-doc-link')" v-bind="attrs" v-on="on">
                    <v-icon> mdi-content-copy </v-icon>
                  </a>
                </template>
                <span>Copy</span>
              </v-tooltip>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :href="googleDocLink" target="_blank">
                Open File
              </v-btn>
              <v-btn color="yellow" @click="reportLoadingDialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-dialog>

      <v-dialog v-model="emailDialog" width="500">
        <v-card>
          <v-card-title class=""> Email body </v-card-title>

          <v-card-text
            v-if="currentEmail && currentEmail.lead && currentEmail.lead.message"
            class="pl-6 mb-4"
          >
            <blockquote class="blockquote">
              <span v-html="currentEmail.lead.message"></span>
            </blockquote>
          </v-card-text>
          <v-card-text v-else> Lead Message is empty. </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="
                emailDialog = false
                currentEmail = null
              "
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  watch,
  defineComponent,
  ref,
  useStore,
  useRouter,
  onMounted,
  useRoute,
  useContext,
} from '@nuxtjs/composition-api'
import { get, sortBy } from 'lodash'
import moment from 'moment-timezone'
import LDRSummary from '~/components/LDR/LDRSummary.vue'
import LDRAnalytics from '~/components/LDR/LDRAnalytics.vue'
import LDRAnalyticsAdwords from '~/components/LDR/LDRAnalyticsAdwords.vue'
import LDRAnalyticsFacebook from '~/components/LDR/LDRAnalyticsFacebook.vue'
import LDRSummaryGOOGLE from '~/components/LDR/LDRSummary-GOOGLE.vue'
import LDRSummaryFACEBOOK from '~/components/LDR/LDRSummary-FACEBOOK.vue'
import LDRSummarySEO from '~/components/LDR/LDRSummary-SEO.vue'
import useAxios from '~/plugins/useAxios'
import { IBreadcrumbs } from '~/store'
import ldrEmails from '~/components/LDR/Emails.vue'
import FormattedDate from '~/components/FormattedDate.vue'
import DatesAndDiff from '~/components/DatesAndDiff.vue'
import ClientPicker from '~/components/forms/ClientPicker.vue'
import Datepicker from '~/components/forms/DatePicker.vue'
import TruncateText from '~/components/TruncateText.vue'
import swalMixin, { showToast } from '~/utils/swalMixin'
import defaultTimezone from '~/utils/defaultTimezone'
import VuetifyColorsPallete from '~/shared/VuetifyColorsPallete'
import getColorForScoredCall, {
  isDateWeekend,
} from '~/utils/getColorForScoredCall'
import generateLeadDetailsReport from '~/utils/reports-upload/ldr'

import LocationPicker from '~/components/forms/LocationPicker.vue'

import LDRAllReports from '~/components/LDR/AllReports.vue'
// import LDRCalls from '~/components/LDR/Calls.vue'
import LDRCallsPPC from '~/components/LDR/Calls-PPC.vue'
import LDRCallsFB from '~/components/LDR/Calls-FB.vue'
import LDRCallsSEO from '~/components/LDR/Calls-SEO.vue'
// import LDRChats from '~/components/LDR/Chats.vue'
import LDRChatsPPC from '~/components/LDR/Chats-PPC.vue'
import LDRChatsFB from '~/components/LDR/Chats-FB.vue'
import LDRChatsSEO from '~/components/LDR/Chats-SEO.vue'

import LDRFormsPPC from '~/components/LDR/Forms-PPC.vue'
import LDRFormsFB from '~/components/LDR/Forms-FB.vue'
import LDRFormsSEO from '~/components/LDR/Forms-SEO.vue'

import UnauthorizedUser from '~/components/UnauthorizedUser.vue'
import SessionExpired from '~/components/SessionExpired.vue'
import { callStatus } from '~/plugins/callStatus'
import { callAudio } from '~/plugins/callAudio'


export default defineComponent({
  components: {
    LDRSummary,
    LDRSummaryGOOGLE,
    LDRSummaryFACEBOOK,
    LDRSummarySEO,
    LDRAnalytics,
    ldrEmails,
    FormattedDate,
    DatesAndDiff,
    Datepicker,
    TruncateText,

    ClientPicker,
    LocationPicker,
    LDRAnalyticsAdwords,
    LDRAnalyticsFacebook,
    LDRAllReports,
    // LDRCalls,
    LDRCallsPPC,
    LDRCallsFB,
    LDRCallsSEO,
    // LDRChats,
    LDRChatsPPC,
    LDRChatsFB,
    LDRChatsSEO,
    LDRFormsPPC,
    LDRFormsFB,
    LDRFormsSEO,
    UnauthorizedUser,
    SessionExpired,
  },
  // middleware: 'isAuthenticated',
  setup(_props, { parent }) {
    const { $auth } = useContext()
    const unAuthorizedToPullReport = computed(() =>
      !$auth.hasScope('create report') && $auth.hasScope('vpn access')
    )
    const sessionExpired = computed(() =>
      !$auth.user
    )
    const store = useStore()
    const isAllowed = store.getters['users/isAuthenticated'] ? true : false
    const currentEmail = ref(null)
    const sectionProgressAlert = ref(true)
    const emailDialog = ref(false)
    const showButton = ref(true)

    const filters: any = ref({
      dates: [],
      client: null,
    })

    const previousDay = moment().subtract(1, 'days').endOf('day').format('MMM DD, YYYY')

    const allReportsList = ref([])
    const tab = ref('mixed')
    const panel = ref(0)
    const LDRReport: any = ref({})
    const LDRReportLoading = ref(false)
    const isCopied = ref(false)

    const copy = (element: string) => {
      window.navigator.clipboard.writeText(googleDocLink.value)
      showToast($swal, {
        title: 'Copied to clipboard',
      })
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 5000)
    }

    const loaded = ref(false)
    const axios = useAxios()
    const $swal = swalMixin((parent as any).$swal as any)

    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: 'Dashboard',
        to: '/',
      },
      {
        text: 'Reports',
        to: '/reports',
      },
      {
        text: 'LDR',
        to: '#',
        disabled: true,
      },
    ]

    store.dispatch('setPageHeading', {
      pageTitle: 'Lead Details Report',
      breadcrumbs,
    })

    // state
    const busy = ref<boolean>(false)
    const report = ref(null)

    const summary = computed(() => {
      return {
        calls: {
          total: get(transformReport, 'value.summary.calls.total', 0),
          unique: get(transformReport, 'value.summary.calls.unique', 0),
        },
        emails: {
          total: get(transformReport, 'value.summary.emails.total', 0),
          unique: get(transformReport, 'value.summary.emails.unique', 0),
        },
        chats: {
          total: get(transformReport, 'value.summary.chats.total', 0),
          unique: get(transformReport, 'value.summary.chats.unique', 0),
        },
        facebook_leads: {
          total: get(transformReport, 'value.summary.facebook_leads.total', 0),
          unique: get(
            transformReport,
            'value.summary.facebook_leads.unique',
            0
          ),
        },
      }
    })

    const callItemClass = (item: any, b: any) => {
      return item.rowColor
    }

    const setallReportsList = () => {
      const { calls, emails, chats, facebook_leads } = get(
        transformReport,
        'value.details',
        {}
      )

      const getDataForAllReports = (item: any, type: string) => {
        if (!item) return null

        switch (type) {
          case 'facebook':
            return {
              type: 'facebook',
              name: item.lead?.name,
              datetime: item.date,
              timestamp: moment(item.date).tz(defaultTimezone).valueOf(),
              rowColorHex: isDateWeekend(item.date)
                ? VuetifyColorsPallete['grey lighten-3']
                : '',
              local_date: item.name,
              campaign: item.campaign,
              timezone: '',
              email: item.lead?.email,
              phone: item.lead?.phone_number,
              procedure: item.procedure,
              location_name: item.location_name,
            }

          case 'call':
            return {
              type: 'call',
              name: item.caller_name,
              datetime: item.call_start,
              timestamp: moment(item.call_start).tz(defaultTimezone).valueOf(),
              rowColorHex: isDateWeekend(item.call_start)
                ? VuetifyColorsPallete['grey lighten-3']
                : '',
              local_date: item.call_start,
              campaign: item.campaign,
              timezone: item.campaign == null ? "US/Eastern" : item.campaign.timezone,
              email: null,
              phone: item.caller_number,
              location_name: item.location_name,
              procedure: item?.score?.procedure?.name,
            }

          case 'email':
            return {
              type: 'email',
              name: item.lead.name,
              datetime: item.date,
              local_date: item.date,
              timestamp: moment(item.date).tz(defaultTimezone).valueOf(),
              rowColorHex: isDateWeekend(item.date)
                ? VuetifyColorsPallete['grey lighten-3']
                : '',
              campaign: item.campaign,
              timezone: null,
              email: item.lead.email,
              phone: item.lead.phone,
              procedure: item?.lead?.procedure,
              location_name: item.location_name,
            }

          case 'chat':
            return {
              type: 'chat',
              name: item.lead.name,
              datetime: item.chat_date,
              timestamp: moment(item.chat_date).tz(defaultTimezone).valueOf(),
              rowColorHex: isDateWeekend(item.chat_date)
                ? VuetifyColorsPallete['grey lighten-3']
                : '',
              campaign: item.campaign,
              local_date: item.chat_date,
              timezone: null,
              email: item.lead.email,
              phone: item.lead.phone,
              procedure: item?.procedure,
              location_name: item.location_name,
            }

          default:
            return null
        }
      }

      // make the mixed array
      let allReports: Array<any> = []

      calls?.forEach((item: any) =>
        allReports?.push(getDataForAllReports(item, `call`))
      )

      // adwords_calls?.forEach((item: any) =>
      //   allReports?.push(getDataForAllReports(item, `google_call`))
      // )

      // facebook_calls?.forEach((item: any) =>
      //   allReports?.push(getDataForAllReports(item, `facebook_call`))
      // )

      emails?.forEach((item: any) =>
        allReports?.push(getDataForAllReports(item, `email`))
      )

      chats?.forEach((item: any) =>
        allReports?.push(getDataForAllReports(item, `chat`))
      )

      // adwords_chats?.forEach((item: any) =>
      //   allReports?.push(getDataForAllReports(item, `chat-ppc`))
      // )

      // facebook_chats?.forEach((item: any) =>
      //   allReports?.push(getDataForAllReports(item, `chat-fb`))
      // )

      facebook_leads?.forEach((item: any) =>
        allReports?.push(getDataForAllReports(item, `facebook`))
      )

      // Avoid null values.

      allReports = allReports.filter((item) => item)

      // @ts-ignore
      allReportsList.value = sortBy(allReports, ['timestamp']).reverse()
    }

    const fetchLDRReport = async function () {
      router
        .replace({
          query: filters.value,
        })
        .catch(() => {})

      const dateOne = filters.value.dates[0]
      const dateTwo = filters.value.dates[1] ?? filters.value.dates[0]
      googleDocLink.value = ''
      reportUploaded.value = false

      if (typeof filters.value.location_ids === 'string') {
        filters.value.location_ids = [filters.value.location_ids]
      }

      reportUploaded.value = uploadReportLoading.value = false
      LDRReportLoading.value = true

      loaded.value = false
      axios
        .get(`/leads`, {
          withCredentials: true,
          headers: {
          'Authorization': `Bearer ${(store.state as any).cred.cred}`
          },
          params: {
            date_start: `${dateOne}`,
            date_end: `${dateTwo}`,
            location_ids: filters.value.location_ids,
            client_id: filters.value.client,
          },
        })
        .then((resp) => {
          const data = resp.data.data
          console.log('LDR', data)
          if (data) {
            LDRReport.value = data
            loaded.value = true
            panel.value = 0

            setallReportsList()
          }
        })
        .catch((e) => {
          loaded.value = false
          const messageFromServer: string = get(
            e,
            'response.data.message',
            e.message
          )
          showToast($swal, {
            title: messageFromServer,
            icon: 'error',
          })
        })
        .finally(() => {
          LDRReportLoading.value = false
          LDRReportLoading.value = false
        })
    }

    const copyReportLink = () => {
      window.navigator.clipboard.writeText(window.location.href)
      showToast($swal, {
        title: 'Link copied to clipboard',
      })
    }

    /**
     * Handles the change of the datepicker input.
     * If a date range is selected, it automatically rearranges them
     * based on their recentness.
     */
    const uploadReportLoading = ref(false)
    const googleDocLink = ref('')
    const reportLoadingDialog = ref(false)
    const reportUploaded = ref(false)

    const uploadReport = () => {
      try {
        if (reportUploaded.value === true) {
          reportLoadingDialog.value = true
          return
        }

        uploadReportLoading.value = true
        reportLoadingDialog.value = true

        axios
          .post(
            '/reports/upload',
            generateLeadDetailsReport(
              transformReport,
              (store as any).state.auth.user,
              LDRReport.value
            ),
            {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${(store.state as any).cred.cred}`
            }
          }
          )
          .then((res) => {
            googleDocLink.value = res.data?.data?.url
            reportUploaded.value = true
          })
          .catch(() => {
            uploadReportLoading.value = false
            reportLoadingDialog.value = false
          })
          .finally(() => {
            uploadReportLoading.value = false
          })
      } catch (e) {
        console.error(e.message)
        showToast($swal, {
          title: 'Something went wrong while uploading report to G-Drive',
        })
      }
    }

    const router = useRouter()
    const route = useRoute()

    const push = () => {
      router.push({
        path: '/reports/lead-details-report',
        query: {
          ...router.currentRoute.query,
          ...(filters.value as any),
        },
      })
    }

    const onClientChange = (id: Number, client: any) => {
      router.push({
        path: router.currentRoute.path,
        query: {
          ...router.currentRoute.query,
          ...(filters.value as any),
          client_name: client ? client.name : '',
          location_ids: [],
        },
      })
    }

    const onLocationChange = (id: Number, client: any) => {
      router.push({
        path: router.currentRoute.path,
        query: {
          ...router.currentRoute.query,
          ...(filters.value as any),
        },
      })
    }

    const loadFiltersFromURL = () => {
      filters.value = {
        ...filters.value,
        ...router.currentRoute.query,
      }
    }

    const transformReport = computed(() => {
      let report: any = {
        date_start: null,
        date_end: null,
        lead_analytics: {
          adwords: {
            clicks: 0,
            conversions: 0,
            impressions: 0,
            total_spend: 0,
          },
          aggregate: {
            clicks: 0,
            conversions: 0,
            cpl: 0,
            impressions: 0,
            total_spend: 0,
            total_unique_leads: 0,
          },
          facebook: {
            clicks: 0,
            conversions: 0,
            impressions: 0,
            total_spend: 0,
          },
        },
        summary: {
          calls: {
            total: 0,
            unique: 0,
          },
          chats: {
            total: 0,
            unique: 0,
          },
          emails: {
            total: 0,
            unique: 0,
          },
          facebook_leads: {
            total: 0,
            unique: 0,
          },
        },
        details: {
          calls: [],
          adwords_calls: [],
          facebook_calls: [],
          seo_calls: [],
          chats: [],
          adwords_chats: [],
          facebook_chats: [],
          seo_chats: [],
          emails: [],
          facebook_leads: [],
          seo_emails: [],
          am: {
            adwords: {
              call_summary: {
                booked: 0,
                irrelevant: 0,
                missed: 0,
                not_booked: 0,
                unscored: 0,
              },
              calls: {
                total: 0,
                unique: 0,
              },
              chats: {
                total: 0,
                unique: 0,
              },
              clicks: 0,
              conversions: 0,
              cpl: 0,
              forms: {
                total: 0,
                unique: 0,
              },
              impressions: 0,
              total_spend: 0,

            },
            facebook: {
              call_summary: {
                booked: 0,
                irrelevant: 0,
                missed: 0,
                not_booked: 0,
                unscored: 0,
              },
              calls: {
                total: 0,
                unique: 0,
              },
              chats: {
                total: 0,
                unique: 0,
              },
              clicks: 0,
              conversions: 0,
              cpl: 0,
              forms: {
                total: 0,
                unique: 0,
              },
              impressions: 0,
              total_spend: 0,
            }
          }
        },
      }

      LDRReport.value?.locations?.forEach((location: any) => {
        report.date_start = location.date_start
        report.date_end = location.date_end

        let adwordsTotalSpend = !location.lead_analytics.adwords.account_shared ? location.lead_analytics.adwords.total_spend : 0
        report.lead_analytics.adwords.total_spend =
          report.lead_analytics.adwords.total_spend +
          adwordsTotalSpend

        let adwordsClicks = !location.lead_analytics.adwords.account_shared ? location.lead_analytics.adwords.clicks : 0      
        report.lead_analytics.adwords.clicks =
          report.lead_analytics.adwords.clicks +
          adwordsClicks

        report.lead_analytics.adwords.conversions =
          report.lead_analytics.adwords.conversions +
          location.lead_analytics.adwords.conversions

        let adwordsImpressions = !location.lead_analytics.adwords.account_shared ? location.lead_analytics.adwords.impressions : 0              
        report.lead_analytics.adwords.impressions =
          report.lead_analytics.adwords.impressions +
          adwordsImpressions

        let aggregateClicks = !location.lead_analytics.adwords.account_shared ? location.lead_analytics.aggregate.clicks : 0
        report.lead_analytics.aggregate.clicks =
          report.lead_analytics.aggregate.clicks +
          aggregateClicks

        report.lead_analytics.aggregate.conversions =
          report.lead_analytics.aggregate.conversions +
          location.lead_analytics.aggregate.conversions

        report.lead_analytics.aggregate.cpl =
          report.lead_analytics.aggregate.cpl +
          location.lead_analytics.aggregate.cpl

        let aggregateImpressions = !location.lead_analytics.adwords.account_shared ? location.lead_analytics.aggregate.impressions : 0
        report.lead_analytics.aggregate.impressions =
          report.lead_analytics.aggregate.impressions +
          aggregateImpressions

        let aggregateTotalSpend = !location.lead_analytics.adwords.account_shared ? location.lead_analytics.aggregate.total_spend : 0
        report.lead_analytics.aggregate.total_spend =
          report.lead_analytics.aggregate.total_spend +
          aggregateTotalSpend

        report.lead_analytics.aggregate.total_unique_leads =
          report.lead_analytics.aggregate.total_unique_leads +
          location.lead_analytics.aggregate.total_unique_leads

        report.lead_analytics.facebook.clicks =
          report.lead_analytics.facebook.clicks +
          location.lead_analytics.facebook.clicks

        report.lead_analytics.facebook.conversions =
          report.lead_analytics.facebook.conversions +
          location.lead_analytics.facebook.conversions

        report.lead_analytics.facebook.impressions =
          report.lead_analytics.facebook.impressions +
          location.lead_analytics.facebook.impressions

        report.lead_analytics.facebook.total_spend =
          report.lead_analytics.facebook.total_spend +
          location.lead_analytics.facebook.total_spend

        report.summary.calls.unique =
          report.summary.calls.unique + location.summary.calls.unique
        report.summary.calls.total =
          report.summary.calls.total + location.summary.calls.total

        report.summary.chats.unique =
          report.summary.chats.unique + location.summary.chats.unique
        report.summary.chats.total =
          report.summary.chats.total + location.summary.chats.total

        report.summary.emails.unique =
          report.summary.emails.unique + location.summary.emails.unique
        report.summary.emails.total =
          report.summary.emails.total + location.summary.emails.total

        report.summary.facebook_leads.unique =
          report.summary.facebook_leads.unique +
          location.summary.facebook_leads.unique
        report.summary.facebook_leads.total =
          report.summary.facebook_leads.total +
          location.summary.facebook_leads.total

        location.details.calls = location.details.calls.map((calls: any) => {
          return {
            location_name: location?.location?.name,
            ...calls,
          }
        })
        location.details.adwords_calls = location.details.adwords_calls.map((adwords_calls: any) => {
          return {
            location_name: location?.location?.name,
            ...adwords_calls,
          }
        })
        location.details.facebook_calls = location.details.facebook_calls.map((facebook_calls: any) => {
          return {
            location_name: location?.location?.name,
            ...facebook_calls,
          }
        })
        location.details.seo_calls = location.details.seo_calls ? location.details.seo_calls.map((seo_calls: any) => {
          return {
            location_name: location?.location?.name,
            ...seo_calls,
          }
        }) : []

        // Filtered calls which has no campaign.

        // let filteredCalls = location.details.calls.filter((call: any) => {
        //   return call.campaign != null
        // })
        // location.details.calls = filteredCalls.map((filteredCalls: any) => {
        //   return {
        //     location_name: location?.location?.name,
        //     ...filteredCalls,
        //   }
        // })

        // let filteredAdwordsCalls = location.details.adwords_calls.filter((call: any) => {
        //   return call.campaign != null
        // })
        // location.details.adwords_calls = filteredAdwordsCalls.map((filteredAdwordsCalls: any) => {
        //   return {
        //     location_name: location?.location?.name,
        //     ...filteredAdwordsCalls,
        //   }
        // })

        // let filteredFacebookCalls = location.details.facebook_calls.filter((call: any) => {
        //   return call.campaign != null
        // })
        // location.details.facebook_calls = filteredFacebookCalls.map((filteredFacebookCalls: any) => {
        //   return {
        //     location_name: location?.location?.name,
        //     ...filteredFacebookCalls,
        //   }
        // })

        location.details.chats = location.details.chats.map((chats: any) => {
          return {
            location_name: location?.location?.name,
            ...chats,
          }
        })
        location.details.adwords_chats = location.details.adwords_chats.map((adwords_chats: any) => {
          return {
            location_name: location?.location?.name,
            ...adwords_chats,
          }
        })
        location.details.facebook_chats = location.details.facebook_chats.map((facebook_chats: any) => {
          return {
            location_name: location?.location?.name,
            ...facebook_chats,
          }
        })
        location.details.seo_chats = location.details.seo_chats ? location.details.seo_chats.map((seo_chats: any) => {
          return {
            location_name: location?.location?.name,
            ...seo_chats,
          }
        }) : []

        
        location.details.emails = location.details.emails.map((emails: any) => {
          return {
            location_name: location?.location?.name,
            ...emails,
          }
        })
        location.details.facebook_leads = location.details.facebook_leads.map(
          (facebook_leads: any) => {
            return {
              location_name: location?.location?.name,
              ...facebook_leads,
            }
          }
        )
        location.details.seo_emails = location.details.seo_emails ? location.details.seo_emails.map(
          (seo_emails: any) => {
            return {
              location_name: location?.location?.name,
              ...seo_emails,
            }
          }
        ) : []
                

        report.details.calls.push(...(location.details.calls as Array<any>))
        report.details.adwords_calls.push(...(location.details.adwords_calls as Array<any>))
        report.details.facebook_calls.push(...(location.details.facebook_calls as Array<any>))
        report.details.seo_calls.push(...(location.details.seo_calls as Array<any>))

        report.details.chats.push(...(location.details.chats as Array<any>))
        report.details.adwords_chats.push(...(location.details.adwords_chats as Array<any>))
        report.details.facebook_chats.push(...(location.details.facebook_chats as Array<any>))
        report.details.seo_chats.push(...(location.details.seo_chats as Array<any>))

        report.details.emails.push(...(location.details.emails as Array<any>))
        report.details.facebook_leads.push(
          ...(location.details.facebook_leads as Array<any>)
        )
        report.details.seo_emails.push(
          ...(location.details.seo_emails as Array<any>)
        )
        
        report.details.am.adwords.call_summary.booked =
        report.details.am.adwords.call_summary.booked + location.details.am.adwords.call_summary.booked

        report.details.am.adwords.call_summary.irrelevant =
        report.details.am.adwords.call_summary.irrelevant + location.details.am.adwords.call_summary.irrelevant

        report.details.am.adwords.call_summary.missed =
        report.details.am.adwords.call_summary.missed + location.details.am.adwords.call_summary.missed

        report.details.am.adwords.call_summary.not_booked =
        report.details.am.adwords.call_summary.not_booked + location.details.am.adwords.call_summary.not_booked

        report.details.am.adwords.call_summary.unscored =
        report.details.am.adwords.call_summary.unscored + location.details.am.adwords.call_summary.unscored

        report.details.am.adwords.calls.total =
        report.details.am.adwords.calls.total + location.details.am.adwords.calls.total

        report.details.am.adwords.calls.unique =
        report.details.am.adwords.calls.unique + location.details.am.adwords.calls.unique

        report.details.am.adwords.chats.total =
        report.details.am.adwords.chats.total + location.details.am.adwords.chats.total

        report.details.am.adwords.chats.unique =
        report.details.am.adwords.chats.unique + location.details.am.adwords.chats.unique

        report.details.am.adwords.clicks =
        report.details.am.adwords.clicks + location.details.am.adwords.clicks

        report.details.am.adwords.conversions =
        report.details.am.adwords.conversions + location.details.am.adwords.conversions

        report.details.am.adwords.cpl =
        report.details.am.adwords.cpl + location.details.am.adwords.cpl

        report.details.am.adwords.forms.total =
        report.details.am.adwords.forms.total + location.details.am.adwords.forms.total

        report.details.am.adwords.forms.unique =
        report.details.am.adwords.forms.unique + location.details.am.adwords.forms.unique

        report.details.am.adwords.impressions =
        report.details.am.adwords.impressions + location.details.am.adwords.impressions

        // For Facebook

        report.details.am.facebook.call_summary.booked =
        report.details.am.facebook.call_summary.booked + location.details.am.facebook.call_summary.booked

        report.details.am.facebook.call_summary.irrelevant =
        report.details.am.facebook.call_summary.irrelevant + location.details.am.facebook.call_summary.irrelevant

        report.details.am.facebook.call_summary.missed =
        report.details.am.facebook.call_summary.missed + location.details.am.facebook.call_summary.missed

        report.details.am.facebook.call_summary.not_booked =
        report.details.am.facebook.call_summary.not_booked + location.details.am.facebook.call_summary.not_booked

        report.details.am.facebook.call_summary.unscored =
        report.details.am.facebook.call_summary.unscored + location.details.am.adwords.call_summary.unscored

        report.details.am.facebook.calls.total =
        report.details.am.facebook.calls.total + location.details.am.facebook.calls.total

        report.details.am.facebook.calls.unique =
        report.details.am.facebook.calls.unique + location.details.am.facebook.calls.unique

        report.details.am.facebook.chats.total =
        report.details.am.facebook.chats.total + location.details.am.facebook.chats.total

        report.details.am.facebook.chats.unique =
        report.details.am.facebook.chats.unique + location.details.am.facebook.chats.unique

        report.details.am.facebook.clicks =
        report.details.am.facebook.clicks + location.details.am.facebook.clicks

        report.details.am.facebook.conversions =
        report.details.am.facebook.conversions + location.details.am.facebook.conversions

        report.details.am.facebook.cpl =
        report.details.am.facebook.cpl + location.details.am.facebook.cpl

        report.details.am.facebook.forms.total =
        report.details.am.facebook.forms.total + location.details.am.facebook.forms.total

        report.details.am.facebook.forms.unique =
        report.details.am.facebook.forms.unique + location.details.am.facebook.forms.unique

        report.details.am.facebook.impressions =
        report.details.am.facebook.impressions + location.details.am.facebook.impressions

      })

      const client = { ...LDRReport.value }
      delete client['locations']

      report.client = client

      return report
    })

    const computedReport = computed(() => {
      let report = transformReport.value

      if (report && report.details && report.details.calls) {
        report.details.all = allReportsList.value
        report.details.calls = report.details.calls.map((item: any) => {
          item.call_duration = new Date(item.call_duration * 1000)
            .toISOString()
            .substr(11, 8)
          let color = getColorForScoredCall(item)
          item.rowColor = color
          item.rowColorHex = (VuetifyColorsPallete as any)[color]
          item.color = color.split(' ')[0]
          return item
        })
        report.details.adwords_calls = report.details.adwords_calls.map((item: any) => {
          item.call_duration = new Date(item.call_duration * 1000)
            .toISOString()
            .substr(11, 8)
          let color = getColorForScoredCall(item)
          item.rowColor = color
          item.rowColorHex = (VuetifyColorsPallete as any)[color]
          item.color = color.split(' ')[0]
          // item.cs_name = item.score ? item.score.scorer.first_name.charAt(0) + ',' + ' ' + item.score.scorer.last_name : 'No scorer'
          item.cs_name = item.score && item.score.scorer && item.score.scorer.first_name ? item.score.scorer.first_name.charAt(0) + ',' + ' ' + item.score.scorer.last_name : 'No scorer'
          item.call_status = item.score && item.score.call_status ? callStatus(item.score.call_status) : 'No status available'
          // call_url changes based on development stages
          item.call_url = item.score && item.call_url ? callAudio(item.call_url) : item.call_url
          return item
        })

        report.details.facebook_calls = report.details.facebook_calls.map((item: any) => {
          item.call_duration = new Date(item.call_duration * 1000)
            .toISOString()
            .substr(11, 8)
          let color = getColorForScoredCall(item)
          item.rowColor = color
          item.rowColorHex = (VuetifyColorsPallete as any)[color]
          item.color = color.split(' ')[0]
          item.call_status = item.score && item.score.call_status ? callStatus(item.score.call_status) : 'No status available'
          // call_url changes based on development stages
          item.call_url = item.score && item.call_url ? callAudio(item.call_url) : item.call_url
          return item
        })

        report.details.seo_calls = report.details.seo_calls ? report.details.seo_calls.map((item: any) => {
          item.call_duration = new Date(item.call_duration * 1000)
            .toISOString()
            .substr(11, 8)
          let color = getColorForScoredCall(item)
          item.rowColor = color
          item.rowColorHex = (VuetifyColorsPallete as any)[color]
          item.color = color.split(' ')[0]
          return item
        }) : ''

        report.details.emails = report.details.emails.map((item: any) => {
          const isWeekend = isDateWeekend(item.date)
          const color = isWeekend ? VuetifyColorsPallete['grey lighten-3'] : ''
          item.rowColorHex = color
          return item
        })

        report.details.facebook_leads = report.details.facebook_leads.map(
          (item: any) => {
            const isWeekend = isDateWeekend(item.date)
            const color = isWeekend
              ? VuetifyColorsPallete['grey lighten-3']
              : ''
            item.rowColorHex = color
            return item
          })

          report.details.seo_emails = report.details.seo_emails ? report.details.seo_emails.map(
          (item: any) => {
            const isWeekend = isDateWeekend(item.date)
            const color = isWeekend
              ? VuetifyColorsPallete['grey lighten-3']
              : ''
            item.rowColorHex = color
            return item
          }) : ''

        report.details.chats = report.details.chats.map((item: any) => {
          const isWeekend = isDateWeekend(item.chat_date)
          const color = isWeekend ? VuetifyColorsPallete['grey lighten-3'] : ''
          item.rowColorHex = color
          return item
        })

        report.details.adwords_chats = report.details.adwords_chats.map((item: any) => {
          const isWeekend = isDateWeekend(item.chat_date)
          const color = isWeekend ? VuetifyColorsPallete['grey lighten-3'] : ''
          item.rowColorHex = color
          return item
        })

        report.details.facebook_chats = report.details.facebook_chats.map((item: any) => {
          const isWeekend = isDateWeekend(item.chat_date)
          const color = isWeekend ? VuetifyColorsPallete['grey lighten-3'] : ''
          item.rowColorHex = color
          return item
        })

        report.details.seo_chats = report.details.seo_chats ? report.details.seo_chats.map((item: any) => {
          const isWeekend = isDateWeekend(item.chat_date)
          const color = isWeekend ? VuetifyColorsPallete['grey lighten-3'] : ''
          item.rowColorHex = color
          return item
        }) : ''
      }

      return report
    })

    onMounted(() => {
      loadFiltersFromURL()

      const query = router.currentRoute.query

      if (query.client && query.dates) {
        fetchLDRReport()
      }
      setTimeout(() => {
        sectionProgressAlert.value = false
      }, 10000)
    })

    watch(route, () => {
      loadFiltersFromURL()
    })

    return {
      transformReport,
      sectionProgressAlert,
      googleDocLink,
      isCopied,
      copy,
      reportLoadingDialog,
      uploadReportLoading,
      uploadReport,
      reportUploaded,
      fetchLDRReport,
      busy,
      report,
      loaded,
      LDRReport,
      LDRReportLoading,
      summary,
      tab,
      panel,
      allReportsList,
      currentEmail,
      emailDialog,
      callItemClass,
      push,
      filters,
      copyReportLink,
      onClientChange,
      computedReport,
      onLocationChange,
      showButton,
      unAuthorizedToPullReport,
      sessionExpired,
      isAllowed,
      previousDay,
    }
  },
  head: {
    title: 'Lead Details Report',
  },
})
</script>

<style lang="scss" src="~/components/LDR/LDRStyles.scss"></style>
