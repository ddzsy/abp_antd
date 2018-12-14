import { queryRole } from "@/services/role";

export default {
  namespace: "role",

  state: {
    data: {
      list: [],
      pagination: {
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
      }
    }
  },

  effects: {
    *fetchRole({ payload }, { call, put }) {
      if (!payload) {
        payload = {
          maxResultCount: 20,
          skipCount: 0
        };
      }

      const response = yield call(queryRole, payload);
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
