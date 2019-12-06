import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import store from '@/utils/store';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;

    dispatch({
      type: 'global/fetchCurrent',
      success: () => {
        dispatch({
          type: 'global/fetchMenuTree',
          payload: {
            routes : this.props.route.routes[0].routes,
          },
        });
      },
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const isLogin = store.getAccessToken();
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin) {
      return <Redirect to={`/login?${queryString}`}></Redirect>;
    }

    return children;
  }
}

export default connect(({ loading }) => ({
  loading: loading.models.global,
}))(SecurityLayout);
