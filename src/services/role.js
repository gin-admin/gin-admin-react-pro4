import request from '@/utils/request';
import * as API from '@/api';

export async function query(params) {
  return request(API.Role.Base, {
    params,
  });
}

export async function get(params) {
  return request(`${API.Role.Base}/${params.record_id}`);
}

export async function create(params) {
  return request(API.Role.Base, {
    method: 'POST',
    data: params,
  });
}

export async function remove(params) {
  return request(`${API.Role.Base}/${params.record_id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request(`${API.Role.Base}/${params.record_id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function disable(params) {
  return request(`${API.Role.Base}/${params.record_id}/disable`, {
    method: 'PATCH',
  });
}

export async function enable(params) {
  return request(`${API.Role.Base}/${params.record_id}/enable`, {
    method: 'PATCH',
  });
}
