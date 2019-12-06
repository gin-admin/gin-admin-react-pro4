import React, { PureComponent } from 'react';
import { Modal, Form, Row, Col, Checkbox, Radio, Button } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

const basicTpl = ['query', 'create', 'update', 'delete'];
const advancedTpl = ['query', 'create', 'update', 'delete', 'enable', 'disable'];

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
          id: 'menu.action.template'
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
            id: 'menu.action.title',
          })}>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={16}>
                    {getFieldDecorator('type', {
                      initialValue: 1,
                      rules: [{ required: true }]
                    })(<Radio.Group onChange={e =>
                      setFieldsValue({ actions: e.target.value === 1 ? basicTpl : advancedTpl })
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
                      setFieldsValue({ actions: [] })
                    }>
                      <FormattedMessage id='component.operation.reset' />
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                {getFieldDecorator('actions', {
                  initialValue: basicTpl,
                  rules: [{ required: true }]
                })(<Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={8}><Checkbox value='query'>Query</Checkbox></Col>
                    <Col span={8}><Checkbox value='create'>Create</Checkbox></Col>
                    <Col span={8}><Checkbox value='update'>Update</Checkbox></Col>
                    <Col span={8}><Checkbox value='delete'>Delete</Checkbox></Col>
                    <Col span={8}><Checkbox value='enable'>Enable</Checkbox></Col>
                    <Col span={8}><Checkbox value='disable'>Disable</Checkbox></Col>
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
