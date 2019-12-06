import { query, disable, enable, create, remove, update, get } from '@/services/user';
import md5 from 'md5';

const Model = {
  namespace: 'user',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload, success }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data,
        });
        if (success) success();
      }
    },

    *get({ payload, success }, { call }) {
      const { response, data } = yield call(get, payload);
      if (response.status === 200) {
        if (success) success(data);
      }
    },

    *add({ payload, success }, { call, put }) {
      payload.password = md5(payload.password);
      const { response } = yield call(create, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'user(s)', action: 'create',
        }});
        if (success) success();
      }
    },

    *remove({ payload, success }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'user(s)', action: 'delete',
        }});
        if (success) success();
      }
    },

    *update({ payload, success }, { call, put }) {
      if (payload.password) {
        payload.password = md5(payload.password);
      }
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'user(s)', action: 'update',
        }});
        if (success) success();
      }
    },

    *enable({ payload, callback }, { call, put }) {
      const { response } = yield call(enable, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'user(s)', action: 'enable',
        }});
        yield put({
          type: 'updateData',
          payload: payload,
        });
      }
      if (callback) callback();
    },

    *disable({ payload, callback }, { call, put }) {
      const { response } = yield call(disable, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'user(s)', action: 'disable',
        }});
        yield put({
          type: 'updateData',
          payload: payload,
        });
      }
      if (callback) callback();
    },
  },
  reducers: {
    updateData(state, { payload }) {
      state.data.list = state.data.list.map(item => {
        if (item.record_id === payload.record_id) {
          return payload;
        }
        return item;
      });
      return state;
    },

    save(state, { payload }) {
      return { ...state, data: payload };
    },

    changeNotifyCount(state, { payload }) {
      return { ...state };
    },
  },
};
export default Model;
