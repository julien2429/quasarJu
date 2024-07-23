<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <q-page :style-fn="setQPagetoFull">
    <div class="full-height column">
      <div
        class="row height q-px-md q-py-md inline justify-between space full-width"
      >
        <q-btn :icon="mdiFilter" flat class="q-my-sm" label="Filter">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            style="width: 20rem"
          >
            <q-list>
              <q-item
                v-for="filter in filters"
                :key="filter.filterName"
                class="row justify-between items-center"
                style="width: 20rem"
                label="Type"
              >
                {{ filter.filterName }}:
                <q-select
                  filled
                  v-model="selectedFilters[filter.filterName]"
                  :options="filter.filterOptions"
                  style="width: 100%; max-width: 200px"
                  :label="filter.filterName"
                  multiple
                >
                  <template
                    v-slot:option="{ itemProps, opt, selected, toggleOption }"
                  >
                    <q-item v-bind="itemProps">
                      <q-item-section>
                        <q-item-label>{{ opt }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-checkbox
                          :model-value="selected"
                          @update:model-value="toggleOption(opt)"
                        ></q-checkbox>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <div class="width q-my-sm row inline-md">
          <q-input
            class="q-mr-sm"
            v-model="dateFrom"
            filled
            type="date"
            hint="Native date"
          />
          <q-input
            class="q-mr-sm"
            v-model="dateTo"
            filled
            type="date"
            hint="Native date"
          />
        </div>
      </div>
      <q-table
        separator="cell"
        bordered
        class="col shadow-0"
        :rows="filteredData"
        :loading="loading"
      />
    </div>
  </q-page>
</template>

<script setup>
import { mdiFilter } from "@quasar/extras/mdi-v6";
import { onMounted, reactive, ref, watch } from "vue";
let dateFrom = ref();
let dateTo = ref();
let selectedFilters = reactive({
  Type: [],
  EndPoint: [],
});
let loading = ref(false);
function setQPagetoFull(offset) {
  return { height: offset ? `calc(100vh - ${offset}px)` : "100vh" };
}

let filters = [
  {
    filterName: "type",
    filterOptions: ["Get", "Post", "Put", "Delete"],
  },
  {
    filterName: "endpoint",
    filterOptions: ["users", "products", "orders", "customers"],
  },
];

let filteredData = ref([]);
watch([dateFrom, dateTo, selectedFilters], () => {
  loading.value = true;

  filteredData.value = data.value.filter((item) => {
    let date = new Date(item.date);
    let fromDate = new Date(dateFrom.value);
    let toDate = new Date(dateTo.value);
    let isDate = true;
    if (dateFrom.value && dateTo.value) {
      isDate = date >= fromDate && date <= toDate;
    }

    let isFilter = true;

    for (let filter in selectedFilters) {
      console.log(filter, selectedFilters[filter]);
      if (selectedFilters[filter].length === 0) continue;
      let isField = false;
      for (let field in selectedFilters[filter]) {
        console.log(
          field,
          filter,
          item,
          item[filter],
          selectedFilters[filter][field],
        );
        isField = isField || item[filter] === selectedFilters[filter][field];
      }
      isFilter = isFilter && isField;
    }
    return isDate && isFilter;
  });

  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

onMounted(() => {
  filteredData.value = data.value;
});
let data = ref([
  {
    type: "Get",
    endpoint: "users",
    date: "2024-07-18",
    comments: "Fetches all users",
  },
  {
    type: "Post",
    endpoint: "products",
    date: "2024-07-17",
    comments: "Adds a new product",
  },
  {
    type: "Put",
    endpoint: "orders",
    date: "2024-07-16",
    comments: "Updates an order",
  },
  {
    type: "Delete",
    endpoint: "customers",
    date: "2024-07-15",
    comments: "Removes a customer",
  },
  {
    type: "Get",
    endpoint: "products",
    date: "2024-07-14",
    comments: "Fetches all products",
  },
  {
    type: "Post",
    endpoint: "orders",
    date: "2024-07-13",
    comments: "Creates a new order",
  },
  {
    type: "Put",
    endpoint: "users",
    date: "2024-07-12",
    comments: "Updates user details",
  },
  {
    type: "Delete",
    endpoint: "orders",
    date: "2024-07-11",
  },
  {
    type: "Get",
    endpoint: "customers",
    date: "2024-07-10",
    comments: "Fetches all customers",
  },
  {
    type: "Post",
    endpoint: "users",
    date: "2024-07-09",
    comments: "Registers a new user",
  },
  {
    type: "Put",
    endpoint: "products",
    date: "2024-07-08",
    comments: "Updates product details",
  },
  {
    type: "Delete",
    endpoint: "users",
    date: "2024-07-07",
    comments: "Deletes a user",
  },
]);
</script>

<style scoped>
.my-sticky-virtscroll-table :deep(.child) {
  /* height or max-height is important */
  height: calc(100vh - 150px);
}
</style>
