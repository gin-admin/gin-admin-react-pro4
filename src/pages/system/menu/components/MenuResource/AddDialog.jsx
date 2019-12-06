import React, { PureComponent } from 'react';
import { Modal, Form, Input, Row, Col, Tooltip, Icon, Checkbox, Radio, Button } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const basicTpl = ['query', 'create', 'update', 'delete'];
const advancedTpl = ['query', 'get', 'create', 'update', 'delete', 'enable', 'disable'];

@Form.create()
class AddDialog extends PureComponent {
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  handleOK = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        onSubmit(formData);
      }
    });
  };

  render() {
    const {
      visible,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title={formatMessage({
          id: 'menu.resource.template'
        })}
        width={450}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.handleOK}
        onCancel={this.handleCancel}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc( 100vh - 158px )',
          overflowY: 'auto'
        }}
      >
        <Form>
          <Form.Item {...formItemLayout} label={formatMessage({
            id: 'menu.resource.name',
          })}>
            <Row>
              <Col span={20}>
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'menu.resource.name',
                      }),
                    },
                  ],
                })(<Input placeholder={formatMessage({
                  id: 'component.placeholder.content'}, { content: formatMessage({
                    id: 'menu.resource.name',
                  })
                })}/>)}
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title={formatMessage({
                  id: 'menu.resource.name.example'
                })}>
                  <Icon type="question-circle"/>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({
            id: 'menu.resource.uri',
          })}>
            <Row>
              <Col span={20}>
                {getFieldDecorator('router', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'menu.resource.uri',
                      }),
                    },
                  ],
                })(<Input placeholder={formatMessage({
                  id: 'component.placeholder.content'}, { content: formatMessage({
                    id: 'menu.resource.uri',
                  })
                })}/>)}
              </Col>
              <Col span={4} style={{ textAlign: 'center' }}>
                <Tooltip title={formatMessage({
                  id: 'menu.resource.uri.example'
                })}>
                  <Icon type="question-circle"/>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...formItemLayout} label={formatMessage({
            id: 'menu.resource.title',
          })}>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={16}>
                    {getFieldDecorator('type', {
                      initialValue: 1,
                      rules: [{ required: true }]
                    })(<Radio.Group onChange={e =>
                      setFieldsValue({ resources: e.target.value === 1 ? basicTpl : advancedTpl })
                    }>
                      <Radio.Button value={1}>
                        <FormattedMessage id='component.template.basic' />
                      </Radio.Button>
                      <Radio.Button value={2}>
                        <FormattedMessage id='component.template.advanced' />
                      </Radio.Button>
                    </Radio.Group>)}
                  </Col>
                  <Col span={8}>
                    <Button type='dashed' onClick={() =>
                      setFieldsValue({ resources: [] })
                    }>
                      <FormattedMessage id='component.operation.reset' />
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                {getFieldDecorator('resources', {
                  initialValue: basicTpl,
                  rules: [{ required: true }]
                })(<Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={8}><Checkbox value='query'>Query</Checkbox></Col>
                    <Col span={8}><Checkbox value='get'>Get</Checkbox></Col>
                    <Col span={8}><Checkbox value='create'>Create</Checkbox></Col>
                    <Col span={8}><Checkbox value='update'>Update</Checkbox></Col>
                    <Col span={8}><Checkbox value='delete'>Delete</Checkbox></Col>
                    <Col span={8}><Checkbox value='enable'>Enable</Checkbox></Col>
                    <Col span={8}><Checkbox value='enable'>Disable</Checkbox></Col>
                  </Row>
                </Checkbox.Group>)}
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddDialog;
