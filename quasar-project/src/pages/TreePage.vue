<template>
  <q-page>
    <div style="height: 95vh">
      <!-- left splitter -->
      <q-splitter v-model="splitterModel" style="height: 100%">
        <template v-slot:before>
        <q-table-with-search
            title="Pacients"
            :rows="pacientsFetched"
            
            :loading="loading1"
            :pagination="pagination"
            @row-click="
              (evt, row, index) => {
                selectedPacient = row.PacientID;
                fetchStudies();
              }
            "
          />
        </template>

        <template v-slot:after>
          <q-splitter v-model="insideModel" horizontal>
            <!-- right up splitter -->
            <template v-slot:before>
              <q-table-with-search
              title="Studies"
              :rows="filteredStudies"
              :loading="loading2"
              :pagination="pagination"
              @row-click="
                (evt, row, index) => {
                  selectedStudy = row.StudyID;
                  fetchDetails();
                }
              "
            />
            </template>
            <!-- right down splitter -->
            <template v-slot:after>
              <q-table-with-search
              title="Details"
              :rows="filteredDetails"
              :loading="loading3"
              :pagination="pagination"
             
            />
            </template>
          </q-splitter>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup>
import QTableWithSearch from "src/components/QTableWithSearch.vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
const splitterModel = ref(50); // start at 50%
const insideModel = ref(50); // start at 50%
const filter = reactive({
  PacientID: "",
  name: "",
  age: "",
  sex: "",
  address: "",
});

pagination: ref({
  rowsPerPage: 1000,
});
const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const selectedPacient = ref(null);
const selectedStudy = ref(null);



const filteredStudies = ref([]);


const filteredDetails = ref([]);

watch(
  () => selectedPacient.value,
  () => {
    selectedStudy.value = null;
  },
);

const pacientsFetched = ref([]);
const pacients = [
  {
    PacientID: 1,
    name: "John Doe",
    age: 45,
    sex: "Male",
    address: "123 Elm Street, Springfield, IL"
  },
  {
    PacientID: 2,
    name: "Jane Smith",
    age: 30,
    sex: "Female",
    address: "456 Maple Avenue, Springfield, IL"
  },
  {
    PacientID: 3,
    name: "Alice Johnson",
    age: 38,
    sex: "Female",
    address: "789 Oak Boulevard, Springfield, IL"
  },
  {
    PacientID: 4,
    name: "Michael Brown",
    age: 50,
    sex: "Male",
    address: "321 Pine Road, Springfield, IL"
  },
  {
    PacientID: 5,
    name: "Emma Wilson",
    age: 28,
    sex: "Female",
    address: "654 Birch Lane, Springfield, IL"
  },
  {
    PacientID: 6,
    name: "James White",
    age: 35,
    sex: "Male",
    address: "987 Cedar Street, Springfield, IL"
  },
  {
    PacientID: 7,
    name: "Olivia Martin",
    age: 40,
    sex: "Female",
    address: "432 Spruce Avenue, Springfield, IL"
  },
  {
    PacientID: 8,
    name: "Liam Garcia",
    age: 33,
    sex: "Male",
    address: "876 Walnut Drive, Springfield, IL"
  },
  {
    PacientID: 9,
    name: "Sophia Martinez",
    age: 29,
    sex: "Female",
    address: "543 Hickory Street, Springfield, IL"
  },
  {
    PacientID: 10,
    name: "William Rodriguez",
    age: 42,
    sex: "Male",
    address: "210 Redwood Road, Springfield, IL"
  }
];

const studies = [
  {
    StudyID: 101,
    PacientID: 1,
    Date: "2023-05-01",
    State: "Completed"
  },
  {
    StudyID: 102,
    PacientID: 2,
    Date: "2023-06-15",
    State: "In Progress"
  },
  {
    StudyID: 103,
    PacientID: 3,
    Date: "2023-07-20",
    State: "Scheduled"
  },
  {
    StudyID: 104,
    PacientID: 4,
    Date: "2023-08-05",
    State: "Completed"
  },
  {
    StudyID: 105,
    PacientID: 5,
    Date: "2023-09-10",
    State: "In Progress"
  },
  {
    StudyID: 106,
    PacientID: 6,
    Date: "2023-10-12",
    State: "Scheduled"
  },
  {
    StudyID: 107,
    PacientID: 7,
    Date: "2023-11-18",
    State: "Completed"
  },
  {
    StudyID: 108,
    PacientID: 8,
    Date: "2023-12-22",
    State: "In Progress"
  },
  {
    StudyID: 109,
    PacientID: 9,
    Date: "2024-01-15",
    State: "Scheduled"
  },
  {
    StudyID: 110,
    PacientID: 10,
    Date: "2024-02-10",
    State: "Completed"
  }
];

const details = [
  {
    DetailsID: 1001,
    StudyID: 101,
    Description: "Blood test for cholesterol levels."
  },
  {
    DetailsID: 1002,
    StudyID: 102,
    Description: "MRI scan for brain analysis."
  },
  {
    DetailsID: 1003,
    StudyID: 103,
    Description: "X-ray for chest examination."
  },
  {
    DetailsID: 1004,
    StudyID: 104,
    Description: "CT scan for abdominal pain."
  },
  {
    DetailsID: 1005,
    StudyID: 105,
    Description: "Ultrasound for pregnancy check."
  },
  {
    DetailsID: 1006,
    StudyID: 106,
    Description: "EKG for heart rate monitoring."
  },
  {
    DetailsID: 1007,
    StudyID: 107,
    Description: "Blood pressure test."
  },
  {
    DetailsID: 1008,
    StudyID: 108,
    Description: "Eye examination."
  },
  {
    DetailsID: 1009,
    StudyID: 109,
    Description: "Hearing test."
  },
  {
    DetailsID: 1010,
    StudyID: 110,
    Description: "Lung function test."
  }
];
onMounted(() => {
  fetchPatients();
});
function fetchPatients() {
  loading1.value = true;
  setTimeout(() => {
    pacientsFetched.value = pacients;
    loading1.value = false;
  }, 1000);
}

function fetchStudies() {
  loading2.value = true;
  setTimeout(() => {
    filteredStudies.value = studies.filter((study) => study.PacientID === selectedPacient.value);
    loading2.value = false;
  }, 1000);
}
function fetchDetails() {
  loading3.value = true;
  setTimeout(() => {
    filteredDetails.value=details.filter((detail) => detail.StudyID === selectedStudy.value),
    loading3.value = false;
  }, 1000);
}
// const columns1 =[]

// const columns1 = [
//   {
//     name: "PacientID",
//     label: "PacientID",
//     field: "PacientID",
//     align: "start",
//     sortable: true,
//   },
//   {
//     name: "name",
//     label: "Name",
//     align: "start",
//     field: "name",
//     sortable: true,
//   },
//   {
//     name: "age",
//     label: "Age",
//     align: "start",
//     field: "age",
//     sortable: true,
//   },
//   {
//     name: "sex",
//     label: "Sex ",
//     align: "start",
//     field: "sex",
//     sortable: true,
//   },
//   {
//     name: "address",
//     label: "Address",
//     align: "start",
//     field: "address",
//     sortable: true,
//   },
// ];

defineOptions({
  name: "IndexPage",
});
</script>
