import {
  Card, Form,
  Input, Button, Radio, Icon, Badge, Switch,
  Row, Col,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import StandardTable from './components/StandardTable';
import UserEditor from './components/UserEditor';
import RoleSelect from './components/RoleSelect';
import styles from './style.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'error'];

/* eslint react/no-multi-comp:0 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: formatMessage({
        id: 'user.field.userName',
      }),
      dataIndex: 'user_name',
      render(val, record) {
        return <Badge status={statusMap[record.status]} text={val}/>
      }
    },
    {
      title: formatMessage({
        id: 'user.field.realName',
      }),
      dataIndex: 'real_name',
    },
    {
      title: formatMessage({
        id: 'user.field.roles',
      }),
      dataIndex: 'roles',
      render: val => {
        if (!val || val.length === 0) {
          return '-';
        }
        const names = [];
        for (let i = 0; i < val.length; i += 1) {
          names.push(val[i].name);
        }
        return names.join(' | ');
      },
    },
    {
      title: formatMessage({
        id: 'user.field.email',
      }),
      dataIndex: 'email',
    },
    {
      title: formatMessage({
        id: 'user.field.phone',
      }),
      dataIndex: 'phone',
    },
    {
      title: formatMessage({
        id: 'user.field.createdAt',
      }),
      dataIndex: 'created_at',
      render: val => <span>{moment(val)
        .format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: formatMessage({
        id: 'user.field.status',
      }),
      dataIndex: 'status',
      render: (val, record) => {
        return <Switch checkedChildren={formatMessage({
                          id: 'component.option.normal'
                        })}
                       unCheckedChildren={formatMessage({
                         id: 'component.option.ban'
                       })}
                       onChange={() => this.handleSwitchUserStatus(record)} checked={val === 1}/>;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }

  fetch = (formValues, reset) => {
    const { dispatch } = this.props;
    let payload = {};
    if (typeof reset === 'undefined' || reset !== true) {
      const { pagination, formValues: oldFormValues } = this.state;
      formValues = { ...oldFormValues, ...formValues };
      payload = {
        ...pagination,
        ...formValues,
      }
    } else {
      payload = formValues;
    }
    dispatch({
      type: 'user/fetch',
      payload,
      success: () => this.setState({ formValues, selectedRows: [] }),
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg)
      .reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
    const params = {
      ...formValues,
      ...pagination,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetch(params);
  };

  handleFormReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.fetch({}, true);
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let role_ids = '';
      if (fieldsValue.role_ids) {
        role_ids = fieldsValue.role_ids.map(v => v.role_id).join(',');
      }
      const values = {
        ...fieldsValue,
        role_ids,
      };
      this.fetch(values, true);
    });
  };

  handleSwitchUserStatus = record => {
    const { dispatch } = this.props;
    let type;
    if (record.status === 1) {
      type = 'user/disable';
      record.status = 2;
    } else {
      type = 'user/enable';
      record.status = 1;
    }
    dispatch({
      type: type,
      payload: record,
    });
  };

  handleEdit = fields => {
    const { formType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: formType === 'E' ? 'user/update' : 'user/add',
      payload: fields,
      success: () => {
        this.fetch();
        this.handleEditModalVisible();
      },
    });
  };

  handleEditClick = formType => {
    if (formType === 'E') {
      const { selectedRows } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/get',
        payload: selectedRows[0],
        success: data => {
          this.setState({
            editModalVisible: true,
            formType,
            stepFormValues: data,
          });
        }
      });
    } else {
      this.setState({
        editModalVisible: true,
        formType,
      });
    }
  };

  handleDisableUsers = records => {
    for (let record of records) {
      record.status = 2;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/disable',
        payload: record,
      });
    }
  };

  handleEnableUsers = records => {
    for (let record of records) {
      record.status = 1;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/enable',
        payload: record,
      });
    }
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.userName'})}>
              {getFieldDecorator('user_name')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
                }, {
                content: formatMessage({
                  id: 'user.field.userName',
                }) })} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.search.roles'})}>
              {getFieldDecorator('role_ids')(<RoleSelect />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.phone'})}>
              {getFieldDecorator('phone')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
              }, {
                content: formatMessage({
                  id: 'user.field.phone',
                }) })} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.realName'})}>
              {getFieldDecorator('real_name')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
              }, {
                content: formatMessage({
                  id: 'user.field.realName',
                }) })} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'user.field.status'})}>
              {getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={0}><FormattedMessage id='component.option.all' /></Radio>
                  <Radio value={1}><FormattedMessage id='component.option.normal' /></Radio>
                  <Radio value={2}><FormattedMessage id='component.option.ban' /></Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  <FormattedMessage id='component.searchList.search' />
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  <FormattedMessage id='component.searchList.reset' />
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      user: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, formType, stepFormValues } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      formType,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleEditClick('A')}>
                <FormattedMessage id='component.operation.create' />
              </Button>
              {selectedRows.length > 0 && (
                <React.Fragment>
                  {selectedRows.length === 1 ?
                    <Button onClick={() => this.handleEditClick('E')}>
                      <Icon type='edit'/>
                      <FormattedMessage id='component.operation.edit' />
                    </Button> : null}
                  <Button onClick={() => this.handleEnableUsers(selectedRows)}>
                    <Icon type='check'/>
                    <FormattedMessage id='component.operation.enable' />
                  </Button>
                  <Button type='danger'
                          onClick={() => this.handleDisableUsers(selectedRows)}>
                    <Icon type='stop'/>
                    <FormattedMessage id='component.operation.disable' />
                  </Button>
                </React.Fragment>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <UserEditor {...parentMethods} editModalVisible={editModalVisible}
                    values={stepFormValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
