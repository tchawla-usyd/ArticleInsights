<template>
  <v-layout row>
    <v-flex class="mr-5" xs1>
      <h4>No. of Articles</h4>
      <v-text-field v-model="counter" :disabled="loading" label="Number" outline></v-text-field>
    </v-flex>
    <v-layout column>
      <v-flex>
        <HorizontalCards objectType="hirev" objectHeader="Articles with Highest Revisions" :counter="counter" @loading="loadingData"/>
        <v-divider></v-divider>
        <HorizontalCards objectType="lorev" objectHeader="Articles with Lowest Revisions" :counter="counter" @loading="loadingData"/>
      </v-flex>
      <v-divider></v-divider>
      <v-layout row>
        <HorizontalCards objectType="hiuser" objectHeader="Article with Most Registered Users" :counter="counter"/>
        <HorizontalCards objectType="louser" objectHeader="Article with Least Registered Users" :counter="counter"/>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row>
        <HorizontalCards objectType="oldest" objectHeader="Articles with Longest History" :counter="counter"/>
        <HorizontalCards objectType="youngest" objectHeader="Article with Shortest History" :counter="counter"/>
      </v-layout>
      <keep-alive>
        <ChartContainer type="overview"/>
      </keep-alive>
    </v-layout>
  </v-layout>
</template>

<script>
import HorizontalCards from "~/components/HorizontalCards.vue";
import ChartContainer from "~/components/ChartContainer";

export default {
  middleware: "auth",
  components: {
    HorizontalCards,
    ChartContainer
  },
  data: () => ({
    counter: 2,
    loading: false
  }),
  beforeCreate() {
    this.$store.dispatch("user/initializeStore");
  },
  methods: {
    loadingData(value) {
      this.loading = value;
    }
  }
};
</script>
