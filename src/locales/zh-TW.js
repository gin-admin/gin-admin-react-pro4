import component from './zh-TW/component';
import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import pwa from './zh-TW/pwa';
import settingDrawer from './zh-TW/settingDrawer';
import settings from './zh-TW/settings';
export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.preview.down.block': '下載此頁面到本地項目',
  'app.welcome.title': 'gin-admin v5.2.0 現已發布，歡迎使用 gin-admin-cli 啟動體驗。',
  'app.welcome.link.gin-admin-react': '測試中遇到問題，請先保證 gin-admin 版本為最新版。仍有問題，請提 issue',
  'app.welcome.project.gin-admin': '使用 gin-admin-cli 快速構建 gin-admin',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
