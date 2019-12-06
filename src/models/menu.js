import { create, query, queryTree, get, remove, update } from '@/services/menu';

const Model = {
  namespace: 'menu',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData: [],
  },
  effects: {
    *fetch({ payload, success }, { call, put }) {
      const { response, data } = yield call(query, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: data,
        });
        yield put({ type: 'fetchTree' });
        if (success) success();
      }
    },

    *get({ payload, success }, { call }) {
      const { response, data } = yield call(get, payload);
      if (response.status === 200) {
        if (success) success(data);
      }
    },

    *fetchTree({ payload, success }, { call, put }) {
      const { response, data } = yield call(queryTree, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveTree',
          payload: data.list || [],
        });
        /* 在角色管理页面可以输出 菜单树 JSON */
        // yield put({
        //   type: 'outputMenus',
        // });
        if (success) success(data.list);
      }
    },

    *add({ payload, success }, { call, put }) {
      const { response } = yield call(create, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'menu(s)', action: 'create',
        }});
        if (success) success();
      }
    },

    *remove({ payload, success }, { call, put }) {
      const { response } = yield call(remove, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'menu(s)', action: 'delete',
        }});
        if (success) success();
      }
    },

    *update({ payload, success }, { call, put }) {
      const { response } = yield call(update, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
          id: 'menu(s)', action: 'update',
        }});
        if (success) success();
      }
    },
  },
  reducers: {
    updateData(state, { payload }) {
      const { data } = state;
      data.list = data.list.map(item => {
        if (item.record_id === payload.record_id) {
          return payload;
        }
        return item;
      });
      return {
        ...state,
        data
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveTree(state, { payload }) {
      return {
        ...state,
        treeData: payload,
      };
    },
    /* 在角色管理页面可以输出 菜单树 JSON */
    outputMenus(state) {
      let menus = JSON.parse(JSON.stringify(state.treeData));
      menus.map(menu => {
        delete menu['parent_id'];
        delete menu['parent_path'];
        delete menu['hidden'];
        if (menu.children && menu.children.length > 0) {
          delete menu['router'];
          delete menu['actions'];
          delete menu['resources'];
          menu.children.map(menu => {
            delete menu['parent_id'];
            delete menu['parent_path'];
            delete menu['children'];
            delete menu['record_id'];
            delete menu['hidden'];
          });
          Object.keys(menu.children).sort();
        } else {
          delete menu['children'];
        }

        delete menu['record_id'];
        Object.keys(menu).sort();
      });
      console.log('menus', JSON.stringify(menus));
    }
  },
};
export default Model;
