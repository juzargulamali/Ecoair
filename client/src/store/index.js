import { createStore } from 'vuex'
import AuthService from "../services/AuthService"

// Create a new store instance.
const store = createStore({
  state() {
    return {
      openMenu: false,
      loggedIn: AuthService.isLoggedIn(),
      requestStatus: ''
    }
  },
  getters: {
    isLoggedIn: state => state.loggedIn,
  },
  mutations: {
    toggleMenu(state) {
      state.openMenu = !state.openMenu;
    },
    setIsLoggedIn(state, payload) {
      state.loggedIn = payload;
    }
  },
})

export default store;
