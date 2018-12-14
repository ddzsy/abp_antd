import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
  Tag,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio
} from "antd";
import StandardTable from "@/components/StandardTable";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { truncateStr } from "@/utils/utils";

import styles from "./User.less";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user
}))
@Form.create()
class User extends PureComponent {
  state = {
    expandForm: false,
    visible: false,
    modalVisible: false,
    selectedRows: [],
    currentLog: undefined
  };

  columns = [
    {
      title: "用户名",
      dataIndex: "userName"
    },
    {
      title: "姓氏",
      dataIndex: "surname"
    },
    {
      title: "名字",
      dataIndex: "name"
    },
    {
      title: "角色",
      dataIndex: "roles",
      render: val => (
        <span>
          {val.reduce((pre, cur) => {
            if (!pre) {
              return cur.roleName;
            }
            return `${pre},${cur.roleName}`;
          }, undefined)}
        </span>
      )
    },
    {
      title: "邮箱地址",
      dataIndex: "emailAddress"
    },
    {
      title: "最近登录",
      dataIndex: "lastLoginTime",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
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
          <a href="javascript:;">编辑 一 {record.displayName}</a>
          {/* <Divider type="vertical" />
          <a href="javascript:;">Delete</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="ant-dropdown-link">
            More actions <Icon type="down" />
          </a> */}
        </span>
      )
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "user/fetchUsers",
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
      user: { data }
    } = this.props;
    const { pagination } = data;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: "user/fetchUsers",
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
      user: { data }
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
        type: "user/fetchUsers",
        payload: {
          ...values,
          skipCount: 0,
          maxResultCount: pagination.pageSize || 20
        }
      });
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
      type: "user/fetchUsers",
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

  render() {
    const {
      user: { data },
      loading
    } = this.props;
    const { selectedRows, visible, currentLog } = this.state;
    const modalFooter = { footer: null, onCancel: this.handleDone };
    const getModalContent = () => {
      return currentLog ? (
        <div>{this.getFormattedParameters(currentLog)}</div>
      ) : (
        <div />
      );
    };

    return (
      <PageHeaderWrapper title="审计日志">
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
        <Modal
          title={"审计日志详情"}
          // className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: "72px 0" }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default User;
