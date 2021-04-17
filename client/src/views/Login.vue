<template>
  <div class="flex flex-col items-center mt-9">
    <h1 class="sm:text-4xl text-2xl py-12 text-gray-600">Login</h1>
    <div class="text-red-600 font-semibold pb-2">{{ serverResponse }}</div>
    <div class="w-2/8">
      <form v-on:submit="onSubmit">
        <div class="w-full flex flex-col gap-4">
          <input
            required
            type="username"
            v-model="formData.username"
            placeholder="username"
            :class="[
              'p-3',
              'outline-none',
              'rounded-md',
              'border-2',
              'border-gray-400',
              'focus:border-gray-600',
              'text-gray-800',
              'placeholder-gray-600',
              'bg-transparent',
            ]"
          />
          <input
            required
            type="password"
            v-model.trim="formData.password"
            placeholder="Password"
            :class="[
              'p-3',
              'outline-none',
              'rounded-md',
              'border-2',
              'border-gray-400',
              'focus:border-gray-600',
              'text-gray-800',
              'placeholder-gray-600',
              'bg-transparent',
            ]"
          />
          <div class="w-full text-center">
            <button
              class="w-full border-2 text-gray-700 border-gray-500 p-2 hover:bg-gray-500 hover:text-gray-50 transition-colors duration-500 rounded-md focus:outline-none"
              type="submit"
            >
              Submit
            </button>
            <div
              class="ml-auto mr-auto rounded-full border-t-4 border-l-4 border-gray-500 animate-spin mt-6 h-5 w-5"
              v-bind:class="{ block: loading, hidden: !loading }"
            ></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from "../services/AuthService";
export default {
  name: "Login",
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      loading: false,
      serverResponse: "",
    };
  },
  methods: {
    onSubmit(e) {
      //loading -> start on submit click
      this.loading = true;
      this.serverResponse = "";
      e.preventDefault();
      // console.log(this.formData);
      AuthService.login(this.formData)
        .then(() => {
          localStorage.setItem("loggedIn", true);
          this.$store.commit("setIsLoggedIn", true);
          this.$root.$refs.notifications.trigger({
            title: `Login Successful`,
            message: `Successfully logged in. Welcome back!`,
            color: "green",
            timeout: "5000",
          });
          this.loading = false;
          this.$router.push(this.$route.query.redirect || "/");
        })
        .catch((err) => {
          localStorage.setItem("loggedIn", false);
          this.serverResponse = err.response.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
</style>
