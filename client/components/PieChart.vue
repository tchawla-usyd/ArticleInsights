<template>
  <v-card>
    <v-card-text v-if="type === 'overview'">
      <chartjs-pie :labels="xlabels" :datasets="xdatasets" :option="option" :bind="true"></chartjs-pie>
    </v-card-text>
    <v-card-text v-else>
      <chartjs-pie :labels="ylabels" :datasets="ydatasets" :option="option" :bind="true"></chartjs-pie>
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
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)"
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ]
      }
    ],
    ylabels: [],
    ydatasets: [
      {
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)"
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ]
      }
    ],
    option: {},
    loaded: false
  }),
  methods: {
    async getRevisionsByUserType() {
      const data = await this.$axios.$get("revisions/getRevisionsByUserType", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        }
      });

      for (var i = 0; i < data.data.length; i++) {
        this.xlabels.push(data.data[i]._id);

        data.data[i].admin_revisions
          ? this.xdatasets[0].data.push(parseInt(data.data[i].admin_revisions))
          : null;
        data.data[i].bot_revisions
          ? this.xdatasets[0].data.push(parseInt(data.data[i].bot_revisions))
          : null;
        data.data[i].anon_revisions
          ? this.xdatasets[0].data.push(parseInt(data.data[i].anon_revisions))
          : null;
        data.data[i].reg_revisions
          ? this.xdatasets[0].data.push(parseInt(data.data[i].reg_revisions))
          : null;
      }

      this.$emit("loaded", true);
    },
    async getIndividualRevisionsByUserType() {
      const data = await this.$axios.$get(
        "revisions/getArticleRevsByUserType",
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
          this.ydatasets[0].data.push(parseInt(data.data[i].admin_revisions));
        }
        if (data.data[i].bot_revisions) {
          this.ydatasets[0].data.push(parseInt(data.data[i].bot_revisions));
        }
        if (data.data[i].anon_revisions) {
          this.ydatasets[0].data.push(parseInt(data.data[i].anon_revisions));
        }
        if (data.data[i].regular_revisions) {
          this.ydatasets[0].data.push(parseInt(data.data[i].regular_revisions));
        }
      }

      this.$emit("loaded", true);
    }
  },
  created() {
    if (this.type === "overview") {
      this.getRevisionsByUserType();
    } else {
      this.getIndividualRevisionsByUserType();
    }
  },
  watch: {
    title: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.ylabels = [];
        this.ydatasets[0].data = [];
        this.getIndividualRevisionsByUserType();
      }
    },
    yFrom: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.ylabels = [];
        this.ydatasets[0].data = [];
        this.getIndividualRevisionsByUserType();
      }
    },
    yTo: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.ylabels = [];
        this.ydatasets[0].data = [];
        this.getIndividualRevisionsByUserType();
      }
    }
  }
};
</script>

<style>
</style>
