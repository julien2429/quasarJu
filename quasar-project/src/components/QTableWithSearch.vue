<template>
  <q-table
    bordered
    style="height: 100%"
    :title="props.title"
    :columns="columns"
    :rows="filteredRows"
    :loading="props.loading"
    separator="cell"
    class="my-sticky-virtscroll-table"
  >
    <template v-slot:header="slotProps">
      <q-tr :props="slotProps">
        <q-th
          style="padding-inline: 1em"
          v-for="col in slotProps.cols"
          :key="col.name"
          :props="slotProps"
        >
          <q-btn
            @click.stop
            flat
            dense
            :style="
              filter[col.name]
                ? 'background-color: #D3D3D3'
                : 'background-color: #ffffff'
            "
            ><q-icon size="sm" name="search"></q-icon>
            <q-menu>
              <q-input
                style="padding-inline: 1em"
                dense
                v-model="filter[col.name]"
                @click.stop
              >
              </q-input>
            </q-menu>
          </q-btn>
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
const props = defineProps(["title", "rows", "loading"]);
const filter = reactive({});

const columns = computed(() => {
  const cols = [];
  for (const key in props.rows[0]) {
    cols.push({
      name: key,
      label: key,
      field: key,
      align: "start",
      sortable: true,
    });
  }
  return cols;
});

const toShow = reactive({});
const filteredRows = computed(() =>
  props.rows.filter((row) => {
    var state = true;
    for (const key in row) {
      if (typeof row[key] === "number")
        state =
          state &&
          (filter[key] === "" ||
            filter[key] === undefined ||
            row[key].toString().includes(filter[key]));
      else
        state =
          state &&
          (filter[key] === "" ||
            filter[key] === undefined ||
            row[key].toLowerCase().includes(filter[key].toLowerCase()));
    }
    return state;
  }),
);
</script>

<style scoped>
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.my-sticky-virtscroll-table :deep(.child) {
  /* height or max-height is important */
  height: calc(100vh - 150px);
}

thead tr:first-child th {
  background-color: #fff;
}

thead tr th {
  position: sticky;
  z-index: 1;
}

thead tr:last-child th {
  top: 48px;
}

thead tr:first-child th {
  top: 0;
}
.rowFlex {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
