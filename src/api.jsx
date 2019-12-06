const Domain = 'http://127.0.0.1:10087'; /* 使用当前域名留空 */
const BaseUrl = `${Domain}/api`;

export const Public = {
  Login: {
    Base: `${BaseUrl}/v1/pub/login`,
    Exit: `${BaseUrl}/v1/pub/login/exit`,
    GetCaptcha: `${BaseUrl}/v1/pub/login/captchaid`,
    ResCaptcha: `${BaseUrl}/v1/pub/login/captcha`,
  },
  RefreshToken: `${BaseUrl}/v1/pub/refresh-token`,
  Current: {
    UpdatePassword:  `${BaseUrl}/v1/pub/current/password`,
    GetUserInfo:  `${BaseUrl}/v1/pub/current/user`,
    QueryUserMenuTree:  `${BaseUrl}/v1/pub/current/menutree`,
  }
};

export const Demo = {
  Base: `${BaseUrl}/v1/demos`,
};

export const Menu = {
  Base: `${BaseUrl}/v1/menus`,
  Tree: `${BaseUrl}/v1/menus.tree`,
};

export const Role = {
  Base: `${BaseUrl}/v1/roles`,
  Select: `${BaseUrl}/v1/roles.select`,
};

export const User = {
  Base: `${BaseUrl}/v1/users`,
};
