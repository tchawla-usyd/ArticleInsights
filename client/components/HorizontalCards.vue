<template>
  <v-card width="100%" class="mb-3">
    <v-card-title class="font-weight-bold">
      <h2>{{ objectHeader }}</h2>
    </v-card-title>
    <v-card-text>
      <v-layout wrap row>
        <div class="loader" v-if="loading">
          <v-progress-circular :width="5" :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <ArticleTile v-for="item in items" :key="item.title" v-bind:title="item.title" v-bind:info="item.info"/>
        <!-- <v-list row>
          <template v-for="item in items" v-bind:title="item.title">
            <v-list-tile-content :key="item.title">
              <v-list-tile-title v-html="item.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.info"></v-list-tile-sub-title>
              <v-divider></v-divider>
            </v-list-tile-content>
          </template>
        </v-list>-->
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import ArticleTile from "~/components/ArticleTile.vue";

export default {
  components: {
    ArticleTile
  },
  props: ["objectType", "objectHeader", "counter"],
  data: () => ({
    //counter: 2,
    loading: false,
    items: []
  }),
  methods: {
    async getHighestRevisionArticles() {
      //console.log(this.$store.state.user.authUser.data.token);
      this.items = [];
      this.loading = true;
      this.$emit("loading", true);

      const data = await this.$axios.$get(
        "revisions/getHighestRevisionsWithValue",
        {
          headers: {
            "x-access-token": this.$store.state.user.authUser.data.token
          },
          params: { limit: this.counter }
        }
      );

      if (data) {
        this.loading = false;
        for (var i = 0; i < data.data.length; i++) {
          let item = {
            title: data.data[i]._id.trim(),
            info: "Revisions: " + data.data[i].count
          };

          this.items.push(item);
        }
      }
      this.$emit("loading", false);
    },

    async getLowestRevisionArticles() {
      this.items = [];
      this.loading = true;
      this.$emit("loading", true);

      const data = await this.$axios.$get(
        "revisions/getLowestRevisionsWithValue",
        {
          headers: {
            "x-access-token": this.$store.state.user.authUser.data.token
          },
          params: { limit: this.counter }
        }
      );

      if (data) {
        this.loading = false;
        for (var i = 0; i < data.data.length; i++) {
          let item = {
            title: data.data[i]._id.trim(),
            info: "Revisions: " + data.data[i].count
          };

          this.items.push(item);
        }
      }
      this.$emit("loading", false);
    },

    async getMostRegisteredUserArticle() {
      this.items = [];
      this.loading = true;
      const data = await this.$axios.$get("revisions/getMostRegUsers", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        }
      });

      if (data) {
        this.loading = false;
        for (var i = 0; i < data.data.length; i++) {
          let item = {
            title: data.data[i]._id.trim(),
            info: "Registered Users: " + data.data[i].distinctUsers
          };

          this.items.push(item);
        }
      }
    },
    async getLeastRegisteredUserArticle() {
      this.items = [];
      this.loading = true;
      const data = await this.$axios.$get("revisions/getLeastRegUsers", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        }
      });

      if (data) {
        this.loading = false;
        for (var i = 0; i < data.data.length; i++) {
          let item = {
            title: data.data[i]._id.trim(),
            info: "Registered Users: " + data.data[i].distinctUsers
          };

          this.items.push(item);
        }
      }
    },
    async getLongestHistoryArticle() {
      this.items = [];
      this.loading = true;
      const data = await this.$axios.$get("revisions/getOldestArticle", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        },
        params: {
          limit: 2
        }
      });

      if (data) {
        this.loading = false;
        for (var i = 0; i < data.data.length; i++) {
          let item = {
            title: data.data[i]._id.trim(),
            info:
              "Age: " +
              Math.floor(data.data[i].age / (1000 * 60 * 60 * 24)) +
              " days"
          };

          this.items.push(item);
        }
      }
    },
    async getYoungestHistoryArticle() {
      this.items = [];
      this.loading = true;
      const data = await this.$axios.$get("revisions/getYoungestArticle", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        },
        params: {
          limit: 1
        }
      });

      if (data) {
        this.loading = false;
        for (var i = 0; i < data.data.length; i++) {
          let item = {
            title: data.data[i]._id.trim(),
            info:
              "Age: " +
              Math.floor(data.data[i].age / (1000 * 60 * 60 * 24)) +
              " days"
          };

          this.items.push(item);
        }
      }
    }
  },
  created() {
    switch (this.objectType) {
      case "hirev":
        this.getHighestRevisionArticles();
        break;
      case "lorev":
        this.getLowestRevisionArticles();
        break;
    }
  },
  mounted() {
    switch (this.objectType) {
      case "hiuser":
        this.getMostRegisteredUserArticle();
        break;
      case "louser":
        this.getLeastRegisteredUserArticle();
        break;
      case "oldest":
        this.getLongestHistoryArticle();
        break;
      case "youngest":
        this.getYoungestHistoryArticle();
        break;
    }
  },
  watch: {
    counter: function(value) {
      if (/^\d+$/.test(value) && value > 0) {
        //console.log(value);
        switch (this.objectType) {
          case "hirev":
            this.getHighestRevisionArticles();
            break;
          case "lorev":
            this.getLowestRevisionArticles();
            break;
        }
      }
    }
  }
};
</script>

<style>
.box {
  width: 100%;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
}

.loader {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  margin: 20px;
}
</style>
