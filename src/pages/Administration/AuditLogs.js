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

import styles from "./AuditLogs.less";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
@connect(({ auditLog, loading }) => ({
  auditLog,
  loading: loading.models.auditLog
}))
@Form.create()
class AuditLogs extends PureComponent {
  state = {
    msg: "World",
    expandForm: false,
    selectedRows: []
  };

  columns = [
    {
      title: "状态",
      dataIndex: "exception",
      render: val => (
        <div>
          {!val ? (
            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
          ) : (
            <Icon type="warning" theme="twoTone" twoToneColor="#eb2f96" />
          )}
        </div>
      )
    },
    {
      title: "时间",
      dataIndex: "executionTime",
      sorter: true,
      render: val => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
    },
    {
      title: "用户名",
      dataIndex: "userName"
    },
    {
      title: "服务",
      dataIndex: "serviceName"
    },
    {
      title: "操作",
      dataIndex: "methodName"
    },
    {
      title: "持续时间",
      dataIndex: "executionDuration"
    },
    {
      title: "IP地址",
      dataIndex: "clientIpAddress"
    },
    {
      title: "客户端",
      dataIndex: "clientName"
    },
    {
      title: "浏览器",
      dataIndex: "browserInfo",
      render: val => <span>{truncateStr(val, 20)}</span>
    }
  ];

  defaultStartDate = moment(new Date().setDate(new Date().getDate() - 3));
  defaultEndDate = moment(new Date());
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "auditLog/fetchAudit",
      payload: {
        startDate: this.defaultStartDate.toDate(),
        endDate: this.defaultEndDate.toDate(),
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
      auditLog: { data }
    } = this.props;
    const { pagination } = data;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: "auditLog/fetchAudit",
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
      auditLog: { data }
    } = this.props;
    const { pagination } = data;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        startDate: fieldsValue["dateRange"][0].toDate(),
        endDate: fieldsValue["dateRange"][1].toDate(),
        dateRange: [],
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf()
      };

      this.setState({
        formValues: values
      });

      dispatch({
        type: "auditLog/fetchAudit",
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
      startDate: this.defaultStartDate.toDate(),
      endDate: this.defaultEndDate.toDate(),
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
      type: "auditLog/fetchAudit",
      payload: params
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="时间范围">
              {getFieldDecorator("dateRange", {
                rules: [{ required: true, message: "请选择生效日期" }],
                initialValue: [this.defaultStartDate, this.defaultEndDate]
              })(
                <RangePicker
                  placeholder={["开始日期", "结束日期"]}
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="错误状态">
              {getFieldDecorator("hasException")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="">全部</Option>
                  <Option value="true">出现错误</Option>
                  <Option value="false">成功</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="时间范围">
              {getFieldDecorator("dateRange", {
                rules: [{ required: true, message: "请选择生效日期" }],
                initialValue: [this.defaultStartDate, this.defaultEndDate]
              })(
                <RangePicker
                  placeholder={["开始日期", "结束日期"]}
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="错误状态">
              {getFieldDecorator("hasException")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="">全部</Option>
                  <Option value="true">出现错误</Option>
                  <Option value="false">成功</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用者">
              {getFieldDecorator("userName")(
                <Input style={{ width: "100%" }} />
              )}
            </FormItem>
          </Col>
        </Row>
        {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator("date")(
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="请输入更新日期"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator("status3")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator("status4")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row> */}
        <div style={{ overflow: "hidden" }}>
          <div style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      auditLog: { data },
      loading
    } = this.props;
    const { msg, selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="审计日志">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AuditLogs;
