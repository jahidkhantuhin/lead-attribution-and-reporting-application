import Vue from 'vue'

Vue.filter('truncateText', (val: string) => {
  if (val && val.length > 50) {
    return `${val.slice(0, 50)}...`
  }
  return val
})
