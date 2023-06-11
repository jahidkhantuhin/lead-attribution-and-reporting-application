import Vue from 'vue'

export const usPhone = (val: string) => {
  
  if (val) {
    val = val && val.trim && val.trim()
    /* regex to find the matches: 3 digits, then 3 digits, then 4 digits */
    const parts = val.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (parts) {
      return `(${parts[1]}) ${parts[2]}-${parts[3]}`
    }
    return val
  }
  return ''
}

Vue.filter('usPhone', (val: string) => {
  return usPhone(val)
})
