<template>
  <v-toolbar class="primary text--white" fixed app>
    <nuxt-link class="pageTitle" to="/">
      <v-layout row>
        <v-icon large left color="white">trending_up</v-icon>
        <v-toolbar-title class="ml-0 white--text" v-text="title"/>
      </v-layout>
    </nuxt-link>
    <v-spacer/>
    <v-toolbar-items>
      <template v-if="isAuthenticated && loggedInUser">
        <v-btn active-class="btnActive" class="white--text" flat to="/overview">Overview</v-btn>
        <v-btn active-class="btnActive" class="white--text" flat to="/article">Individual Article</v-btn>
        <v-btn active-class="btnActive" class="white--text" flat to="/author">Author</v-btn>
      </template>
    </v-toolbar-items>
    <v-spacer/>
    <v-toolbar-items>
      <v-tooltip bottom v-if="isAuthenticated && loggedInUser">
        <template v-slot:activator="{ on }">
          <v-btn class="white--text" v-on="on" flat @click="logout">
            {{ loggedInUser.data.userName }}
            <v-icon right color="red">power_settings_new</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>

      <template v-if="!isAuthenticated || !loggedInUser">
        <v-btn active-class="btnActive" class="white--text" flat to="/register">Register</v-btn>
        <v-btn active-class="btnActive" class="white--text" flat to="/login">Login</v-btn>
      </template>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    title: "Article Insight"
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: "user/isAuthenticated",
      loggedInUser: "user/loggedInUser"
    })
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");

      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.pageTitle {
  text-decoration: none;
  text-decoration-color: none;
  color: black;
}
.btnActive {
  background-color: white;
  color: black !important;
  box-shadow: none !important;
}
</style>
