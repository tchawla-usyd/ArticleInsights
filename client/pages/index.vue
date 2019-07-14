<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <h1>Welcome to Article Insight</h1>
      <v-img src="~/assets/IMAGE1.png" aspect-ratio="1"></v-img>
      <v-img src="~/assets/IMAGE2.png" aspect-ratio="1"></v-img>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: "guest",
  components: {},
  beforeCreate() {
    this.$store.dispatch("user/initializeStore");
  }
};
</script>
