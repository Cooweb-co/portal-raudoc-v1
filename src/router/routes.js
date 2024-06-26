import store from "@/state/store";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/login.vue"),
    meta: {
      title: "Login",
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
          next();
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/creacion-usuario",
    name: "createUser",
    component: () => import("../views/pages/create-user.vue"),
    meta: {
      title: "Creación de usuario"
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: "notFound",
    component: () => import("../views/auth/errors/404-cover.vue"),
    meta: {
      title: "Página no encontrada"
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/account/register.vue"),
    meta: {
      title: "Register",
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../views/account/forgot-password.vue"),
    meta: {
      title: "Forgot Password",
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/",
    name: "default",
    meta: {
      title: "Dashboard",
      authRequired: true,
    },
    component: () => import("../views/dashboard/projects/index"),
  },

  // RouDoc - Gestion Documental

  {
    path: "/r/:company/:documentID",
    name: "consulta-de-radicado",
    meta: {
      title: "Consulta de radicado",
    },
    component: () => import("../views/admin-doc/OverviewWithoutSign"),
  },

  {
    path: "/ver-radicado",
    name: "buscar-radicado",
    meta: {
      title: "Buscar radicado",
    },
    component: () => import("../views/admin-doc/detailsDocuments/SearchDocument"),
  },

  {
    path: "/gestion-documental/radicado/:documentID",
    name: "projects-overview",
    meta: { title: "Resumen de proyectos", authRequired: true },
    component: () => import("../views/admin-doc/detailsDocuments/Overview"),
  },
  {
    path: "/radicacion/radicar-documento/:id?",
    name: "claim",
    meta: { title: "Radicación", authRequired: true },
    component: () => import("../views/admin-doc/create"),
  },

  {
    path: "/gestion-documental/document-list",
    name: "document-list",
    meta: { title: "Document - List", authRequired: true },
    component: () => import("../views/admin-doc/document-list"),
  },
  {
    path: "/gestion-documental/lista-radicados",
    name: "list-claim",
    meta: { title: "Lista de Radicados", authRequired: true },
    component: () => import("../views/tickets/List"),
  },
  {
    path: "/administracion/usuarios",
    name: "administration-users",
    meta: { title: "Administración de usuarios", authRequired: true },
    component: () => import("../views/apps/jobs/candidate-lists.vue"),
  },
  {
    path: "/dashboard/projects",
    name: "dashboard-projects",
    meta: {
      title: "Projects", authRequired: true,
    },
    component: () => import("../views/dashboard/projects/index"),
  },
  {
    path: "/logout",
    name: "logout",
    meta: {
      title: "Logout", authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        localStorage.clear();
        sessionStorage.clear();
        next();
      },
    },
    component: () => import("../views/auth/logout/basic")
  },
  {
    path: "/pages/faqs",
    name: "FAQs",
    meta: { title: "FAQs", authRequired: true },
    component: () => import("../views/pages/faqs"),
  },
  {
    path: "/pages/profile",
    name: "profile",
    meta: { title: "Profile", authRequired: true },
    component: () => import("../views/pages/profile/simple"),
  },
];