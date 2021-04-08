<template>
  <div
    class="flex md:flex-row flex-col md:h-16 py-4 px-8 md:items-center md:justify-start justify-center shadow-md"
  >
    <div class="md:flex-grow-0 flex-grow flex justify-between">
      <router-link to="/" class="text-2xl pr-10">Admin Portal</router-link>
      <button
        @click="$store.commit('toggleMenu')"
        class="md:hidden block focus:outline-none font-semibold hover:opacity-100 opacity-50"
      >
        {{ $store.state.openMenu ? "Close" : "Menu" }}
      </button>
    </div>
    <div
      class="flex-grow md:space-x-2"
      :class="
        $store.state.openMenu ? 'flex flex-col' : 'md:flex hidden flex-row'
      "
    >
      <div class="flex-grow flex flex-row md:justify-end">
        <router-link
          v-show="!$store.getters.isLoggedIn"
          class="hover:opacity-100 opacity-70 font-semibold pl-1"
          to="/login"
        >
          Login
        </router-link>
        <button
          v-show="$store.getters.isLoggedIn"
          class="hover:opacity-100 opacity-70 font-semibold pl-1"
          @click="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Navbar",

  methods: {
    Logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push("/login");
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.nav-height {
  height: 10%;
}
</style>
