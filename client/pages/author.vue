<template>
  <v-container>
    <v-toolbar dark color="primary">
      <v-toolbar-title class="mr-4">
        <v-icon>search</v-icon>
      </v-toolbar-title>
      <v-autocomplete class="mt-2" v-model="author" :hint="'Type to search'" :items="authors" :label="'Search...'" item-text="_id" item-value="_id" flat solo-inverted>
        <template v-slot:selection="authors">
          <v-list-tile-content>
            <v-list-tile-title v-html="authors.item._id"></v-list-tile-title>
            <v-list-tile-sub-title v-html="'Revisions: ' + authors.item.user"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
        <template v-slot:item="authors">
          <v-list-tile-content>
            <v-list-tile-title v-html="authors.item._id"></v-list-tile-title>
            <v-list-tile-sub-title v-html="'Revisions: ' + authors.item.user"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>
    </v-toolbar>
    <v-card v-if="author">
      <v-card-title>
        <h2>Aricles by Author</h2>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-group v-for="item in authorRecords" :key="item._id" v-model="item.active" no-action>
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Article: {{ item._id }}, Revisions: {{ item.no_revisions }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile v-for="subItem in item.timestamp_list" :key="subItem">
              <v-list-tile-content>
                <v-layout row>
                  <v-list-tile-avatar>
                    <v-icon>arrow_right</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-title>{{ new Date(subItem) }}</v-list-tile-title>
                </v-layout>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
          </v-list-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: ["auth"],
  data: () => ({
    authors: [],
    author: null,
    authorRecords: []
  }),
  methods: {
    async getAuthorList() {
      this.authors = [];
      this.author = null;
      const data = await this.$axios.$get("revisions/getAllAuthors", {
        headers: {
          "x-access-token": this.$store.state.user.authUser.data.token
        }
      });

      if (data) {
        this.authors = data.data;
      }
    },
    async getAuhorRecords() {
      this.authorRecords = [];
      if (this.author) {
        console.log(this.author);
        const data = await this.$axios.$get("revisions/getArticlesByAuthor", {
          headers: {
            "x-access-token": this.$store.state.user.authUser.data.token
          },
          params: {
            author: this.author
          }
        });

        if (data) {
          this.authorRecords = data.data;
        }
      }
    }
  },
  beforeCreate() {
    this.$store.dispatch("user/initializeStore");
  },
  created() {
    this.getAuthorList();
  },
  watch: {
    author: function(nvalue, ovalue) {
      if (nvalue !== ovalue) {
        this.getAuhorRecords();
      }
    }
  }
};
</script>

<style>
</style>
