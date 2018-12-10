import { queryAudit } from "@/services/audit";

export default {
  namespace: "auditLog",

  state: {
    auditList: [],
    pagination: {}
  },

  effects: {
    *fetchAudit({ payload }, { call, put }) {
      const response = yield call(queryAudit, payload);
      yield put({
        type: "save",
        payload: response.result
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        auditList: action.payload.items,
        pagination: { total: action.payload.totalCount }
      };
    }
  }
};
