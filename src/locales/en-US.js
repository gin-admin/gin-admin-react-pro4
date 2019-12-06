import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import user from './en-US/user';
import role from './en-US/role';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.name': 'gin-admin-react',
  'app.desc': 'gin-admin-react Based on Ant Design Pro v4',
  'app.welcome.title': 'gin-admin v5.2.0 released, start the experience with gin-admin-cli.',
  'app.welcome.link.gin-admin-react': 'In case of problems, please keep gin-admin up to date. Still have issues, please report it',
  'app.welcome.project.gin-admin': 'Use gin-admin-cli to quickly build gin-admin',
  ...globalHeader,
  ...menu,
  ...user,
  ...role,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
