export default {
  apiPrefix: "/api/v1",
  swagger: {
    path: "/api/docs",
    spec: "openapi.json",
  },
  auth: {
    path: "/auth",
    login: "/login",
    logout: "/logout",
    changePassword: "/password",
    register: "/register",
  },
  joke: {
    path: "/joke",
  },
  ping: {
    path: "/ping",
  },
  contest: {
    path: "/contest",
  }
};
