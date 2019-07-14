export const state = () => ({
  authUser: null,
  loggedIn: false
});

export const mutations = {
  SET_USER: (state, user) => {
    state.authUser = user;
  },
  SET_LOGGEDIN: (state, flag) => {
    state.loggedIn = flag;
  }
};

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  // nuxtServerInit({ commit }, { req }) {
  //   if (req.session && req.session.authUser) {
  //     commit("SET_USER", req.session.authUser);
  //   }
  // },
  async login({ commit }, { email, password }) {
    try {
      const data = await this.$axios.$post("user/authenticate", {
        email,
        password
      });

      if (!data || data.status === "error") {
        throw new Error("Bad credentials");
      }

      commit("SET_USER", data);
      commit("SET_LOGGEDIN", true);
      localStorage.setItem("store", JSON.stringify(this.state));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error("Bad credentials");
      }
      throw error;
    }
  },

  async logout({ commit }) {
    commit("SET_USER", null);
    commit("SET_LOGGEDIN", false);
    localStorage.clear();
  },

  initializeStore(state) {
    if (localStorage.getItem("store")) {
      this.replaceState(
        Object.assign(state, JSON.parse(localStorage.getItem("store")))
      );
    } else {
      this.$router.push("/");
    }
  }
};

export const getters = {
  isAuthenticated: state => {
    return state.loggedIn;
  },
  loggedInUser: state => {
    return state.authUser;
  }
};
