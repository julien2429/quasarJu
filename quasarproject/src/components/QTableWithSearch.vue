<template>
  <q-table
    bordered
    :title="props.title"
    :columns="columns"
    :rows="filteredRows"
    :loading="props.loading"
    separator="cell"
    virtual-scroll
    v-model:pagination="pagination"
    :rows-per-page-options="[0]"
    class="full-height"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          style="cursor: pointer"
          v-for="col in columns"
          :key="col.name"
          :props="props"
          @click="onRowClick(props.row)"
        >
          <div
            @click.stop
            v-if="isEditable && rowContains(editableRows, col.name)"
          >
            {{ props.row[col.name] }}
            <q-popup-edit
              v-model="props.row[col.name]"
              title="Update"
              buttons
              persistent
              v-slot="scope"
            >
              <q-input
                v-model="scope.value"
                autofocus
                hint="Use buttons to close"
              ></q-input>
            </q-popup-edit>
          </div>

          <div v-else>
            {{ props.row[col.name] }}
          </div>
        </q-td>
      </q-tr>
    </template>
    <template v-slot:header="slotProps">
      <q-tr :props="slotProps">
        <q-th
          style="padding-inline: 1em; background-color: #dadada"
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
                ? 'background-color: #A7A7A7'
                : 'background-color: #dadada'
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
import { computed, onMounted, reactive, ref } from "vue";
const emit = defineEmits(["onRowClick"]);
let pagination = ref({
  rowsPerPage: 0,
});
function onRowClick(row) {
  emit("onRowClick", row);
}

const props = defineProps([
  "title",
  "rows",
  "loading",
  "excludedColumns",
  "isEditable",
  "editableRows",
]);

const filter = reactive({});
const editableRows = props.editableRows;
const isEditable = props.isEditable;
const columns = computed(() => {
  const cols = [];
  for (const key in props.rows[0]) {
    if (
      props.excludedColumns !== undefined &&
      props.excludedColumns.includes(key)
    )
      continue;
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

function rowContains(row, key) {
  for (const r of row) {
    if (r === key) return true;
  }
  return false;
}
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
