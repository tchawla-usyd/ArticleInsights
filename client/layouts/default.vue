<template>
  <v-app light>
    <Navbar/>
    <v-container>
      <v-content class="px-4 py-5 my-5">
        <transition name="fade" mode="in-out" appear>
          <nuxt ref="page"/>
        </transition>
      </v-content>
    </v-container>
    <v-footer class="customFooter elevation-4" :fixed="fixed" app>
      <v-divider/>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "~/components/Navbar.vue";

export default {
  data() {
    return {
      fixed: false
    };
  },
  components: {
    Navbar
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.customFooter {
  border-top: 3px;
  border-top-color: black;
}
</style>

