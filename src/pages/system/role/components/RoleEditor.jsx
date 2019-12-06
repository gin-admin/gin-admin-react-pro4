import {
  Card, Form,
  Input, InputNumber, Tooltip, Icon,
  Modal, message,
  Row, Col,
} from 'antd';
import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';

import RoleMenu from './RoleMenu';

class RoleEditor extends Component {
  static defaultProps = {
    handleEdit: () => {},
    handleEditModalVisible: () => {},
    values: {},
  };
  formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  handleSubmit = () => {
    const { form, handleEdit, values: oldValue } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.menus || fieldsValue.menus.length === 0) {
        message.warning(formatMessage({ id: 'component.placeholder.select.content' }, {
          content: formatMessage({
            id: 'menu.perm',
          }),
        }));
        return;
      }
      const formValues = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formValues,
        },
        () => {
          handleEdit(formValues);
        },
      );
    });
  };

  render() {
    const {
      editModalVisible, handleEditModalVisible,
      formType, values,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        title={formType === 'A' ?
          formatMessage({ id: 'component.operation.create' }) :
          formatMessage({ id: 'component.operation.update' })}
        width={900}
        visible={editModalVisible}
        destroyOnClose
        onCancel={() => handleEditModalVisible(false, values)}
        onOk={this.handleSubmit}
        afterClose={() => handleEditModalVisible()}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc( 100vh - 158px )',
          overflowY: 'auto'
        }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'role.field.name',
                })}>
                  {getFieldDecorator('name', {
                    initialValue: formType === 'A' ? null : values.name,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'component.placeholder.content' }, {
                          content: formatMessage({
                            id: 'role.field.name',
                          }),
                        }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'role.field.name',
                    }),
                  })} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'menu.field.sequence',
                })}>
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('sequence', {
                        initialValue: formType === 'A' ? 1000000 : values.sequence,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'component.placeholder.content' }, {
                              content: formatMessage({
                                id: 'menu.field.sequence',
                              }),
                            }),
                          },
                        ],
                      })(<InputNumber min={1} step={100} max={99999999} style={{ width: '100%' }} />)}
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Tooltip title={formatMessage({
                        id: 'component.order.description.desc',
                      })}>
                        <Icon type="question-circle"/>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item {...this.formItemLayout} label={formatMessage({
                  id: 'role.field.memo',
                })}>
                  {getFieldDecorator('memo', {
                    initialValue: formType === 'A' ? null : values.memo,
                  })(<Input.TextArea rows={2} placeholder={formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'role.field.memo',
                    }),
                  })} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card bordered={false} title={formatMessage({
                  id: 'menu.perm'
                })}>
                  {getFieldDecorator('menus', {
                    required: true,
                    initialValue: formType === 'A' ? null : values.menus,
                  })(<RoleMenu />)}
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(RoleEditor);
