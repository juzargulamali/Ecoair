<template>
  <div
    class="absolute h-screen top-0 right-0 w-96 pointer-events-none overflow-y-hidden"
    style="z-index: 100"
  >
    <div class="relative">
      <div class="absolute flex flex-col-reverse gap-5 top-20 right-2">
        <div
          v-for="(not, i) in notifications"
          :key="i"
          class="flex flex-col relative px-10 py-5 rounded-md shadow-lg opacity-80 hover:opacity-100 pointer-events-auto"
          :class="[`bg-${not.color}-300`]"
        >
          <div
            class="w-full text-lg font-semibold"
            :class="[`text-${not.color}-900`]"
          >
            {{ not.title }}
          </div>
          <div class="w-full" :class="[`text-${not.color}-900`]">
            {{ not.message }}
          </div>
          <div>
            <button
              @click="dismiss(i)"
              class="font-semibold focus:outline-none"
              :class="[`text-${not.color}-900`]"
            >
              <!-- <font-awesome-icon icon="check" class="text-lg mr-2" /> -->
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notifications",
  data() {
    return {
      notifications: [],
    };
  },
  methods: {
    trigger(opts = {}) {
      this.notifications.push(opts);
      // Dismiss notification after a set timeout
      let timeoutID;
      if (opts.timeout) {
        timeoutID = setTimeout(() => {
          this.notifications.splice(this.notifications.indexOf(opts), 1);
        }, opts.timeout);
      }
      return () => clearTimeout(timeoutID);
    },

    dismiss(index) {
      this.notifications.splice(index, 1);
    },
  },
};
</script>