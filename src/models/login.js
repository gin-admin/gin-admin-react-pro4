import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import {
  accountLogin,
  accountLogout,
  getCaptcha,
  refreshCaptcha,
  updatePassword,
} from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import store from '@/utils/store';
import md5 from 'md5';
// import { setAuthority } from '@/utils/authority';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    captchaID: '',
  },
  effects: {
    *login({ payload, error }, { call, put }) {
      payload.password = md5(payload.password);
      const { response, data } = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: data,
      }); // Login successfully

      if (response.status === 200) {
        store.setAccessToken(data);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      } else {
        if (error) error();
        yield put({ type: 'getCaptcha' });
      }
    },

    *getCaptcha(_, { call, put }) {
      const { response, data } = yield call(getCaptcha);
      if (response.status === 200) {
        yield put({
          type: 'saveCaptchaID',
          payload: data
        })
      }
    },

    *refreshCaptcha({ payload }, { call }) {
      yield call(refreshCaptcha, payload);
    },

    *updatePassword({ payload, success }, { call, put }) {
      const { response } = yield call(updatePassword, payload);
      if (response.status === 200) {
        yield put({ type: 'global/requestSuccess', payload: {
            id: 'user.field.password', action: 'update',
          }});
        if (success) success();
      }
    },

    *logout(_, { call, put }) {
      const { response } = yield call(accountLogout);
      if (response.status === 200) {
        store.clearAccessToken();

        const { redirect } = getPageQuery(); // redirect
        if (window.location.pathname !== '/login' && !redirect) {
          yield put(
            routerRedux.replace({
              pathname: '/login',
              search: stringify({
                redirect: window.location.href,
              }),
            }),
          );
        }
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return { ...state, status: true };
    },
    saveCaptchaID(state, { payload }) {
      return { ...state, captchaID: payload.captcha_id };
    },
  },
};
export default Model;
