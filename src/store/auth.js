import { ref } from "vue";
import { defineStore } from "pinia";
import { getFirebaseBackend } from "../authUtils";

const COMPANY_ID = "BAQVERDER";

export const useAuth = defineStore("auth", () => {
  const currentUser = ref(JSON.parse(sessionStorage.getItem("authUser")));
  const currentUserInfo = ref(
    JSON.parse(sessionStorage.getItem("authUserInfo"))
  );

  const firebaseBackend = getFirebaseBackend();

  function setCurrentUser(newCurrentUser) {
    currentUser.value = newCurrentUser;
  }

  function setCurrentUserInfo(newCurrentUserInfo) {
    currentUserInfo.value = newCurrentUserInfo;
  }

  function loggedIn() {
    return !!currentUser.value;
  }

  async function login({ email, password }) {
    if (loggedIn()) return validate();

    currentUser.value = firebaseBackend.loginUser(email, password);
    currentUserInfo.value = await firebaseBackend.getUserInfo(
      COMPANY_ID,
      currentUser.value.uid
    );

    return currentUser.value;
  }

  async function logout() {
    currentUser.value = null;
    currentUserInfo.value = null;

    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("authUserInfo");

    await firebaseBackend.logout();
  }

  async function register({ username, email, password }) {
    if (loggedIn()) return validate();

    currentUser.value = await firebaseBackend.registerUser(
      username,
      email,
      password
    );
    return currentUser.value;
  }

  async function resetPassword({ email }) {
    if (loggedIn()) return validate();

    const { data: message } = await firebaseBackend.forgetPassword(email);

    return message;
  }

  function validate() {
    if (!currentUser.value) return null;

    currentUser.value = firebaseBackend.getAuthenticatedUser();
    return currentUser.value;
  }

  return {
    currentUser,
    currentUserInfo,
    login,
    logout,
    loggedIn,
    validate,
    register,
    resetPassword,
    setCurrentUser,
    setCurrentUserInfo,
  };
});
