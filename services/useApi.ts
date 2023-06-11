/**
 * Experimental
 */
import useAxios from '~/plugins/useAxios'
import {
  useStore
} from '@nuxtjs/composition-api'



export default function useApi() {
  const store = useStore()

const includes = {
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${(store.state as any).cred.cred}`
  }
}
  const $axios = useAxios()

  const get = (url: string, params?: any) =>
    $axios.get(url, { params, ...includes })

  const post = (url: string, data: any, headers?: any[]) =>
    $axios.post(url, data, { ...includes })

  const put = (url: string, data: any, headers?: any[]) =>
    $axios.put(url, data, { ...includes })

  const Delete = (url: string, data?: any, headers?: any[]) =>
    $axios.delete(url, {
      data,
      withCredentials: true,
    })

  return {
    get,
    post,
    put,
    Delete,
  }
}
