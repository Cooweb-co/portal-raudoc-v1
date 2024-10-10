<script setup>
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  // import { layoutMethods } from '@/state/helpers';
  import { state } from "../state/modules/auth";
  import { BButton } from "bootstrap-vue-next";
  // import i18n from '../i18n';

  import Notification from "@/components/NavbarNotification";
  import { Trash2Icon } from "@zhuowenli/vue-feather-icons";

  // Notifications /////////////////////////////////////////////////
  const notifications = ref([]);
  const selectNotifications = ref([]);
  const loadingDeleteNotification = ref(false);
  const activeUser = JSON.parse(sessionStorage.getItem("auth.currentUser"));

  let configNotificationsQuery = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.VUE_APP_CF_BASE_URL}/user/notifications/BAQVERDE/${activeUser?.uid}`,
    headers: {},
  };

  async function getNotifications() {
    try {
      await axios.request(configNotificationsQuery).then((result) => {
        if (result) {
          notifications.value = result.data.data;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  getNotifications();

  const setSelectNotifications = (id) => {
    selectNotifications.value.push(id);
  };

  const deselectNotifications = (id) => {
    selectNotifications.value = selectNotifications.value.filter(
      (element) => element != id
    );
  };

  const deleteNotification = () => {
    selectNotifications.value.forEach((element) => {
      notifications.value.forEach((item, idx) => {
        if (element == item.id) {
          deleteNotificationItem(item.id, idx);
        }
      });
    });
  };

  async function deleteNotificationItem(id, indice) {
    try {
      loadingDeleteNotification.value = true;
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${process.env.VUE_APP_CF_BASE_URL}/user/notifications/BAQVERDE/${activeUser?.uid}/${id}`,
        headers: {},
      };
      await axios.request(config).then((response) => {
        if (response) {
          notifications.value.splice(indice, 1);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      loadingDeleteNotification.value = false
    }
  }

  const markAsRead = () => {
    selectNotifications.value = [];
    notifications.value = [];
  };
  // Notifications /////////////////////////////////////////////////

  // ------------------------------------------------------------ //

  // const languages = ref([
  //   {
  //     flag: require('@/assets/images/flags/us.svg'),
  //     language: 'en',
  //     title: 'English',
  //   },
  //   {
  //     flag: require('@/assets/images/flags/spain.svg'),
  //     language: 'sp',
  //     title: 'Española',
  //   },
  //   // Otras entradas del array de idiomas...
  // ]);

  // const lan = ref(i18n.locale);
  // const text = ref(null);
  const flag = ref(null);
  // const value = ref(null);
  // const myVar = ref(1);

  // const calculateTotalPrice = computed(() => {
  //   return cartItems.value.reduce((total, item) => total + parseFloat(item.itemPrice), 0).toFixed(2);
  // });

  const user = computed(() => {
    return JSON.parse(state.currentUserInfo);
  });

  const name = computed(() => {
    const namesToArray = user?.value?.name?.split(" ");
    if (!user?.value?.name) return "-";
    return (
      capitalizeFirstLetter(namesToArray[0]) +
      " " +
      capitalizeFirstLetter(namesToArray[namesToArray.length - 2])
    );
  });

  const rol = computed(() => {
    switch (user?.value?.idRole) {
      case "FUNCTIONARY":
        return "Funcionario";
      case "ADMIN":
        return "Administrador";
      case "BOSS_OF_AREA":
        return "Jefe de area";
      case "DIRECTOR":
        return "Director";
      case "RADICATOR":
        return "Radicador";
      default:
        return "Indefinido";
    }
  });

  function capitalizeFirstLetter(str) {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase() || "";
  }

  const toggleHamburgerMenu = () => {
    var windowSize = document.documentElement.clientWidth;
    let layoutType = document.documentElement.getAttribute("data-layout");

    document.documentElement.setAttribute("data-sidebar-visibility", "show");
    let visiblilityType = document.documentElement.getAttribute(
      "data-sidebar-visibility"
    );

    if (windowSize > 767)
      document.querySelector(".hamburger-icon").classList.toggle("open");

    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu")
        ? document.body.classList.remove("menu")
        : document.body.classList.add("menu");
    }

    //For collapse vertical menu

    if (
      visiblilityType === "show" &&
      (layoutType === "vertical" || layoutType === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") == "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") == "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute("data-layout") == "twocolumn") {
      document.body.classList.contains("twocolumn-panel")
        ? document.body.classList.remove("twocolumn-panel")
        : document.body.classList.add("twocolumn-panel");
    }
  };

  // const toggleMenu = () => {
  //   $parent.toggleMenu();
  // };

  // const toggleRightSidebar = () => {
  //   $parent.toggleRightSidebar();
  // };

  const initFullScreen = () => {
    document.body.classList.toggle("fullscreen-enable");
    if (
      !document.fullscreenElement &&
      /* alternative standard method */
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  };

  // const setLanguage = (locale, country, flag) => {
  //   lan.value = locale;
  //   text.value = country;
  //   flag.value = flag;
  //   i18n.global.locale = locale;
  // };

  // const toggleDarkMode = () => {
  //   if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
  //     document.documentElement.setAttribute('data-bs-theme', 'light');
  //   } else {
  //     document.documentElement.setAttribute('data-bs-theme', 'dark');
  //   }

  //   const mode = document.documentElement.getAttribute('data-bs-theme');
  //   changeMode({
  //     mode: mode,
  //   });
  // };

  // const removeItem = (cartItem) => {
  //   cartItems.value = cartItems.value.filter(item => item.id !== cartItem.id);
  //   $emit('cart-item-price', cartItems.value.length);
  // };

  const isCustomDropdown = () => {
    // Aquí va tu lógica de isCustomDropdown
  };

  onMounted(() => {
    if (process.env.VUE_APP_I18N_LOCALE) {
      flag.value = process.env.VUE_APP_I18N_LOCALE;
    }

    document.addEventListener("scroll", () => {
      const pageTopbar = document.getElementById("page-topbar");
      if (pageTopbar) {
        document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50
          ? pageTopbar.classList.add("topbar-shadow")
          : pageTopbar.classList.remove("topbar-shadow");
      }
    });

    const hamburgerIcon = document.getElementById("topnav-hamburger-icon");
    if (hamburgerIcon) {
      hamburgerIcon.addEventListener("click", toggleHamburgerMenu);
    }

    isCustomDropdown();
  });
</script>

<template>
  <header id="page-topbar" style="z-index: 1000 !important">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link to="/" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-dark.png" alt="" height="37" />
              </span>
            </router-link>

            <router-link to="/" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-light.png" alt="" height="37" />
              </span>
            </router-link>
          </div>

          <button
            type="button"
            class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
            id="topnav-hamburger-icon"
          >
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <picture
          class="d-flex justify-content-center align-items-center mx-auto w-full"
        >
          <img src="/BAQVERDE.png" alt="BAQVERDE" class="company-logo" />
        </picture>
        <div class="d-flex align-items-center">
          <!-- Full screen -->
          <div class="ms-1 header-item d-sm-flex">
            <BButton
              type="button"
              variant="ghost-secondary"
              class="btn-icon btn-topbar rounded-circle"
              data-toggle="fullscreen"
              @click="initFullScreen"
            >
              <i class="bx bx-fullscreen fs-22"></i>
            </BButton>
          </div>

          <!-- ---------------------------------- Botón de notificaciones ---------------------------------------------------------------  -->
          <BDropdown
            variant="ghost-dark"
            dropstart
            class="ms-1 dropdown"
            :offset="{
              alignmentAxis: 57,
              crossAxis: 0,
              mainAxis: -42,
            }"
            toggle-class="btn-icon btn-topbar rounded-circle arrow-none"
            id="page-header-notifications-dropdown"
            menu-class="dropdown-menu-xl dropdown-menu-end p-0"
            auto-close="outside"
          >
            <template #button-content>
              <i class="bx bx-bell fs-22"></i>
              <span
                class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger"
                v-if="notifications.length"
              >
                <span class="notification-badge"
                  >{{ notifications.length }}
                </span>
                <span class="visually-hidden"> Notificaciones nuevas </span>
              </span>
            </template>

            <div
              class="dropdown-head bg-primary bg-pattern rounded-top dropdown-menu-xl"
            >
              <div class="p-3">
                <BRow class="align-items-center">
                  <BCol>
                    <h6 class="m-0 fs-16 fw-semibold text-white">
                      Notificaciones
                    </h6>
                  </BCol>
                  <BCol cols="auto" class="dropdown-tabs">
                    <BBadge
                      variant="light-subtle"
                      class="bg-light-subtle text-body fs-13"
                    >
                      {{ notifications.length }}
                      nuevas
                    </BBadge>
                  </BCol>
                </BRow>
              </div>
            </div>

            <BTabs
              nav-class="dropdown-tabs nav-tab-custom bg-primary px-2 pt-2"
            >
              <div
                v-if="notifications.length > 0"
                class="d-flex justify-content-between align-items-center w-100 px-3 mt-2"
              >
                <BButton
                  variant="outline-success"
                  size="sm"
                  class="m-2 mb-0"
                  @click="markAsRead"
                  >Marcar como leídas todas</BButton
                >
                <BButton
                  variant="outline-danger"
                  size="sm"
                  class="m-2 mb-0"
                  @click="deleteNotification"
                >
                  <span
                    v-if="loadingDeleteNotification"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <Trash2Icon v-else />
                </BButton>
              </div>

              <BTab title="Notificaciones" class="p-2">
                <Notification
                  v-for="notification in notifications"
                  :key="notification.id"
                  :notification="notification"
                  @setSelectNotifications="setSelectNotifications"
                  @deselectNotifications="deselectNotifications"
                />

                <simplebar
                  data-simplebar
                  style="max-height: 300px"
                  class="pe-2"
                  v-if="notifications.length < 1"
                >
                  <div class="w-25 w-sm-50 pt-3 mx-auto">
                    <img
                      src="@/assets/images/svg/bell.svg"
                      class="img-fluid"
                      alt="user-pic"
                    />
                  </div>
                  <div class="text-center pb-5 mt-2">
                    <h6 class="fs-18 fw-semibold lh-base">
                      Ey! No tienes ninguna notificación
                    </h6>
                  </div>
                </simplebar>
              </BTab>
            </BTabs>
          </BDropdown>

          <!-- ---------------------------------- Botón de Perfil ---------------------------------------------------------------  -->
          <BDropdown
            variant="link"
            class="ms-sm-3 header-item topbar-user"
            toggle-class="rounded-circle arrow-none"
            menu-class="dropdown-menu-end"
            :offset="{
              alignmentAxis: -14,
              crossAxis: 0,
              mainAxis: 0,
            }"
          >
            <template #button-content>
              <span class="d-flex align-items-center">
                <img
                  class="rounded-circle header-profile-user"
                  src="@/assets/images/users/user-dummy-img.jpg"
                  alt="Header Avatar"
                />
                <span class="text-start ms-xl-2">
                  <span
                    class="d-none d-xl-inline-block ms-1 fw-medium user-name-text"
                    >{{ name }}</span
                  >
                  <span
                    class="d-none d-xl-block ms-1 fs-13 user-name-sub-text"
                    >{{ rol }}</span
                  >
                </span>
              </span>
            </template>
            <h6 class="dropdown-header">Hola {{ name }}!</h6>

            <router-link class="dropdown-item" to="/pages/faqs"
              ><i
                class="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"
              ></i>
              <span class="align-middle"> Ayuda</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" to="/forgot-password"
              ><i
                class="mdi mdi-lock-reset text-muted fs-16 align-middle me-1"
              ></i>
              <span class="align-middle" data-key="t-logout">
                Cambiar contraseña</span
              >
            </router-link>
            <router-link class="dropdown-item" to="/logout"
              ><i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle" data-key="t-logout">
                Cerrar sesión</span
              >
            </router-link>
          </BDropdown>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .company-logo {
    width: 20%;
  }

  .notify-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .notify-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    background-color: aliceblue;
  }

  @media (max-width: 425px) {
    .company-logo {
      width: 30%;
    }
  }

  @media (max-width: 340px) {
    .company-logo {
      width: 45%;
    }
  }
</style>
