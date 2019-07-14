export default function({ store, redirect }) {
  if (!store.state.user.loggedIn) {
    return redirect("/");
  }
}
