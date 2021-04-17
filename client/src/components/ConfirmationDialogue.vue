<template>
  <div
    v-show="show"
    style="z-index: 1000"
    class="w-full h-screen absolute flex justify-center items-center top-0 left-0"
  >
    <div class="absolute w-full h-full bg-black opacity-50" @click="_no"></div>
    <div class="flex flex-col relative bg-white z-10 rounded-md shadow-lg">
      <div class="w-full flex justify-center p-5 text-2xl">
        {{ title }}
      </div>
      <div class="w-full flex-grow px-5 text-center mb-5">
        {{ message }}
      </div>
      <div
        class="w-full gap-5 flex flex-wrap sm:justify-end justify-center p-5 border-t items-center"
      >
        <button
          type="button"
          @click="_no"
          class="group focus:outline-none flex justify-center items-center py-2 px-5 border border-gray-300 rounded-md hover:border-gray-400"
        >
          <!-- <font-awesome-icon icon="times" class="text-lg mr-2" /> -->
          <span>{{ noButton }}</span>
        </button>
        <button
          @click="_yes"
          class="group focus:outline-none flex justify-center items-center py-2 px-5 border border-gray-400 text-gray-600 font-semibold rounded-md hover:bg-gray-700 hover:text-white"
        >
          <!-- <font-awesome-icon icon="check" class="text-lg mr-2" /> -->
          <span>{{ yesButton }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationDialogue",
  data() {
    return {
      show: false,
      title: "",
      message: "",
      yesButton: "",
      noButton: "Close",

      resolvePromise: undefined,
      rejectPromise: undefined,
    };
  },
  methods: {
    trigger(opts = {}) {
      this.title = opts.title;
      this.message = opts.message;
      this.yesButton = opts.yesButton;
      if (opts.noButton) {
        this.noButton = opts.noButton;
      }
      // Once we set our config, we tell the popup modal to open
      this.show = true;
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;
      });
    },
    _yes() {
      this.show = false;
      this.resolvePromise(true);
    },

    _no() {
      this.show = false;
      this.resolvePromise(false);
      // Or you can throw an error
      // this.rejectPromise(new Error('User cancelled the dialogue'))
    },
  },
};
</script>