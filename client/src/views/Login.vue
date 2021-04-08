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
      this.$store
        .dispatch("login", {
          credentials: this.formData,
        })
        .then(() => {
          this.loading = false;
          // console.log(this.$store.state);
          this.$router.push("/");
        })
        .catch((err) => {
          this.loading = false;
          if (err.response) {
            this.serverResponse = err.response.data.message;
          } else {
            this.serverResponse = "Server Error Occured";
          }
        });
    },
  },
};
</script>

<style scoped>
</style>
