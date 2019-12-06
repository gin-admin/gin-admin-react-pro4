import {
  Layout, Card, Form,
  Input, Button, Radio, Icon, Tree,
  Row, Col,
  Modal,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import StandardTable from './components/StandardTable';
import MenuEditor from './components/MenuEditor';
import styles from './style.less';

const { confirm, error } = Modal;
const { TreeNode } = Tree;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    expandedKeys: [],
    formValues: {},
    stepFormValues: {},
    pagination: {},
  };
  columns = [
    {
      title: formatMessage({ id: 'menu.field.name' }),
      dataIndex: 'name',
      render: (val, record) => <React.Fragment>
        <Icon type={record.icon}/>{val}
      </React.Fragment>,
    },
    {
      title: formatMessage({ id: 'menu.field.sequence' }),
      dataIndex: 'sequence',
    },
    {
      title: formatMessage({ id: 'menu.field.hidden' }),
      dataIndex: 'hidden',
      render: val => val === 0 ?
        formatMessage({ id: 'component.option.show' }) :
        formatMessage({ id: 'component.option.hidden' }),
    },
    {
      title: formatMessage({ id: 'menu.field.icon' }),
      dataIndex: 'icon',
    },
    {
      title: formatMessage({ id: 'menu.field.router' }),
      dataIndex: 'router',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetch',
    });
  }

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

  handleEdit = fields => {
    const { formType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: formType === 'E' ? 'menu/update' : 'menu/add',
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
        type: 'menu/get',
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

  handleDelClick = () => {
    const { selectedRows } = this.state;
    const { menu: { treeData } } = this.props;
    const row = selectedRows[0];

    const disableOperationMenus = [
      '/system/menu',
      '/system/role',
      '/welcome',
      '/user',
      '/demo',
    ];

    if (disableOperationMenus.indexOf(row.router) !== -1) {
      error({
        title: formatMessage({ id: 'menu.operation.delete.refuse' }),
        content: formatMessage({ id: 'menu.operation.delete.refuse.preset' }),
      });
      return;
    }
    if (treeData.findIndex(menu => menu.router === row.router && menu.children && menu.children.length > 0) !== -1) {
      error({
        title: formatMessage({ id: 'menu.operation.delete.refuse' }),
        content: formatMessage({ id: 'menu.operation.delete.refuse.submenu' }),
      });
      return;
    }

    const modal = confirm({
      title: formatMessage({ id: 'menu.operation.delete.refuse.confirm' }),
      content: (
        <React.Fragment>
          <span style={{
            marginBottom: '10px',
            display: 'block'
          }}>
            {formatMessage({ id: 'component.name:.content' }, { content: row.name })}
          </span>
          <Input placeholder={formatMessage({ id: 'menu.operation.delete.refuse.confirm.name' })}
                 onChange={({ target: { value: menuName } }) => {
                   this.setState({ menuName });
                   modal.update({
                     okButtonProps: {
                       disabled: menuName !== row.name
                     },
                   })
                 }}/>
        </React.Fragment>
      ),
      okText: formatMessage({ id: 'component.button.confirm' }),
      okType: 'danger',
      okButtonProps: {
        disabled: true,
      },
      cancelText: formatMessage({ id: 'component.button.cancel' }),
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'menu/remove',
          payload: row,
          success: () => this.fetch({ menuName: '' }),
        });
      },
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
      const values = {
        ...fieldsValue,
      };
      this.fetch(values, true);
    });
  };

  fetch = (formValues, reset) => {
    const { dispatch } = this.props;
    let payload = {};
    if (typeof reset === 'undefined' || reset !== true) {
      const { pagination, formValues: oldFormValues } = this.state;
      formValues = { ...oldFormValues, ...formValues };
      payload = {
        ...pagination,
        ...formValues,
      };
    } else {
      payload = formValues;
    }
    dispatch({
      type: 'menu/fetch',
      payload,
      success: () => this.setState({ formValues, selectedRows: [] }),
    });
  };

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'menu.field.name'})}>
              {getFieldDecorator('name')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
              }, {
                content: formatMessage({
                  id: 'menu.field.name',
                }) })} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'menu.field.hidden'})}>
              {getFieldDecorator('hidden')(
                <Radio.Group>
                  <Radio value={-1}><FormattedMessage id='component.option.all' /></Radio>
                  <Radio value={0}><FormattedMessage id='component.option.show' /></Radio>
                  <Radio value={1}><FormattedMessage id='component.option.hidden' /></Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
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

  renderTreeNodes = data => {
    return data ? data.map(item => {
      if (item.children) {
        return (
          <TreeNode icon={<Icon type={item.icon}/>} title={item.name} key={item.record_id}
                    dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode icon={<Icon type={item.icon}/>} title={item.name} key={item.record_id}
                       dataRef={item}/>;
    }) : null;
  };

  render() {
    const {
      menu: { data, treeData },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, formType, stepFormValues, expandedKeys } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      formType,
      treeData,
    };

    return (
      <PageHeaderWrapper>
        <Layout>
          <Layout.Sider
            width={200}
            style={{
              background: '#fff',
              borderRight: '1px solid lightGray'
            }}
          >
            <Tree
              showIcon
              expandedKeys={expandedKeys}
              switcherIcon={<Icon type="down"/>}
              onExpand={expandedKeys => {
                this.setState({ expandedKeys })
              }}
              onSelect={recordID => {
                if (recordID[0]) {
                  this.fetch({ parentID: recordID[0] === 'all' ? null : recordID[0] }, true)
                }
              }}
            >
              {this.renderTreeNodes([{
                record_id: 'all',
                name: formatMessage({ id: 'component.option.all' })
              }, ...treeData])}
            </Tree>
          </Layout.Sider>
          <Layout.Content>
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
                          <Button type='danger'
                                  onClick={this.handleDelClick}>
                        <Icon type='delete'/>
                        <FormattedMessage id='component.operation.delete' />
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
                  size="small"
                />
              </div>
            </Card>
            <MenuEditor {...parentMethods} editModalVisible={editModalVisible}
                      values={stepFormValues}/>
          </Layout.Content>
        </Layout>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
