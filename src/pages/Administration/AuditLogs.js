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
    expandForm: false,
    visible: false,
    modalVisible: false,
    selectedRows: [],
    currentLog: undefined
  };

  columns = [
    {
      title: "操作",
      key: "action",
      render: (text, record) => {
        return (
          <div>
            <Icon type="search" onClick={() => this.showModal(record)} />
          </div>
        );
      }
    },
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

  // TODO: 默认值放在model里会比较好，model中有没有办法aop 来填写payload?
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
        startDate: this.defaultStartDate.toDate(),
        endDate: this.defaultEndDate.toDate(),
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
                <Input placeholder="请填写用户名" style={{ width: "100%" }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="服务">
              {getFieldDecorator("serviceName")(
                <Input placeholder="请填写服务名" style={{ width: "100%" }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="操作">
              {getFieldDecorator("methodName")(
                <Input placeholder="请填写操作名" style={{ width: "100%" }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="持续时间">
              {/* TODO: 封装一个数值范围的组件，消除一个FormItem下多个 getFieldDecorator 的报错*/}
              <Input.Group compact>
                {getFieldDecorator("minExecutionDuration")(
                  <InputNumber
                    style={{ width: "45%", textAlign: "center" }}
                    min={0}
                    formatter={value => `${value}ms`}
                    parser={value => value.replace("ms", "")}
                    placeholder="Minimum"
                  />
                )}
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: "none",
                    backgroundColor: "#fff"
                  }}
                  placeholder="~"
                  disabled
                />
                {getFieldDecorator("maxExecutionDuration")(
                  <InputNumber
                    style={{ width: "45%", textAlign: "center", borderLeft: 0 }}
                    min={0}
                    formatter={value => `${value}ms`}
                    parser={value => value.replace("ms", "")}
                    placeholder="Maximum"
                  />
                )}
              </Input.Group>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="客户端">
              {getFieldDecorator("browserInfo")(
                <Input
                  placeholder="请填写客户端信息"
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
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
      auditLog: { data },
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
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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

export default AuditLogs;
