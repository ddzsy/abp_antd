import { routerRedux } from "dva/router";
import { stringify } from "qs";
import {
  fakeAccountLogin,
  getFakeCaptcha,
  authenticate,
  getAll
} from "@/services/api";

import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { setToken } from "../utils/authenticate";
import { reloadAuthorized } from "@/utils/Authorized";

export default {
  namespace: "login",

  state: {
    status: undefined,
    token: undefined
  },

  effects: {
    *authenticate({ payload }, { call, put }) {
      const response = yield call(authenticate, payload);
      if (!response) {
        console.log(response);
      } else if (response.success) {
        yield put({
          type: "setToken",
          payload: response.result
        });
        const res = yield call(getAll);

        var permissions = Object.keys(res.result.auth.grantedPermissions);
        setAuthority(permissions);
        reloadAuthorized();

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf("#") + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || "/"));
      }
    },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response
      });
      // Login successfully
      if (response.status === "ok") {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf("#") + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || "/"));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          status: false,
          currentAuthority: "guest"
        }
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: "/user/login",
          search: stringify({
            redirect: window.location.href
          })
        })
      );
    }
  },

  reducers: {
    setToken(state, { payload }) {
      setToken(payload.accessToken);
      return {
        ...state,
        token: payload.accessToken
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type
      };
    }
  }
};
