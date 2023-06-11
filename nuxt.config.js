import colors from 'vuetify/es5/util/colors'
import en from './lang/en-US'

let API_URL

if (process.env.NODE_ENV === 'development') {
  API_URL = process.env.BASE_URL_DEVELOPMENT
} else if (process.env.NODE_ENV === 'staging') {
  API_URL = process.env.BASE_URL_STAGING
} else if (process.env.NODE_ENV === 'production') {
  API_URL = process.env.BASE_URL_PRODUCTION
}

console.log(`Building for ${process.env.NODE_ENV} with base URL of ${API_URL}`)

const axiosConfig = {
  baseURL: API_URL,
  withCredentials: true,
}

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  env: {
    baseUrl: API_URL,
  },

  // server: {
  //   port: 5000, // default: 3000
  // },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Foundation',
    title: 'foundation-front-end',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Score calls' },
    ],
    link: [
      { rel: 'icon', sizes: 'any', href: '/favicon.png' },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/4.4.95/css/materialdesignicons.min.css',
      },
    ],
    script: [],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/notification-style-fix.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/usPhone', '~/plugins/truncateText'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://github.com/nuxt-community/dotenv-module
    `@nuxtjs/dotenv`,
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://composition-api.nuxtjs.org/getting-started/setup
    '@nuxtjs/composition-api',
    'vue-sweetalert2/nuxt',
  ],

  // https://composition-api.nuxtjs.org/getting-started/setup
  // Optional. Currently there's an issue with static site generation and
  // async functions which means that you'll need to add time between pages
  // being generated to allow for any async functions to resolve,
  // if you are pre-generating any of your pages:
  generate: {
    interval: 2000,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://i18n.nuxtjs.org/setup
    'nuxt-i18n',
    '@nuxtjs/auth-next',
    // "@nuxtjs/auth",
    'vue-sweetalert2/nuxt',
    // ['vue-social-auth/nuxt', { 
    //   property: '$auth', // Optional property if the $auth property is being used by another module 
    //   providers: {
    //     google: {
    //       clientId: '109019455855-hjv5klrhc7ugf0dd0j1e4u3dim6fcicf.apps.googleusercontent.com',
    //       redirectUri: 'http://localhost:3000/login' // Your client app URL
    //     }
    //   }
    // }],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: axiosConfig,

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: API_URL,
    },
  },

  privateRuntimeConfig: {
    axios: axiosConfig,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  i18n: {
    locales: [{ code: `en`, iso: 'en-US', name: 'English (US)' }],
    defaultLocale: `en`,
    vueI18n: {
      fallbackLocale: `en`,
      messages: {
        en,
      },
    },
  },

  router: {
    // middleware: ['isAuthenticated']
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
    }
  },

  auth: {
    watchLoggedIn: true,
    rewriteRedirects: true,
    fullPathRedirect: true,
    // plugins custom made for CA
    plugins: [],
    // stategum
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: API_URL,
        user: {
          property: 'data',
        },
        endpoints: {
          user: {
            url: '/user?noswal',
          },
        },
      },
      google: {
        clientId: '109019455855-hjv5klrhc7ugf0dd0j1e4u3dim6fcicf.apps.googleusercontent.com',
        codeChallengeMethod: '',
        responseType: 'code',
        redirectUri: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000/social-login' :
        process.env.NODE_ENV === 'staging' ? 'https://foundation-dev.wm4d.com/social-login' : 'https://foundation.wm4d.com/social-login' }`,
        endpoints: {
          token: API_URL + '/social-login', // some backend url to resolve your auth with google and give you the token back
          userInfo: '/user?noswal' // the endpoint to get the user info after you received the token 
        },
      },
    },
    redirect: false,
    // redirect: {
    //   logout: '/login',
    //   login: `/login`,
    //   home: false,
    // },
  },
}
