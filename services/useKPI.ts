import useApi from './useApi'

export default function () {
  const { get } = useApi()

  const fetchKPI = (filters: any) =>
    get(`/clients/${filters.client_id}/kpi`, filters)

  return {
    fetchKPI,
  }
}
