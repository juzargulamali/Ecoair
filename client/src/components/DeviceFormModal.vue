<template>
  <div
    class="w-full h-screen absolute flex justify-center items-center top-0 left-0"
  >
    <div
      class="absolute w-full h-full bg-black opacity-50"
      @click="modalToggler"
    ></div>
    <form
      @submit="onSubmit"
      class="flex flex-col relative w-4/5 md:h-3/5 bg-white z-10 rounded-md shadow-lg"
      @click="
        () => {
          editing_company = false;
          editing_country = false;
        }
      "
    >
      <div class="w-full flex justify-center p-5">
        <div class="text-center">
          <div class="text-2xl">
            {{ device._id ? "Edit Device" : "New Device" }}
          </div>
        </div>
      </div>
      <div class="flex-grow px-5 items-center justify-center">
        <div class="grid grid-cols-2 gap-5 lg:px-40">
          <!-- device ID -->
          <div class="col-span-2">
            <label class="text-sm font-semibold"
              >Device ID
              <span
                :class="['ml-3', deviceError !== '...' && 'text-red-600']"
                >{{ deviceError }}</span
              >
            </label>
            <input
              :disabled="!!localDevice._id"
              class="w-full border rounded-md h-10 focus:outline-none px-3 text-center shadow"
              placeholder="Enter Device ID"
              v-model="deviceSearch"
            />
          </div>
          <!-- country -->
          <div
            class="col-span-2 md:col-span-1"
            @click.stop="editing_company = false"
          >
            <label class="text-sm font-semibold">Country</label>
            <button
              type="button"
              class="w-full border rounded-md h-10 focus:outline-none px-3 text-center shadow flex justify-center items-center gap-2"
              @click="editing_country = !editing_country"
              @keydown.esc.stop="editing_country = false"
            >
              <img
                v-if="!!localDevice.country"
                :src="findFlagUrlByCountryName(localDevice.country)"
                alt="flag"
                class="w-8 border rounded-sm"
              />
              <p class="whitespace-nowrap overflow-hidden overflow-ellipsis">
                <span v-if="localDevice.country">{{
                  localDevice.country
                }}</span>
                <span v-else class="opacity-40">{{ "Select Country" }}</span>
              </p>
            </button>
            <div class="relative w-full mt-0.5" style="z-index: 10000">
              <div
                v-if="editing_country"
                class="absolute flex flex-col w-full border rounded-md bg-white max-h-60 overflow-y-auto"
              >
                <div class="w-full p-2">
                  <input
                    v-on:keydown.enter.prevent
                    class="w-full rounded-md border p-1 focus:outline-none"
                    placeholder="Search Countries"
                    v-model="countrySearch"
                  />
                </div>
                <!-- eslint-disable -->
                <template v-for="country in countries_list" :key="country">
                  <button
                    v-show="
                      country.name
                        .toLowerCase()
                        .includes(countrySearch.toLowerCase())
                    "
                    type="button"
                    class="p-1 hover:bg-gray-100 focus:outline-none"
                    @mousedown="
                      () => {
                        editing_country = false;
                        localDevice.country = country.name;
                      }
                    "
                    :title="country.name"
                  >
                    <div class="flex gap-2">
                      <img
                        :src="country.flag"
                        :alt="country.iso2"
                        class="w-8"
                      />
                      <p
                        class="whitespace-nowrap overflow-hidden overflow-ellipsis"
                      >
                        {{ country.name }}
                      </p>
                    </div>
                  </button>
                </template>
                <!-- eslint-enable -->
              </div>
            </div>
          </div>
          <!-- company -->
          <div
            class="col-span-2 md:col-span-1"
            @click.stop="editing_country = false"
          >
            <label class="text-sm font-semibold">Company</label>
            <button
              type="button"
              class="w-full border rounded-md h-10 focus:outline-none px-3 text-center shadow flex justify-center items-center gap-2"
              @click="editing_company = !editing_company"
              @keydown.esc.stop="editing_company = false"
            >
              <p class="whitespace-nowrap overflow-hidden overflow-ellipsis">
                <span v-if="localDevice.company">{{
                  localDevice.company
                }}</span>
                <span v-else class="opacity-40">{{ "Select Company" }}</span>
              </p>
            </button>
            <div class="relative w-full mt-0.5">
              <div
                v-if="editing_company"
                class="absolute flex flex-col w-full border rounded-md bg-white max-h-60 overflow-y-auto"
              >
                <div class="w-full p-2 relative flex">
                  <input
                    class="w-full rounded-md border p-1 focus:outline-none pr-8"
                    placeholder="Search Companies"
                    v-model="companySearch"
                    v-on:keypress.enter.stop
                    @keypress.enter="
                      () => {
                        editing_company = false;
                        localDevice.company = companySearch;
                      }
                    "
                  />
                  <button
                    class="transform hover:scale-110 right-3 p-1 ml-1"
                    type="button"
                    @click="
                      () => {
                        editing_company = false;
                        localDevice.company = companySearch;
                      }
                    "
                  >
                    <font-awesome-icon icon="plus"></font-awesome-icon>
                  </button>
                </div>
                <!-- eslint-disable -->
                <template v-for="company in companies_list" :key="company">
                  <button
                    v-if="
                      company
                        .toLowerCase()
                        .includes(companySearch.toLowerCase())
                    "
                    type="button"
                    class="p-1 hover:bg-gray-100 focus:outline-none"
                    @mousedown="
                      () => {
                        editing_company = false;
                        localDevice.company = company;
                      }
                    "
                  >
                    {{ company }}
                  </button>
                </template>
                <!-- eslint-enable -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full gap-5 flex flex-wrap sm:justify-end justify-center p-5 border-t items-center"
      >
        <div
          v-if="loading != 0"
          :class="[
            'mr-3 flex justify-center w-full font-semibold',
            loading > 0 ? 'text-green-500' : 'text-red-600',
          ]"
        >
          <div
            v-if="loading === 1"
            class="h-5 w-5 rounded-full border-t-2 border-r-2 border-blue-500 animate-spin"
          ></div>
          <span v-else>
            {{ serverResponse }}
          </span>
        </div>
        <button
          type="button"
          @click="modalToggler"
          class="group focus:outline-none w-32 flex justify-center items-center p-2 border border-gray-300 rounded-md hover:border-gray-400"
        >
          <font-awesome-icon icon="times" class="text-lg mr-2" />
          <span>Close</span>
        </button>
        <button
          type="submit"
          class="group focus:outline-none w-32 flex justify-center items-center p-2 border border-gray-300 rounded-md hover:border-gray-400"
        >
          <font-awesome-icon icon="check" class="text-lg mr-2" />
          <span>Confirm</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { findFlagUrlByCountryName } from "country-flags-svg";
import { countries as COUNTRIES } from "country-flags-svg";
import DeviceService from "../services/DeviceService";

export default {
  props: ["toggle", "device", "updateSelectedDevice"],
  name: "SearchFilterModal",
  data() {
    return {
      findFlagUrlByCountryName: findFlagUrlByCountryName,
      //autocomplete data
      countries_list: COUNTRIES,
      companies_list: [],
      editing_country: false,
      editing_company: false,
      deviceSearch: "",
      countrySearch: "",
      companySearch: "",
      localDevice: Object.assign({}, this.device) || {},
      deviceError: "",
      countryError: "",
      loading: 0,
      serverResponse: "",
    };
  },
  mounted() {
    if (this.device) {
      this.deviceSearch = this.device.device_id;
      this.country = this.device.country;
      this.company = this.device.company;
    }
    DeviceService.findCompanies({
      countries: [],
      companies: [],
      device_ids: [],
    })
      .then((res) => {
        this.companies_list = res.data.companies;
      })
      .catch((err) => console.log(err));
  },
  methods: {
    modalToggler() {
      this.toggle();
    },
    onSubmit(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.deviceError) return;
      this.serverResponse = "";
      this.loading = 1;
      if (this.localDevice._id) {
        DeviceService.updateDevice(this.localDevice)
          .then(() => {
            this.loading = 2;
            this.serverResponse = "Successfully Updated Device";
            this.updateSelectedDevice(this.localDevice);
          })
          .catch((err) => {
            console.log(err);
            this.serverResponse = "Update Device Failed";
            this.loading = -1;
          });
      } else {
        this.localDevice.device_id = this.deviceSearch;
        DeviceService.addDevice(this.localDevice)
          .then(() => {
            this.loading = 2;
            this.serverResponse = "Successfully Created Device";
          })
          .catch((err) => {
            console.log(err);
            this.serverResponse = "Device Creation Failed";
            this.loading = -1;
          });
      }
    },
  },
  watch: {
    device: function (val) {
      this.localDevice = val;
    },
    deviceSearch: function () {
      if (this.device._id) return;
      this.deviceError = "...";
      let timeoutID = setTimeout(() => {
        if (!this.deviceSearch) {
          this.deviceError = "";
          return;
        }
        DeviceService.findDeviceByID(this.deviceSearch)
          .then((res) => {
            if (res.data.device) {
              this.deviceError = "A device with this ID already exists";
              return;
            } else {
              this.deviceError = "";
              return;
            }
          })
          .catch((err) => console.log(err));
      }, 500);

      return () => clearTimeout(timeoutID);
    },
  },
};
</script>