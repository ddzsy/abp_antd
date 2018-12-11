import { queryAudit } from "@/services/audit";

export default {
  namespace: "auditLog",

  state: {
    data: {
      list: [],
      pagination: {
        pageSize: 20
      }
    }
  },

  effects: {
    *fetchAudit({ payload }, { call, put }) {
      let yesterday = new Date();
      yesterday.setDate(new Date().getDate() - 1);
      if (!payload) {
        payload = {
          startDate: yesterday,
          endDate: new Date(),
          maxResultCount: 20,
          skipCount: 0
        };
      }
      if (!payload.startDate) {
        payload.startDate = yesterday;
      }
      if (!payload.endDate) {
        payload.endDate = new Date();
      }
      const response = yield call(queryAudit, payload);

      const result = {
        list: response.result.items,
        pagination: {
          total: response.result.totalCount
        }
      };
      yield put({
        type: "save",
        payload: result
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  }
};
