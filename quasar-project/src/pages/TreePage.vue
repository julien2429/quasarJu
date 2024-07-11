<template>
  <q-page>

      <div style="height: 95vh;">
        <!-- left splitter -->
        <q-splitter v-model="splitterModel" style="height: 100%;" >
          <template v-slot:before>
            <!-- <div class="q-pa-md" style="display: flex; flex-direction: column;">
          <div class="text-h4 q-mb-md">Node 0</div>
          <q-btn @click="selectedPacient=pacient.PacientID" v-for="pacient in pacients" :key="pacient.PacientID" class="" :label="pacientRow(pacient)" color="black" > </q-btn>
        </div> -->

            <q-table
            style="height: 100%;"
              class="my-sticky-dynamic"
              flat
              bordered
              title="Pacients"
              :rows="filteredPacients"
              :columns="columns1"
              :loading="loading1"
              row-key="PacientID"
              virtual-scroll
              :virtual-scroll-item-size="48"
              :virtual-scroll-sticky-size-start="48"
              :pagination="pagination"
              :rows-per-page-options="[0]"
              @virtual-scroll="onScroll"
              @row-click="
                (evt, row, index) => {
                  selectedPacient = row.PacientID;
                }
              "
            >
              <template v-slot:top-right>
                <q-input
                  borderless
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Search"
                >
                  <template v-slot:append>
                    <q-icon name="search"></q-icon>
                  </template>
                </q-input>
              </template>
            </q-table>
          </template>

          <template v-slot:after>
            <q-splitter v-model="insideModel" horizontal>
              <!-- right up splitter -->
              <template v-slot:before>
                <!-- <div class="q-pa-md" style="display: flex; flex-direction: column;">
            <div class="text-h4 q-mb-md">Node 1</div>
            <q-btn @click="selectedStudy=filteredStudy.StudyID" v-for="filteredStudy in filteredStudies" :key="filteredStudy.StudyID" class="" :label="studyRow(filteredStudy)" color="black" > </q-btn>
            </div> -->

                <q-table
                style="height: 100%;"
                  class="my-sticky-dynamic"
                  flat
                  bordered
                  title="Studies"
                  :rows="filteredStudies"
                  :loading="loading2"
                  row-key="StudyID"
                  virtual-scroll
                  :virtual-scroll-item-size="48"
                  :virtual-scroll-sticky-size-start="48"
                  :pagination="pagination"
                  :rows-per-page-options="[0]"
                  @virtual-scroll="onScroll"
                  @row-click="
                    (evt, row, index) => {
                      selectedStudy = row.StudyID;
                    }
                  "
                ></q-table>
              </template>
              <!-- right down splitter -->
              <template v-slot:after>
                <!-- <div class="q-pa-md" style="display: flex; flex-direction: column;">
            <div class="text-h4 q-mb-md">Node 2</div>
            <q-btn  v-for="filteredDetail in filteredDetails" :key="filteredDetail.DetailsID" class="" :label="detailsRow(filteredDetail)" color="black" > </q-btn>
          </div> -->

                <q-table
                style="height: 100%;"
                  class="my-sticky-dynamic"
                  flat
                  bordered
                  title="Studies"
                  :rows="filteredDetails"
                  :loading="loading3"
                  row-key="DetailsID"
                  virtual-scroll
                  :virtual-scroll-item-size="48"
                  :virtual-scroll-sticky-size-start="48"
                  :pagination="pagination"
                  :rows-per-page-options="[0]"
                  @virtual-scroll="onScroll"
                ></q-table>
              </template>
            </q-splitter>
          </template>
        </q-splitter>
      </div>
   
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from "vue";
const splitterModel = ref(50); // start at 50%
const insideModel = ref(50); // start at 50%
const filter = ref("");
pagination: ref({
  rowsPerPage: 1000,
});
const loading1 = ref(false);


const selectedPacient = ref(null);
const selectedStudy = ref(null);

const filteredPacients = computed(() =>
  pacients.filter(
    (pacient) =>
      pacient.name.toLowerCase().includes(filter.value) || filter.value === "",
  ),
);

const filteredStudies = computed(() =>
  studies.filter((study) => study.PacientID === selectedPacient.value),
);

const filteredDetails = computed(() =>
  details.filter((detail) => detail.StudyID === selectedStudy.value),
);

watch(
  () => selectedPacient.value,
  () => {
    selectedStudy.value = null;
  },
);

watch(
  () => selectedStudy.value,
  () => {
    console.log(selectedStudy.value);
    console.log(filteredDetails);
    console.log(filteredDetails.value);
  },
);

const pacients = [
  {
    PacientID: 1,
    name: "John Doe",
    age: 45,
    sex: "Male",
    address: "123 Elm Street, Springfield, IL",
  },
  {
    PacientID: 2,
    name: "Jane Smith",
    age: 30,
    sex: "Female",
    address: "456 Maple Avenue, Springfield, IL",
  },
  {
    PacientID: 3,
    name: "Alice Johnson",
    age: 38,
    sex: "Female",
    address: "789 Oak Boulevard, Springfield, IL",
  },
];
const studies = [
  {
    StudyID: 101,
    PacientID: 1,
    Date: "2023-05-01",
    State: "Completed",
  },
  {
    StudyID: 412,
    PacientID: 1,
    Date: "2023-05-01",
    State: "Completed",
  },
  {
    StudyID: 102,
    PacientID: 2,
    Date: "2023-06-15",
    State: "In Progress",
  },
  {
    StudyID: 103,
    PacientID: 3,
    Date: "2023-07-20",
    State: "Scheduled",
  },
];

const details = [
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels.",
  },
  {
    DetailsID: 1002,
    StudyID: 102,
    Description: "MRI scan for brain analysis.",
  },
  {
    DetailsID: 1003,
    StudyID: 103,
    Description: "X-ray for chest examination.",
  },
];

const columns1 = [
  { name: "PacientID", label: "PacientID", field: "PacientID", sortable: true },
  {
    name: "name",
    label: "Name",
    align: "center",
    field: "name",
    sortable: true,
  },
  { name: "age", label: "Age", align: "center", field: "age", sortable: true },
  { name: "sex", label: "Sex ", align: "center", field: "sex", sortable: true },
  {
    name: "address",
    label: "Address",
    align: "center",
    field: "address",
    sortable: true,
  },
];

defineOptions({
  name: "IndexPage",
});
</script>
