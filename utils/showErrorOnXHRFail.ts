import { AxiosResponse } from 'axios'

interface CustomErrors {
  code422?: String
  code429?: String
  code500?: String
}

interface Args {
  error: {
    message: String
    response: AxiosResponse
  }
  showToast: Function
  $swal: any
  translate: Function
  customErrors?: CustomErrors
}

export default function ({
  error,
  showToast,
  $swal,
  translate,
  customErrors,
}: Args) {
  const response = error.response
  if (!response) {
    showToast($swal, {
      title: error.message.includes('Network Error')
        ? 'Possible Network error. Please reload the page. If the problem persists, please file a task.'
        : error.message,
      icon: 'error',
    })
    return
  }
  let mainMessage = ''
  const status = response.status
  
  if (response && response.config && response.config.url?.includes('noswal')) {
    return
  }

  if (response.data && response.data.errors) {
    const errors = response.data.errors
    mainMessage = errors[Object.keys(errors)[0]]
  }

  switch (status) {
    case 401:
      showToast($swal, {
        title: translate(`alert.error.unauthorized`),
        icon: 'error',
      })
      break
    case 422:
      showToast($swal, {
        title: mainMessage
          ? mainMessage
          : customErrors?.code422
          ? customErrors?.code422
          : translate(`alert.error.unprocessableEntity`),
        icon: 'error',
      })
      break
    case 429:
      showToast($swal, {
        title: customErrors?.code429
          ? customErrors?.code429
          : translate(`alert.error.tooManyAttempts`),
        icon: 'error',
      })
      break
    case 500:
      showToast($swal, {
        title: customErrors?.code500
          ? customErrors?.code500
          : translate(`alert.error.server`),
        icon: 'error',
      })
      break
    default:
      showToast($swal, {
        title: translate(`alert.error.unknown`),
        icon: 'error',
      })
  }
}
