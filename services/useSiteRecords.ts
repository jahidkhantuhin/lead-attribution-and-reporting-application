import useApi from './useApi'
export default function () {
  const { get, post, put, Delete } = useApi()
  const list = (filters: any) => get('/sites', filters)
  const siteById = (id: string | number) => get(`/sites/${id}`)
  const pluginList = () => get('/plugins')
  const themeList = () => get('/themes')
  return {
    list,
    siteById,
    pluginList,
    themeList,
  }
}
