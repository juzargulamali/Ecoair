<template>
  <div class="flex flex-col items-center mt-9 px-2 sm:px-0">
    <SearchFilterModal
      v-show="filterToggle"
      :toggle="toggle"
      :applyFilters="applyFilters"
    />
    <div
      class="flex flex-wrap justify-between sm:w-9/12 w-full rounded-md gap-2"
    >
      <div class="text-3xl flex flex-wrap gap-3">
        <span>Logs</span>

        <button
          @click="updateLogList"
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
          @click="toggle"
          class="border border-gray-500 p-2 rounded-md text-gray-500 font-semibold opacity-80 hover:opacity-100 focus:outline-none"
        >
          <font-awesome-icon icon="filter" class="mr-2"> </font-awesome-icon>
          <span>Filter Logs</span>
        </button>
        <button
          v-if="!filtersIsEmpty()"
          @click="handleDelete"
          class="border border-red-500 p-2 rounded-md text-red-500 text-sm font-semibold opacity-80 hover:opacity-100 focus:outline-none"
        >
          <font-awesome-icon icon="trash" class="mr-2"> </font-awesome-icon>
          <span>Delete Filtered Logs</span>
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
        class="group text-blue-500 border border-blue-500 rounded-md p-2 flex items-center"
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
        class="group text-blue-500 border border-blue-500 rounded-md p-2 flex items-center"
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
          class="flex flex-row overflow-x-auto rounded-lg shadow-lg"
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
            </thead>
            <tbody>
              <tr
                class="odd:bg-gray-200 even:bg-gray-50 border-b border-l-2 border-r border-gray-300"
                v-for="(row, i) in logs"
                :key="i"
              >
                <td
                  v-for="(j, head) in headers"
                  :key="j"
                  class="px-3 py-3 text-gray-700 font-semibold"
                >
                  {{
                    head === "createdAt"
                      ? formatDateTime(row[head])
                      : head === "hours" || head === "reading"
                      ? row[head].toFixed(2)
                      : row[head]
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="logs.length === 0"
          class="opacity-50 text-center w-full px-3 py-3"
        >
          {{ serverResponse }}
        </div>
      </div>

      <div v-show="!loading" class="flex text-white justify-end space-x-5 pb-6">
        <button
          v-show="page > 1"
          class="text-gray-800 border border-gray-700 opacity-60 hover:opacity-100 focus:outline-none px-3 py-2 rounded"
          @click="getLogEntries(false)"
        >
          Previous
        </button>
        <button
          v-show="page < pageCount"
          class="text-gray-800 border border-gray-700 opacity-60 hover:opacity-100 focus:outline-none px-3 py-2 rounded"
          @click="getLogEntries(true)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { findFlagUrlByCountryName } from "country-flags-svg";
import SearchFilterModal from "../components/SearchFilterModal.vue";
import LogService from "../services/LogService";
import Headers from "../assets/data/LogHeaders";
export default {
  name: "Home",
  components: { SearchFilterModal },
  data() {
    return {
      findFlagUrlByCountryName: findFlagUrlByCountryName,
      headers: Headers,
      logs: [],
      pageCount: 9999,
      limit: 50,
      page: 1,
      filters: {
        devices: [],
        countries: [],
        companies: [],
      },
      filterToggle: false,
      loading: true,
      serverResponse: "",
    };
  },
  methods: {
    toggle() {
      this.filterToggle = !this.filterToggle;
    },
    applyFilters(filters) {
      this.page = 1;
      this.filters = { ...filters };
    },
    formatDateTime(d) {
      return new Date(d).toLocaleString();
    },
    deleteFilter(type, index) {
      this.page = 1;
      this.filters[type].splice(index, 1);
      this.updateLogList();
    },
    updateLogList() {
      this.logs = [];
      this.loading = true;
      this.serverResponse = "Fetching...";
      LogService.findLogEntriesByFilter({
        countries: this.filters.countries.map((c) => c.name),
        companies: this.filters.companies,
        device_ids: this.filters.devices.map((d) => d.device_id),
        page: this.page,
        limit: this.limit,
      })
        .then((res) => {
          this.logs = res.data.logEntries;
          if (this.page === 1) this.pageCount = res.data.pageCount;
          this.loading = false;
          this.serverResponse = "No logs to show";
        })
        .catch((err) => {
          this.loading = false;
          this.serverResponse = "Failed to fetch logs";
          console.log(err);
        });
    },
    filtersIsEmpty() {
      return (
        !this.filters.countries.length &&
        !this.filters.companies.length &&
        !this.filters.devices.length
      );
    },
    async handleDelete() {
      const ok = await this.$root.$refs.confirmationDialogue.trigger({
        title:
          "Are you sure you want to delete this all logs that match your filters?",
        message: `Filters:{
            countries:[${this.filters.countries.map((c) => c.name)}],
            companies:[${this.filters.companies}],
            device_ids:[${this.filters.devices.map((d) => d.device_id)}],
          }
          `,
        yesButton: "Confirm Deletion",
        noButton: "Cancel",
      });
      if (ok) {
        LogService.deleteLogsByFilters({
          countries: this.filters.countries.map((c) => c.name),
          companies: this.filters.companies,
          device_ids: this.filters.devices.map((d) => d.device_id),
        })
          .then(() => {
            this.updateLogList();
            this.$root.$refs.notifications.trigger({
              title: `Logs Successfully Deleted`,
              message: `Filtered logs successfully deleted from database`,
              color: "green",
              timeout: "5000",
            });
          })
          .catch((err) => {
            this.$root.$refs.notifications.trigger({
              title: `Logs Deletion Failed`,
              message: `Failed to delete filtered logs from database`,
              color: "red",
              timeout: "5000",
            });
            console.log(err);
          });
      }
    },
    getLogEntries(cursorNext) {
      if (cursorNext && this.page < this.pageCount) {
        this.page += 1;
        this.updateLogList();
      } else if (!cursorNext && this.page > 1) {
        this.page -= 1;
        this.updateLogList();
      }
    },
  },
  mounted() {
    this.updateLogList();
  },
  watch: {
    filters: function () {
      this.updateLogList();
    },
  },
};
</script>

<style scoped>
</style>
