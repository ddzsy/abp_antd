import { queryAudit } from "@/services/audit";

export default {
  namespace: "auditLog",

  state: {
    data: {
      list: [],
      pagination: {
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
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
          current: payload.skipCount / payload.maxResultCount + 1,
          pageSize: payload.maxResultCount,
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
      var newState = { ...state };
      newState.data.list = action.payload.list;
      newState.data.pagination = {
        ...newState.data.pagination,
        current: action.payload.pagination.current,
        total: action.payload.pagination.total
      };
      return newState;
    }
  }
};
