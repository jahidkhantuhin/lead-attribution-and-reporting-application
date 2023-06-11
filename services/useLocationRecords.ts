import useApi from './useApi'
export default function () {
  const { get, post, put, Delete } = useApi()

  const list = (filters: any) => get('/locations/missing-clients', filters)
  const create = (body: any) => post('locations/client', body)
  const createClientByLocationId = (id: string | number) => {
    return put(`/locations/${id}/client`, null)
  }

  return {
    list,
    create,
    createClientByLocationId,
  }
}
