export default {
  apiPrefix: "/api/v1",
  swagger: {
    path: "/api/docs",
    spec: "openapi.json",
  },
  auth: {
    path: "/auth",
    login: "/login",
    loginWithToken: "/loginWithToken",
    logout: "/logout",
    changePassword: "/password",
    register: "/register",
    update: "/update",
  },
  joke: {
    path: "/joke",
  },
  ping: {
    path: "/ping",
  },
  contest: {
    path: "/contest",
  },
  coin: {
    path: "/coin",
  }
};
