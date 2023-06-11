<template>
  <div>
    <UnauthorizedUser v-if="nonAccountManagerUserRole"/>
    <v-row
      :class="{
        'my-5': true,
        'dark-page': $vuetify.theme.dark,
      }"
      v-if="!nonAccountManagerUserRole"
    >
      <v-col cols="12" md="12" lg="12">
        <v-card color="default" rounded elevation="1">
          <v-card-title>{{ $t('message.filters') }}</v-card-title>
          <v-switch
            class="ml-4"
            v-model="reportCompare"
            inset
            @change="push"
            @click="compareReportChange"
            :label="'Compare Report'"
          ></v-switch>
          <v-card-text>
            <!-- <p>{{selectedMonthIsCurrentMonth}}</p> -->
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="4" sm="12" xs="12" v-if="!reportCompare">
                <v-select
                  :items="clientStatusOptions"
                  item-value="value"
                  @change="push"
                  v-model="filters['status']"
                  item-text="label"
                  label="Client Type"
                >
                </v-select>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12" v-if="reportCompare">
                <v-select
                  :items="clientStatusOptions"
                  item-value="value"
                  @change="push"
                  v-model="filters['status']"
                  item-text="label"
                  label="Client Type"
                >
                </v-select>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" sm="12" xs="12" v-if="!reportCompare">
                <v-autocomplete
                  :items="accountManagers"
                  item-value="id"
                  @change="push"
                  :loading="loadingAccountManagers"
                  v-model="filters['account_manager_id']"
                  item-text="fullname"
                  :clearable="filters.account_manager_id ? true : false"
                  label="Account Manager"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12" v-if="reportCompare">
                <v-autocomplete
                  :items="accountManagers"
                  item-value="id"
                  @change="push"
                  :loading="loadingAccountManagers"
                  v-model="filters['account_manager_id']"
                  item-text="fullname"
                  :clearable="filters.account_manager_id ? true : false"
                  label="Account Manager"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4" sm="12" xs="12" v-if="!reportCompare">
                <Datepicker
                  @change="push"
                  v-model="filters['dates']"
                  :dateHelpButtons="[
                    'lastWeek',
                    'thisWeek',
                    'thisMonth',
                    'lastMonth',
                    'thisYear',
                    'lastYear',
                  ]"
                ></Datepicker>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12" v-if="reportCompare">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filters['ref_month']"
                      label="Reference Month"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    type="month"
                    v-model="filters['ref_month']"
                    @input="menu2 = false"
                    @change="push"
                    scrollable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3" sm="12" xs="12" v-if="reportCompare">
                <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="filters['comp_month']"
                      label="Comparing Month"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    type="month"
                    v-model="filters['comp_month']"
                    @input="menu1 = false"
                    @change="push"
                    scrollable
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                xl="12"
                lg="12"
                md="12"
                sm="12"
                xs="12"
                class="py-0"
              >
                <div class="text-xs-left text-sm-left text-lg-left mt-n3">
                  <v-btn
                    :loading="loadingReport"
                    color="primary"
                    class="my-2"
                    :disabled="
                      (reportCompare ? ((!filters.ref_month) || (!filters.comp_month)) : filters.dates && filters.dates < 1) || loadingReport 
                    "
                    @click="fetchReport"
                  >
                    <v-icon left>mdi-check</v-icon>
                    Apply
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="12" lg="12">
        <v-expand-transition>
          <v-card v-if="!loadedReport && loadingReport === false">
            <v-card-text>
              {{ $t('message.supplyFilters') }}
            </v-card-text>
          </v-card>
        </v-expand-transition>
        <v-expand-transition>
          <v-card v-if="loadingReport">
            <v-card-text>
              <v-skeleton-loader
                type="table-heading, list-item-two-line, image, table-tfoot"
              ></v-skeleton-loader>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <v-expand-transition>
          <v-card v-if="!loadingReport && loadedReport">
            <v-toolbar flat>
              <v-toolbar-title> {{ reportTitle }} </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon title="Copy link to this report" @click="copyLink">
                <v-icon>mdi-link</v-icon>
              </v-btn>
              <v-btn
                v-show="loadedReport"
                icon
                @click="uploadReport"
                title="Upload to Google Drive"
                :color="googleDocLink ? 'info' : 'normal'"
              >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </v-toolbar>
            <v-toolbar elevation="0">
              <!-- <div v-if="!reportCompare">
                <p class="body-2 mb-2">Last updated at {{ lastUpdatedTime }}</p>
                <DatesAndDiff
                  class="body-2"
                  v-if="loadedReport && !reportCompare"
                  :start="report.date.date_start"
                  :end="report.date.date_end"
                />
              </div> -->
              <v-spacer></v-spacer>
              <v-btn 
              v-if="!seoReport && !ppcOnlyReport"
              class="mr-4" 
              color="primary"
              @click="searchHandler"
              @change="push"
              > 
              SEO ONLY 
              </v-btn>
              <v-btn 
              v-if="seoReport || ppcOnlyReport"
              class="mr-4" 
              color="primary"
              @click="searchAllReport"
              @change="push"
              > 
              ALL REPORT 
              </v-btn>
              <v-btn 
              v-if="!ppcOnlyReport && !reportCompare || seoReport && !reportCompare"
              class="mr-4" 
              color="primary"
              @click="searchPPCReport"
              @change="push"
              > 
              PPC ONLY 
              </v-btn>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search clients"
                style="width: 150px"
                single-line
                hide-details
                clearable
                @input="newInput"
                @click:clear="searchAllReport"
              >
              </v-text-field>
            </v-toolbar>

            <v-card-text>
              <v-data-table
                fixed-header
                :sort-by="['client.name']"
                :sort-desc="[true]"
                :footer-props="{
                  itemsPerPageOptions: [100, 200, 500, -1],
                  itemsPerPage: 100,
                }"
                :loading="loadingReport"
                :items="selectedComputedReport"
                :headers="selectedTableHeaders"
                :search="search"
                @current-items="currentItems"
                no-results="No matching clients found"
                class="elevation-0 cor-table"
                height="700px"
              >
              <template #item.location.name="{ item }">
                  <nuxt-link class="client-link" :to="`/client-records/${item.client_id}/locations/${item.location.id}`">
                    <span>
                      {{ item.location.name }}
                    </span>
                  </nuxt-link>
                </template>
                <template #item.client.adwords.total_spend_="{ item }">
                  <span>
                    {{ item.client.adwords.total_spend }}
                  </span>
                </template>
                <template #item.adword_cpl="{ item }">
                  <span>
                    ${{ item.adword_cpl }}
                  </span>
                </template>
                <template #item.client.facebook.total_spend_="{ item }">
                  <span>
                    {{ item.client.facebook.total_spend }}
                  </span>
                </template>
                <template #item.facebook_cpl="{ item }">
                  <span>
                    ${{ item.facebook_cpl }}
                  </span>
                </template>
                <template #item.total_cpl="{ item }">
                  <span>
                    ${{ item.total_cpl }}
                  </span>
                </template>
                <template #item.total_adwords_cost="{ item }">
                  <span>
                    ${{ item.total_adwords_cost }}
                  </span>
                </template>
                <template #item.total_facebook_cost="{ item }">
                  <span>
                    ${{ item.total_facebook_cost }}
                  </span>
                </template>
                <template #item.total_aggregate_cost="{ item }">
                  <span>
                    ${{ item.total_aggregate_cost }}
                  </span>
                </template>
                <template #item.predicted_spend="{ item }">
                  <span>
                    ${{ item.predicted_spend}}
                  </span>
                </template>
                <template #item.location.adwords_budget="{ item }">
                  <span>
                    ${{ item.location.adwords_budget }}
                  </span>
                </template>
                <template #item.location.facebook_budget="{ item }">
                  <span>
                    ${{ item.location.facebook_budget }}
                  </span>
                </template>
                <template #item.location.monthly_fee="{ item }">
                  <span>
                    ${{ item.location.monthly_fee }}
                  </span>
                </template>
                <template #item.total_budget="{ item }">
                  <span>
                    ${{ item.total_budget }}
                  </span>
                </template>
                <!-- <template #item.total_trends="{ item }">
                  <span>
                    {{ selectedMonthIsCurrentMonth ? item.total_trends : item.total_leads}}
                  </span>
                </template> -->
                <template #item.total_booked="{ item }">
                  <span :style="`color: ${item.colors.booked_color}`">
                    {{ item.total_booked }}
                  </span>
                </template>
                <template #item.total_not_booked="{ item }">
                  <span :style="`color: ${item.colors.not_booked_color}`">
                    {{ item.total_not_booked }}
                  </span>
                </template>
                <template #item.total_voice_mail_booking="{ item }">
                  <span :style="`color: ${item.colors.voice_mail_booking}`">
                    {{ item.total_voice_mail_booking }}
                  </span>
                </template>
                <template #item.total_missed="{ item }">
                  <span :style="`color: ${item.colors.missed_color}`">
                    {{ item.total_missed }}
                  </span>
                </template>
                <template #item.total_irrelevant="{ item }">
                  <span :style="`color: ${item.colors.irrelevant_color}`">
                    {{ item.total_irrelevant }}
                  </span>
                </template>
                <!-- Comparing COR Start -->
                <!-- Total leads -->
                <template #item.percentage_diff_of_total_leads="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_leads > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_leads < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_leads }}%
                  </span>
                </template>
                <!-- Total Trends -->
                <template #item.percentage_diff_of_total_trends="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_trends > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_trends < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_trends }}%
                  </span>
                </template>
                <!-- All Calls -->
                <template #item.percentage_diff_of_total_calls="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_calls > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_calls < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_calls }}%
                  </span>
                </template>
                <!-- All Forms -->
                <template #item.percentage_diff_of_total_forms="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_forms > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_forms < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_forms }}%
                  </span>
                </template>
                <!-- All Chats -->
                <template #item.percentage_diff_of_total_chats="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_chats > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_chats < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_chats }}%
                  </span>
                </template>
                <!-- Adwords Leads -->
                <template #item.percentage_diff_of_total_adwords_leads="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_adwords_leads > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_adwords_leads < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_adwords_leads }}%
                  </span>
                </template>
                <!-- Adwords CPL -->
                <template #item.ref_month_adword_cpl="{ item }">
                  <span>
                    ${{ item.ref_month_adword_cpl }}
                  </span>
                </template>
                <template #item.comp_month_adword_cpl="{ item }">
                  <span>
                    ${{ item.comp_month_adword_cpl }}
                  </span>
                </template>
                <template #item.diff_of_adword_cpl="{ item }">
                  <span>
                    {{ item.diff_of_adword_cpl }}
                  </span>
                </template>
                <template #item.percentage_diff_of_adword_cpl="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_adword_cpl > 0 ? '#00FF00' :
                    item.percentage_diff_of_adword_cpl < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_adword_cpl }}%
                  </span>
                </template>
                <!-- Facebook Leads -->
                <template #item.percentage_diff_of_total_facebook_leads="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_facebook_leads > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_facebook_leads < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_facebook_leads }}%
                  </span>
                </template>
                <!-- Facebook CPL -->
                <template #item.ref_month_facebook_cpl="{ item }">
                  <span>
                    ${{ item.ref_month_facebook_cpl }}
                  </span>
                </template>
                <template #item.comp_month_facebook_cpl="{ item }">
                  <span>
                    ${{ item.comp_month_facebook_cpl }}
                  </span>
                </template>
                <template #item.diff_of_facebook_cpl="{ item }">
                  <span>
                    {{ item.diff_of_facebook_cpl }}
                  </span>
                </template>
                <template #item.percentage_diff_of_facebook_cpl="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_facebook_cpl > 0 ? '#00FF00' :
                    item.percentage_diff_of_facebook_cpl < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_facebook_cpl }}%
                  </span>
                </template>
                <!-- Total CPL -->
                <template #item.ref_month_total_cpl="{ item }">
                  <span>
                    ${{ item.ref_month_total_cpl }}
                  </span>
                </template>
                <template #item.comp_month_total_cpl="{ item }">
                  <span>
                    ${{ item.comp_month_total_cpl }}
                  </span>
                </template>
                <template #item.diff_of_total_cpl="{ item }">
                  <span>
                    {{ item.diff_of_total_cpl }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_cpl="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_cpl > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_cpl < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_cpl }}%
                  </span>
                </template>
                <!-- Adwords Spend -->
                <template #item.ref_month_total_adwords_cost="{ item }">
                  <span>
                    ${{ item.ref_month_total_adwords_cost }}
                  </span>
                </template>
                <template #item.comp_month_total_adwords_cost="{ item }">
                  <span>
                    ${{ item.comp_month_total_adwords_cost }}
                  </span>
                </template>
                <template #item.diff_of_total_adwords_cost="{ item }">
                  <span>
                    {{ item.diff_of_total_adwords_cost }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_adwords_cost="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_adwords_cost > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_adwords_cost < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_adwords_cost }}%
                  </span>
                </template>
                <!-- Adwords Budget -->
                <template #item.ref_month_adwords_budget="{ item }">
                  <span>
                    ${{ item.ref_month_adwords_budget }}
                  </span>
                </template>
                <template #item.comp_month_adwords_budget="{ item }">
                  <span>
                    ${{ item.comp_month_adwords_budget }}
                  </span>
                </template>
                <template #item.diff_of_adwords_budget="{ item }">
                  <span>
                    {{ item.diff_of_adwords_budget }}
                  </span>
                </template>
                <!-- Adwords # of days live in selected time period -->
                <template #item.percentage_diff_of_adwords_days_live="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_adwords_days_live > 0 ? '#00FF00' :
                    item.percentage_diff_of_adwords_days_live < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_adwords_days_live }}%
                  </span>
                </template>
                <template #item.percentage_diff_of_adwords_budget="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_adwords_budget > 0 ? '#00FF00' :
                    item.percentage_diff_of_adwords_budget < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_adwords_budget }}%
                  </span>
                </template>
                <!-- Facebook Spend -->
                <template #item.ref_month_total_facebook_cost="{ item }">
                  <span>
                    ${{ item.ref_month_total_facebook_cost }}
                  </span>
                </template>
                <template #item.comp_month_total_facebook_cost="{ item }">
                  <span>
                    ${{ item.comp_month_total_facebook_cost }}
                  </span>
                </template>
                <template #item.diff_of_total_facebook_cost="{ item }">
                  <span>
                    {{ item.diff_of_total_facebook_cost }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_facebook_cost="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_facebook_cost > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_facebook_cost < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_facebook_cost }}%
                  </span>
                </template>
                <!-- Facebook Budget -->
                <template #item.ref_month_facebook_budget="{ item }">
                  <span>
                    ${{ item.ref_month_facebook_budget }}
                  </span>
                </template>
                <template #item.comp_month_facebook_budget="{ item }">
                  <span>
                    ${{ item.comp_month_facebook_budget }}
                  </span>
                </template>
                <template #item.diff_of_facebook_budget="{ item }">
                  <span>
                    {{ item.diff_of_facebook_budget }}
                  </span>
                </template>
                <template #item.percentage_diff_of_facebook_budget="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_facebook_budget > 0 ? '#00FF00' :
                    item.percentage_diff_of_facebook_budget < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_facebook_budget }}%
                  </span>
                </template>
                <!-- Facebook # of days live in selected time period -->
                <template #item.percentage_diff_of_facebook_days_live="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_facebook_days_live > 0 ? '#00FF00' :
                    item.percentage_diff_of_facebook_days_live < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_facebook_days_live }}%
                  </span>
                </template>
                <!-- Aggregate Spend -->
                <template #item.ref_month_total_aggregate_cost="{ item }">
                  <span>
                    ${{ item.ref_month_total_aggregate_cost }}
                  </span>
                </template>
                <template #item.comp_month_total_aggregate_cost="{ item }">
                  <span>
                    ${{ item.comp_month_total_aggregate_cost }}
                  </span>
                </template>
                <template #item.diff_of_total_aggregate_cost="{ item }">
                  <span>
                    {{ item.diff_of_total_aggregate_cost }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_aggregate_cost="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_aggregate_cost > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_aggregate_cost < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_aggregate_cost }}%
                  </span>
                </template>
                <!-- Total Budget -->
                <template #item.ref_month_total_budget="{ item }">
                  <span>
                    ${{ item.ref_month_total_budget }}
                  </span>
                </template>
                <template #item.comp_month_total_budget="{ item }">
                  <span>
                    ${{ item.comp_month_total_budget }}
                  </span>
                </template>
                <template #item.diff_of_total_budget="{ item }">
                  <span>
                    {{ item.diff_of_total_budget }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_budget="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_budget > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_budget < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_budget }}%
                  </span>
                </template>
                <!-- Budget Spent -->
                <template #item.ref_month_percentageOf_budget_spent="{ item }">
                  <span>
                    {{ item.ref_month_percentageOf_budget_spent }}%
                  </span>
                </template>
                <template #item.comp_month_percentageOf_budget_spent="{ item }">
                  <span>
                    {{ item.comp_month_percentageOf_budget_spent }}%
                  </span>
                </template>
                <template #item.diff_of_percentageOf_budget_spent="{ item }">
                  <span :style="`color: ${item.diff_of_percentageOf_budget_spent > 0 ? '#00FF00' : '#FF0000'}`">
                    {{ item.diff_of_percentageOf_budget_spent }}%
                  </span>
                </template>
                <!-- Total booked calls -->
                <template #item.ref_month_total_booked="{ item }">
                  <span :style="`color: ${item.colors.booked_color}`">
                    {{ item.ref_month_total_booked }}
                  </span>
                </template>
                <template #item.comp_month_total_booked="{ item }">
                  <span :style="`color: ${item.colors.booked_color}`">
                    {{ item.comp_month_total_booked }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_booked="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_booked > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_booked < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_booked }}%
                  </span>
                </template>
                <!-- Total not booked calls -->
                <template #item.ref_month_total_not_booked="{ item }">
                  <span :style="`color: ${item.colors.not_booked_color}`">
                    {{ item.ref_month_total_not_booked }}
                  </span>
                </template>
                <template #item.comp_month_total_not_booked="{ item }">
                  <span :style="`color: ${item.colors.not_booked_color}`">
                    {{ item.comp_month_total_not_booked }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_not_booked="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_not_booked > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_not_booked < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_not_booked }}%
                  </span>
                </template>
                <!-- Total voice mail booking -->
                <template #item.ref_month_total_voice_mail_booking="{ item }">
                  <span :style="`color: ${item.colors.voice_mail_booking}`">
                    {{ item.ref_month_total_voice_mail_booking }}
                  </span>
                </template>
                <template #item.comp_month_total_voice_mail_booking="{ item }">
                  <span :style="`color: ${item.colors.voice_mail_booking}`">
                    {{ item.comp_month_total_voice_mail_booking }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_voice_mail_booking="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_voice_mail_booking > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_voice_mail_booking < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_voice_mail_booking }}%
                  </span>
                </template>
                <!-- Total missed calls -->
                <template #item.ref_month_total_missed="{ item }">
                  <span :style="`color: ${item.colors.missed_color}`">
                    {{ item.ref_month_total_missed }}
                  </span>
                </template>
                <template #item.comp_month_total_missed="{ item }">
                  <span :style="`color: ${item.colors.missed_color}`">
                    {{ item.comp_month_total_missed }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_missed="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_missed > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_missed < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_missed }}%
                  </span>
                </template>
                <!-- Total irrelevant calls -->
                <template #item.ref_month_total_irrelevant="{ item }">
                  <span :style="`color: ${item.colors.irrelevant_color}`">
                    {{ item.ref_month_total_irrelevant }}
                  </span>
                </template>
                <template #item.comp_month_total_irrelevant="{ item }">
                  <span :style="`color: ${item.colors.irrelevant_color}`">
                    {{ item.comp_month_total_irrelevant }}
                  </span>
                </template>
                <template #item.percentage_diff_of_total_irrelevant="{ item }">
                  <span :style="`color: ${item.percentage_diff_of_total_irrelevant > 0 ? '#00FF00' :
                    item.percentage_diff_of_total_irrelevant < 0 ? '#FF0000' : ''}`">
                    {{ item.percentage_diff_of_total_irrelevant }}%
                  </span>
                </template>
                <!-- Comparing COR End -->
                <template #item.actions="{ item }">
                  <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn small color="primary" dark v-bind="attrs" v-on="on">
                      Links
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                    > <a 
                    style="text-decoration: none; color: black; font-weight: bold"
                    :href="`/reports/lead-details-report?client=${item.client_id}&dates=${String(reportCompare ? 
                      filters.ref_month_dates : filters.dates).replace(/,/g, `&dates=`)}&location_ids=${item.location_id}`" 
                    target="_blank"
                    >LDR</a>
                    </v-list-item>
                    <v-list-item
                    >
                    <a 
                    style="text-decoration: none; color: black; font-weight: bold"
                    :href="`/reports/kpi?dates=${String(dates).replace(/,/g, `&dates=`)}&client_id=${item.client_id}&location_ids=${item.location_id}&type=month`" 
                    target="_blank"
                    >KPI</a>
                    </v-list-item>
                  </v-list>
                </v-menu>
                </template>
              </v-data-table>
            </v-card-text>
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
            <v-card-title class="mb-4">
              {{ $t('alert.success.driveUpload') }}.
            </v-card-title>

            <v-card-text>
              <span class="google-doc-link">{{ googleDocLink }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a @click="copy" v-bind="attrs" v-on="on">
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
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  ref,
  useContext,
  watch,
  useRouter,
  onMounted,
  computed,
  useRoute,
} from '@nuxtjs/composition-api'
import { IBreadcrumbs } from '~/store'
import Datepicker from '~/components/forms/DatePicker.vue'
import { filters as clientStatusOptions } from '~/utils/ClientStatusEnums'
import moment from 'moment'
import swalMixin, { showToast } from '~/utils/swalMixin'
import { get } from 'lodash'
import useApi from '~/services/useApi'
import DatesAndDiff from '~/components/DatesAndDiff.vue'
import useUsers from '~/services/useUsers'
import { AM_ROLE } from '~/utils/UserEnums'
import { callColors } from '~/shared/callColors'
import useAxios from '~/plugins/useAxios'
import generateClientOverviewReport, {
  clientOverviewColumns,
} from '~/utils/reports-upload/cor'

import generateSeoCorOverviewReport, {
  seoCorColumns,
} from '~/utils/reports-upload/seoCor'

import generateComparingCorColumnsReport, {
  comparingCorColumns,
} from '~/utils/reports-upload/comparingCor'

import generateComparingSeoCorColumnsReport, {
  comparingSeoCorColumns,
} from '~/utils/reports-upload/comparingSeoCor'

import corTestingReport from '~/report/cor-testing-report'
import corCompTestingReport from '~/report/cor-comp-testing-report'
import UnauthorizedUser from '~/components/UnauthorizedUser.vue'




const pageTitle = `Client Overview Report`

let timeout: any = null

export default defineComponent({
  components: {
    Datepicker,
    DatesAndDiff,
    UnauthorizedUser,
  },
  setup(_props, { parent }) {
    const store = useStore()
    const { $auth } = useContext()
    const nonAccountManagerUserRole = computed(() =>
      !$auth.hasScope('create report') && $auth.hasScope('vpn access')
    )
    const { get, post } = useApi()
    const { list } = useUsers()
    const accountManagers = ref<Array<any>>([])
    const menu1 = ref(false)
    const menu2 = ref(false)

    const report = ref({
      date: {
        date_end: '',
        date_start: '',
      },
      summary: [
        {
          location: {
            name: ''
          }
        }
      ],
      cache: {
        cache: {
          created_at: '',
          expires_at: '',
        }
        
      },
    })

//New COR Start

  //Reference Month Picker
  const formattedRefMonth = computed(() => {
    return [refMonthPicker.value + '-01', refMonthPicker.value + '-' + daysOfRefMonth.value]
  })
  const daysOfRefMonth = computed(() => {
    return refMonthPicker.value.includes('01') || refMonthPicker.value.includes('03') || refMonthPicker.value.includes('05') || 
    refMonthPicker.value.includes('07') || refMonthPicker.value.includes('08') || refMonthPicker.value.includes('10') || 
    refMonthPicker.value.includes('12') ? 31 : 30
  })
  const refMonthPicker = ref()

  //Reference Month Picker
  const formattedCompMonth = computed(() => {
    return [compMonthPicker.value + '-01', compMonthPicker.value + '-' + daysOfCompMonth.value]
  })
  const daysOfCompMonth = computed(() => {
    return compMonthPicker.value.includes('01') || compMonthPicker.value.includes('03') || compMonthPicker.value.includes('05') || 
    compMonthPicker.value.includes('07') || compMonthPicker.value.includes('08') || compMonthPicker.value.includes('10') || 
    compMonthPicker.value.includes('12') ? 31 : 30
  })
  const compMonthPicker = ref()

  const reportCompare = ref(false)
  const corReport = corTestingReport
  const corCompReport = corCompTestingReport
  const selectedComputedReport = computed(() => {
    return reportCompare.value ? requiredFormattedReport.value : computedReport.value
  })
  const selectedTableHeaders = computed(() => {
    return reportCompare.value && seoReport.value ? tableHeaders.value = [...comparingSeoCorColumns()] : 
    reportCompare.value && !seoReport.value ? tableHeaders.value = [...comparingCorColumns()] : 
    !reportCompare.value && seoReport.value ? tableHeaders.value = [...seoCorColumns()] : 
    !reportCompare.value && !seoReport.value ? tableHeaders.value = [...clientOverviewColumns()] : tableHeaders.value
  })

  const compareReportChange = () => {
    googleDocLink.value = ''
    search.value = ''
    reportTitle.value = 'Client overview'
    seoReport.value = false
    ppcOnlyReport.value = false
    filters.value.seo_report = []
    reportUploaded.value = false
    loadedReport.value = false
    loadingReport.value = false
    filters.value.dates = []
    filters.value.ref_month_dates = []
    filters.value.comp_month_dates = []
    if (reportCompare.value === true) {
      filters.value.comparing_report = 1
    }
    if (reportCompare.value === false) {
      filters.value.comparing_report = []
    }
    push()
    // searchAllReport()
  }

  const comparedReport = ref({
      date: {
        date_end: '',
        date_start: '',
      },
      cache: {
        cache: {
          created_at: '',
          expires_at: '',
        }
        
      },
      summary: [
        {
          ref_month: {},
          comp_month: {},
        }
      ],
      
    })

    const computedAllTogetherReport = computed(() => {
      return (
        comparedReport.value &&
        comparedReport.value.summary &&
        comparedReport.value.summary.map((reportItem: any) => {
          return reportItem
        })
      )
    })

    const requiredFormattedReport = computed(() => {
      return (
        computedAllTogetherReport.value.map((eachItem: any) => {
          //Client Name
          eachItem.client = eachItem['ref_month'].location.name
          //Client ID
          eachItem.client_id = eachItem['ref_month'].client_id
          //Location ID
          eachItem.location_id = eachItem['ref_month'].location_id
          //Account Manager Name
          eachItem.account_manager = eachItem['ref_month'].location.account_manager

          //Total Leads
          eachItem.ref_month_total_leads = eachItem['ref_month'] && eachItem['ref_month'].total_leads ? 
          `${new Number(+eachItem['ref_month'].total_leads)}` : 0
          eachItem.comp_month_total_leads = eachItem['comp_month'] && eachItem['comp_month'].total_leads ? 
          `${new Number(+eachItem['comp_month'].total_leads)}` : 0
          eachItem.diff_of_total_leads = eachItem['ref_month'] && eachItem['ref_month'].total_leads && eachItem['comp_month'] && eachItem['comp_month'].total_leads ? 
          `${new Number(+eachItem['ref_month'].total_leads - +eachItem['comp_month'].total_leads)}` : 0
          eachItem.percentage_diff_of_total_leads = eachItem.diff_of_total_leads == 0 || eachItem.comp_month_total_leads == 0 ? 
          '0' : `${new Number(((+eachItem['ref_month'].total_leads - +eachItem['comp_month'].total_leads) / +eachItem['comp_month'].total_leads) * 100).toFixed(2)}`
          //Calls
          eachItem.ref_month_total_calls = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_calls)}` : 0
          eachItem.comp_month_total_calls = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_calls)}` : 0
          eachItem.diff_of_total_calls = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_calls - +eachItem['comp_month'].total_calls)}` : 0
          eachItem.percentage_diff_of_total_calls = eachItem.diff_of_total_calls == 0 || eachItem.comp_month_total_calls == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_calls - +eachItem['comp_month'].total_calls) / +eachItem['comp_month'].total_calls) * 100).toFixed(2)}`
          //Forms
          eachItem.ref_month_total_forms = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_forms)}` : 0
          eachItem.comp_month_total_forms = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_forms)}` : 0
          eachItem.diff_of_total_forms = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_forms - +eachItem['comp_month'].total_forms)}` : 0
          eachItem.percentage_diff_of_total_forms = eachItem.diff_of_total_forms == 0 || eachItem.comp_month_total_forms == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_forms - +eachItem['comp_month'].total_forms) / +eachItem['comp_month'].total_forms) * 100).toFixed(2)}`
          //Chats
          eachItem.ref_month_total_chats = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_chats)}` : 0
          eachItem.comp_month_total_chats = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_chats)}` : 0
          eachItem.diff_of_total_chats = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_chats - +eachItem['comp_month'].total_chats)}` : 0
          eachItem.percentage_diff_of_total_chats = eachItem.diff_of_total_chats == 0 || eachItem.comp_month_total_chats == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_chats - +eachItem['comp_month'].total_chats) / +eachItem['comp_month'].total_chats) * 100).toFixed(2)}`
          //Adwords Leads
          eachItem.ref_month_total_adwords_leads = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_adwords_leads)}` : 0
          eachItem.comp_month_total_adwords_leads = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_adwords_leads)}` : 0
          eachItem.diff_of_total_adwords_leads = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_adwords_leads - +eachItem['comp_month'].total_adwords_leads)}` : 0
          eachItem.percentage_diff_of_total_adwords_leads = eachItem.diff_of_total_adwords_leads == 0 || eachItem.comp_month_total_adwords_leads == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_adwords_leads - +eachItem['comp_month'].total_adwords_leads) / +eachItem['comp_month'].total_adwords_leads) * 100).toFixed(2)}`
          //Adwords CPL
          eachItem.ref_month_adword_cpl = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].adword_cpl).toFixed(0)}` : 0
          eachItem.comp_month_adword_cpl = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].adword_cpl).toFixed(0)}` : 0
          eachItem.diff_of_adword_cpl = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].adword_cpl - +eachItem['comp_month'].adword_cpl).toFixed(0)}` : 0
          eachItem.percentage_diff_of_adword_cpl = eachItem.diff_of_adword_cpl == 0 || eachItem.comp_month_adword_cpl == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].adword_cpl - +eachItem['comp_month'].adword_cpl) / +eachItem['comp_month'].adword_cpl) * 100).toFixed(2)}`
          //Facebook Leads
          eachItem.ref_month_total_facebook_leads = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_facebook_leads)}` : 0
          eachItem.comp_month_total_facebook_leads = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_facebook_leads)}` : 0
          eachItem.diff_of_total_facebook_leads = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_facebook_leads - +eachItem['comp_month'].total_facebook_leads)}` : 0
          eachItem.percentage_diff_of_total_facebook_leads = eachItem.diff_of_total_facebook_leads == 0 || eachItem.comp_month_total_facebook_leads == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_facebook_leads - +eachItem['comp_month'].total_facebook_leads) / +eachItem['comp_month'].total_facebook_leads) * 100).toFixed(2)}`
          //Facebook CPL
          eachItem.ref_month_facebook_cpl = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].facebook_cpl).toFixed(0)}` : 0
          eachItem.comp_month_facebook_cpl = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].facebook_cpl).toFixed(0)}` : 0
          eachItem.diff_of_facebook_cpl = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].facebook_cpl - +eachItem['comp_month'].facebook_cpl).toFixed(0)}` : 0
          eachItem.percentage_diff_of_facebook_cpl= eachItem.diff_of_facebook_cpl == 0 || eachItem.comp_month_facebook_cpl == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].facebook_cpl - +eachItem['comp_month'].facebook_cpl) / +eachItem['comp_month'].facebook_cpl) * 100).toFixed(2)}`
          // //CPL
          const ref_month_seo_cpl = eachItem['ref_month'] && eachItem['ref_month'].location 
          && eachItem['ref_month'].location.monthly_fee && eachItem['ref_month'].location.monthly_fee === 0 
          || eachItem['ref_month'] && eachItem['ref_month'].total_leads === 0 ? 0 : 
          eachItem['ref_month'] ? `${new Number(eachItem['ref_month'].location.monthly_fee / eachItem['ref_month'].total_leads).toFixed(0)}` : 0
          
          const comp_month_seo_cpl = eachItem['comp_month'] && eachItem['comp_month'].location 
          && eachItem['comp_month'].location.monthly_fee && eachItem['comp_month'].location.monthly_fee === 0 
          || eachItem['comp_month'] && eachItem['comp_month'].total_leads === 0 ? 0 : 
          eachItem['comp_month'] ? `${new Number(eachItem['comp_month'].location.monthly_fee / eachItem['comp_month'].total_leads).toFixed(0)}` : 0

          // const ref_month_seo_cpl = 0
          
          // const comp_month_seo_cpl = 0

          eachItem.ref_month_total_cpl = eachItem['ref_month'] && eachItem['ref_month'].location 
          && eachItem['ref_month'].location.name && eachItem['ref_month'].location.name.includes('SEO') ? 
          ref_month_seo_cpl :
          eachItem['ref_month'] ? `${new Number(+eachItem['ref_month']?.cpl).toFixed(0)}` : 0

          eachItem.comp_month_total_cpl = eachItem['comp_month'] && eachItem['comp_month'].location 
          && eachItem['comp_month'].location.name && eachItem['comp_month'].location.name.includes('SEO') ? 
          comp_month_seo_cpl :
          eachItem['comp_month'] ? `${new Number(+eachItem['comp_month']?.cpl).toFixed(0)}` : 0

          eachItem.diff_of_total_cpl = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem.ref_month_total_cpl - +eachItem.comp_month_total_cpl).toFixed(0)}` : 0
          eachItem.percentage_diff_of_total_cpl = eachItem.diff_of_total_cpl == 0 || eachItem.comp_month_total_cpl == 0 ?
          '0' : `${new Number(((+eachItem.ref_month_total_cpl - +eachItem.comp_month_total_cpl) / +eachItem.comp_month_total_cpl) * 100).toFixed(2)}`
          //Adwords Spend
          eachItem.ref_month_total_adwords_cost = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_adwords_cost).toFixed(0)}` : 0
          eachItem.comp_month_total_adwords_cost = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_adwords_cost).toFixed(0)}` : 0
          eachItem.diff_of_total_adwords_cost = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_adwords_cost - +eachItem['comp_month'].total_adwords_cost).toFixed(0)}` : 0
          eachItem.percentage_diff_of_total_adwords_cost = eachItem.diff_of_total_adwords_cost == 0 || eachItem.comp_month_total_adwords_cost == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_adwords_cost - +eachItem['comp_month'].total_adwords_cost) / +eachItem['comp_month'].total_adwords_cost) * 100).toFixed(2)}`
          //Adwords Budget
          eachItem.ref_month_adwords_budget = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].location.adwords_budget).toFixed(0)}` : 0
          eachItem.comp_month_adwords_budget = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].location.adwords_budget).toFixed(0)}` : 0
          eachItem.diff_of_adwords_budget = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].location.adwords_budget - +eachItem['comp_month'].location.adwords_budget).toFixed(0)}` : 0
          eachItem.percentage_diff_of_adwords_budget = eachItem.diff_of_adwords_budget == 0 || eachItem.comp_month_adwords_budget == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].location.adwords_budget - +eachItem['comp_month'].location.adwords_budget) / +eachItem['comp_month'].location.adwords_budget) * 100).toFixed(2)}`
          //Adwords # of days live in selected time period
          eachItem.ref_month_adwords_days_live = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].adwords_days_live)}` : 0
          eachItem.comp_month_adwords_days_live = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].adwords_days_live)}` : 0
          eachItem.diff_of_adwords_days_live = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].adwords_days_live - +eachItem['comp_month'].adwords_days_live)}` : 0
          eachItem.percentage_diff_of_adwords_days_live = eachItem.diff_of_adwords_days_live == 0 || eachItem.comp_month_adwords_days_live == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].adwords_days_live - +eachItem['comp_month'].adwords_days_live) / +eachItem['comp_month'].adwords_days_live) * 100).toFixed(2)}`
          //Facebook Spend
          eachItem.ref_month_total_facebook_cost = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_facebook_cost).toFixed(0)}` : 0
          eachItem.comp_month_total_facebook_cost = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_facebook_cost).toFixed(0)}` : 0
          eachItem.diff_of_total_facebook_cost = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem.ref_month_total_facebook_cost - +eachItem.comp_month_total_facebook_cost).toFixed(0)}` : 0
          eachItem.percentage_diff_of_total_facebook_cost = eachItem.diff_of_total_facebook_cost == 0 || eachItem.comp_month_total_facebook_cost == 0 ?
          '0' : `${new Number(((+eachItem.ref_month_total_facebook_cost - +eachItem.comp_month_total_facebook_cost) / +eachItem.comp_month_total_facebook_cost) * 100).toFixed(2)}`
          //Facebook Budget
          eachItem.ref_month_facebook_budget = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].location.facebook_budget).toFixed(0)}` : 0
          eachItem.comp_month_facebook_budget = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].location.facebook_budget).toFixed(0)}` : 0
          eachItem.diff_of_facebook_budget = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].location.facebook_budget - +eachItem['comp_month'].location.facebook_budget).toFixed(0)}` : 0
          eachItem.percentage_diff_of_facebook_budget = eachItem.diff_of_facebook_budget == 0 || eachItem.diff_of_facebook_budget == null || eachItem.comp_month_facebook_budget == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].location.facebook_budget - +eachItem['comp_month'].location.facebook_budget) / +eachItem['comp_month'].location.facebook_budget) * 100).toFixed(2)}`
          //Facebook # of days live in selected time period
          eachItem.ref_month_facebook_days_live = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].fb_days_live)}` : 0
          eachItem.comp_month_facebook_days_live = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].fb_days_live)}` : 0
          eachItem.diff_of_facebook_days_live = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].fb_days_live - +eachItem['comp_month'].fb_days_live)}` : 0
          eachItem.percentage_diff_of_facebook_days_live = eachItem.diff_of_facebook_days_live == 0 || eachItem.comp_month_facebook_days_live == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].fb_days_live - +eachItem['comp_month'].fb_days_live) / +eachItem['comp_month'].fb_days_live) * 100).toFixed(2)}`
          //Aggregate Spend
          eachItem.ref_month_total_aggregate_cost = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_aggregate_cost).toFixed(0)}` : 0
          eachItem.comp_month_total_aggregate_cost = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_aggregate_cost).toFixed(0)}` : 0
          eachItem.diff_of_total_aggregate_cost = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_aggregate_cost - +eachItem['comp_month'].total_aggregate_cost).toFixed(0)}` : 0
          eachItem.percentage_diff_of_total_aggregate_cost = eachItem.diff_of_total_aggregate_cost == 0 || eachItem.comp_month_total_aggregate_cost == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_aggregate_cost - +eachItem['comp_month'].total_aggregate_cost) / +eachItem['comp_month'].total_aggregate_cost) * 100).toFixed(2)}`
          //Total Budget
          eachItem.ref_month_total_budget = eachItem['ref_month'] ? 
          `${new Number(+eachItem.ref_month_adwords_budget + +eachItem.ref_month_facebook_budget).toFixed(0)}` : 0
          eachItem.comp_month_total_budget = eachItem['comp_month'] ? 
          `${new Number(+eachItem.comp_month_adwords_budget + +eachItem.comp_month_facebook_budget).toFixed(0)}` : 0
          eachItem.diff_of_total_budget = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem.ref_month_total_budget - +eachItem.comp_month_total_budget).toFixed(0)}` : 0
          eachItem.percentage_diff_of_total_budget = eachItem.diff_of_total_budget == 0 || eachItem.comp_month_total_budget == 0 ?
          '0' : `${new Number(((+eachItem.ref_month_total_budget - +eachItem.comp_month_total_budget) / +eachItem.comp_month_total_budget) * 100).toFixed(2)}`
          //% of Budget Spent
          eachItem.ref_month_percentageOf_budget_spent = +eachItem['ref_month']?.total_aggregate_cost === 0 || +eachItem.ref_month_total_budget === 0 ? 
          '0' : `${new Number( (+eachItem['ref_month'].total_aggregate_cost / (+eachItem.ref_month_total_budget * 1)) * 100).toFixed(2)}`
          eachItem.comp_month_percentageOf_budget_spent = +eachItem['comp_month']?.total_aggregate_cost === 0 || +eachItem.comp_month_total_budget === 0 ? 
          '0' : `${new Number( (+eachItem['comp_month'].total_aggregate_cost / (+eachItem.comp_month_total_budget * 1)) * 100).toFixed(2)}`
          eachItem.diff_of_percentageOf_budget_spent = `${new Number(+eachItem.ref_month_percentageOf_budget_spent - +eachItem.comp_month_percentageOf_budget_spent).toFixed(2)}`
          //Monthly Fee
          eachItem.ref_month_monthly_fee = eachItem['ref_month']?.location.monthly_fee ? 
          `${new Number(+eachItem['ref_month'].location.monthly_fee).toFixed(0)}` : 0
          eachItem.comp_month_monthly_fee = eachItem['comp_month']?.location.monthly_fee ? 
          `${new Number(+eachItem['comp_month'].location.monthly_fee).toFixed(0)}` : 0
          eachItem.diff_of_monthly_fee = `${new Number(+eachItem.ref_month_monthly_fee - +eachItem.comp_month_monthly_fee).toFixed(0)}`
          eachItem.percentage_diff_of_monthly_fee = eachItem.diff_of_monthly_fee  == 0 || eachItem.comp_month_monthly_fee == 0 ?
          '0' : `${new Number((+eachItem.diff_of_monthly_fee / +eachItem.comp_month_monthly_fee) * 100).toFixed(2)}`
          //Total booked calls
          eachItem.ref_month_total_booked = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_booked)}` : 0
          eachItem.comp_month_total_booked = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_booked)}` : 0
          eachItem.diff_of_total_booked = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_booked - +eachItem['comp_month'].total_booked)}` : 0
          eachItem.percentage_diff_of_total_booked = eachItem.diff_of_total_booked == 0 || eachItem.comp_month_total_booked == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_booked - +eachItem['comp_month'].total_booked) / +eachItem['comp_month'].total_booked) * 100).toFixed(2)}`
          //Total not booked calls
          eachItem.ref_month_total_not_booked = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_not_booked)}` : 0
          eachItem.comp_month_total_not_booked = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_not_booked)}` : 0
          eachItem.diff_of_total_not_booked = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_not_booked - +eachItem['comp_month'].total_not_booked)}` : 0
          eachItem.percentage_diff_of_total_not_booked = eachItem.diff_of_total_not_booked == 0 || eachItem.comp_month_total_not_booked == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_not_booked - +eachItem['comp_month'].total_not_booked) / +eachItem['comp_month'].total_not_booked) * 100).toFixed(2)}`
          //Total voice mail booking
          eachItem.ref_month_total_voice_mail_booking = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_voice_mail_booking)}` : 0
          eachItem.comp_month_total_voice_mail_booking = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_voice_mail_booking)}` : 0
          eachItem.diff_of_total_voice_mail_booking = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_voice_mail_booking - +eachItem['comp_month'].total_voice_mail_booking)}` : 0
          eachItem.percentage_diff_of_total_voice_mail_booking = eachItem.diff_of_total_voice_mail_booking == 0 || eachItem.comp_month_total_voice_mail_booking == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_voice_mail_booking - +eachItem['comp_month'].total_voice_mail_booking) / +eachItem['comp_month'].total_voice_mail_booking) * 100).toFixed(2)}`
          //Total missed calls
          eachItem.ref_month_total_missed = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_missed)}` : 0
          eachItem.comp_month_total_missed = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_missed)}` : 0
          eachItem.diff_of_total_missed = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_missed - +eachItem['comp_month'].total_missed)}` : 0
          eachItem.percentage_diff_of_total_missed = eachItem.diff_of_total_missed == 0 || eachItem.comp_month_total_missed == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_missed - +eachItem['comp_month'].total_missed) / +eachItem['comp_month'].total_missed) * 100).toFixed(2)}`
          //Total irrelevant calls
          eachItem.ref_month_total_irrelevant = eachItem['ref_month'] ? 
          `${new Number(+eachItem['ref_month'].total_irrelevant)}` : 0
          eachItem.comp_month_total_irrelevant = eachItem['comp_month'] ? 
          `${new Number(+eachItem['comp_month'].total_irrelevant)}` : 0
          eachItem.diff_of_total_irrelevant = eachItem['ref_month'] && eachItem['comp_month'] ? 
          `${new Number(+eachItem['ref_month'].total_irrelevant - +eachItem['comp_month'].total_irrelevant)}` : 0
          eachItem.percentage_diff_of_total_irrelevant = eachItem.diff_of_total_irrelevant == 0 || eachItem.comp_month_total_irrelevant == 0 ?
          '0' : `${new Number(((+eachItem['ref_month'].total_irrelevant - +eachItem['comp_month'].total_irrelevant) / +eachItem['comp_month'].total_irrelevant) * 100).toFixed(2)}`

            const item = {
            ...eachItem,
            colors: callColors,
          }
          return item
        })
      )
    })
    
    const filterParams = computed(() => {
      return reportCompare.value ? 
      {
        // ref_date_start: filters.value.ref_month_dates[0],
        // ref_date_end: filters.value.ref_month_dates[1],
        // comp_date_start: filters.value.comp_month_dates[0],
        // comp_date_end: filters.value.comp_month_dates[1],
        ref_month: filters.value.ref_month,
        comp_month: filters.value.comp_month,
        status: filters.value.status,
        account_manager_id: filters.value.account_manager_id,
      } :
      {
        date_start: filters.value.dates[0],
        date_end: filters.value.dates[1],
        status: filters.value.status,
        account_manager_id: filters.value.account_manager_id,
      }
    })
    //Comparing COR Reference dates
    const refDateOne = computed(() => {
      return filters.value.ref_month_dates[0]
    }) 
    const refDateOneDisp = computed(() => {
      return moment(filters.value.ref_month_dates[0]).format(
        'ddd, MMM DD, YYYY'
      )
    }) 
    const refDateTwo = computed(() => {
      return filters.value.ref_month_dates[1] ?? filters.value.ref_month_dates[0]
    }) 
    const refDateTwoDisp = computed(() => {
      return moment(filters.value.ref_month_dates[1] ?? filters.value.ref_month_dates[0]).format(
        'ddd, MMM DD, YYYY'
      )
      
    }) 
    const refValidDates = computed(() => moment(refDateOne.value).isBefore(refDateTwo.value))
    const refDateDifference = computed(
      () => {
        if (refDateOne.value === refDateTwo.value) {
          return 1
        }
        return refValidDates.value && moment(refDateTwo.value).diff(refDateOne.value, 'days') + 1
      }
    )
    const refTotalMonth = computed(() => {
      return (+refDateDifference.value / 30).toFixed(0)
    })
    //Comparing COR Comparing dates
    const compDateOne = computed(() => {
      return filters.value.comp_month_dates[0]
    }) 
    const compDateOneDisp = computed(() => {
      return moment(filters.value.comp_month_dates[0]).format(
        'ddd, MMM DD, YYYY'
      )
    }) 
    const compDateTwo = computed(() => {
      return filters.value.comp_month_dates[1] ?? filters.value.comp_month_dates[0]
    })
    const compDateTwoDisp = computed(() => {
      return moment(filters.value.comp_month_dates[1] ?? filters.value.comp_month_dates[0]).format(
        'ddd, MMM DD, YYYY'
      )
      
    }) 
    const compValidDates = computed(() => moment(compDateOne.value).isBefore(compDateTwo.value))
    const compDateDifference = computed(
      () => {
        if (compDateOne.value === compDateTwo.value) {
          return 1
        }
        return compValidDates.value && moment(compDateTwo.value).diff(compDateOne.value, 'days') + 1
      }
    )
    const compTotalMonth = computed(() => {
      return (+compDateDifference.value / 30).toFixed(0)
    })
//New COR End

    const route = useRoute()
    const search = ref('')
    const dates = ref([
        moment().subtract('2', 'year').startOf('year').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ])
    //COR dates
    const dateOne = computed(() => {
      return filters.value.dates[0]
    }) 
    const dateTwo = computed(() => {
      return filters.value.dates[1] ?? filters.value.dates[0]
    }) 
    const validDates = computed(() => moment(dateOne.value).isBefore(dateTwo.value))
    const dateDifference = computed(
      () => {
        if (dateOne.value === dateTwo.value) {
          return 1
        }
        return validDates.value && moment(dateTwo.value).diff(dateOne.value, 'days') + 1
      }
    )
    const totalMonth = computed(() => {
      return Math.ceil(+dateDifference.value / 30)
    })

    const currentMonth = computed(() => {
      return new Date().getMonth()
    })
    const selectedMonthIsCurrentMonth = computed(() => {
      return new Date(filters.value.dates[0]).getMonth() === new Date().getMonth() ? true : false
    })
    const totalDaysOfCurrentMonth = computed(() => {
      return currentMonth.value === 0 ? 31
      : currentMonth.value === 1 ? 28
      : currentMonth.value === 2 ? 31
      : currentMonth.value === 3 ? 30
      : currentMonth.value === 4 ? 31
      : currentMonth.value === 5 ? 30
      : currentMonth.value === 6 ? 31
      : currentMonth.value === 7 ? 31
      : currentMonth.value === 8 ? 30
      : currentMonth.value === 9 ? 31
      : currentMonth.value === 10 ? 30
      : 31
    })

    const seoReport = ref(false)
    const reportTitle = ref('Client overview')

    const searchHandler = () => {
      search.value = 'seo'
      seoReport.value = true
      googleDocLink.value = ''
      reportUploaded.value = false
      reportTitle.value = 'SEO client overview'
      filters.value.seo_report = [1]
      push()
    }
    const searchAllReport = () => {
      search.value = ''
      fetchReport()
      reportTitle.value = 'Client overview'
      seoReport.value = false
      ppcOnlyReport.value = false
      // googleDocLink.value = ''
      // reportUploaded.value = false
      filters.value.seo_report = []
      push()
    }

    const newInput = (value: any) => {
      if (value === 'seo') {
        searchHandler()
      }
      // else searchAllReport()
    }
    
    const ppcOnlyReport = ref(false)
    
    const onlYPpcReport = computed(() => {
       let computedSummary = report.value.summary
    
        return computedSummary.filter((item) => {
          return !item.location.name.includes('SEO')
        })
      })

      const searchPPCReport = () => {
      ppcOnlyReport.value = true
      report.value.summary = onlYPpcReport.value
      search.value = ''
      reportTitle.value = 'PPC client overview'
      seoReport.value = false
      googleDocLink.value = ''
      reportUploaded.value = false
      filters.value.seo_report = []
      push()
      // console.log('Filtered PPC', onlYPpcReport.value)
    }
    

    const CurrentComputedReport = ref()

    const currentItems = (value: any) => {
      CurrentComputedReport.value = value
    }
    const computedReport = computed(() => {
      return (
        report.value &&
        report.value.summary &&
        report.value.summary.map((reportItem: any) => {
          reportItem.total_adwords_cost = reportItem && reportItem.total_adwords_cost ? `${new Number(+reportItem.total_adwords_cost).toFixed(0)}` : 0
          reportItem.adword_cpl = reportItem && reportItem.adword_cpl ? `${new Number(+reportItem.adword_cpl).toFixed(0)}` : 0
          reportItem.adwords_days_live = reportItem && reportItem.adwords_days_live ? `${new Number(+reportItem.adwords_days_live)}` : 0
          reportItem.fb_days_live = reportItem && reportItem.fb_days_live ? `${new Number(+reportItem.fb_days_live)}` : 0
          reportItem.total_facebook_cost = reportItem && reportItem.total_facebook_cost ? `${new Number(+reportItem.total_facebook_cost).toFixed(0)}` : 0
          reportItem.facebook_cpl = reportItem && reportItem.facebook_cpl ? `${new Number(+reportItem.facebook_cpl).toFixed(0)}` : 0
          reportItem.total_aggregate_cost = reportItem && reportItem.total_aggregate_cost ? `${new Number(+reportItem.total_aggregate_cost).toFixed(0)}` : 0
          reportItem.location.adwords_budget = reportItem && reportItem?.location?.adwords_budget ? `${new Number(+reportItem.location.adwords_budget).toFixed(0)}` : 0
          reportItem.location.facebook_budget = reportItem && reportItem.location.facebook_budget ? `${new Number(+reportItem.location.facebook_budget).toFixed(0)}` : 0
          reportItem.total_budget = `${new Number( +reportItem.location.adwords_budget + +reportItem.location.facebook_budget).toFixed(0)}`
          reportItem.percentageOf_budget_spent = reportItem && +reportItem.total_aggregate_cost === 0 || reportItem && +reportItem.total_budget === 0 ? '0%' : 
          `${new Number( (+reportItem.total_aggregate_cost / (+reportItem.total_budget * +totalMonth.value)) * 100).toFixed(0)}%`
          const seo_cpl = reportItem && reportItem.location.monthly_fee === 0 
          || reportItem && reportItem.total_leads === 0 ? 0 
          : `${new Number(reportItem.location.monthly_fee / reportItem.total_leads).toFixed(0)}`
          reportItem.total_cpl = reportItem && reportItem.location.name.includes('SEO') 
          || reportItem && reportItem.location.name.includes('seo') ? seo_cpl : `${new Number(reportItem.cpl).toFixed(0)}`
          reportItem.location.monthly_fee = reportItem && reportItem.location.monthly_fee ? 
          `${new Number(reportItem.location.monthly_fee).toFixed(0)}` : '0'
          reportItem.total_voice_mail_booking = reportItem && reportItem.total_voice_mail_booking ? reportItem.total_voice_mail_booking : 0
          // reportItem.total_trends = reportItem && +dateDifference.value > 1 ? 
          // `${new Number(+(+reportItem.total_leads / (+dateDifference.value)) 
          // * (+totalDaysOfCurrentMonth.value)).toFixed(0)}` : 'N/A'
          // reportItem.predicted_spend = reportItem && +dateDifference.value > 1 ? 
          // `${new Number((+reportItem.total_aggregate_cost / (+dateDifference.value)) 
          // * (+totalDaysOfCurrentMonth.value)).toFixed(0)}` : 'N/A'
          reportItem.total_trends = reportItem.total_trends ? `${new Number(+reportItem.total_trends).toFixed(0)}` : 0
          reportItem.predicted_spend = reportItem.predicted_spend ? `${new Number(+reportItem.predicted_spend).toFixed(0)}` : 0


          const item = {
            ...reportItem,
            colors: callColors,
          }

          return item
        })
      )
    })

    const getAccountManagers = () => {
      loadingAccountManagers.value = true
      list({
        sort_by: 'first_name:asc',
        role: AM_ROLE,
        limit: 200,
      })
        .then((res) => {
          accountManagers.value = [
            {
              fullname: 'All',
              id: null,
            },
            ...res.data.data.result,
          ]
        })
        .finally(() => {
          loadingAccountManagers.value = false
        })
    }

    const lastUpdatedTime = computed(() => {
      return moment(report.value?.cache?.cache?.created_at).format(
        'ddd, MMM DD, YYYY @ hh:mm:ss A z'
      )
    })

    const loadingAccountManagers = ref(false)
    const filters: any = ref({
      seo_report: [],
      comparing_report: [],
      dates: [],
      ref_month_dates: [],
      comp_month_dates: [],
      status: 'active',
      account_manager_id: null,
      ref_month: '',
      comp_month: '',
      
    })

    const router = useRouter()
    const loadingReport = ref(false)
    const axios = useAxios()
    const loadedReport = ref(false)


    const fetchReport = () => {
      if (loadingReport.value === false) {
        googleDocLink.value = ''
        reportUploaded.value = false
        loadingReport.value = true
        get('/clients/leads', filterParams.value)
          .then((resp: any) => {
            const accountManagerFilter = filters.value.account_manager_id
            if (
              typeof accountManagerFilter === 'string' ||
              typeof accountManagerFilter === 'number'
            ) {
              tableHeaders.value.splice(
                tableHeaders.value.findIndex((c: any) =>
                  c.value.includes('account_manager_id')
                ),
                1
              )
            } else {
              tableHeaders.value = clientOverviewColumns()
            }
            if (reportCompare.value) {
              comparedReport.value = resp.data?.data
            // comparedReport.value = corCompReport
            }
            else {
              report.value = resp.data?.data
              // report.value = corReport
            }
            loadedReport.value = true
          })
          .finally(() => {
            loadingReport.value = false
          })
      }
    }

    const $swal = swalMixin((parent as any).$swal as any)

    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: 'Dashboard',
        to: `/`,
      },
      {
        text: `Reports`,
        to: '/reports/',
      },
      {
        text: 'Client Overview',
        to: `/reports/client-overview`,
      },
    ]
    const push = () => {
      router.push({
        path: '/reports/client-overview',
        query: filters.value as any,
      })
    }

    store.dispatch('setPageHeading', {
      pageTitle,
      breadcrumbs,
    })

    const tableHeaders = ref<any>([...clientOverviewColumns()])

    const loadFiltersFromURL = () => {
      const query = router.currentRoute.query
      filters.value = {
        ...filters.value,
        ...query,
      }
      if (filters.value.account_manager_id) {
        filters.value.account_manager_id = +filters.value.account_manager_id
      }
    }

    onMounted(() => {
      loadFiltersFromURL()
      getAccountManagers()

      const query = router.currentRoute.query

      // if (query.ref_month_dates && query.comp_month_dates) {
      //   reportCompare.value = true
      // }
      // if (query.ref_month && query.comp_month) {
      //   reportCompare.value = true
      // }
      if (query.comparing_report) {
        reportCompare.value = true
      }

      if (query.seo_report) {
        seoReport.value = true
        search.value = 'seo'
      }

      // if (query.status && query.dates || query.ref_month_dates && query.comp_month_dates) {
      //   fetchReport()
      // }
      if (query.status && query.dates || query.ref_month && query.comp_month) {
        fetchReport()
      }
    })

    watch(route, () => {
      loadFiltersFromURL()
    })

    const copyLink = () => {
      window.navigator.clipboard.writeText(window.location.href)
      showToast($swal, {
        title: 'Link copied to clipboard',
      })
    }

    const uploadReportLoading = ref(false)
    const googleDocLink = ref('')
    const reportLoadingDialog = ref(false)
    const reportUploaded = ref(false)
    const uploadReport = () => {
      if (reportUploaded.value === true) {
        reportLoadingDialog.value = true
        return
      }

      uploadReportLoading.value = true
      reportLoadingDialog.value = true
      var fn
      if (seoReport.value === false && reportCompare.value === false) {
        fn = generateClientOverviewReport
      } 
      else if (seoReport.value === false && reportCompare.value === true) {
        fn = generateComparingCorColumnsReport
      }
      else if (seoReport.value === true && reportCompare.value === true) {
        fn = generateComparingSeoCorColumnsReport
      }
      else {
        fn = generateSeoCorOverviewReport
      }
      axios   
        .post(
          '/reports/upload',
          fn(CurrentComputedReport, {
            user: (store as any).state.auth.user,
            filters: filters,
          }),
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
    }
    const copy = () => {
      window.navigator.clipboard.writeText(googleDocLink.value)
      showToast($swal, {
        title: 'Copied to clipboard',
      })
    }

    return {
      loadingAccountManagers,
      loadingReport,
      fetchReport,
      clientStatusOptions,
      filters,
      push,
      report,
      tableHeaders,
      computedReport,
      search,
      loadedReport,
      lastUpdatedTime,
      copyLink,
      uploadReportLoading,
      googleDocLink,
      reportLoadingDialog,
      reportUploaded,
      uploadReport,
      moment,
      copy,
      accountManagers,
      currentItems,
      CurrentComputedReport,
      searchHandler,
      searchAllReport,
      dates,
      seoReport,
      reportTitle,
      newInput,
      dateOne,
      dateTwo,
      validDates,
      dateDifference,
      totalMonth,
      //New COR Start
      corReport,
      comparedReport,
      corCompReport,
      computedAllTogetherReport,
      requiredFormattedReport,
      reportCompare,
      selectedComputedReport,
      selectedTableHeaders,
      compareReportChange,
      filterParams,
      refDateOne,
      refDateOneDisp,
      refDateTwo,
      refDateTwoDisp,
      refValidDates,
      refDateDifference,
      compDateOne,
      compDateOneDisp,
      compDateTwo,
      compDateTwoDisp,
      compValidDates,
      compDateDifference,
      refTotalMonth,
      compTotalMonth,
      refMonthPicker,
      formattedRefMonth,
      daysOfRefMonth,
      compMonthPicker,
      formattedCompMonth,
      daysOfCompMonth,
      nonAccountManagerUserRole,
      searchPPCReport,
      ppcOnlyReport,
      onlYPpcReport,
      totalDaysOfCurrentMonth,
      currentMonth,
      selectedMonthIsCurrentMonth,
      menu1,
      menu2,
      //New COR ENd
    }
  },
  head: {
    title: pageTitle,
  },
})
</script>
<style lang="scss">
// @todo Wait for Vuetify table fixed column feature. Remove this code when that's done. so we can use configuration.
.cor-table {
  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 1;
    background: white;
  }
  table > thead > tr > th:nth-child(1) {
    z-index: 6;
  }

  tbody tr:nth-of-type(odd) {
   background-color: rgba(9, 245, 127, 0.1);
 }

  @media (min-width: 768px) {
    table > tbody > tr > td:nth-child(2),
    table > thead > tr > th:nth-child(2) {
      position: sticky !important;
      position: -webkit-sticky !important;
      left: 200px;
      z-index: 1;
      background: white;
    }
    table > thead > tr > th:nth-child(2) {
      position: sticky !important;
      position: -webkit-sticky !important;
      z-index: 6;
    }
    table > tbody > tr > td:nth-child(3),
    table > thead > tr > th:nth-child(3) {
      position: sticky !important;
      position: -webkit-sticky !important;
      left: 300px;
      z-index: 1;
      background: white;
    }
    table > thead > tr > th:nth-child(3) {
      position: sticky !important;
      position: -webkit-sticky !important;
      z-index: 6;
    }
  }
}
.dark-page {
 .cor-table {
  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1)
   {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 4;
    background: rgb(29, 28, 28);
  }
  table > thead > tr > th:nth-child(1) {
    z-index: 5;
  }
  table > tbody > tr > td:nth-child(2),
  table > thead > tr > th:nth-child(2)
   {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 340 px;
    z-index: 4;
    background: rgb(29, 28, 28);
  }
  table > thead > tr > th:nth-child(2) {
    z-index: 5;
  }
  table > tbody > tr > td:nth-child(3),
  table > thead > tr > th:nth-child(3)
   {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 490 px;
    z-index: 4;
    background: rgb(29, 28, 28);
  }
  table > thead > tr > th:nth-child(3) {
    z-index: 5;
  }
 } 
}
</style>
