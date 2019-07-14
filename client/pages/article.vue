<template>
  <v-layout row>
    <v-flex class="mr-5 mt-2" sm2>
      <v-layout column>
        <h4 class="ml-2">Filter By Date</h4>
        <DatePicker @picked="setFrom" title="From" @cleared="resetFrom"/>
        <DatePicker @picked="setTo" title="To" @cleared="resetTo"/>
        <!-- <v-btn color="primary" flat>Get Revisions</v-btn> -->
      </v-layout>
    </v-flex>
    <v-container>
      <v-toolbar dark color="primary">
        <v-toolbar-title class="mr-4">
          <v-icon>search</v-icon>
        </v-toolbar-title>
        <v-autocomplete class="mt-2" v-model="title" :hint="'Type to search'" :items="titles" :label="'Search...'" item-text="_id" item-value="_id" flat solo-inverted>
          <template v-slot:selection="titles">
            <v-list-tile-content>
              <v-list-tile-title v-html="titles.item._id"></v-list-tile-title>
              <v-list-tile-sub-title v-html="'Revisions: ' + titles.item.revisions"></v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
          <template v-slot:item="titles">
            <v-list-tile-content>
              <v-list-tile-title v-html="titles.item._id"></v-list-tile-title>
              <v-list-tile-sub-title v-html="'Revisions: ' + titles.item.revisions"></v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </v-autocomplete>
      </v-toolbar>
      <ArticleContainer ref="arc" :articleTitle="title" :yearFrom="yFrom" :yearTo="yTo" :update="update"/>
      <ChartContainer v-if="show" type="individual" :title="title" :yearFrom="yFrom" :yearTo="yTo" :update="update"/>
    </v-container>
  </v-layout>
</template>

<script>
import ArticleContainer from "~/components/ArticleContainer.vue";
import ChartContainer from "~/components/ChartContainer.vue";
import DatePicker from "~/components/DatePicker.vue";

export default {
  middleware: ["auth"],
  components: {
    ArticleContainer,
    ChartContainer,
    DatePicker
  },
  data: () => ({
    titles: [],
    title: null,
    counter: 0,
    loading: false,
    yFrom: null,
    yTo: null,
    update: false,
    off: false,
    show: false
  }),
  methods: {
    async getAllTitles() {
      const data = await this.$axios.$get("revisions/uniqueTitles", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        }
      });

      if (data) {
        this.titles = data.data;
      }
    },
    setFrom(value) {
      this.yFrom = value;
    },
    setTo(value) {
      this.yTo = value;
    },
    resetFrom() {
      this.yFrom = null;
    },
    resetTo() {
      this.yTo = null;
    }
  },
  beforeCreate() {
    this.$store.dispatch("user/initializeStore");
  },
  created() {
    this.getAllTitles();
  },
  watch: {
    title: function(nvalue, oldvalue) {
      {
        if (nvalue !== oldvalue) {
          this.update = true;
          this.show = true;
        }
      }
    }
  }
};
</script>

<style>
</style>
