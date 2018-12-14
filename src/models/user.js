import { query, queryUsers, queryCurrent, test } from "@/services/user";
import { setPermissions } from "../utils/permissions";

export default {
  namespace: "user",

  state: {
    list: [],
    currentUser: {},
    data: {
      list: [],
      pagination: {
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
      }
    },
    test: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(query);
      yield put({
        type: "oldSave",
        payload: response
      });
    },
    *fetchUsers({ payload }, { call, put }) {
      if (!payload) {
        payload = {
          maxResultCount: 20,
          skipCount: 0
        };
      }
      const response = yield call(queryUsers, payload);
      if (response.success) {
        const result = {
          list: response.result.items,
          pagination: {
            current: payload.skipCount / payload.maxResultCount + 1,
            pageSize: payload.maxResultCount,
            total: response.result.totalCount
          }
        };
        yield put({
          type: "save",
          payload: result
        });
      } else {
        console.log(response);
      }
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: "saveCurrentUser",
        payload: response
      });
    },
    *fetchTest(_, { call, put }) {
      const response = yield call(test);
      var permissions = Object.keys(response.result.auth.grantedPermissions);

      setPermissions(permissions);
      yield put({
        type: "test",
        payload: response
      });
    }
  },

  reducers: {
    test(state, action) {
      return {
        ...state,
        test: action.payload
      };
    },
    save(state, action) {
      var newState = { ...state };
      newState.data.list = action.payload.list;
      newState.data.pagination = {
        ...newState.data.pagination,
        current: action.payload.pagination.current,
        total: action.payload.pagination.total
      };
      return newState;
    },
    oldSave(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount
        }
      };
    }
  }
};
