import request from '@/utils/request';
import * as API from '@/api';

export async function accountLogin(params) {
  return request(API.Public.Login.Base, {
    method: 'POST',
    data: params,
  });
}

export async function accountLogout() {
  return request(API.Public.Login.Exit, {
    method: 'POST',
  });
}

export async function menuTree() {
  return request(API.Public.Current.QueryUserMenuTree);
}

export async function current() {
  return request(API.Public.Current.GetUserInfo);
}

export async function updatePassword(params) {
  return request(API.Public.Current.UpdatePassword, {
    method: 'PUT',
    data: params,
  });
}

export async function getCaptcha() {
  return request(API.Public.Login.GetCaptcha);
}

export async function refreshCaptcha(params) {
  return request(API.Public.Login.ResCaptcha, {
    method: 'GET',
    data: {
      ...params,
      reload: 'yes',
    },
  });
}
