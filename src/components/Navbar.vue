<script setup>
import { ref, computed, onMounted } from "vue";
// import { layoutMethods } from '@/state/helpers';
import Notification from "@/components/NavbarNotification";
import { state } from "../state/modules/auth";
import { BButton } from "bootstrap-vue-next";
// import i18n from '../i18n';

import { Trash2Icon } from "@zhuowenli/vue-feather-icons";

const notifications = ref([
    {
        id: "2Ebr1u9Thu29DUm7aVBZ",
        numberClaim: "EXT-BV-2024-00041",
    },
    {
        id: "5LbwcASOOEMtS0tLSqEx",
        numberClaim: "EXT-BV-2024-00050",
    },
]);



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
  return JSON.parse(state.currentUserInfo)
});


const name = computed(()=> {
  const namesToArray = user?.value?.name?.split(' ');
  if(!user?.value?.name) return '-'
  return capitalizeFirstLetter(namesToArray[0]) +  ' ' + capitalizeFirstLetter(namesToArray[namesToArray.length - 2])
});

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const toggleHamburgerMenu = () => {
    // Aquí va tu lógica de toggleHamburgerMenu
};



// const toggleMenu = () => {
//   $parent.toggleMenu();
// };

// const toggleRightSidebar = () => {
//   $parent.toggleRightSidebar();
// };

const initFullScreen = () => {
    // Aquí va tu lógica de initFullScreen
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

const selectNotifications = ref([]);

const setSelectNotifications = (id) => {
    selectNotifications.value.push(id);
};

const deselectNotifications = (id) => {
    selectNotifications.value = selectNotifications.value.filter(
        (element) => element != id
    );
};

const deleteNotification = () => {
  for (let i = 0; i < selectNotifications.value.length; i++) {
    notifications.value = notifications.value.filter(element => element.id != selectNotifications.value[i]);
  }
}

const markAsRead = () => {
    selectNotifications.value = []
    notifications.value = []
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
    <header id="page-topbar">
        <div class="layout-width">
            <div class="navbar-header">
                <div class="d-flex">
                    <!-- LOGO -->
                    <div class="navbar-brand-box horizontal-logo">
                        <router-link to="/" class="logo logo-dark">
                            <span class="logo-sm">
                                <img
                                    src="@/assets/images/logo-sm.png"
                                    alt=""
                                    height="22"
                                />
                            </span>
                            <span class="logo-lg">
                                <img
                                    src="@/assets/images/logo-dark.png"
                                    alt=""
                                    height="37"
                                />
                            </span>
                        </router-link>

                        <router-link to="/" class="logo logo-light">
                            <span class="logo-sm">
                                <img
                                    src="@/assets/images/logo-sm.png"
                                    alt=""
                                    height="22"
                                />
                            </span>
                            <span class="logo-lg">
                                <img
                                    src="@/assets/images/logo-light.png"
                                    alt=""
                                    height="37"
                                />
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

                    <!-- App Search-->
                    <!-- <form class="app-search d-none d-md-block">
            <div class="position-relative">
              <input type="text" class="form-control" placeholder="Search..." autocomplete="off" id="search-options"
                value="" />
              <span class="mdi mdi-magnify search-widget-icon"></span>
              <span class="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
                id="search-close-options"></span>
            </div>
            <div class="dropdown-menu dropdown-menu-lg" id="search-dropdown">
              <simplebar data-simplebar style="max-height: 320px">
                <div class="dropdown-header">
                  <h6 class="text-overflow text-muted mb-0 text-uppercase">
                    Recent Searches
                  </h6>
                </div>

                <div class="dropdown-item bg-transparent text-wrap">
                  <router-link to="/" class="btn btn-soft-secondary btn-sm rounded-pill">how to setup <i
                      class="mdi mdi-magnify ms-1"></i></router-link>
                  <router-link to="/" class="btn btn-soft-secondary btn-sm rounded-pill">buttons <i
                      class="mdi mdi-magnify ms-1"></i></router-link>
                </div>
                <div class="dropdown-header mt-2">
                  <h6 class="text-overflow text-muted mb-1 text-uppercase">
                    Pages
                  </h6>
                </div>

                <BLink href="javascript:void(0);" class="dropdown-item notify-item">
                  <i class=" ri-bubble-chart-line align-middle fs-18 text-muted me-2"></i>
                  <span>Analytics Dashboard</span>
                </BLink>

                <BLink href="javascript:void(0);" class="dropdown-item notify-item">
                  <i class="ri-lifebuoy-line align-middle fs-18 text-muted me-2"></i>
                  <span>Help Center</span>
                </BLink>

                <BLink href="javascript:void(0);" class="dropdown-item notify-item">
                  <i class=" ri-user-settings-line align-middle fs-18 text-muted me-2"></i>
                  <span>My account settings</span>
                </BLink>

                <div class="dropdown-header mt-2">
                  <h6 class="text-overflow text-muted mb-2 text-uppercase">
                    Members
                  </h6>
                </div>

                <div class="notification-list">
                  <BLink href="javascript:void(0);" class="d-flex dropdown-item notify-item py-2">
                    <img src="@/assets/images/users/avatar-2.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div class="flex-grow-1">
                      <h6 class="m-0">Angela Bernier</h6>
                      <span class="fs-11 mb-0 text-muted">Manager</span>
                    </div>
                  </BLink>
                  <BLink href="javascript:void(0);" class="d-flex dropdown-item notify-item py-2">
                    <img src="@/assets/images/users/avatar-3.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div class="flex-grow-1">
                      <h6 class="m-0">David Grasso</h6>
                      <span class="fs-11 mb-0 text-muted">Web Designer</span>
                    </div>
                  </BLink>
                  <BLink href="javascript:void(0);" class="d-flex dropdown-item notify-item py-2">
                    <img src="@/assets/images/users/avatar-5.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div class="flex-grow-1">
                      <h6 class="m-0">Mike Bunch</h6>
                      <span class="fs-11 mb-0 text-muted">React Developer</span>
                    </div>
                  </BLink>
                </div>
              </simplebar>

              <div class="text-center pt-3 pb-1">
                <router-link to="/pages/search-results" class="btn btn-primary btn-sm">View All Results <i
                    class="ri-arrow-right-line ms-1"></i></router-link>
              </div>
            </div>
          </form> -->
                </div>
                <picture
                    class="d-flex justify-content-center align-items-end"
                >
                    <img src="/BAQVERDE.png" alt="BAQVERDE" style="width: 20%;"/>
                </picture>
                <div class="d-flex align-items-center">
                    <BDropdown
                        class="dropdown d-md-none topbar-head-dropdown header-item"
                        variant="ghost-secondary"
                        dropstart
                        :offset="{
                            alignmentAxis: 55,
                            crossAxis: 15,
                            mainAxis: 0,
                        }"
                        toggle-class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle show  arrow-none"
                        menu-class="dropdown-menu-lg dropdown-menu-end p-0"
                    >
                        <template #button-content>
                            <i class="bx bx-search fs-22"></i>
                        </template>
                        <BDropdownItem
                            aria-labelledby="page-header-search-dropdown"
                        >
                            <form class="p-3">
                                <div class="form-group m-0">
                                    <div class="input-group">
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Search ..."
                                            aria-label="Recipient's username"
                                        />
                                        <BButton
                                            variant="primary"
                                            type="submit"
                                        >
                                            <i class="mdi mdi-magnify"></i>
                                        </BButton>
                                    </div>
                                </div>
                            </form>
                        </BDropdownItem>
                    </BDropdown>

                    <!-- <BDropdown class="dropdown" variant="ghost-secondary" dropstart
            :offset="{ alignmentAxis: 57, crossAxis: 0, mainAxis: -42 }"
            toggle-class="btn-icon btn-topbar rounded-circle mode-layout ms-1 arrow-none"
            menu-class="p-0 dropdown-menu-end">
            <template #button-content>
              <i class="bx bx-category-alt fs-22"></i>
            </template>
            <div class="p-3 border-top-0 dropdown-head border-start-0 border-end-0 border-dashed border dropdown-menu-lg">
              <BRow class="align-items-center">
                <BCol>
                  <h6 class="m-0 fw-semibold fs-15">Web Apps</h6>
                </BCol>
                <BCol cols="auto">
                  <BLink href="#!" class="btn btn-sm btn-soft-info">
                    View All Apps
                    <i class="ri-arrow-right-s-line align-middle"></i>
                  </BLink>
                </BCol>
              </BRow>
            </div>

            <div class="p-2">
              <BRow class="g-0">
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/github.png" alt="Github" />
                    <span>GitHub</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/bitbucket.png" alt="bitbucket" />
                    <span>Bitbucket</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/dribbble.png" alt="dribbble" />
                    <span>Dribbble</span>
                  </BLink>
                </BCol>
              </BRow>

              <BRow class="g-0">
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/dropbox.png" alt="dropbox" />
                    <span>Dropbox</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/mail_chimp.png" alt="mail_chimp" />
                    <span>Mail Chimp</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/slack.png" alt="slack" />
                    <span>Slack</span>
                  </BLink>
                </BCol>
              </BRow>
            </div>
          </BDropdown> -->

                    <!-- <BDropdown variant="ghost-secondary" dropstart :offset="{ alignmentAxis: 57, crossAxis: 0, mainAxis: -42 }"
            class="ms-1 dropdown" toggle-class="btn-icon btn-topbar rounded-circle mode-layout arrow-none"
            menu-class="dropdown-menu-xl dropdown-menu-end p-0" text="Manual close (auto-close=false)"
            auto-close="outside">
            <template #button-content>
              <i class="bx bx-shopping-bag fs-22"></i>
              <span
                class="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">{{
                  cartItems.length }} </span>
            </template>

            <div class="p-3 border-top-0 border-start-0 dropdown-head border-end-0 border-dashed border dropdown-menu-xl">
              <BRow class="align-items-center">
                <BCol>
                  <h6 class="m-0 fs-16 fw-semibold"> My Cart</h6>
                </BCol>
                <BCol cols="auto">
                  <BBadge variant="warning-subtle" class="bg-warning-subtle text-warning fs-13"><span
                      class="cartitem-badge"> {{ cartItems.length }} </span>
                    items</BBadge>
                </BCol>
              </BRow>
            </div>
            <simplebar data-simplebar style="max-height: 300px">
              <div class="p-2">
                <div class="text-center empty-cart" id="empty-cart" v-if="cartItems.length === 0">
                  <div class="avatar-md mx-auto my-3">
                    <div class="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                      <i class="bx bx-cart"></i>
                    </div>
                  </div>
                  <h5 class="mb-3">Your Cart is Empty!</h5>
                  <router-link to="/ecommerce/products" class="btn btn-success w-md mb-3">Shop Now</router-link>
                </div>
                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2"
                  v-for="(item, index) in cartItems" :key="index">
                  <div class="d-flex align-items-center">
                    <img :src="item.productImage" class="me-3 rounded-circle avatar-sm p-2 bg-light" />
                    <div class="flex-grow-1">
                      <h6 class="mt-0 mb-1 fs-14">
                        <router-link :to="item.productLink" class="text-reset">{{ item.productName }}</router-link>
                      </h6>
                      <p class="mb-0 fs-12 text-muted">
                        Quantity: <span>{{ item.quantity }}</span>
                      </p>
                    </div>
                    <div class="px-2">
                      <h5 class="m-0 fw-normal">$<span class="cart-item-price">{{ item.itemPrice }}</span></h5>
                    </div>
                    <div class="ps-2">
                      <button type="button" class="btn btn-ghost-secondary btn-sm btn-icon remove-item-btn"
                        @click="removeItem(item)">
                        <i class="ri-close-fill fs-16"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </simplebar>
            <div v-if="cartItems.length" class="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border"
              id="checkout-elem">
              <div class="d-flex justify-content-between align-items-center pb-3">
                <h5 class="m-0 text-muted">Total:</h5>
                <div class="px-2">
                  <h5 class="m-0" id="cart-item-total">${{ calculateTotalPrice }}</h5>
                </div>
              </div>

              <router-link to="/ecommerce/checkout" class="btn btn-success text-center w-100">
                Checkout
              </router-link>
            </div>
          </BDropdown> -->

                    <div class="ms-1 header-item d-none d-sm-flex">
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

                    <!-- <div class="ms-1 header-item d-none d-sm-flex">
            <BButton type="button" variant="ghost-secondary" class="btn-icon btn-topbar rounded-circle light-dark-mode"
              @click="toggleDarkMode">
              <i class="bx bx-moon fs-22"></i>
            </BButton>
          </div> -->

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
                        menu-class="dropdown-menu-lg dropdown-menu-end p-0"
                        auto-close="outside"
                    >
                        <template #button-content>
                            <i class="bx bx-bell fs-22"></i>
                            <span
                                class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger"
                                v-if="notifications.length"
                                ><span class="notification-badge">{{
                                    notifications.length
                                }}</span
                                ><span class="visually-hidden"
                                    >Notificaciones nuevas
                                </span>
                            </span>
                        </template>

                        <div
                            class="dropdown-head bg-primary bg-pattern rounded-top dropdown-menu-lg"
                        >
                            <div class="p-3">
                                <BRow class="align-items-center">
                                    <BCol>
                                        <h6
                                            class="m-0 fs-16 fw-semibold text-white"
                                        >
                                            Notificaciones
                                        </h6>
                                    </BCol>
                                    <BCol cols="auto" class="dropdown-tabs">
                                        <BBadge
                                            variant="light-subtle"
                                            class="bg-light-subtle text-body fs-13"
                                        >
                                            {{ notifications.length }}
                                            nuevas</BBadge
                                        >
                                    </BCol>
                                </BRow>
                            </div>
                        </div>
                        <BTabs
                            nav-class="dropdown-tabs nav-tab-custom bg-primary px-2 pt-2"
                        >
                            <div class="d-flex justify-content-between align-items-center w-100">
                              <BButton variant="outline-success" size="sm" class=" m-2 mb-0" @click="markAsRead">Marcar como leídas todas</BButton>
                              <BButton variant="outline-danger" size="sm" class=" m-2 mb-0" @click="deleteNotification"><Trash2Icon /></BButton>
                            </div>
                            <!-- <BTab title=" All (4) " class="tab-pane fade py-2 ps-2 show" id="all-noti-tab" role="tabpanel">
                <simplebar data-simplebar style="max-height: 300px" class="pe-2">
                  <div class="text-reset notification-item d-block dropdown-item position-relative">
                    <div class="d-flex">
                      <div class="avatar-xs me-3 flex-shrink-0">
                        <span class="avatar-title bg-info-subtle text-info rounded-circle fs-16">
                          <i class="bx bx-badge-check"></i>
                        </span>
                      </div>
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-2 lh-base">
                            Your <b>Elite</b> author Graphic Optimization
                            <span class="text-secondary">reward</span> is
                            ready!
                          </h6>
                        </BLink>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> Just 30 sec ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="text-reset notification-item d-block dropdown-item position-relative">
                    <div class="d-flex">
                      <img src="@/assets/images/users/avatar-2.jpg" class="me-3 rounded-circle avatar-xs flex-shrink-0"
                        alt="user-pic" />
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                            Angela Bernier
                          </h6>
                        </BLink>
                        <div class="fs-13 text-muted">
                          <p class="mb-1">
                            Answered to your comment on the cash flow forecast's graph 🔔.
                          </p>
                        </div>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 48 min ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="text-reset notification-item d-block dropdown-item position-relative">
                    <div class="d-flex">
                      <div class="avatar-xs me-3 flex-shrink-0">
                        <span class="avatar-title bg-danger-subtle text-danger rounded-circle fs-16">
                          <i class="bx bx-message-square-dots"></i>
                        </span>
                      </div>
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-2 fs-13 lh-base">
                            You have received <b class="text-success">20</b> new messages in the conversation
                          </h6>
                        </BLink>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 2 hrs
                            ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="text-reset notification-item d-block dropdown-item position-relative">
                    <div class="d-flex">
                      <img src="@/assets/images/users/avatar-8.jpg" class="me-3 rounded-circle avatar-xs flex-shrink-0"
                        alt="user-pic" />
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                            Maureen Gibson
                          </h6>
                        </BLink>
                        <div class="fs-13 text-muted">
                          <p class="mb-1">
                            We talked about a project on linkedin.
                          </p>
                        </div>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 4 hrs
                            ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="my-3 text-center">
                    <BButton type="button" variant="soft-success">
                      View All Notifications
                      <i class="ri-arrow-right-line align-middle"></i>
                    </BButton>
                  </div>
                </simplebar>
              </BTab>

              <BTab title="Messages" class="tab-pane fade py-2 ps-2" id="messages-tab" role="tabpanel"
                aria-labelledby="messages-tab">
                <simplebar data-simplebar style="max-height: 300px" class="pe-2">
                  
                  <div class="text-reset notification-item d-block dropdown-item">
                    <div class="d-flex">
                      <img src="@/assets/images/users/avatar-3.jpg" class="me-3 rounded-circle avatar-xs"
                        alt="user-pic" />
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                            James Lemire
                          </h6>
                        </BLink>
                        <div class="fs-13 text-muted">
                          <p class="mb-1">
                            We talked about a project on linkedin.
                          </p>
                        </div>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 30 min ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="text-reset notification-item d-block dropdown-item">
                    <div class="d-flex">
                      <img src="@/assets/images/users/avatar-2.jpg" class="me-3 rounded-circle avatar-xs"
                        alt="user-pic" />
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                            Angela Bernier
                          </h6>
                        </BLink>
                        <div class="fs-13 text-muted">
                          <p class="mb-1">
                            Answered to your comment on the cash flow
                            forecast's graph 🔔.
                          </p>
                        </div>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 2 hrs
                            ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="text-reset notification-item d-block dropdown-item">
                    <div class="d-flex">
                      <img src="@/assets/images/users/avatar-6.jpg" class="me-3 rounded-circle avatar-xs"
                        alt="user-pic" />
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                            Kenneth Brown
                          </h6>
                        </BLink>
                        <div class="fs-13 text-muted">
                          <p class="mb-1">
                            Mentionned you in his comment on 📃 invoice
                            #12501.
                          </p>
                        </div>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 10 hrs
                            ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="text-reset notification-item d-block dropdown-item">
                    <div class="d-flex">
                      <img src="@/assets/images/users/avatar-8.jpg" class="me-3 rounded-circle avatar-xs"
                        alt="user-pic" />
                      <div class="flex-grow-1">
                        <BLink href="#!" class="stretched-link">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold">
                            Maureen Gibson
                          </h6>
                        </BLink>
                        <div class="fs-13 text-muted">
                          <p class="mb-1">
                            We talked about a project on linkedin.
                          </p>
                        </div>
                        <p class="mb-0 fs-11 fw-medium text-uppercase text-muted">
                          <span><i class="mdi mdi-clock-outline"></i> 3 days
                            ago</span>
                        </p>
                      </div>
                      <div class="px-2 fs-15">
                        <input class="form-check-input" type="checkbox" />
                      </div>
                    </div>
                  </div>

                  <div class="my-3 text-center">
                    <BButton type="button" variant="soft-success">
                      View All Messages
                      <i class="ri-arrow-right-line align-middle"></i>
                    </BButton>
                  </div>
                </simplebar>
              </BTab> -->

                            <BTab title="Notificaciones" class="p-3 pt-2">
                                <Notification
                                    v-for="(
                                        notification
                                    ) in notifications"
                                    :key="notification.id"
                                    :notification="notification"
                                    @setSelectNotifications="
                                        setSelectNotifications
                                    "
                                    @deselectNotifications="
                                        deselectNotifications
                                    "
                                />
                                <simplebar
                                    data-simplebar
                                    style="max-height: 300px"
                                    class="pe-2"
                                    v-if="!notifications"
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
                                        class="d-none d-xl-block ms-1 fs-12 user-name-sub-text"
                                        >Administrador</span
                                    >
                                </span>
                            </span>
                        </template>
                        <h6 class="dropdown-header">
                            Hola {{ name }}!
                        </h6>
                        <router-link class="dropdown-item" to="/pages/profile"
                            ><i
                                class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"
                            ></i>
                            <span class="align-middle"> Perfil</span>
                        </router-link>
                        <!-- <router-link class="dropdown-item" to="/chat">
              <i class=" mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Messages</span>
            </router-link> -->
                        <!-- <router-link class="dropdown-item" to="/apps/tasks-kanban">
              <i class="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Espacio de Trabajo</span>
            </router-link> -->
                        <router-link class="dropdown-item" to="/pages/faqs"
                            ><i
                                class="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"
                            ></i>
                            <span class="align-middle"> Ayuda</span>
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <!-- <router-link class="dropdown-item" to="/pages/profile"><i
                class="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Balance : <b>$5971.67</b></span>
            </router-link> -->
                        <!-- <router-link class="dropdown-item" to="/pages/profile-setting">
              <BBadge variant="success-subtle" class="bg-success-subtle text-success mt-1 float-end">New</BBadge>
                <i
                class="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Configuración</span>
            </router-link> -->
                        <!-- <router-link class="dropdown-item" to="/auth/lockscreen-basic"><i
                class="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Bloquear Pantalla</span>
            </router-link> -->
                        <router-link class="dropdown-item" to="/logout"
                            ><i
                                class="mdi mdi-logout text-muted fs-16 align-middle me-1"
                            ></i>
                            <span class="align-middle" data-key="t-logout">
                                Cerrar Sesión</span
                            >
                        </router-link>
                    </BDropdown>
                </div>
            </div>
        </div>
    </header>
</template>
