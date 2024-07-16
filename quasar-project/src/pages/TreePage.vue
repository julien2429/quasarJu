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
import { onMounted, ref, watch } from "vue";
const splitterModel = ref(50); // start at 50%
const insideModel = ref(50); // start at 50%

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

var pacientsFetched =[]
const pacients =  [
    {
      "DcmPatientId": 29120343,
      "DcmPatientName": "Britney",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "Gcytc0I74wQK8Po",
      "MobilePhone": "790-952-9196 x56637",
      "Email": [
        "Robbie22@gmail.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "International",
      "DateAdded": "2023-06-27T23:54:11.237Z",
      "DateModified": "1972-08-30T13:57:45.997Z"
    },
    {
      "DcmPatientId": 32819826,
      "DcmPatientName": "Selina",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "VWdMtorEUs7w3TB",
      "MobilePhone": "455-271-9098",
      "Email": [
        "Kurtis_Macejkovic@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Product",
      "DateAdded": "1971-07-21T23:41:42.041Z",
      "DateModified": "1972-11-05T13:26:57.437Z"
    },
    {
      "DcmPatientId": 32610820,
      "DcmPatientName": "Roslyn",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "POJe5Fr3uT72sif",
      "MobilePhone": "(859) 267-7306 x689",
      "Email": [
        "Clifford.Jakubowski51@gmail.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Future",
      "DateAdded": "1976-08-03T08:41:34.390Z",
      "DateModified": "1971-04-07T16:19:41.736Z"
    },
    {
      "DcmPatientId": 25792022,
      "DcmPatientName": "Ova",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "p8BSCYSe4xF62w0",
      "MobilePhone": "855-780-6342",
      "Email": [
        "Miller_Nolan58@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Dynamic",
      "DateAdded": "1977-04-24T06:47:56.451Z",
      "DateModified": "1978-11-28T08:26:55.755Z"
    },
    {
      "DcmPatientId": 23392414,
      "DcmPatientName": "Gunnar",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "3RaQOnN8ErsorW0",
      "MobilePhone": "(954) 825-0476",
      "Email": [
        "Violet.Dooley@example.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Direct",
      "DateAdded": "1972-01-29T16:35:15.628Z",
      "DateModified": "1979-01-22T21:54:10.288Z"
    },
    {
      "DcmPatientId": 18380981,
      "DcmPatientName": "Rey",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "wGqOeYgzSQO4jez",
      "MobilePhone": "1-853-516-5076 x926",
      "Email": [
        "Keagan_Berge64@gmail.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Forward",
      "DateAdded": "2006-03-21T02:48:29.045Z",
      "DateModified": "1999-10-15T21:53:04.673Z"
    },
    {
      "DcmPatientId": 19009725,
      "DcmPatientName": "Frances",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "gaa9gdnCtVzoI0W",
      "MobilePhone": "(636) 948-7902 x7030",
      "Email": [
        "Marietta_Stiedemann39@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Forward",
      "DateAdded": "2020-12-04T20:29:03.967Z",
      "DateModified": "2014-06-20T06:47:40.452Z"
    },
    {
      "DcmPatientId": 26715827,
      "DcmPatientName": "Prince",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "T9Xxv7KISb_9nrO",
      "MobilePhone": "577.873.2681 x8511",
      "Email": [
        "Anibal71@example.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "International",
      "DateAdded": "2001-06-05T14:20:45.849Z",
      "DateModified": "1989-11-27T01:08:21.732Z"
    },
    {
      "DcmPatientId": 23778384,
      "DcmPatientName": "Karine",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "AVUAGLFj9Shtsl4",
      "MobilePhone": "738-900-7606 x854",
      "Email": [
        "Lenna_Hoeger32@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Central",
      "DateAdded": "1992-12-16T23:34:19.141Z",
      "DateModified": "1972-01-14T14:50:41.676Z"
    },
    {
      "DcmPatientId": 27084464,
      "DcmPatientName": "Trinity",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "MJp6tHebdctxFG0",
      "MobilePhone": "1-465-489-0062 x6621",
      "Email": [
        "Darian_Turcotte@gmail.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Senior",
      "DateAdded": "1977-06-04T12:11:08.302Z",
      "DateModified": "1979-02-17T14:11:48.960Z"
    },
    {
      "DcmPatientId": 19089459,
      "DcmPatientName": "Melissa",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "Wj8ZnkqZlCDQs84",
      "MobilePhone": "(578) 601-8337 x46638",
      "Email": [
        "Magnolia.OKeefe60@gmail.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Central",
      "DateAdded": "1970-06-22T16:11:30.227Z",
      "DateModified": "1979-08-29T20:02:18.488Z"
    },
    {
      "DcmPatientId": 26079545,
      "DcmPatientName": "Jordon",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "A49baGeNzjZRBZn",
      "MobilePhone": "968-619-3690 x2344",
      "Email": [
        "Madyson3@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Forward",
      "DateAdded": "1978-01-28T10:25:53.369Z",
      "DateModified": "1984-08-08T04:08:05.418Z"
    },
    {
      "DcmPatientId": 21772190,
      "DcmPatientName": "Amelie",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "64wwNaGNX9PvWiR",
      "MobilePhone": "(877) 393-8975 x77341",
      "Email": [
        "Alessia98@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "International",
      "DateAdded": "2024-02-05T09:07:27.880Z",
      "DateModified": "1977-02-14T00:11:39.974Z"
    },
    {
      "DcmPatientId": 32785867,
      "DcmPatientName": "Bulah",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "xfr7iiPzHdXb4EW",
      "MobilePhone": "761-781-4001 x216",
      "Email": [
        "Filomena.Mosciski@gmail.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Dynamic",
      "DateAdded": "1999-11-13T14:10:55.087Z",
      "DateModified": "2005-07-04T08:54:30.872Z"
    },
    {
      "DcmPatientId": 15885867,
      "DcmPatientName": "Jarod",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "OFWG8LCF85oDPvc",
      "MobilePhone": "1-226-466-6182",
      "Email": [
        "Gabriella.Kunde-Stroman@example.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "International",
      "DateAdded": "1974-06-20T03:33:26.288Z",
      "DateModified": "1985-02-22T23:08:02.562Z"
    },
    {
      "DcmPatientId": 16285619,
      "DcmPatientName": "Deja",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "71XaI9rKSi0ZKtd",
      "MobilePhone": "597.279.1350 x03673",
      "Email": [
        "Johnathan96@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Senior",
      "DateAdded": "1972-09-21T07:49:34.039Z",
      "DateModified": "1970-12-12T15:24:23.287Z"
    },
    {
      "DcmPatientId": 22125126,
      "DcmPatientName": "Kip",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "A39YoQep19ifEuk",
      "MobilePhone": "(552) 242-4983",
      "Email": [
        "Sydni71@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Future",
      "DateAdded": "1996-11-23T23:16:34.156Z",
      "DateModified": "2016-07-25T03:27:13.598Z"
    },
    {
      "DcmPatientId": 30863243,
      "DcmPatientName": "Zita",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "_tSZLB62L808DZx",
      "MobilePhone": "1-442-653-1613 x94609",
      "Email": [
        "Darian.Walter@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Direct",
      "DateAdded": "1988-09-08T04:24:46.471Z",
      "DateModified": "1993-07-12T23:37:24.553Z"
    },
    {
      "DcmPatientId": 15332059,
      "DcmPatientName": "Everette",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "vwUKebv3pxJZGib",
      "MobilePhone": "783-918-2917 x1225",
      "Email": [
        "Elissa.Murazik91@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Direct",
      "DateAdded": "1997-06-27T07:15:57.255Z",
      "DateModified": "2010-10-06T10:50:33.119Z"
    },
    {
      "DcmPatientId": 22037964,
      "DcmPatientName": "Devon",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "kzip7Z4Ki5tNfSJ",
      "MobilePhone": "407.606.5799 x244",
      "Email": [
        "Vivienne_Lemke61@example.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Dynamic",
      "DateAdded": "1999-11-23T23:16:28.009Z",
      "DateModified": "2007-05-08T21:36:49.710Z"
    },
    {
      "DcmPatientId": 30083676,
      "DcmPatientName": "Brandon",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "FXJy2VKedZwkIpV",
      "MobilePhone": "673-918-9994",
      "Email": [
        "Yazmin_OHara@gmail.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Chief",
      "DateAdded": "2022-07-31T20:53:55.368Z",
      "DateModified": "1996-08-24T12:33:43.687Z"
    },
    {
      "DcmPatientId": 30742604,
      "DcmPatientName": "Kenny",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "wfi1mzsn5xX_oBR",
      "MobilePhone": "354.606.1068",
      "Email": [
        "Price_Frami@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "District",
      "DateAdded": "2023-07-13T21:20:26.743Z",
      "DateModified": "2018-03-16T12:48:59.954Z"
    },
    {
      "DcmPatientId": 30553761,
      "DcmPatientName": "Isaiah",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "RUr0YX7B2zQbGwh",
      "MobilePhone": "360-694-9554 x86593",
      "Email": [
        "Oda.Hauck-Schmidt@gmail.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Future",
      "DateAdded": "1988-01-19T23:27:56.308Z",
      "DateModified": "1972-07-03T09:52:15.440Z"
    },
    {
      "DcmPatientId": 25977682,
      "DcmPatientName": "Patsy",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "WBRsRKJwsVtYLFI",
      "MobilePhone": "290-446-9492 x0574",
      "Email": [
        "Madyson.Lang@gmail.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Product",
      "DateAdded": "1988-05-29T19:24:14.706Z",
      "DateModified": "1999-10-16T00:34:48.649Z"
    },
    {
      "DcmPatientId": 17466118,
      "DcmPatientName": "Gregg",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "ONVfsLk1njXQ86O",
      "MobilePhone": "(770) 652-8001 x3377",
      "Email": [
        "Kelton.Gleason57@gmail.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Principal",
      "DateAdded": "2018-10-30T03:12:34.629Z",
      "DateModified": "2023-05-21T22:50:01.095Z"
    },
    {
      "DcmPatientId": 32949910,
      "DcmPatientName": "Brittany",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "oCGeX2m7OQDdHwS",
      "MobilePhone": "957.613.4697 x8143",
      "Email": [
        "Onie31@gmail.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Internal",
      "DateAdded": "2003-02-17T19:22:28.561Z",
      "DateModified": "2002-01-11T09:10:20.816Z"
    },
    {
      "DcmPatientId": 23819179,
      "DcmPatientName": "Nicklaus",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "Ra0PwYvoJsGbnrQ",
      "MobilePhone": "(263) 727-6239 x653",
      "Email": [
        "Enola_Kilback36@gmail.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Human",
      "DateAdded": "1999-01-04T07:23:01.410Z",
      "DateModified": "1972-08-11T18:31:05.758Z"
    },
    {
      "DcmPatientId": 30316493,
      "DcmPatientName": "Theresia",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "voESGrZfFmIT3fj",
      "MobilePhone": "653-906-2152 x40402",
      "Email": [
        "Bulah.Hoppe@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Investor",
      "DateAdded": "1983-07-11T17:13:51.092Z",
      "DateModified": "2007-01-15T15:26:56.569Z"
    },
    {
      "DcmPatientId": 19523791,
      "DcmPatientName": "Kattie",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "224U5V59zpJOuwu",
      "MobilePhone": "1-567-776-0301 x0593",
      "Email": [
        "Bella62@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "National",
      "DateAdded": "1998-03-17T01:10:13.277Z",
      "DateModified": "1992-02-12T22:44:35.408Z"
    },
    {
      "DcmPatientId": 26011521,
      "DcmPatientName": "Julie",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "ED7MjGnJbbfCsvt",
      "MobilePhone": "293-543-1146",
      "Email": [
        "Arden.Sporer56@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Direct",
      "DateAdded": "1989-07-27T12:45:11.838Z",
      "DateModified": "2011-04-07T10:13:31.429Z"
    },
    {
      "DcmPatientId": 30359078,
      "DcmPatientName": "Skyla",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "LoyUM_nyokmz12L",
      "MobilePhone": "295-370-3058",
      "Email": [
        "Ken_Bechtelar39@gmail.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Corporate",
      "DateAdded": "2009-03-22T14:19:13.099Z",
      "DateModified": "1990-12-25T08:10:31.042Z"
    },
    {
      "DcmPatientId": 28752232,
      "DcmPatientName": "Dwight",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "LCEj43hFjXl_jxC",
      "MobilePhone": "657.872.8315 x04363",
      "Email": [
        "Angel54@gmail.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Dynamic",
      "DateAdded": "1971-11-01T21:00:37.288Z",
      "DateModified": "2002-09-16T06:41:50.831Z"
    },
    {
      "DcmPatientId": 13418885,
      "DcmPatientName": "Eliseo",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "FFKFRNflANFSZUM",
      "MobilePhone": "(945) 919-3903 x720",
      "Email": [
        "Dena.Collins87@example.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Global",
      "DateAdded": "2022-04-01T22:52:06.377Z",
      "DateModified": "2018-04-18T06:11:43.477Z"
    },
    {
      "DcmPatientId": 21958386,
      "DcmPatientName": "London",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "CtSJe20p3Ccs9hq",
      "MobilePhone": "508-847-0718",
      "Email": [
        "Vincenza_Batz@example.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Human",
      "DateAdded": "2024-02-10T12:06:01.337Z",
      "DateModified": "1995-01-21T11:59:51.839Z"
    },
    {
      "DcmPatientId": 22783528,
      "DcmPatientName": "Alexandrine",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "m9K3KZpwP2VnLyy",
      "MobilePhone": "474.255.3693 x6212",
      "Email": [
        "Doug.Rolfson@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Product",
      "DateAdded": "2021-01-12T07:30:43.788Z",
      "DateModified": "2006-10-15T08:09:06.940Z"
    },
    {
      "DcmPatientId": 24725384,
      "DcmPatientName": "Sonia",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "8S2_78fHUmoSYPv",
      "MobilePhone": "559.412.5275",
      "Email": [
        "Euna96@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "District",
      "DateAdded": "1995-10-28T20:39:30.045Z",
      "DateModified": "2021-12-04T03:36:42.842Z"
    },
    {
      "DcmPatientId": 26739249,
      "DcmPatientName": "Maxie",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "DnAuc0PCuLLUW5G",
      "MobilePhone": "1-743-439-8875",
      "Email": [
        "Mazie_Prosacco12@example.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Global",
      "DateAdded": "2003-05-14T11:28:34.562Z",
      "DateModified": "1987-06-14T20:20:35.941Z"
    },
    {
      "DcmPatientId": 19419629,
      "DcmPatientName": "Jaquan",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "ZuhacJu5I1ZC1za",
      "MobilePhone": "921.422.0221 x63414",
      "Email": [
        "Laurianne_Dicki91@example.com"
      ],
      "DcmEthnicGroup": "Asian",
      "DcmPatientComments": "Lead",
      "DateAdded": "2001-11-06T20:02:25.942Z",
      "DateModified": "1997-02-08T16:21:55.761Z"
    },
    {
      "DcmPatientId": 14533055,
      "DcmPatientName": "Erin",
      "DcmPatientPatientSex": "Female",
      "DcmPatientPatientDoB": "My0RxJ9CtJ1dL3O",
      "MobilePhone": "398-801-8083",
      "Email": [
        "Kelsie56@gmail.com"
      ],
      "DcmEthnicGroup": "African",
      "DcmPatientComments": "Dynamic",
      "DateAdded": "2006-10-01T18:28:29.230Z",
      "DateModified": "2000-09-05T20:54:09.524Z"
    },
    {
      "DcmPatientId": 24237402,
      "DcmPatientName": "Nettie",
      "DcmPatientPatientSex": "Male",
      "DcmPatientPatientDoB": "LK_xs08lREowIXo",
      "MobilePhone": "(931) 546-9865 x21001",
      "Email": [
        "Anabelle.Schneider@gmail.com"
      ],
      "DcmEthnicGroup": "Caucasian",
      "DcmPatientComments": "Central",
      "DateAdded": "1974-03-13T00:56:02.928Z",
      "DateModified": "1978-12-02T21:41:45.254Z"
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

async function fetchPatients() {
  loading1.value = true;
  console.log("fetching pacients...");
  await setTimeout(() => {
    pacientsFetched = pacients;
    loading1.value = false;
  }, 1000);
  console.log("pacients fetched...");
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
defineOptions({
  name: "IndexPage",
});
</script>
