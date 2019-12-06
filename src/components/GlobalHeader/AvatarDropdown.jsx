import React from 'react';
import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import UpdatePasswordDialog from '@/pages/user/components/UpdatePasswordDialog';

class AvatarDropdown extends React.Component {
  state = {
    updatePasswordVisible: false,
  };

  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/logout',
      });
      return;
    } else if (key === 'password') {
      this.setState({ updatePasswordVisible: true });
      return;
    }

    router.push(`/account/${key}`);
  };

  handleCancel = () => {
    this.setState({ updatePasswordVisible: false });
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const { updatePasswordVisible } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
        <Menu.Item key="password">
          <Icon type="lock" />
          <FormattedMessage id="menu.account.password" defaultMessage="change password" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.real_name ? (
      <React.Fragment>
        <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} alt="avatar"
                  icon={currentUser.avatar ? null : 'user'}
                  src={currentUser.avatar ? currentUser.avatar : null} />
          <span className={styles.name}>{currentUser.real_name}</span>
        </span>
        </HeaderDropdown>
        <UpdatePasswordDialog visible={updatePasswordVisible}
                              onCancel={this.handleCancel} />
      </React.Fragment>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ global }) => ({
  currentUser: global.currentUser,
}))(AvatarDropdown);
