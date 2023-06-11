/**
 * User CRUD API service
 */
import useApi from './useApi'

export default function useUsers() {
  const { get, post, put, Delete } = useApi()

  // TODO: Change filters to an interface
  const list = (filters: any) => {
    return get('/users', filters)
  }

  const userById = (id: string | number) => get(`/users/${id}`)

  const updateUser = (data: { [key: string]: string | number }) =>
    put(`users/${data.id}`, data)

  const createUser = (data: { [key: string]: string | number }) =>
    post('register', data)

  const deleteUser = (id: string | number) => Delete(`users/${id}`, {})

  const getRoles = () => get('/roles')

  return {
    list,
    getRoles,
    userById,
    updateUser,
    createUser,
    deleteUser,
  }
}
