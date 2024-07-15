<template>
  <q-card class="bg-primary text-white">
    <q-card-section>
      <q-card-title>
        <q-icon name="settings" />
        Settings
      </q-card-title>
    </q-card-section>
    <q-card-section>
      <q-input
        dark
        v-model="filters.searchFilter"
        label="Search"
        placeholder="Search"
        outlined
      ></q-input>
      <div class="q-mt-md">
        <q-checkbox
          dark
          standout
          v-model="filters.ok"
          label="OK"
          color="red"
        ></q-checkbox>
        <q-checkbox
          dark
          v-model="filters.warning"
          label="Warning"
          color="red"
        ></q-checkbox>
        <q-checkbox
          dark
          v-model="filters.error"
          label="Error"
          color="red"
        ></q-checkbox>
        <q-checkbox dark v-model="filters.info" label="Info" color="red">
        </q-checkbox>
      </div>
    </q-card-section>
  </q-card>
</template>