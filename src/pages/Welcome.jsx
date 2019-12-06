import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Card, Typography, Alert } from 'antd';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default () => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message={formatMessage({
          id: 'app.welcome.title',
        })}
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text strong>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/gin-admin/gin-admin-react/issue">
          <FormattedMessage
            id="app.welcome.link.gin-admin-react"
            defaultMessage="使用中遇到问题，请先保证 gin-admin 为最新版本。仍有问题，请提 issue"
          />
        </a>
      </Typography.Text>
      <CodePreview>
        https://github.com/gin-admin/gin-admin
      </CodePreview>
      <Typography.Text strong>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/LyricTian/gin-admin-cli">
          <FormattedMessage
            id="app.welcome.project.gin-admin"
            defaultMessage="使用 gin-admin-cli 快速构建 gin-admin"
          />
        </a>
      </Typography.Text>
      <CodePreview>
        go get -v github.com/LyricTian/gin-admin-cli && gin-admin-cli new -m -d ~/go/src/gin-admin -p gin-admin
      </CodePreview>
    </Card>
  </PageHeaderWrapper>
);
