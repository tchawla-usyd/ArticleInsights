<template>
  <v-card class="elevation-0">
    <v-card-text v-if="type === 'overview'">
      <chartjs-bar :labels="xlabels" :datasets="xdatasets" :bind="true"></chartjs-bar>
    </v-card-text>
    <v-card-text v-else>
      <chartjs-bar :labels="ylabels" :datasets="ydatasets" :bind="true"></chartjs-bar>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["type", "title", "yFrom", "yTo", "change"],
  data: () => ({
    xlabels: [],
    xdatasets: [
      {
        label: "Administrator",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      },
      {
        label: "Anonymous",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      },
      {
        label: "Bot",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      },
      {
        label: "Regular User",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      }
    ],
    ylabels: [],
    ydatasets: [
      {
        label: "Administrator",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      },
      {
        label: "Anonymous",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      },
      {
        label: "Bot",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      },
      {
        label: "Regular User",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: []
      }
    ],
    beginZero: true,
    loaded: false
  }),
  methods: {
    async getOverallYearRevisionDist() {
      const data = await this.$axios.$get(
        "revisions/getRevisionDistributionByYearUser",
        {
          headers: {
            "x-access-token": this.$store.state.user.authUser.data.token
          }
        }
      );

      for (var i = 0; i < data.data.length; i++) {
        this.xlabels.push(data.data[i]._id);

        if (data.data[i].admin_revisions) {
          this.xdatasets[0].backgroundColor.push("rgba(255, 99, 132, 0.2)");
          this.xdatasets[0].borderColor.push("rgba(255, 99, 132, 1)");
          this.xdatasets[0].data.push(data.data[i].admin_revisions);
        }
        if (data.data[i].anon_revisions) {
          this.xdatasets[1].backgroundColor.push("rgba(54, 162, 235, 0.2)");
          this.xdatasets[1].borderColor.push("rgba(54, 162, 235, 1)");
          this.xdatasets[1].data.push(data.data[i].anon_revisions);
        }
        if (data.data[i].bot_revisions) {
          this.xdatasets[2].backgroundColor.push("rgba(255, 206, 86, 0.2)");
          this.xdatasets[2].borderColor.push("rgba(255, 206, 86, 1)");
          this.xdatasets[2].data.push(data.data[i].bot_revisions);
        }
        if (data.data[i].reg_revisions) {
          this.xdatasets[3].backgroundColor.push("rgba(75, 192, 192, 0.2)");
          this.xdatasets[3].borderColor.push("rgba(75, 192, 192, 1)");
          this.xdatasets[3].data.push(data.data[i].reg_revisions);
        }
      }

      this.$emit("loaded", true);
    },
    async getIndividualYearRevisionDist() {
        this.ydatasets[0].data = [];
        this.ydatasets[0].backgroundColor = [];
        this.ydatasets[0].borderColor = [];

        this.ydatasets[1].data = [];
        this.ydatasets[1].backgroundColor = [];
        this.ydatasets[1].borderColor = [];

        this.ydatasets[2].data = [];
        this.ydatasets[2].backgroundColor = [];
        this.ydatasets[2].borderColor = [];

        this.ydatasets[3].data = [];
        this.ydatasets[3].backgroundColor = [];
        this.ydatasets[0].borderColor = [];

      const data = await this.$axios.$get(
        "revisions/getArticleRevsByUserTypeAndYear",
        {
          headers: {
            "x-access-token": this.$store.state.user.authUser.data.token
          },
          params: {
            title: this.title,
            fromyear: this.yFrom ? this.yFrom : "1970-01-01",
            toyear: this.yTo ? this.yTo : new Date().toISOString().substr(0, 10)
          }
        }
      );

      for (var i = 0; i < data.data.length; i++) {
        this.ylabels.push(data.data[i]._id);

        if (data.data[i].admin_revisions) {
          this.ydatasets[0].backgroundColor.push("rgba(255, 99, 132, 0.2)");
          this.ydatasets[0].borderColor.push("rgba(255, 99, 132, 1)");
          this.ydatasets[0].data.push(data.data[i].admin_revisions);
        }
        if (data.data[i].anon_revisions) {
          this.ydatasets[1].backgroundColor.push("rgba(54, 162, 235, 0.2)");
          this.ydatasets[1].borderColor.push("rgba(54, 162, 235, 1)");
          this.ydatasets[1].data.push(data.data[i].anon_revisions);
        }
        if (data.data[i].bot_revisions) {
          this.ydatasets[2].backgroundColor.push("rgba(255, 206, 86, 0.2)");
          this.ydatasets[2].borderColor.push("rgba(255, 206, 86, 1)");
          this.ydatasets[2].data.push(data.data[i].bot_revisions);
        }
        if (data.data[i].reg_revisions) {
          this.ydatasets[3].backgroundColor.push("rgba(75, 192, 192, 0.2)");
          this.ydatasets[3].borderColor.push("rgba(75, 192, 192, 1)");
          this.ydatasets[3].data.push(data.data[i].reg_revisions);
        }
      }

      this.$emit("loaded", true);
    }
  },
  created() {
    if (this.type === "overview") {
      this.getOverallYearRevisionDist();
    } else { 
      this.getIndividualYearRevisionDist(); 
    }
  },
  watch: {
    title: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.ylabels = [];
        this.getIndividualYearRevisionDist();
      }
    },
    yFrom: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.ylabels = [];

        this.getIndividualYearRevisionDist();
      }
    },
    yTo: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.ylabels = [];

        this.getIndividualYearRevisionDist();
      }
    }
  }
};
</script>

<style>
</style>
