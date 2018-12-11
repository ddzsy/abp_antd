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

@connect(({ auditLog, loading }) => ({
  auditLog,
  loading: loading.models.auditLog
}))
class AuditLogs extends PureComponent {
  state = {
    msg: "World",
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "auditLog/fetchAudit"
    });
  }

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
      type: "auditLog/fetchAudit",
      payload: params
    });
  };

  render() {
    const {
      auditLog: { data },
      loading
    } = this.props;
    const { msg, selectedRows } = this.state;

    return (
      <div>
        <StandardTable
          rowKey="id"
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default AuditLogs;
