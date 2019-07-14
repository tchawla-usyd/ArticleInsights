<template>
  <v-card>
    <v-card-title primary-title>
      <v-layout column>
        <h2>Title: {{ articleTitle ? articleTitle : "N/A" }}</h2>
        <h4>Summary Between: {{ yearFrom ? yearFrom : "---" }} to {{ yearTo ? yearTo : "---" }}</h4>
      </v-layout>
    </v-card-title>
    <v-card-text v-if="show">Total revisions: {{ revisionCount }}</v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <v-divider></v-divider>
      <v-card v-if="show" width="100%">
        <v-card-title class="primary white--text">Top 5 Regular Users</v-card-title>
        <v-card-text>
          <v-list>
            <template v-for="item in regUsers">
              <v-list-tile :key="item._id">
                <v-list-tile-title v-html="item._id"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.usercount"></v-list-tile-sub-title>
              </v-list-tile>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-card-text>
    <!-- <ChartContainer v-if="show" type="individual" :title="articleTitle" :yearFrom="yearFrom" :yearTo="yearTo"/> -->
  </v-card>
</template>

<script>
import ChartContainer from "~/components/ChartContainer";

export default {
  components: {
    ChartContainer
  },
  data: () => ({
    revisionCount: 0,
    regUsers: [],
    show: false
  }),
  props: ["articleTitle", "yearFrom", "yearTo", "update"],
  methods: {
    async getArticleSummary() {
      if (this.articleTitle !== null && this.update === true) {
        this.show = true;
        const data = await this.$axios.$get("revisions/displaySummaryInfo", {
          headers: {
            "x-access-token": this.$store.state.user.authUser.data.token
          },
          params: {
            title: this.articleTitle,
            fromyear: this.yearFrom ? this.yearFrom : "1970-01-01",
            toyear: this.yearTo
              ? this.yearTo
              : new Date().toISOString().substring(0, 10)
          }
        });

        this.revisionCount =
          data.data[0].Total.length == 1 ? data.data[0].Total[0].Total : 0;
        this.regUsers = [];

        var topfivelength = data.data[0].TopFive.length;

        for (var i = 0; i < topfivelength; i++) {
          this.regUsers.push(data.data[0].TopFive[i]);
        }

        for (var i = 0; i < 5 - topfivelength; i++) {
          this.regUsers.push({ _id: "N/A", usercount: 0 });
        }

        this.$emit("done", true);
      }
    }
  },
  watch: {
    update: function(value) {
      if (value === true) {
        this.getArticleSummary();
      }
    },
    articleTitle: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.getArticleSummary();
      }
    },
    yearFrom: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.getArticleSummary();
      }
    },
    yearTo: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.getArticleSummary();
      }
    }
  }
};
</script>

<style>
</style>
