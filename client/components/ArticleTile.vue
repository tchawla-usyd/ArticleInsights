<template>
  <v-card min-height="140px" max-width="160px" class="ma-1 elevation-1">
    <v-card-title class="primary white--text font-weight-bold">{{ title }}</v-card-title>
    <v-card-text>{{ info }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["title", "info"]
};
</script>

<style>
</style>
