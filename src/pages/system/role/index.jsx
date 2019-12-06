import {
  Card, Form,
  Input, Button, Icon,
  Modal,
  Row, Col,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import StandardTable from './components/StandardTable';
import RoleEditor from './components/RoleEditor';
import styles from './style.less';

const { confirm } = Modal;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    expandedKeys: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: formatMessage({ id: 'role.field.name' }),
      dataIndex: 'name',
      render: (val, record) => <React.Fragment>
        <Icon type={record.icon}/>{val}
      </React.Fragment>,
    },
    {
      title: formatMessage({ id: 'role.field.sequence' }),
      dataIndex: 'sequence',
    },
    {
      title: formatMessage({ id: 'role.field.memo' }),
      dataIndex: 'memo',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchTree',
    });
    dispatch({
      type: 'role/fetch',
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
      type: formType === 'E' ? 'role/update' : 'role/add',
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
        type: 'role/get',
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
    const row = selectedRows[0];
    const modal = confirm({
      title: formatMessage({ id: 'role.operation.delete.refuse.confirm' }),
      content: (
        <React.Fragment>
          <span style={{
            marginBottom: '10px',
            display: 'block'
          }}>
            {formatMessage({ id: 'component.name:.content' }, { content: row.name })}
          </span>
          <Input placeholder={formatMessage({ id: 'role.operation.delete.refuse.confirm.name' })}
                 onChange={({ target: { value: roleName } }) => {
                   this.setState({ roleName });
                   modal.update({
                     okButtonProps: {
                       disabled: roleName !== row.name
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
          type: 'role/remove',
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
      type: 'role/fetch',
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label={formatMessage({ id: 'role.field.name'})}>
              {getFieldDecorator('name')
              (<Input placeholder={formatMessage({
                id: 'component.placeholder.content'
              }, {
                content: formatMessage({
                  id: 'role.field.name',
                }) })} />)}
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

  render() {
    const {
      role: { data },
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
        <RoleEditor {...parentMethods} editModalVisible={editModalVisible}
                  values={stepFormValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
