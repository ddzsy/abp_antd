import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Alert,
  Row,
  Col,
  Tag,
  Tabs,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Tree,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Checkbox
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { truncateStr } from "@/utils/utils";

import styles from "./Role.less";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;

const CreateOrUpdateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })
  return (
    <Modal
      destroyOnClose
      style={{ top: 20 }}
      width={800}
      bodyStyle={{ paddingTop: 15 }}
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><Icon type="info" />角色属性</span>} key="1">
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} style={{ paddingTop: 10 }} label="角色名称">
            {form.getFieldDecorator("displayName", {
              rules: [
                {
                  required: true,
                  message: "请输入角色名称",
                  min: 2
                }
              ]
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认" extra="新用户将默认拥有此角色.">
            {form.getFieldDecorator("isDefault", {
              rules: [
              ]
            })(<Checkbox></Checkbox>)}
          </Form.Item>
          <Alert
            message="提示"
            description="如果您正在更改自己的权限，则可能需要刷新页面（F5），以在您所做的权限更改生效！"
            type="warning"
            showIcon
          />
        </TabPane>
        <TabPane tab={<span><Icon type="security-scan" />权限</span>} key="2">
          <DirectoryTree
            multiple
            checkable
            defaultExpandAll
          >
            <TreeNode title="parent 0" key="0-0">
              <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
              <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
            </TreeNode>
            <TreeNode title="parent 1" key="0-1">
              <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
              <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
            </TreeNode>
          </DirectoryTree>
        </TabPane>
      </Tabs>

    </Modal>
  );
});


@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role
}))
@Form.create()
class Role extends PureComponent {
  state = {
    expandForm: false,
    modalVisible: false,
    visible: false,
    selectedRows: [],
    currentLog: undefined
  };

  columns = [
    {
      title: "角色名称",
      dataIndex: "displayName"
    },
    {
      title: "创建时间",
      dataIndex: "creationTime",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑 一 {record.displayName}</a>
        </span>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "role/fetchRoles",
      payload: {
        maxResultCount: 20,
        skipCount: 0
      }
    });
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const {
      role: { data }
    } = this.props;
    const { pagination } = data;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: "role/fetchRoles",
      payload: {
        skipCount: 0,
        maxResultCount: pagination.pageSize || 20
      }
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const {
      role: { data }
    } = this.props;
    const { pagination } = data;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
      };

      this.setState({
        formValues: values
      });

      dispatch({
        type: "role/fetchRoles",
        payload: {
          ...values,
          skipCount: 0,
          maxResultCount: pagination.pageSize || 20
        }
      });
    });
  };

  handleModalVisible = (flag, record) => {
    console.log(`handle modal`);
    const { dispatch } = this.props;

    this.setState({
      modalVisible: !!flag,
      //stepFormValues: record || {}
    });
    dispatch({
      type: "role/fetchRoleForEdit",
      payload: {
        id: !record ? undefined : record.id
      }
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      skipCount: (pagination.current - 1) * pagination.pageSize,
      maxResultCount: pagination.pageSize,
      ...formValues,
      ...filters
    };
    if (sorter.field) {
      params.sorting = `${sorter.field}`;
      if (sorter.order === "descend") {
        params.sorting += ` DESC`;
      } else if (sorter.order === "ascend") {
        params.sorting += ` ASC`;
      }
    }

    dispatch({
      type: "role/fetchRoles",
      payload: params
    });
  };

  showModal = record => {
    this.setState({
      visible: true,
      currentLog: record
    });
  };

  handleDone = () => {
    // setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      currentLog: undefined
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="按权限搜索">
              {getFieldDecorator("permission")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="Frontend">加工页面</Option>
                  <Option value="Backend">管理后台</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  getFormattedParameters(record) {
    if (!record) {
      return {};
    }
    try {
      var json = JSON.parse(record.parameters);
      return JSON.stringify(json, null, 4);
    } catch (e) {
      return record.parameters || {};
    }
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "rule/add",
      payload: {
        desc: fields.desc
      }
    });

    message.success("添加成功");
    this.handleModalVisible();
  };

  render() {
    const {
      role: { data },
      loading
    } = this.props;
    const { selectedRows, visible, currentLog, modalVisible } = this.state;
    const modalFooter = { footer: null, onCancel: this.handleDone };
    const getModalContent = () => {
      return <div>123</div>
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };

    return (
      <PageHeaderWrapper title="角色">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <StandardTable
              rowKey="id"
              // expandedRowRender={record => <p>{record.parameters}</p>}
              hideAlert={true}
              rowSelection={undefined}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateOrUpdateForm {...parentMethods} modalVisible={modalVisible} />

      </PageHeaderWrapper>
    );
  }
}

export default Role;
