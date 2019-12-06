import { Icon, notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import { queryNotices } from '@/services/user';
import { menuTree, current } from '@/services/login';
import store from '@/utils/store';
import { routerRedux } from 'dva/router';

const Model = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    currentUser: {
      user_name: '',
      real_name: '',
      role_names: [],
    },
    routes: [],
    menus: [],
    menuTree: [],
  },
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *fetchCurrent({ success }, { call, put }) {
      const auth = store.getAccessToken();
      if (auth === '') {
        yield put(routerRedux.replace('/login'));
        return;
      }
      const { response, data } = yield call(current);
      if (response.status === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: data,
        });
        if (success) success();
      }
    },

    *fetchMenuTree({ payload: { routes } }, { call, put }) {
      const { response, data: { list } } = yield call(menuTree);
      if (response.status === 200) {
        yield put({
          type: 'saveMenuTree',
          payload: {
            menuTree: list,
            routes,
          },
        });
      }
    },

    *requestSuccess({ payload: { id, action } }) {
      notification.open({
        message: formatMessage({ id: `component.operation.${action}.content` }, {
          content: formatMessage({
            id: 'component.notification.request.success.content'}, {
            content: formatMessage({
              id: id })
          })
        }),
        icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>,
        duration: 1,
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload || {} };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveMenuTree(state, { payload: { menuTree, routes } }) {
      let newRoutes = [];
      function resetRouter(menuTree, router) {
        menuTree.map(menu => {
          const found = router.find(item => item.path === menu.router && menu.hidden === 0);
          if (found) {
            found.icon = menu.icon;
            newRoutes.push(found);
            if (found.children && found.children > 0 && menu.children && menu.children > 0) {
              resetRouter(menu.children, found);
            }
          }
        });
      }
      resetRouter(menuTree, routes);

      return {
        ...state,
        menuTree,
        routes: newRoutes,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default Model;
