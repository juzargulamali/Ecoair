<template>
  <div class="subpixel-antialiased h-screen">
    <Navbar />
    <Notifications ref="notifications" />
    <ConfirmationDialogue ref="confirmationDialogue" />
    <div
      class="body-height transition-colors duration-500 overflow-y-auto px-2 sm:px-0"
    >
      <router-view v-if="!loading" v-slot="{ Component }">
        <transition name="router-anim">
          <!-- <keep-alive include="ViewStats"> -->
          <component :is="Component" />
          <!-- </keep-alive> -->
        </transition>
      </router-view>
      <Loading v-else />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import Notifications from "./components/Notifications.vue";
import ConfirmationDialogue from "./components/ConfirmationDialogue.vue";
import { checkAuthState } from "./services/AuthService";
export default {
  components: { Navbar, Loading, Notifications, ConfirmationDialogue },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    checkAuthState()
      .then((res) => {
        res.data ? console.log("Signed In") : console.log("Signed Out");
        localStorage.setItem("loggedIn", res.data);
        this.$store.commit("setIsLoggedIn", res.data);
        this.loading = false;
        if(!res.data) {
          this.$router.push("/login");
        }
      })
      .catch((err) => {
        this.$store.commit("setIsLoggedIn", false);
        localStorage.setItem("loggedIn", false);
        console.log(err.response);
        this.loading = false;
        this.$router.push("/login");
      });
  },
};
</script>

<style>
a:focus {
  outline: none;
}

.body-height {
  height: 90%;
}

.router-anim-enter-active {
  animation: coming 0.4s;
  animation-delay: 0.4s;
  opacity: 0;
}
.router-anim-leave-active {
  animation: going 0.4s;
}
@keyframes going {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes coming {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
