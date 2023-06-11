import useApi from './useApi'
export default function useClientStaff() {
  const { get, post, put, Delete } = useApi()

  const staffById = (id: string | number) => get(`/staff/${id}`)

  const create = (body: any) => {
    return post('/staff', body)
  }

  const updateStaff = (data: { [key: string]: string | number }) =>
    put(`/staff/${data.id}`, data)

  const deleteStaff = (id: string | number) => {
    return Delete(`/staff/${id}`)
  }

  return {
    create,
    staffById,
    deleteStaff,
    updateStaff,
  }
}
