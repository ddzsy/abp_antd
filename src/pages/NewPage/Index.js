import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Button } from 'antd';

// eslint-disable-next-line no-unused-vars
import styles from './Index.less';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Index extends Component {
  state = {
    msg: 'World',
  };

  render() {
    const { msg } = this.state;

    return (
      <div
        style={{
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>Hello {msg}</div>
        <Link to="/newLayoutPage">
          <Button size="large">参观自定义布局</Button>
        </Link>
      </div>
    );
  }
}

export default Index;
