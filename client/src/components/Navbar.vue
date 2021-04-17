<template>
  <div
    class="flex md:flex-row flex-col md:h-16 py-4 px-8 md:items-center md:justify-start justify-center shadow-md text-gray-800"
  >
    <div class="md:flex-grow-0 flex-grow flex justify-between">
      <router-link to="/" class="text-2xl pr-10 font-semibold"
        >Portal</router-link
      >
      <button
        @click="$store.commit('toggleMenu')"
        class="md:hidden block focus:outline-none font-semibold hover:opacity-100 opacity-50"
      >
        {{ $store.state.openMenu ? "Close" : "Menu" }}
      </button>
    </div>
    <div
      class="flex-grow md:space-x-2 mt-1"
      :class="
        $store.state.openMenu ? 'flex flex-col' : 'md:flex hidden flex-row'
      "
    >
      <router-link
        v-show="$store.getters.isLoggedIn"
        class="hover:opacity-100 opacity-70 font-semibold pl-1"
        to="/devices"
      >
        Devices
      </router-link>
      <div class="flex-grow flex flex-row md:justify-end">
        <!-- <router-link
          v-show="!$store.getters.isLoggedIn"
          class="hover:opacity-100 opacity-70 font-semibold pl-1"
          to="/login"
        >
          Login
        </router-link> -->
        <button
          v-show="$store.getters.isLoggedIn"
          class="hover:opacity-100 opacity-70 font-semibold pl-1 focus:outline-none"
          @click="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import AuthService from "../services/AuthService";
export default {
  name: "Navbar",

  methods: {
    Logout() {
      AuthService.signOut()
        .then(() => {
          localStorage.setItem("loggedIn", false);
          this.$store.commit("setIsLoggedIn", false);
          this.$root.$refs.notifications.trigger({
            title: `Logout Successful`,
            message: `Succefully logged out from session`,
            color: "green",
            timeout: "5000",
          });
          this.$router.push("/login");
        })
        .catch((err) => {
          this.$root.$refs.notifications.trigger({
            title: `Logout Failed`,
            message: `Failed to logout from session on this device`,
            color: "red",
            timeout: "5000",
          });
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.nav-height {
  height: 10%;
}
</style>
