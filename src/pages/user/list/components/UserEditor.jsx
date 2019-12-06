import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio } from 'antd';
import RoleSelect from './RoleSelect';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

@connect(user => ({
  user,
}))
class UserEditor extends PureComponent {
  static defaultProps = {
    handleEdit: () => {},
    handleEditModalVisible: () => {},
    values: {},
  };

  handleSubmit = () => {
    const { form, handleEdit, values: oldValue } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
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
        width={600}
        visible={editModalVisible}
        destroyOnClose
        onCancel={() => handleEditModalVisible(false, values)}
        onOk={this.handleSubmit}
        afterClose={() => handleEditModalVisible()}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.userName',
          })}>
            {getFieldDecorator('user_name', {
              initialValue: formType === 'A' ? null : values.user_name,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.field.userName',
                    }),
                  }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'component.placeholder.content' }, {
              content: formatMessage({
                id: 'user.field.userName',
              }),
            })} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.password',
          })}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: formType === 'A',
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.field.password',
                    }),
                  }),
                },
              ],
            })(<Input placeholder={formType === 'A' ? formatMessage({ id: 'component.placeholder.content' }, {
              content: formatMessage({
                id: 'user.field.password',
              }),
            }) : '留空则不修改登录密码'} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.realName',
          })}>
            {getFieldDecorator('real_name', {
              initialValue: formType === 'A' ? null : values.real_name,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.field.realName',
                    }),
                  }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'component.placeholder.content' }, {
              content: formatMessage({
                id: 'user.field.realName',
              }),
            })} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.roles',
          })}>
            {getFieldDecorator('roles', {
              initialValue: formType === 'A' ? null : values.roles,
              rules: [
                {
                  required: formType === 'A',
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'user.field.roles',
                    }),
                  }),
                },
              ],
            })(<RoleSelect />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.status',
          })}>
            {getFieldDecorator('status', {
              initialValue: formType === 'A' ? 1 : values.status,
            })(<Radio.Group>
                <Radio value={1}><FormattedMessage id='component.option.normal' /></Radio>
                <Radio value={2}><FormattedMessage id='component.option.ban' /></Radio>
              </Radio.Group>)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.email',
          })}>
            {getFieldDecorator('email', {
              initialValue: formType === 'A' ? null : values.email,
            })(<Input placeholder={formatMessage({ id: 'component.placeholder.content' }, {
              content: formatMessage({
                id: 'user.field.email',
              }),
            })} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'user.field.phone',
          })}>
            {getFieldDecorator('phone', {
              initialValue: formType === 'A' ? null : values.phone,
            })(<Input placeholder={formatMessage({ id: 'component.placeholder.content' }, {
              content: formatMessage({
                id: 'user.field.phone',
              }),
            })} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserEditor);
