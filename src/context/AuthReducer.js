import { LOAD_USER, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT } from "./types";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case LOAD_USER:
      return {
        ...state,
        isAuth: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        isAuth: true,
        loading: false,
      };

    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        isAuth: false,
        loading: false,
      };

    default:
      return state;
  }
};

export default AuthReducer;
