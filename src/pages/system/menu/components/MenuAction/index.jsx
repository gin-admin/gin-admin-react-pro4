import { Button, Form, Table, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import uuid from 'uuid/v4';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import styles from '../../style.less';
import { EditableCell, EditableFormRow } from './EditableCell';
import AddDialog from './AddDialog';

function fillKey(data) {
  if (!data) {
    return [];
  }
  return data.map(item => {
    const nItem = { ...item };
    if (!nItem.key) {
      nItem.key = uuid();
    }
    return nItem;
  });
}

class Index extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      addVisible: false,
      dataSource: fillKey(props.value),
    };

    this.columns = [
      {
        title: formatMessage({ id: 'menu.action.code' }),
        dataIndex: 'code',
        editable: true,
        width: '40%',
      },
      {
        title: formatMessage({ id: 'menu.action.name' }),
        dataIndex: 'name',
        editable: true,
        width: '45%',
      },
      {
        title: formatMessage({ id: 'component.operation' }),
        dataIndex: 'key',
        width: '15%',
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm onConfirm={() => this.handleDelete(record.key)}
                        okText={formatMessage({ id: 'component.button.confirm' })}
                        title={formatMessage({ id: 'component.operation.delete.confirm' })}>
              <a><FormattedMessage id='component.operation.delete' /></a>
            </Popconfirm>
          ) : null,
      },
    ];
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const data = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: data }, () => this.triggerChange(data));
  };

  handleClean = () => {
    this.setState({ dataSource: [] }, () => this.triggerChange([]));
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const newData = {
      key: uuid(),
      code: '',
      name: '',
    };
    const data = [...dataSource, newData];
    this.setState({ dataSource: data }, () => this.triggerChange(data));
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData }, () => this.triggerChange(newData));
  };

  handleAddCancel = () => {
    this.setState({ addVisible: false });
  };

  handleAddTpl = () => {
    this.setState({ addVisible: true });
  };

  handleAddSubmit = item => {
    const tplData = [
      {
        code: 'query',
        name: formatMessage({ id: 'component.operation.query' }),
      },
      {
        code: 'create',
        name: formatMessage({ id: 'component.operation.create' }),
      },
      {
        code: 'update',
        name: formatMessage({ id: 'component.operation.update' }),
      },
      {
        code: 'delete',
        name: formatMessage({ id: 'component.operation.delete' }),
      },
      {
        code: 'enable',
        name: formatMessage({ id: 'component.operation.enable' }),
      },
      {
        code: 'disable',
        name: formatMessage({ id: 'component.operation.disable' }),
      },
    ];

    const { actions } = item;
    let newData = [];
    tplData.map(v => {
      if (actions.indexOf(v.code) !== -1) {
        newData.push({ key: v.code, ...v });
      }
    });

    const { dataSource } = this.state;
    const data = [...dataSource];
    for (let i = 0; i < newData.length; i += 1) {
      let exists = false;
      for (let j = 0; j < dataSource.length; j += 1) {
        if (dataSource[j].key === newData[i].key) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        data.push(newData[i]);
      }
    }

    this.setState({ dataSource: data, addVisible: false },
      () => this.triggerChange(data));
  };

  render() {
    const { dataSource, addVisible } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <React.Fragment>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button onClick={this.handleAdd} size="small" type="primary">
              <FormattedMessage id='component.operation.create' />
            </Button>
            <Button onClick={this.handleClean} size="small" type="danger">
              <FormattedMessage id='component.operation.reset' />
            </Button>
            <Button onClick={this.handleAddTpl} size="small" type="primary">
              <FormattedMessage id='component.template' />
            </Button>
          </div>
          <Table
            rowKey={record => record.key}
            components={components}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size="small"
          />
          <AddDialog
            visible={addVisible}
            onCancel={this.handleAddCancel}
            onSubmit={this.handleAddSubmit}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create()(Index);
