import {
  ADMIN_ROLE,
  AM_ROLE,
  CALL_SCORER_ROLE,
  SUPER_ADMIN_ROLE,
} from './UserEnums'

export default function (
  editingUser: any,
  loginUser: any,
  scope: null | string | undefined = null
) {
  if (scope === 'profile') {
    return true
  }

  if (editingUser.role === ADMIN_ROLE && loginUser.role !== SUPER_ADMIN_ROLE) {
    return false
  }

  if (
    editingUser.role === ADMIN_ROLE &&
    loginUser.role === ADMIN_ROLE &&
    editingUser.id !== loginUser.id
  ) {
    return false
  }

  return true
}
