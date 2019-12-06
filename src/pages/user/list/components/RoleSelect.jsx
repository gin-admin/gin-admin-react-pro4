import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

function parseValue(value) {
  if (!value) {
    return [];
  }
  return value.map(v => v.role_id);
}

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
export default class RoleSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: parseValue(props.value),
      data: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
      payload: {
        q: 'select',
      },
      success: data => {
        this.setState({ data });
      }
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, value: parseValue(nextProps.value) };
    }
    return state;
  }

  handleChange = value => {
    this.setState({ value });
    this.triggerChange(value);
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      const newData = data.map(v => ({ role_id: v }));
      onChange(newData);
    }
  };

  render() {
    const { value, data } = this.state;

    return (
      <Select
        mode="tags"
        value={value}
        onChange={this.handleChange}
        placeholder={formatMessage({
          id: 'component.placeholder.select.content'
        }, {
          content: formatMessage({
            id: 'user.field.roles',
          }) })}
        style={{ width: '100%' }}
      >
        {data.map(item => (
          <Select.Option key={item.record_id} value={item.record_id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
