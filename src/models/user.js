import { query as queryUsers, queryCurrent, test } from '@/services/user';
import { setPermissions } from '../utils/permissions';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    test: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchTest(_, { call, put }) {
      const response = yield call(test);
      setPermissions(response.result.auth.grantedPermissions);
      yield put({
        type: 'test',
        payload: response,
      });
    },
  },

  reducers: {
    test(state, action) {
      return {
        ...state,
        test: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
