export default function ({redirect, store}) {
  const isAuthenticated = store.getters['users/isAuthenticated'] ? true : false
    // If the user is not authenticated
    if (!isAuthenticated) {
      return redirect("/login");
    }
  }