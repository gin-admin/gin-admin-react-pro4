const accessTokenKey = 'access_token';

export default class store {
  static active = false;
  // 设定访问令牌
  static setAccessToken(token) {
    this.active = true;
    sessionStorage.setItem(accessTokenKey, JSON.stringify(token));
  }

  // 获取访问令牌
  static getAccessToken() {
    if (!this.active) return '';
    const token = sessionStorage.getItem(accessTokenKey);
    if (!token || token === '') {
      return null;
    }
    return JSON.parse(token);
  }

  // 清空访问令牌
  static clearAccessToken() {
    this.active = false;
    sessionStorage.removeItem(accessTokenKey);
  }
}
