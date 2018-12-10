import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import moment from "moment";
import {
  Row,
  Col,
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

import styles from "./AuditLogs.less";

@connect(({ auditLog, loading }) => ({
  auditLog,
  loading: loading.models.auditLog
}))
class AuditLogs extends PureComponent {
  state = {
    msg: "World"
  };

  columns = [
    {
      title: "规则名称",
      dataIndex: "serviceName"
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(`did mount`);

    dispatch({
      type: "auditLog/fetchAudit"
    });
  }

  render() {
    const {
      auditLog: { auditLog },
      loading
    } = this.props;
    const { msg } = this.state;
    return (
      <div
        style={{
          height: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div>
          <StandardTable
            loading={loading}
            data={auditLog}
            columns={this.columns}
          />
        </div>
      </div>
    );
  }
}

export default AuditLogs;
