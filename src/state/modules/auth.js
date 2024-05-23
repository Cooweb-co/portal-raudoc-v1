import { getFirebaseBackend } from '../../authUtils.js'

export const state = {
    currentUser: sessionStorage.getItem('authUser'),
    currentUserInfo: sessionStorage.getItem('authUserInfo') // Init variable with session storage key
}

export const mutations = {
    SET_CURRENT_USER(state, newValue) {
        state.currentUser = newValue
        saveState('auth.currentUser', newValue)
    },
    SET_CURRENT_USER_INFO(state, newValue) {
        state.currentUserInfo = JSON.stringify(newValue)
        saveState('authUserInfo', newValue)
    }
}

export const getters = {
    // Whether the user is currently logged in.
    loggedIn(state) {
        return !!state.currentUser
    }
}

export const actions = {
    // This is automatically run in `src/state/store.js` when the app
    // starts, along with any other actions named `init` in other modules.
    // eslint-disable-next-line no-unused-vars
    init({ state, dispatch }) {
        dispatch('validate')
    },

    // Logs in the current user.
    logIn({ commit, dispatch, getters }, { email, password } = {}) {
        if (getters.loggedIn) return dispatch('validate')

        return getFirebaseBackend().loginUser(email, password).then(async (response) => {
            const user = response
            commit('SET_CURRENT_USER', user)

            // Fetch user info with an email and save it in session storage
            const currentUser = await getFirebaseBackend().getUserInfo('BAQVERDE', user.uid);
            commit('SET_CURRENT_USER_INFO', currentUser)

            return user
        }).catch((error) => {
            // console.log(error)
            return Promise.reject(error)
        })
    },

    // Logs out the current user.
    logOut({ commit }) {
        // eslint-disable-next-line no-unused-vars
        commit('SET_CURRENT_USER', null)
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authUserInfo');
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line no-unused-vars
            getFirebaseBackend().logout().then((response) => {
                commit('SET_CURRENT_USER', null)
                resolve(true);
            }).catch((error) => {
                commit('SET_CURRENT_USER', null)
                reject(this._handleError(error));
            })
        });
    },

    // register the user
    register({ commit, dispatch, getters }, { username, email, password } = {}) {
        if (getters.loggedIn) return dispatch('validate')

        return getFirebaseBackend().registerUser(username, email, password).then((response) => {
            const user = response
            commit('SET_CURRENT_USER', user)
            return user
        });
    },

    // register the user
    // eslint-disable-next-line no-unused-vars
    resetPassword({ commit, dispatch, getters }, { email } = {}) {
        if (getters.loggedIn) return dispatch('validate')

        return getFirebaseBackend().forgetPassword(email).then((response) => {
            const message = response.data
            return message
        });
    },

    // Validates the current user's token and refreshes it
    // with new data from the API.
    // eslint-disable-next-line no-unused-vars
    validate({ commit, state }) {
        if (!state.currentUser) return Promise.resolve(null)
        const user = getFirebaseBackend().getAuthenticatedUser();
        commit('SET_CURRENT_USER', user)
        return user;
    },
}

// ===
// Private helpers
// ===

function saveState(key, state) {
    window.sessionStorage.setItem(key, JSON.stringify(state))
}
