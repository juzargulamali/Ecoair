import { createStore } from 'vuex'
import AuthService from "../services/AuthService";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      openMenu: false,
      token: localStorage.getItem('token') || '',
      user: {},
      loggedIn: false,
      requestStatus: ''

    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAdmin: state => !!state.user && state.user.role === 'admin',
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    toggleMenu(state) {
      state.openMenu = !state.openMenu;
    },
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, { token, user }) {
      state.status = 'success'
      state.token = token
      state.user = user
      state.loggedIn = true
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.user = {}
      state.loggedIn = false

    },
  },
  actions: {
    refresh({ commit }) {
      commit('setUser', AuthService.getUserDetails().user)
    },
    login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        AuthService.login(payload.credentials)
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            commit('auth_success', { token, user },)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        resolve()
      })
    }
  }
})

export default store;
