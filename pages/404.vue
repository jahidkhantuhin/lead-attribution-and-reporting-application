<template>
  <div class="NotFound">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card height="400" color="transparent" flat>
            <v-card-title class="display-3 mt-5 font-weight-bold">Page not found.</v-card-title>
            <v-card-text class="paragraph-text mt-2">
              The page you are trying to get to never existed in this reality,
              or has migrated to a parallel universe.
            </v-card-text>
            <v-card-text class="paragraph-text mt-2">
                Try going back to <nuxt-link to="/">home page </nuxt-link> and repeating your action. Or, contact helpdesk for support.
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style>
  .paragraph-text {
    font-size: 18px;
  }
</style>