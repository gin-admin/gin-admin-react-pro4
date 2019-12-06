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
        title: formatMessage({ id: 'menu.resource.code' }),
        dataIndex: 'code',
        editable: true,
        width: '20%',
      },
      {
        title: formatMessage({ id: 'menu.resource.name' }),
        dataIndex: 'name',
        editable: true,
        width: '25%',
      },
      {
        title: formatMessage({ id: 'menu.resource.method' }),
        dataIndex: 'method',
        editable: true,
        width: '15%',
      },
      {
        title: formatMessage({ id: 'menu.resource.uri' }),
        dataIndex: 'path',
        editable: true,
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
      method: '',
      path: '',
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
        name: formatMessage({ id: 'menu.resource.query' }, { content: item.name }),
        method: 'GET',
        path: item.router,
      },
      {
        code: 'get',
        name: formatMessage({ id: 'menu.resource.get' }, { content: item.name }),
        method: 'GET',
        path: `${item.router}/:id`,
      },
      {
        code: 'create',
        name: formatMessage({ id: 'menu.resource.create' }, { content: item.name }),
        method: 'POST',
        path: item.router,
      },
      {
        code: 'update',
        name: formatMessage({ id: 'menu.resource.update' }, { content: item.name }),
        method: 'PUT',
        path: `${item.router}/:id`,
      },
      {
        code: 'delete',
        name: formatMessage({ id: 'menu.resource.delete' }, { content: item.name }),
        method: 'DELETE',
        path: `${item.router}/:id`,
      },
      {
        code: 'enable',
        name: formatMessage({ id: 'menu.resource.enable' }, { content: item.name }),
        method: 'PATCH',
        path: `${item.router}/:id/enable`,
      },
      {
        code: 'disable',
        name: formatMessage({ id: 'menu.resource.disable' }, { content: item.name }),
        method: 'PATCH',
        path: `${item.router}/:id/disable`,
      },
    ];

    const { resources } = item;
    let newData = [];
    tplData.map(v => {
      if (resources.indexOf(v.code) !== -1) {
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
