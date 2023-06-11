<template>
  <v-row justify="center" align-content="center">
    <v-col md="4">
      <v-expand-transition>
        <v-card
          v-if="showUpdateForm === false && showUpdatePictureForm === false"
        >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <v-icon
                  v-if="!$store.getters['users/userProfilePicture']"
                  color="primary"
                  size="128"
                >
                  mdi-account-circle
                </v-icon>
                <user-profile-picture
                  v-else
                  :height="80"
                  :width="80"
                  radius="50%"
                  :src="$store.getters['users/userProfilePicture']"
                />
              </v-col>
              <v-col md="8">
                <span class="overline">{{ userData.role }}</span>
                <p class="display-1">{{ userData.fullName }}</p>
                <p>
                  <v-icon left>mdi-email</v-icon>
                  {{ userData.email }}
                </p>
                <p>Permissions:</p>
                <v-chip
                  v-for="scope in userData.scope"
                  :key="scope"
                  small
                  class="mr-1 mb-1"
                >
                  {{ scope.toUpperCase() }}
                </v-chip>
                <div class="mt-3">
                  <v-btn
                    color="primary"
                    class="my-2"
                    @click="
                      showUpdateForm = true
                      showUpdatePictureForm = false
                    "
                  >
                    <v-icon left>mdi-pencil</v-icon>
                    Update
                  </v-btn>
                  <v-btn
                    color="primary"
                    class="my-2"
                    @click="
                      showUpdatePictureForm = true
                      showUpdateForm = false
                    "
                  >
                    <v-icon left>mdi-pencil</v-icon>
                    Update Picture
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-expand-transition>

      <v-expand-transition>
        <v-card v-if="showUpdateForm">
          <user-form
            @cancel="showUpdateForm = false"
            @done="
              showUpdateForm = false
              showUpdatePictureForm = false
              $auth.fetchUser()
            "
            v-if="userData"
            scope="profile"
            :userId="userData.id"
          />
        </v-card>
        <v-card v-if="showUpdatePictureForm">
          <v-card-title> Update profile picture </v-card-title>
          <v-card-text>
            <v-file-input
              @change="handleSelectFile"
              placeholder="Please select a file"
              v-if="!selectedImage"
              truncate-length="15"
            ></v-file-input>
            <vue-croppie
              v-if="selectedImage"
              ref="croppieRef"
              @update="handlePictureUpdate"
              :enableOrientation="true"
              :boundary="{ width: 256, height: 256 }"
            >
            </vue-croppie>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="uploadingImage" @click="handleClearPicture">
              Reset
            </v-btn>
            <v-btn
              :disabled="uploadingImage"
              color="primary"
              @click="
                showUpdatePictureForm = false
                handleClearPicture()
              "
            >
              Cancel
            </v-btn>
            <v-btn :loading="uploadingImage" color="yellow" @click="handleSave">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import UserForm from '~/components/forms/UserForm.vue'

// @ts-ignore
import * as VueCroppie from 'vue-croppie'
import Compressor from 'compressorjs'

import 'croppie/croppie.css'

import { IBreadcrumbs } from '~/store'
import useApi from '~/services/useApi'
import swalMixin, { showToast } from '~/utils/swalMixin'

const pageTitle = `Profile`

export default defineComponent({
  props: {
    user: {
      type: Object,
      required: false,
      default: null,
    },
  },
  components: {
    UserForm,
    VueCroppie: VueCroppie.VueCroppieComponent,
  },
  middleware: 'isAuthenticated',
  setup(props, { root, parent }) {
    const { $auth } = useContext()
    const store = useStore()
    const { put } = useApi()

    const userData =
      props.user ??
      computed(() => ({
        ...$auth.user,
        photo: `https://randomuser.me/api/portraits/lego/6.jpg`,
        fullName: $auth.user?.first_name + ' ' + $auth.user?.last_name,
      }))

    const breadcrumbs: IBreadcrumbs[] = [
      {
        text: `Dashboard`,
        to: `/`,
      },
      {
        text: `Profile`,
        to: `/profile`,
      },
    ]

    store.dispatch('setPageHeading', {
      pageTitle,
      breadcrumbs,
    })

    // form data
    const password = ref<string>('')
    const newPassword = ref<string>('')
    const newPasswordConfirmation = ref<string>('')
    const croppieRef = ref()

    const showUpdateForm = ref<boolean>(false)
    const showUpdatePictureForm = ref<boolean>(false)
    const uploadingImage = ref<boolean>(false)
    const selectedImage = ref<string>('')
    const selectedImageOptions = ref<any>({})
    const $swal = swalMixin((parent as any).$swal as any)

    const requiredRule = [
      (v: any) => !!v || root.$t('alert.error.validation.required'),
    ]
    const nameRules = [
      ...requiredRule,
      (v: string) =>
        (v && v.length <= 50) ||
        root.$t('alert.error.validation.maxLength', { maxLength: 50 }),
      (v: string) =>
        (v && !(v.match(/[0-9]/g) || []).length) ||
        root.$t('alert.error.validation.invalidCharacters', {
          type: `numbers`,
        }),
    ]
    const passwordRules = [
      (v: string) =>
        (v && v.length >= 8) ||
        root.$t('alert.error.validation.passwordTooShort', { minLength: 8 }),
      (v: string) =>
        (v && (v.match(/[a-z]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `small letter`,
        }),
      (v: string) =>
        (v && (v.match(/[A-Z]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `capital letter`,
        }),
      (v: string) =>
        (v && (v.match(/[0-9]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `number`,
        }),
      (v: string) =>
        (v && (v.match(/[$@#&^!]/g) || []).length > 0) ||
        root.$t('alert.error.validation.passwordRequirement', {
          requirement: `of the following special characters: $@#&^!`,
        }),
    ]

    const pwConfirmationRules = [
      ...passwordRules,
      (v: string) =>
        (v && v === newPassword.value) ||
        root.$t('alert.error.validation.passwordMatch'),
    ]

    const handleSelectFile = async (file: any) => {
      if (file) {
        if (file.type.startsWith('image')) {
          new Compressor(file, {
            quality: 0.3,

            // The compression process is asynchronous,
            // which means you have to access the `result` in the `success` hook function.
            success(compressedFile) {
              var reader = new FileReader()
              var baseString: string = ''
              reader.onloadend = function () {
                baseString = reader.result as string
                let sizeInKB: number = +(compressedFile.size / 1024).toFixed(0)

                if (sizeInKB > 500) {
                  showToast($swal, {
                    title: 'Image size should not be more than 500KB.',
                    icon: 'warning',
                  })
                  // @ts-ignore
                  uploader.value.reset()
                  return
                }
                selectedImage.value = baseString
                setTimeout(() => {
                  croppieRef.value.bind({
                    url: baseString,
                  })
                }, 500)
              }

              reader.readAsDataURL(compressedFile)
            },
            error(err) {
              console.log(err.message)
            },
          })
        } else {
          showToast($swal, {
            title: 'Please select an image.',
            icon: 'warning',
          })
        }
      }
    }

    const handleClearPicture = () => {
      selectedImage.value = ''
    }

    const handlePictureUpdate = (result: any) => {
      console.log(result)
    }

    const handleSave = () => {
      let options = {
        format: 'jpeg',
        circle: false,
        quality: 0.3,
      }
      croppieRef.value.result(options, async (output: string) => {
        try {
          uploadingImage.value = true
          showToast($swal, {
            title: 'Uploading image.',
            icon: 'info',
          })
          await put('/meta/profile_picture', {
            meta_name: `profile_picture`,
            meta_value: output,
          })
          showToast($swal, {
            title: 'Image uploaded successfully.',
          })
          showUpdatePictureForm.value = showUpdateForm.value = false
          selectedImage.value = ''
          uploadingImage.value = false
          parent?.$auth.fetchUser()
        } catch (e: any) {
          const message = e.response?.message || e.message
          showToast($swal, {
            title: 'Something went wrong while uploading profile picture.',
            icon: 'error',
          })
        }
      })
    }

    return {
      userData,
      showUpdateForm,
      passwordRules,
      nameRules,
      pwConfirmationRules,
      requiredRule,
      showUpdatePictureForm,
      handleSelectFile,
      handleClearPicture,
      croppieRef,
      selectedImage,
      handlePictureUpdate,
      handleSave,
      uploadingImage,
    }
  },
  head: {
    title: pageTitle,
  },
})
</script>
