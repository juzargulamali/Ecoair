<template>
  <div class="flex flex-col items-center mt-9">
    <div
      class="flex flex-wrap justify-between sm:w-9/12 w-full rounded-md gap-2"
    >
      <div class="text-3xl flex flex-wrap gap-3">
        <span>Devices</span>
        <button
          @click="updateDeviceList"
          class="focus:outline-none text-sm transform hover:scale-110 h-6 w-6 text-white rounded-full bg-gray-700 self-center"
        >
          <font-awesome-icon
            icon="redo-alt"
            flip="horizontal"
          ></font-awesome-icon>
        </button>
      </div>
      <div class="flex flex-wrap justify-start gap-2">
        <button
          @click="openDeviceForm({})"
          class="border border-green-600 p-2 rounded-md text-green-600 font-semibold opacity-80 hover:opacity-100 focus:outline-none"
        >
          <font-awesome-icon icon="plus" class="mr-2"> </font-awesome-icon>
          <span>Add Device</span>
        </button>
        <button
          @click="toggle"
          class="border border-gray-500 p-2 rounded-md text-gray-500 font-semibold opacity-80 hover:opacity-100 focus:outline-none"
        >
          <font-awesome-icon icon="filter" class="mr-2"> </font-awesome-icon>
          <span>Filter Logs</span>
        </button>
      </div>
    </div>
    <div class="flex flex-wrap sm:w-9/12 w-full gap-1 mt-2">
      <div
        v-for="(country, i) in filters.countries"
        :key="country.name"
        class="group text-gray-500 border border-gray-500 rounded-md p-2 flex items-center"
      >
        <img :src="country.flag" class="w-8 rounded mr-3" />
        <span>{{ country.name }}</span>
        <button
          class="group-hover:block hidden ml-5 focus:outline-none"
          @click="deleteFilter('countries', i)"
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
        </button>
      </div>
      <div
        v-for="(company, i) in filters.companies"
        :key="company"
        class="group text-gray-500 border border-gray-500 rounded-md p-2 flex items-center"
      >
        <span>Company: {{ company }}</span>
        <button
          class="group-hover:block hidden ml-5 focus:outline-none"
          @click="deleteFilter('countries', i)"
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
        </button>
      </div>
      <div
        v-for="(device, i) in filters.devices"
        :key="device.device_id"
        class="group text-gray-500 border border-gray-500 rounded-md p-2 flex items-center"
      >
        <img
          v-if="!!device.country"
          :src="findFlagUrlByCountryName(device.country)"
          class="w-8 rounded mr-3"
        />
        <span>Device ID {{ device.device_id }}</span>
        <button
          class="group-hover:block hidden ml-5 focus:outline-none"
          @click="deleteFilter('countries', i)"
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
        </button>
      </div>
    </div>
    <div class="text-center sm:w-9/12 w-full mt-1">
      <div class="w-full mb-12 mt-5">
        <div
          id="previewContainer"
          class="flex flex-row overflow-x-auto rounded-lg shadow-lg relative"
        >
          <table id="previewTable" class="table-auto border-collapse w-full">
            <thead class="bg-gray-700 border-b-4 border-gray-500">
              <th
                class="px-3 text-gray-100 py-3"
                v-for="(head, i) in headers"
                :key="i"
              >
                {{ head }}
              </th>
              <th class="flex py-3"></th>
            </thead>
            <tbody>
              <tr
                class="odd:bg-gray-200 even:bg-gray-50 border-b border-l-2 border-r border-gray-300 hover:bg-gray-300 cursor-pointer"
                v-for="(row, i) in devices"
                :key="i"
                @click="openDeviceForm(row)"
              >
                <td
                  v-for="(j, head) in headers"
                  :key="j"
                  class="px-3 py-3 text-gray-700 font-semibold"
                >
                  {{
                    head !== "createdAt" ? row[head] : formatDateTime(row[head])
                  }}
                </td>
                <td class="flex gap-2 py-3">
                  <button
                    v-on:click.stop
                    @click="handleDelete(row, i)"
                    class="text-xl text-red-500 hover:text-red-600 focus:outline-none"
                  >
                    <font-awesome-icon icon="trash"> </font-awesome-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="devices.length === 0"
          class="opacity-50 text-center w-full px-3 py-3"
        >
          {{ serverResponse }}
        </div>
      </div>

      <div v-show="!loading" class="flex text-white justify-end space-x-5 pb-6">
        <button
          v-show="page > 1"
          class="text-gray-800 border border-gray-700 opacity-60 hover:opacity-100 focus:outline-none px-3 py-2 rounded"
          @click="getDevices(false)"
        >
          Previous
        </button>
        <button
          v-show="page < pageCount"
          class="text-gray-800 border border-gray-700 opacity-60 hover:opacity-100 focus:outline-none px-3 py-2 rounded"
          @click="getDevices(true)"
        >
          Next
        </button>
      </div>
    </div>
    <SearchFilterModal
      v-show="filterToggle"
      :toggle="toggle"
      :applyFilters="applyFilters"
    />
    <DeviceFormModal
      v-if="deviceFormToggle"
      :toggle="
        () => {
          deviceFormToggle = !deviceFormToggle;
        }
      "
      :device="selectedDevice"
      :updateSelectedDevice="updateSelectedDevice"
    />
  </div>
</template>

<script>
import { findFlagUrlByCountryName } from "country-flags-svg";
import SearchFilterModal from "../components/SearchFilterModal.vue";
import DeviceFormModal from "../components/DeviceFormModal.vue";
import DeviceService from "../services/DeviceService";
import Headers from "../assets/data/DeviceHeaders";
export default {
  name: "Devices",
  components: {
    SearchFilterModal,
    DeviceFormModal,
  },
  data() {
    return {
      findFlagUrlByCountryName: findFlagUrlByCountryName,
      headers: Headers,
      devices: [],
      pageCount: 99999,
      page: 1,
      limit: 50,
      filters: {
        devices: [],
        countries: [],
        companies: [],
      },
      filterToggle: false,
      deviceFormToggle: false,
      selectedDevice: {},
      loading: false,
      serverResponse: "",
    };
  },
  methods: {
    toggle() {
      this.filterToggle = !this.filterToggle;
    },
    applyFilters(filters) {
      this.page = 1;
      this.filters = filters;
    },
    formatDateTime(d) {
      return new Date(d).toLocaleString();
    },
    openDeviceForm(device) {
      this.selectedDevice = device;
      this.deviceFormToggle = true;
    },
    updateSelectedDevice(device) {
      this.selectedDevice.country = device.country;
      this.selectedDevice.company = device.company;
    },
    async handleDelete(device, i) {
      const ok = await this.$root.$refs.confirmationDialogue.trigger({
        title: "Confirm Deletion",
        message:
          "Are you sure you want to delete this device and all its logs?",
        yesButton: "Confirm Deletion",
        noButton: "Cancel",
      });
      if (ok) {
        DeviceService.deleteDeviceByID(device.device_id)
          .then(() => {
            this.devices.splice(i, 1);
            this.$root.$refs.notifications.trigger({
              title: `Device Successfully Deleted`,
              message: `Device ${device.device_id} deleted from database`,
              color: "green",
              timeout: "5000",
            });
          })
          .catch((err) => {
            this.$root.$refs.notifications.trigger({
              title: `Device Deletion Failed`,
              message: `Failed to delete device ${device.device_id} from database`,
              color: "red",
              timeout: "5000",
            });
            console.log(err);
          });
      }
    },
    deleteFilter(type, index) {
      this.filters[type].splice(index, 1);
      this.updateDeviceList();
    },
    updateDeviceList() {
      this.devices = [];
      this.loading = true;
      this.serverResponse = "Fetching...";
      DeviceService.findDevicesByFilter({
        countries: this.filters.countries.map((c) => c.name),
        companies: this.filters.companies,
        device_ids: this.filters.devices.map((d) => d.device_id),
        page: this.page,
        limit: this.limit,
      })
        .then((res) => {
          this.devices = res.data.devices;
          if (this.page === 1) this.pageCount = res.data.pageCount;
          this.loading = false;
          this.serverResponse = "No devices to show";
        })
        .catch((err) => {
          this.loading = false;
          this.serverResponse = "Failed to fetch devices";
          console.log(err);
        });
    },
    getDevices(cursorNext) {
      if (cursorNext && this.page < this.pageCount) {
        this.page += 1;
        this.updateDeviceList();
      } else if (!cursorNext && this.page > 1) {
        this.page -= 1;
        this.updateDeviceList();
      }
    },
  },
  mounted() {
    this.updateDeviceList();
    // this.loading = true;
    // this.serverResponse = "Fetching...";
    // DeviceService.getAllDevices({page: this.page, limit: this.limit})
    //   .then((res) => {
    //     this.devices = res.data.devices;
    //     this.loading = true;
    //     this.serverResponse = "No devices to show";
    //   })
    //   .catch((err) => {
    //     this.serverResponse = "Failed to fetch devices";
    //     console.log(err);
    //   });
  },
  watch: {
    filters: function () {
      this.updateDeviceList();
    },
  },
};
</script>

<style scoped>
</style>
