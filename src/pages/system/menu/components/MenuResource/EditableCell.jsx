import React from 'react';
import { Input, Form, Select } from 'antd';
import { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends PureComponent {
  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { dataIndex, record, title } = this.props;

    if (dataIndex === 'method') {
      return (
        <Form.Item style={{ margin: 0 }}>
          {this.form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'component.placeholder.select.content' }, {
                  content: title,
                }),
              },
            ],
            initialValue: record[dataIndex],
          })(
            <Select
              style={{ width: '100%' }}
              onBlur={() => {
                this.save();
              }}
            >
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="PATCH">PATCH</Select.Option>
              <Select.Option value="HEAD">HEAD</Select.Option>
              <Select.Option value="OPTIONS">OPTIONS</Select.Option>
            </Select>
          )}
        </Form.Item>
      );
    }
    return <Form.Item style={{ margin: 0 }}>
      {form.getFieldDecorator(dataIndex, {
        rules: [
          {
            required: true,
            message: formatMessage({ id: 'component.placeholder.content' }, {
              content: title,
            }),
          },
        ],
        initialValue: record[dataIndex],
      })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
    </Form.Item>
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
