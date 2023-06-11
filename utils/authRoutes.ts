export const AuthRoutes = [
  '/login',
  '/login/',
  '/reset-password',
  '/reset-password/',
  '/forgot-password',
  '/forgot-password/',
]

export const isAuthRoute = (route: String) =>
  AuthRoutes.map((c) => route.includes(c)).includes(true)
