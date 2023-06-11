import Vue from 'vue'

export const callAudio = (val: string) => {
  if (val && val.includes('drive.google')) {
    return val
  }

  switch (process.env.NODE_ENV) {
    case 'development':
      return `http://localhost:3000/player?url=${val}`
    case 'staging':
      return `https://ca-dev.wm4d.com/player?url=${val}`

    case 'production':
      return `https://ca.wm4d.com/player?url=${val}`
    default:
      break
  }
}

Vue.filter('callAudio', (val: string) => {
  return callAudio(val)
})
