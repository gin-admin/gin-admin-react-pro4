import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import user from './zh-CN/user';
import role from './zh-CN/role';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.name': '权限管理脚手架',
  'app.desc': 'gin-admin-react 基于 Ant Design Pro v4',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.title': 'gin-admin v5.2.0 现已发布，欢迎使用 gin-admin-cli 启动体验。',
  'app.welcome.link.gin-admin-react': '测试中遇到问题，请先保证 gin-admin 版本为最新版。仍有问题，请提 issue',
  'app.welcome.project.gin-admin': '使用 gin-admin-cli 快速构建 gin-admin',
  ...globalHeader,
  ...menu,
  ...user,
  ...role,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
