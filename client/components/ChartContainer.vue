<template>
  <div>
    <v-stepper v-model="e1" v-if="type === 'overview'">
      <v-stepper-header>
        <v-stepper-step step="1">Yearly Revision Distribution by User Types</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2">Revision Number Distribution by User Type</v-stepper-step>
      </v-stepper-header>
      <v-progress-linear height="2" v-model="value" :active="show" :indeterminate="query" :query="true"></v-progress-linear>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-layout fill-height column>
            <BarChart @loaded="progress" :type="type"/>
            <v-btn color="primary" @click="e1 = 2">Change</v-btn>
          </v-layout>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-layout fill-height column>
            <PieChart @loaded="progress" :type="type"/>
            <v-btn color="primary" @click="e1 = 1">Change</v-btn>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-stepper v-else v-model="e1">
      <v-stepper-header>
        <v-stepper-step step="1">Yearly Revision Distribution by User Types</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2">Revision Number Distribution by User Type</v-stepper-step>
        <!-- <v-divider></v-divider>
        <v-stepper-step step="3">Revision Number Distribution by User</v-stepper-step>-->
      </v-stepper-header>
      <v-progress-linear height="2" v-model="value" :active="show" :indeterminate="query" :query="true"></v-progress-linear>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-layout fill-height column>
            <BarChart :title="title" :yFrom="yearFrom" :yTo="yearTo" @loaded="progress" :change="update"/>
            <v-btn color="primary" @click="e1 = 2">Change</v-btn>
          </v-layout>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-layout fill-height column>
            <PieChart :title="title" :yFrom="yearFrom" :yTo="yearTo" @loaded="progress" :change="update"/>
            <v-btn color="primary" @click="e1 = 1">Change</v-btn>
          </v-layout>
        </v-stepper-content>
        <!-- <v-stepper-content step="3">
          <v-layout fill-height column>
            <PieChart :title="title" :yFrom="yearFrom" :yTo="yearTo" @loaded="progress"/>
            <h1>PLACEHOLDER</h1>
            <v-btn color="primary" @click="e1 = 1">Change</v-btn>
          </v-layout>
        </v-stepper-content>-->
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import BarChart from "~/components/BarChart.vue";
import PieChart from "~/components/PieChart.vue";

export default {
  components: {
    BarChart,
    PieChart
  },
  data: () => ({
    e1: 0,
    steps: 2,
    n: 1,
    value: 0,
    query: true,
    show: true,
    interval: 0
  }),
  props: ["type", "title", "yearFrom", "yearTo", "update"],
  methods: {
    nextStep() {
      if (this.n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = this.n + 1;
      }
    },
    progress(status) {
      if (status) {
        this.value += 50;
      }
    }
  },
  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
    value(val) {
      if (val == 100) {
        this.show = false;
        this.query = false;
      }
    }
  }
};
</script>

<style>
</style>
