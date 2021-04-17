<template>
  <div
    class="w-full h-screen absolute flex justify-center items-center top-0 left-0"
  >
    <div
      class="absolute w-full h-full bg-black opacity-50"
      @click="modalToggler"
    ></div>
    <div
      class="flex flex-col relative w-4/5 h-4/5 bg-white z-10 rounded-md shadow-lg"
    >
      <div class="w-full flex justify-between p-5">
        <div>
          <button
            v-if="stage > 0"
            @click="changeStage(-1)"
            class="group focus:outline-none"
          >
            <font-awesome-icon
              icon="angle-left"
              class="text-2xl transform group-hover:scale-110"
            />
          </button>
        </div>
        <div class="text-center">
          <div class="text-2xl">Set Filters</div>
          <div class="text-base">
            {{
              stage === 0
                ? "Select Countries"
                : stage === 1
                ? "Select Companies"
                : "Select Devices"
            }}
          </div>
        </div>
        <div>
          <button
            v-if="stage < 2"
            @click="changeStage(+1)"
            class="group focus:outline-none"
          >
            <font-awesome-icon
              icon="angle-right"
              class="text-2xl transform group-hover:scale-110"
            />
          </button>
        </div>
      </div>
      <div class="w-full text-center mb-2 px-5 relative">
        <font-awesome-icon
          icon="search"
          class="absolute h-full ml-3"
        ></font-awesome-icon>
        <input
          v-model="search"
          class="pl-10 w-4/5 rounded-md border h-10 focus:outline-none"
        />
      </div>
      <div class="flex-grow px-5 items-center justify-center overflow-auto">
        <!-- countries -->
        <div
          v-if="stage === 0"
          class="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-1 gap-5 place-content-center"
        >
          <button
            @click="countries = []"
            :class="[
              'border w-full p-2 rounded-md flex justify-center items-center focus:outline-none hover:bg-blue-50',
              countries.length === 0 && 'border-blue-500 shadow-md',
            ]"
          >
            All
          </button>
          <!-- eslint-disable -->
          <template v-for="country in countries_list" :key="country.iso2">
            <button
              v-if="country.name.toLowerCase().includes(search.toLowerCase())"
              @click="toggleItem('country', country)"
              :class="[
                'border w-full p-2 rounded-md flex flex-col justify-start items-center focus:outline-none hover:bg-blue-50',
                countries.includes(country) && 'border-blue-500 shadow-md',
              ]"
            >
              <img :src="country.flag" class="h-12 border" />
              <span class="overflow-ellipsis text-sm">{{ country.name }}</span>
            </button>
          </template>
          <!-- eslint-enable -->
        </div>
        <!-- companies -->
        <div
          v-else-if="stage === 1"
          class="grid grid-cols-1 gap-1 place-content-center"
        >
          <button
            @click="companies = []"
            :class="[
              'border w-full p-2 rounded-md flex justify-center items-center focus:outline-none hover:bg-blue-50',
              companies.length === 0 && 'border-blue-500 shadow-md',
            ]"
          >
            All
          </button>
          <!-- eslint-disable -->
          <template v-for="company in companies_list" :key="company">
            <button
              v-if="company.toLowerCase().includes(search.toLowerCase())"
              @click="toggleItem('company', company)"
              :class="[
                'border w-full p-2 rounded-md flex flex-col justify-start items-center focus:outline-none hover:bg-blue-50',
                companies.includes(company) && 'border-blue-500 shadow-md',
              ]"
            >
              <span class="overflow-ellipsis">{{ company }}</span>
            </button>
          </template>
          <!-- eslint-enable -->
        </div>
        <!-- devices -->
        <div
          v-else-if="stage === 2"
          class="grid grid-cols-1 gap-1 place-content-center"
        >
          <button
            @click="devices = []"
            :class="[
              'border w-full p-2 rounded-md flex justify-center items-center focus:outline-none hover:bg-blue-50',
              devices.length === 0 && 'border-blue-500 shadow-md',
            ]"
          >
            All
          </button>
          <!-- eslint-disable -->
          <template v-for="device in devices_list" :key="device.device_id">
            <button
              v-if="
                device.device_id.toLowerCase().includes(search.toLowerCase())
              "
              @click="toggleItem('id', device)"
              :class="[
                'border w-full p-2 rounded-md flex flex-col justify-start items-center focus:outline-none hover:bg-blue-50',
                devices.includes(device) && 'border-blue-500 shadow-md',
              ]"
            >
              <span class="overflow-ellipsis">{{ device.device_id }}</span>
            </button>
          </template>
          <!-- eslint-enable -->
        </div>
      </div>
      <div
        class="w-full gap-5 flex flex-wrap sm:justify-end justify-center p-5 border-t"
      >
        <button
          @click="modalToggler"
          class="group focus:outline-none w-32 flex justify-center items-center p-2 border border-gray-300 rounded-md hover:border-gray-400"
        >
          <font-awesome-icon icon="times" class="text-lg mr-2" />
          <span>Cancel</span>
        </button>
        <button
          @click="
            () => {
              applyFilters({
                countries: countries,
                companies: companies,
                devices: devices,
              });
              modalToggler();
            }
          "
          class="group focus:outline-none w-32 flex justify-center items-center p-2 border border-gray-300 rounded-md hover:border-gray-400"
        >
          <font-awesome-icon icon="check" class="text-lg mr-2" />
          <span>Confirm</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { countries as COUNTRIES } from "country-flags-svg";
import DeviceService from "../services/DeviceService";

export default {
  props: ["toggle", "device", "applyFilters"],
  name: "DeviceForm",
  data() {
    return {
      countries_list: COUNTRIES,
      companies_list: [],
      devices_list: [],
      stage: 0,
      search: "",
      countries: [],
      companies: [],
      devices: [],
      page: 1,
      limit: 99999,
    };
  },
  methods: {
    changeStage(change) {
      this.stage += change;
      this.search = "";
      this.page = 1;
      if (this.stage === 1) {
        //get companies
        DeviceService.findCompanies({
          countries: this.countries.map((c) => c.name),
          companies: [],
          device_ids: [],
        })
          .then((res) => {
            this.companies_list = res.data.companies;
          })
          .catch((err) => console.log(err));
      } else if (this.stage === 2) {
        //get devices

        DeviceService.findDevices({
          countries: this.countries.map((c) => c.name),
          companies: this.companies,
          device_ids: [],
          page: this.page,
          limit: this.limit,
        })
          .then((res) => {
            this.devices_list = res.data.devices;
          })
          .catch((err) => console.log(err));
      }
    },
    toggleItem(type, item) {
      var index = -1;
      switch (type) {
        case "country": {
          this.companies = [];
          this.companies_list = [];
          this.devices = [];
          this.devices_list = [];
          index = this.countries.indexOf(item);
          if (index >= 0) {
            this.countries.splice(index, 1);
            break;
          }
          this.countries.push(item);
          break;
        }
        case "company": {
          this.devices = [];
          this.devices_list = [];
          index = this.companies.indexOf(item);
          if (index >= 0) {
            this.companies.splice(index, 1);
            break;
          }
          this.companies.push(item);
          break;
        }
        case "id": {
          index = this.devices.indexOf(item);
          if (index >= 0) {
            this.devices.splice(index, 1);
            break;
          }
          this.devices.push(item);
          break;
        }
      }
    },
    modalToggler() {
      this.stage = 0;
      this.toggle();
    },
  },
};
</script>